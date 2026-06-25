import json
import asyncpg
from typing import Any
from fastapi import HTTPException

from app.repositories.riesgo_repository import RiesgoRepository
from app.schemas.semaforo_schemas import SemaforoResponse, DetalleIndicadorSemaforo

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
        Tarea masiva. Recalcula el riesgo de TODOS los estudiantes de una carrera y etapa.
        Se dispara cuando cambian las reglas (pesos AHP o umbrales del semáforo).
        """
        
        try:
            async with pool.acquire() as conn:
                repo_riesgo = RiesgoRepository(conn)
                
                # Necesitás una query que devuelva la última asignación de cada alumno de esta carrera
                # Ejemplo: SELECT estudiante_id, MAX(id) as asignacion_id FROM asignaciones WHERE carrera_id = $1 GROUP BY estudiante_id
                alumnos = await RiesgoRepository.obtener_ultimas_asignaciones_por_carrera(carrera_id, etapa)
                
                if not alumnos:
                    raise HTTPException(status_code=404, detail=f"ℹ️ No hay estudiantes con datos para recalcular en la carrera {carrera_id}.")
                    return
                    
                service = RiesgoService(conn)
                
                # Iteramos uno a uno
                for alumno in alumnos:
                    try:
                        await service.calcular_y_guardar_riesgo(
                            estudiante_id=alumno['estudiante_id'],
                            asignacion_id=alumno['asignacion_id']
                        )
                    except Exception as e:
                        raise HTTPException(status_code=500, detail=f"❌ Error al recalcular alumno {alumno['estudiante_id']} por nueva config: {str(e)}")

            raise HTTPException(status_code=200, detail=f"✅ Recálculo masivo por reconfiguración de carrera {carrera_id} finalizado.")

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"❌ Error crítico en tarea de reconfiguración: {str(e)}")


    @staticmethod
    async def tarea_background_calcular_riesgo(pool: asyncpg.Pool, estudiante_id: int, asignacion_id: int):
        """
        Esta función está diseñada para correr en background.
        Pide su propia conexión al pool para no chocar con el request principal.
        """
        try:
            # Pedimos una conexión fresca exclusivamente para esta tarea
            async with pool.acquire() as conn:
                service = RiesgoService(conn)
                await service.calcular_y_guardar_riesgo(estudiante_id, asignacion_id)
                raise HTTPException(status_code=200, detail= f"✅ Background: Riesgo calculado para estudiante {estudiante_id}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"❌ Error en background task (AHP): {str(e)}")

    @staticmethod
    async def tarea_background_recalcular_masivo(
        pool: asyncpg.Pool, 
        estudiantes_afectados: list[dict[str, int]]
    ):
        """
        Procesa una lista masiva de estudiantes.
        Formato esperado: [{"estudiante_id": 1, "asignacion_id": 10}, ...]
        """

        # Procesamos de forma secuencial. Al estar en background, no importa si tarda 
        # 10 segundos, lo vital es no saturar el pool de conexiones con 500 queries a la vez.
        for item in estudiantes_afectados:
            try:
                # Pedimos una conexión por alumno, calculamos y la devolvemos al pool
                async with pool.acquire() as conn:
                    service = RiesgoService(conn)
                    await service.calcular_y_guardar_riesgo(
                        estudiante_id=item['estudiante_id'], 
                        asignacion_id=item['asignacion_id']
                    )
            except Exception as e:
                # Si un alumno falla, lo logueamos pero el loop sigue con el próximo
                raise HTTPException(status_code=500, detail=f"❌ Error calculando riesgo para estudiante {item['estudiante_id']}: {str(e)}")
        
        raise HTTPException(status_code=200, detail=f"✅ Cálculo masivo finalizado.")

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

    async def calcular_y_guardar_riesgo(self, estudiante_id: int, asignacion_id: int) -> int:
        """Fase 1: Motor AHP dinámico."""
        
        # 1. Obtener contexto del estudiante (Carrera y Etapa)
        estudiante = await self.repo.obtener_contexto_estudiante(estudiante_id)
        if not estudiante:
            raise HTTPException(status_code=404, detail="Estudiante no encontrado.")

        carrera_id = estudiante['carrera_id']
        etapa = estudiante['etapa']

        # 2. Obtener la configuración dinámica de umbrales
        config_db = await self.repo.obtener_configuracion_activa(carrera_id, etapa)
        if not config_db:
            raise HTTPException(status_code=404, detail=f"No hay configuración de indicadores activa para la carrera {carrera_id} en etapa {etapa}.")

        umbral_amarillo = float(config_db['umbral_amarillo'])
        umbral_rojo = float(config_db['umbral_rojo'])

        # 3. Obtener los pesos AHP de la base de datos
        pesos_ahp = await self.repo.obtener_pesos_ahp(carrera_id)

        # 4. Procesar respuestas
        respuestas_crudas = await self.repo.obtener_respuestas_para_calculo(asignacion_id)
        riesgos_por_indicador: dict[int, list[float]] = {}
        
        for row in respuestas_crudas:
            ind_id = row['indicador_id']
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
        
        # 5. Cálculo AHP con valores de la BD
        for ind_id, lista_riesgos in riesgos_por_indicador.items():
            promedio_indicador = sum(lista_riesgos) / len(lista_riesgos)
            peso_ahp = pesos_ahp.get(ind_id, 0.0)
            score_ponderado = promedio_indicador * peso_ahp
            
            score_total_acumulado += score_ponderado
            detalles_insert.append({
                "id_indicador": ind_id,
                "score": promedio_indicador,
                "nivel": self._determinar_color(promedio_indicador, umbral_amarillo, umbral_rojo),
                "factor_aplicado": peso_ahp,
                "score_ponderado": score_ponderado
            })

        suma_pesos_utilizados = sum(pesos_ahp.get(ind_id, 0.0) for ind_id in riesgos_por_indicador.keys())
        if suma_pesos_utilizados > 0:
            score_total_acumulado = score_total_acumulado / suma_pesos_utilizados

        return await self.repo.guardar_scores_ahp(estudiante_id, score_total_acumulado, detalles_insert)

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