from datetime import datetime

import asyncpg
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.models.respuesta import RespuestaEstudiante

class RespuestasRepository(CrudRepository[RespuestaEstudiante]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            conn,
            RespuestaEstudiante,
            CrudTableConfig(
                table_name="respuesta_estudiante",
                columns=(
                    "id", "asignacion_id", "pregunta_id", "materia_id", 
                    "opcion_seleccionada_id", "valor_numerico", "valor_texto", "riesgo_calculado"
                ),
                order_by="id ASC"
            )
        )

    async def get_estado_asignacion(self, asignacion_id: int) -> str | None:
        """Devuelve el estado actual de la asignación."""
        return await self.conn.fetchval(
            """SELECT CASE
            WHEN completado THEN 'Completada'
            WHEN borrador THEN 'Borrador'
            ELSE 'Pendiente'
            END::text FROM asignacion_encuesta WHERE id = $1""", 
            asignacion_id
        )

    async def guardar_transaccion_encuesta(self, asignacion_id: int, respuestas: list[dict], nuevo_estado: str | None) -> None:
        """
        Bloque atómico: Borra respuestas previas, inserta nuevas, actualiza la asignación
        y procesa la lógica académica (intentos de finales y estados de cursada).
        """
        async with self.conn.transaction():
            # 1. Obtener info de la asignación antes de modificarla
            asig = await self.conn.fetchrow(
            "SELECT estudiante_id, e.periodicidad as evento_disparador FROM asignacion_encuesta as a JOIN evento_disparador as e ON a.evento_id = e.id WHERE a.id = $1",
                asignacion_id
            )

            completado = (nuevo_estado == 'Completada')
            await self.conn.execute(
                "UPDATE asignacion_encuesta SET completado = $1, borrador = false WHERE id = $2",
                completado, asignacion_id
            )       

            # 3. Limpieza: Borramos respuestas anteriores de esta asignación
            await self.conn.execute(
                "DELETE FROM respuesta_estudiante WHERE asignacion_id = $1", 
                asignacion_id
            )

            # 4. Inserción masiva de las nuevas respuestas
            if respuestas:
                query_insert = """
                    INSERT INTO respuesta_estudiante 
                    (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto)
                    VALUES ($1, $2, $3, $4, $5, $6)
                """
                valores = [
                    (
                        asignacion_id,
                        r["pregunta_id"],
                        r.get("materia_id"),
                        r.get("opcion_seleccionada_id"),
                        r.get("valor_numerico"),
                        r.get("valor_texto")
                    )
                    for r in respuestas
                ]
                await self.conn.executemany(query_insert, valores)

            # =================================================================
            # 5. LÓGICA ACADÉMICA: PROCESAMIENTO DE FINALES
            # =================================================================
            if nuevo_estado == 'Completada' and asig and asig['evento_disparador'] == 'llamado_final_acad':
                
                # Obtener los IDs únicos de las materias que respondió en este formulario
                materias_ids = list(set(r['materia_id'] for r in respuestas if r.get('materia_id')))

                for materia_id in materias_ids:
                    # Buscamos la cursada que está habilitada para rendir final
                    cursada = await self.conn.fetchrow("""
                        SELECT id FROM cursadas
                        WHERE estudiante_id = $1 AND materia_id = $2 AND estado = 'aprobada_falta_final' 
                    """, asig['estudiante_id'], materia_id)

                    if not cursada:
                        continue # Si no tiene la cursada en ese estado, ignoramos para no romper datos

                    cursada_id = cursada['id']

                    # Extraer qué contestó sobre esta materia cruzando con las opciones
                    resp_materia = await self.conn.fetch("""
                        SELECT r.valor_numerico, op.texto_opcion
                        FROM respuesta_estudiante r
                        LEFT JOIN opcion_pregunta op ON r.opcion_seleccionada_id = op.id
                        WHERE r.asignacion_id = $1 AND r.materia_id = $2
                    """, asignacion_id, materia_id)

                    nota_final = None
                    estado_final = None

                    for rm in resp_materia:
                        if rm['valor_numerico'] is not None:
                            nota_final = rm['valor_numerico']
                        if rm['texto_opcion'] is not None:
                            estado_final = rm['texto_opcion'] # 'Sí', 'No', o 'No me presenté'

                    # Si no se presentó, cortamos acá y no consumimos intento
                    if estado_final == 'No me presenté' or not estado_final:
                        continue

                    aprobado = (estado_final == 'Sí')

                    # Contar cuántos intentos ya tenía
                    intentos_previos = await self.conn.fetchval(
                        "SELECT COUNT(*) FROM intentos_finales WHERE cursada_id = $1", 
                        cursada_id
                    )
                    nuevo_intento = intentos_previos + 1

                    # Insertar el registro histórico en intentos_finales
                    await self.conn.execute("""
                        INSERT INTO intentos_finales (cursada_id, numero_intento, nota, fecha, aprobado)
                        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)
                    """, cursada_id, nuevo_intento, nota_final, aprobado)

                    # Evaluar el impacto en la cursada original
                    if aprobado:
                        await self.conn.execute(
                            "UPDATE cursadas SET estado = 'aprobada'::public.enum_estado_cursada WHERE id = $1", 
                            cursada_id
                        )
                    elif nuevo_intento >= 3:
                        # Se le venció la cursada por la regla de los 3 intentos
                        await self.conn.execute(
                            "UPDATE cursadas SET estado = 'desaprobada'::public.enum_estado_cursada WHERE id = $1", 
                            cursada_id
                        )

                        # Generar alerta por agotar intentos de final
                        estudiante = await self.conn.fetchrow(
                            "SELECT etapa FROM estudiantes WHERE id = $1",
                            asig['estudiante_id']
                        )
                        etapa = estudiante['etapa'] if estudiante else 'tardia'
                        anio_actual = datetime.now().year
                        await self.conn.execute("""
                            INSERT INTO alertas
                                (estudiante_id, score_id, asignacion_id, tipo_desercion,
                                 nivel_riesgo, origen, anio_cursada)
                            VALUES ($1, NULL, NULL, $2::etapa_desercion_enum,
                                    'critico'::nivel_riesgo_enum, 'intentos_final_agotados'::origen_alerta_enum, $3)
                        """, asig['estudiante_id'], etapa, anio_actual)
