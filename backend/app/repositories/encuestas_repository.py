from dataclasses import fields

from app.models import RespuestaItem
from app.models import SubmitEncuestaRequest
from app.models import AsignacionEncuestaResponse
from app.models import AsignacionEncuestaCreate
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
import asyncpg

from app.schemas.encuesta import OpcionEncuestaResponse, PreguntaParaEncuesta, RespuestaItemSubmit, RespuestaPrevia
from app.schemas.materia import MateriaResponse
from app.schemas.pregunta import PreguntaResponse
    

class EncuestasRepository:
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.conn = conn
    

    async def _obtener_materias_alumno(self, estudiante_id: int, estado: str) -> list[MateriaResponse]:
        """
        Busca materias en las que el estudiante ya tiene una inscripción activa 
        con un estado específico ('cursando' o 'aprobada falta final').
        """
        rows = await self.conn.fetch(
                """
                SELECT m.id as materia_id, m.nombre as materia_nombre
                FROM inscripciones i
                JOIN materias m ON i.materia_id = m.id
                WHERE i.estudiante_id = $1 
                AND i.estado_cursada = $2::public.enum_estado_cursada
            """, estudiante_id, estado)
        return [MateriaResponse(**row) for row in rows]
    
    async def _obtener_materias_disponibles(self, estudiante_id: int) -> list[MateriaResponse]:
        """
        Cruza al estudiante con su plan de estudios, filtrando las materias
        que ya aprobó/está cursando, y asegurando que cumpla con las CORRELATIVAS.
        """
        query = """
            SELECT m.id as materia_id, m.nombre as materia_nombre
            FROM estudiantes e
            JOIN plan_estudios pe ON e.carrera_id = pe.carrera_id
            JOIN materias m ON m.plan_id = pe.id
            WHERE e.id = $1 
              AND pe.activo = TRUE
              AND NOT EXISTS (
                  SELECT 1 
                  FROM cursadas c 
                  WHERE c.estudiante_id = e.id 
                    AND c.materia_id = m.id 
                    AND c.estado IN ('aprobada', 'aprobada falta final', 'cursando')
              )
              AND NOT EXISTS (
                  SELECT 1
                  FROM correlativas co
                  WHERE c.materia_id = m.id
                    AND NOT EXISTS (
                        SELECT 1
                        FROM cursadas c2
                        WHERE c2.estudiante_id = e.id
                          AND c2.materia_id = co.requiere_materia_id
                          AND c2.estado_cursada IN ('aprobada', 'aprobada falta final')
                    )
              )
        """
        
        return [MateriaResponse(**row) for row in await self.conn.fetch(query, estudiante_id)]
    
    async def guardar_respuestas(self, asignacion_id: int, respuestas: list[RespuestaItemSubmit]) -> None:
        """Guarda el array de respuestas de forma transaccional."""
        async with self.conn.transaction():
            # 1. Marcar la asignación como completada
            await self.conn.execute(
                "UPDATE asignacion_encuesta SET completado = true WHERE id = $1",
                asignacion_id
            )

            # 2. Insertar respuestas (sin calcular riesgo aún)
            query_insert = """
                INSERT INTO respuesta_estudiante 
                (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto)
                VALUES ($1, $2, $3, $4, $5, $6)
            """
            valores = [
                (
                    asignacion_id,
                    r['pregunta_id'],
                    r.get('materia_id'),
                    r.get('opcion_seleccionada_id'),
                    r.get('valor_numerico'),
                    r.get('valor_texto')
                )
                for r in respuestas
            ]
            await self.conn.executemany(query_insert, valores)
            
    async def get_asignacion(self, asignacion_id: int) -> AsignacionEncuestaResponse | None:
        row = await self.conn.fetchrow(
            """
            SELECT 
            id as id,
            estudiante_id as estudiante_id,
            evento_disparador as evento_disparador,
            periodo_lectivo as periodo_lectivo,
            completado as completado
            FROM asignacion_encuesta WHERE id = $1 AND completado=false""",
            asignacion_id
        )
        return AsignacionEncuestaResponse(**row) if row else None

    async def get_preguntas(self, evento: str, carrera_id: int | None) -> list[PreguntaResponse]:
        rows = await self.conn.fetch(
            """
            SELECT id, indicador_id, carrera_id, texto_pregunta, evento_disparador.nombre as evento,
                   tipo_pregunta::text, configuracion_riesgo::text, activa
            FROM pregunta
            INNER JOIN evento_disparador ON pregunta.evento_disparador = evento_disparador.id
            WHERE activa = TRUE AND evento = $1
              AND (carrera_id = $2 OR carrera_id IS NULL)
            """,
            evento, carrera_id
        )
        return [PreguntaResponse(**r) for r in rows]

    async def get_opciones(self, pregunta_ids: list[int]) -> list[OpcionEncuestaResponse]:
        rows = await self.conn.fetch(
            "SELECT id, pregunta_id, texto_opcion FROM opcion_pregunta WHERE pregunta_id = ANY($1::int[]) ORDER BY orden_visual ASC",
            pregunta_ids
        )
        return [OpcionEncuestaResponse(**r) for r in rows]

    async def get_respuestas_previas(self, asignacion_id: int) -> list[RespuestaPrevia]:
        rows = await self.conn.fetch(
            "SELECT pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto FROM respuesta_estudiante WHERE asignacion_id = $1",
            asignacion_id
        )
        return [RespuestaPrevia(**r) for r in rows]

    async def get_carrera_estudiante(self, estudiante_id: int) -> int | None:
        row = await self.conn.fetchrow("SELECT carrera_id FROM estudiantes WHERE id = $1", estudiante_id)
        return row['carrera_id'] if row else None

    async def get_materias_cursando(self, estudiante_id: int) -> list[dict]:
        return await self._obtener_materias_alumno(estudiante_id, 'cursando')

    async def get_materias_con_final(self, estudiante_id: int) -> list[dict]:
        return await self._obtener_materias_alumno(estudiante_id, 'aprobada falta final')

    async def get_materias_disponibles(self, estudiante_id: int) -> list[dict]:
        return await self._obtener_materias_disponibles(estudiante_id)