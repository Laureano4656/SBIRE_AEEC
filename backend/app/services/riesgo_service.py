import json
import asyncpg
from typing import Any
from fastapi import HTTPException

from app.repositories.riesgo_repository import RiesgoRepository
from app.schemas.semaforo_schemas import SemaforoResponse, DetalleIndicadorSemaforo
from app.schemas.alertas import AlertaCreate
from app.services.alertas_service import AlertasService
from datetime import datetime

class RiesgoService:
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.repo = RiesgoRepository(conn)

    @staticmethod
    async def tarea_background_recalcular_por_configuracion(
        pool: asyncpg.Pool, 
        carrera_id: int,
        etapa: str
    ):
        """
        Tarea masiva en background. Recalcula el riesgo de TODOS los estudiantes 
        de una carrera sin bloquear la respuesta de la API.
        """
        try:
            # 1. Obtenemos la lista de alumnos usando una conexión muy breve
            async with pool.acquire() as conn:
                repo_riesgo = RiesgoRepository(conn)
                alumnos = await repo_riesgo.obtener_estudiantes_por_carrera(carrera_id)
                
            if not alumnos:
                print(f"No hay estudiantes registrados en la carrera {carrera_id}.")
                return
                
            print(f"Iniciando recálculo masivo para {len(alumnos)} estudiantes de la carrera {carrera_id}...")

            # 2. Procesamos uno a uno pidiendo una conexión nueva por cada cálculo.
            for alumno in alumnos:
                try:
                    async with pool.acquire() as conn:
                        service = RiesgoService(conn)
                        # Llamamos al cálculo que ya sabe buscar las encuestas por su cuenta
                        await service.calcular_y_guardar_riesgo(
                            estudiante_id=alumno['estudiante_id'],
                            etapa=etapa
                        )
                except Exception as e:
                    # Logueamos si falla uno, pero el loop sigue con el resto
                    print(f"Error al recalcular alumno {alumno['estudiante_id']}: {str(e)}")

            print(f"Recálculo masivo de la carrera {carrera_id} finalizado exitosamente.")

        except Exception as e:
            print(f"Error crítico en tarea de reconfiguración masiva: {str(e)}")

    @staticmethod
    async def tarea_background_calcular_riesgo(pool: asyncpg.Pool, estudiante_id: int):
        """
        Calcula el riesgo de UN solo estudiante. Ideal para cuando envían una encuesta.
        """
        try:
            async with pool.acquire() as conn:
                repo = RiesgoRepository(conn)
                estudiante = await repo.obtener_contexto_estudiante(estudiante_id)
                
                if estudiante:
                    service = RiesgoService(conn)
                    await service.calcular_y_guardar_riesgo(estudiante_id, estudiante['etapa'])
                    
        except Exception as e:
            print(f"Error recalculando semáforo del estudiante {estudiante_id}: {str(e)}")

    @staticmethod
    async def tarea_background_recalcular_masivo(pool: asyncpg.Pool, estudiante_ids: list[int]):
        """
        Procesa una lista plana de IDs. Ideal para la importación masiva de notas.
        """
        print(f"Iniciando recálculo por actualización de notas para {len(estudiante_ids)} estudiantes...")
        
        for est_id in set(estudiante_ids): # Usamos set() por si en el Excel un alumno sale 2 veces
            try:
                async with pool.acquire() as conn:
                    repo = RiesgoRepository(conn)
                    estudiante = await repo.obtener_contexto_estudiante(est_id)
                    
                    if estudiante:
                        service = RiesgoService(conn)
                        await service.calcular_y_guardar_riesgo(est_id, estudiante['etapa'])
                        
            except Exception as e:
                print(f"Error calculando riesgo para estudiante {est_id}: {str(e)}")
                
        print("Cálculo masivo por importación finalizado.")

    # ==========================================
    # LÓGICA INTERNA: CÁLCULO Y NORMALIZACIÓN
    # ==========================================
    def _normalizar_riesgo(self, valor_numerico: float, config: dict[str, Any]) -> float:
        min_val = config.get("intervalo_min", 0.0)
        max_val = config.get("intervalo_max", 10.0)
        extremo = config.get("extremo_riesgoso", "min")
        
        if max_val == min_val: return 0.0
        valor = max(min_val, min(valor_numerico, max_val))
        
        if extremo == "min":
            return (max_val - valor) / (max_val - min_val)
        return (valor - min_val) / (max_val - min_val)

    def _determinar_color(self, score: float, umbral_amarillo: float, umbral_rojo: float) -> str:
        """Determina el nivel de riesgo en base a los umbrales dinámicos de la carrera."""
        if score >= umbral_rojo: return 'Rojo'
        if score >= umbral_amarillo: return 'Amarillo'
        return 'Verde'

    def _determinar_nivel_riesgo(self, score: float, umbral_amarillo: float, umbral_rojo: float) -> str:
        """Determina el nivel de riesgo en base a los umbrales dinámicos de la carrera."""
        if score < umbral_amarillo: return 'bajo'
        elif score < umbral_rojo: return 'medio'
        elif score < 0.8: return 'alto'
        return 'critico' 

    async def calcular_y_guardar_riesgo(self, estudiante_id: int, etapa: str) -> int:
        """
        Calcula el riesgo global (semáforo) del estudiante consolidando las respuestas 
        de sus asignaciones más recientes para cada tipo de evento.
        """
        
        # 1. Obtener contexto del estudiante (sin 'etapa')
        estudiante = await self.repo.obtener_contexto_estudiante(estudiante_id)
        if not estudiante:
            raise HTTPException(status_code=404, detail="Estudiante no encontrado.")

        carrera_id = estudiante['carrera_id']

        # 2. Obtener la configuración dinámica de umbrales
        config_db = await self.repo.obtener_configuracion_activa(carrera_id, etapa)
        if not config_db:
            raise HTTPException(status_code=404, detail=f"No hay configuración de indicadores activa para la carrera {carrera_id}.")

        umbral_amarillo = float(config_db['umbral_amarillo'])
        umbral_rojo = float(config_db['umbral_rojo'])

        # 3. Obtener los pesos AHP de la base de datos
        pesos_ahp = await self.repo.obtener_pesos_ahp(config_db['id'])

        # 4. Buscar la última "foto" del estudiante (sus asignaciones más recientes por evento)
        asignaciones_recientes = await self.repo.obtener_ultimas_asignaciones_por_estudiante(estudiante_id)
        if not asignaciones_recientes:
            return 0 # El alumno no completó ninguna encuesta todavía

        asignacion_ids = [row['asignacion_id'] for row in asignaciones_recientes]

        # 5. Obtener y procesar TODAS las respuestas de esas asignaciones
        respuestas_crudas = await self.repo.obtener_respuestas_para_calculo_bulk(asignacion_ids)
        riesgos_por_indicador: dict[int, list[float]] = {}
        
        for row in respuestas_crudas:
            ind_id = row['indicador_id']
            # Descartamos si la pregunta no aporta a ningún subcriterio/indicador
            if not ind_id: continue 
            
            riesgo_pregunta = 0.0
            
            if row['tipo_pregunta'] == 'opcion_multiple' and row['valor_riesgo_manual'] is not None:
                riesgo_pregunta = float(row['valor_riesgo_manual'])
            elif row['tipo_pregunta'] in ['numero', 'escala'] and row['valor_numerico'] is not None and row['configuracion_riesgo']:
                config_riesgo = json.loads(row['configuracion_riesgo'])
                riesgo_pregunta = self._normalizar_riesgo(float(row['valor_numerico']), config_riesgo)
            
            if ind_id not in riesgos_por_indicador:
                riesgos_por_indicador[ind_id] = []
            riesgos_por_indicador[ind_id].append(riesgo_pregunta)

        score_total_acumulado = 0.0
        detalles_insert = []
        
        # 6. Cálculo AHP final: Promedio del indicador * Peso de la BD
        for ind_id, lista_riesgos in riesgos_por_indicador.items():
            # Sumamos los riesgos de todas las respuestas que componen este indicador y dividimos por el total
            promedio_indicador = sum(lista_riesgos) / len(lista_riesgos)
            
            peso_ahp = pesos_ahp.get(ind_id, 0.0)
            score_ponderado = promedio_indicador * peso_ahp
            
            score_total_acumulado += score_ponderado
            
            detalles_insert.append({
                "id_indicador": ind_id,
                "score": promedio_indicador,
                "nivel": self._determinar_nivel_riesgo(promedio_indicador, umbral_amarillo, umbral_rojo),
                "factor_aplicado": peso_ahp,
                "score_ponderado": score_ponderado
            })

        # 7. Normalización del Score Total (Por si al alumno le faltan responder bloques enteros)
        suma_pesos_utilizados = sum(pesos_ahp.get(ind_id, 0.0) for ind_id in riesgos_por_indicador.keys())
        if suma_pesos_utilizados > 0:
            score_total_acumulado = score_total_acumulado / suma_pesos_utilizados

        score_total_id, detalles_guardados = await self.repo.guardar_scores_ahp(
            estudiante_id, score_total_acumulado, detalles_insert
        )

        estado_general = self._determinar_nivel_riesgo(score_total_acumulado, umbral_amarillo, umbral_rojo)
        
        if estado_general == 'alto' or estado_general == "critico":
            alertas_service = AlertasService(self.repo.conn)
            anio_actual = datetime.now().year
            
            # Buscamos cuáles fueron los indicadores específicos que le dieron Rojo (o Crítico)
            peores_indicadores = [d for d in detalles_guardados if (d["nivel"] == 'alto' or d["nivel"] == 'critico')]
            
            for indicador in peores_indicadores:
                try:
                    nueva_alerta = AlertaCreate(
                        estudiante_id=estudiante_id,
                        score_id=indicador["id_score_riesgo"], 
                        asignacion_id=None,
                        tipo_desercion=etapa,
                        nivel_riesgo=indicador["nivel"],
                        origen="score_riesgo",
                        anio_cursada=anio_actual
                    )
                    await alertas_service.crear_alerta(nueva_alerta)
                except Exception as e:
                    # Atrapamos el error para que, si falla la alerta, el cálculo AHP no se rompa
                    print(f"Error al crear alerta para estudiante {estudiante_id}: {str(e)}")

        return score_total_id

        return resultado

    # ==========================================
    # LÓGICA DE EXPOSICIÓN: GET DEL SEMÁFORO
    # ==========================================
    async def armar_semaforo_estudiante(self, estudiante_id: int) -> SemaforoResponse:
        """Fase 2: Retorno para el Frontend, evaluando el score con los umbrales de la base de datos."""
        
        # Obtener contexto y configuración para pintar el semáforo final
        estudiante = await self.repo.obtener_contexto_estudiante(estudiante_id)
        if not estudiante:
            raise HTTPException(status_code=404, detail="Estudiante no encontrado.")

        config_db = await self.repo.obtener_configuracion_activa(estudiante['carrera_id'], estudiante['etapa'])
        if not config_db:
            raise HTTPException(status_code=404, detail="Configuración de semáforo no encontrada para este estudiante.")

        umbral_amarillo = float(config_db['umbral_amarillo'])
        umbral_rojo = float(config_db['umbral_rojo'])

        # Obtener datos matemáticos
        total_row = await self.repo.obtener_ultimo_score_total(estudiante_id)
        if not total_row:
            raise HTTPException(status_code=404, detail="El estudiante no tiene cálculos de riesgo aún.")
            
        score_total_id = total_row['id']
        riesgo_global = float(total_row['valor'])
        
        # Pintar el nivel general basado en los umbrales extraídos de la BD
        estado_general = self._determinar_color(riesgo_global, umbral_amarillo, umbral_rojo)

        desglose_rows = await self.repo.obtener_desglose_semaforo(score_total_id)

        detalles = [
            DetalleIndicadorSemaforo(
                indicador_id=row['id_indicador'],
                nombre_indicador=row['nombre_indicador'],
                nombre_dimension=row['nombre_dimension'],
                score_bruto=float(row['score']),
                nivel_riesgo=row['nivel'],
                factor_ahp=float(row['factor_aplicado']),
                aporte_al_total=float(row['score_ponderado'])
            ) for row in desglose_rows
        ]

        return SemaforoResponse(
            estudiante_id=estudiante_id,
            score_total_id=score_total_id,
            riesgo_global=riesgo_global,
            estado_general=estado_general,
            fecha_calculo=total_row['creado_en'],
            desglose_indicadores=detalles
        )

    async def armar_semaforo_estudiantes(self, carrera_id: int) -> list[SemaforoResponse]:
        """
        Retorno para el Frontend, evaluando el score con los umbrales de la base de datos 
        para todos los estudiantes de esa carrera.
        """

        estudiantes_id = await self.repo.obtener_estudiantes_por_carrera(carrera_id)

        semaforos = []

        for estudiante_id in estudiantes_id:
            try:
                semaforos.append(await self.armar_semaforo_estudiante(estudiante_id["estudiante_id"]))

            except HTTPException as http_ex:
                if http_ex.status_code == 404:
                    print(f"Saltando estudiante {estudiante_id}: aún no tiene cálculos de riesgo.")
                    continue
                
                raise http_ex
                
            except Exception as e:
                print(f"Error inesperado al procesar estudiante {estudiante_id}: {str(e)}")
                continue
        return semaforos