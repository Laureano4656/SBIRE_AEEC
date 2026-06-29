from dataclasses import fields

from app.schemas.encuesta import AsignacionEncuestaResponse
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
import asyncpg

from app.schemas.encuesta import (
    EstadisticaEventoResponse,
    OpcionEncuestaResponse,
    PreguntaParaEncuesta,
    RespuestaItemSubmit,
    RespuestaPrevia,
    MateriaResponse,
)
from app.schemas.pregunta import PreguntaResponse


class EncuestasRepository:
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.conn = conn

    async def _obtener_materias_alumno(
        self, estudiante_id: int, estado: str
    ) -> list[MateriaResponse]:
        """
        Busca materias en las que el estudiante ya tiene una inscripción activa
        con un estado específico ('cursando' o 'aprobada falta final').
        """
        rows = await self.conn.fetch(
            """
                SELECT m.id as materia_id, m.nombre as materia_nombre
                FROM cursadas c
                JOIN materias m ON c.materia_id = m.id
                WHERE c.estudiante_id = $1 
                AND c.estado = $2::public.enum_estado_cursada
            """,
            estudiante_id,
            estado,
        )
        return [MateriaResponse(**row) for row in rows]

    async def _obtener_materias_disponibles(
        self, estudiante_id: int
    ) -> list[MateriaResponse]:
        """
        Cruza al estudiante con su plan de estudios, filtrando las materias
        que ya aprobó/está cursando, asegurando que cumpla con las CORRELATIVAS,
        y validando que la materia se dicte en el cuatrimestre actual.
        """
        # 1. Calculamos en qué cuatrimestre estamos según el mes actual
        mes_actual = datetime.now().month
        cuatrimestre_actual = 1 if mes_actual <= 7 else 2

        # 2. Actualizamos la query agregando el filtro y corrigiendo el alias
        query = """
            SELECT m.id as materia_id, m.nombre as materia_nombre
            FROM estudiantes e
            JOIN plan_estudios pe ON e.carrera_id = pe.carrera_id
            JOIN plan_materia pm ON pm.plan_id = pe.id
            JOIN materias m ON m.id = pm.materia_id
            WHERE e.id = $1 
              AND pe.activo = TRUE
              AND m.cuatrimestre_dictado IN (0, $2)
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
                  WHERE co.materia_id = m.id
                    AND NOT EXISTS (
                        SELECT 1
                        FROM cursadas c2
                        WHERE c2.estudiante_id = e.id
                          AND c2.materia_id = co.requiere_materia_id
                          AND c2.estado_cursada IN ('aprobada', 'aprobada falta final')
                    )
              )
        """

        # 3. Le pasamos el estudiante_id ($1) y el cuatrimestre_actual ($2) a asyncpg
        filas = await self.conn.fetch(query, estudiante_id, cuatrimestre_actual)

        return [MateriaResponse(**dict(row)) for row in filas]

    async def guardar_respuestas(
        self, asignacion_id: int, respuestas: list[RespuestaItemSubmit]
    ) -> None:
        """Guarda el array de respuestas de forma transaccional."""
        async with self.conn.transaction():
            # 1. Marcar la asignación como completada
            await self.conn.execute(
                "UPDATE asignacion_encuesta SET completado = true WHERE id = $1",
                asignacion_id,
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
                    r["pregunta_id"],
                    r.get("materia_id"),
                    r.get("opcion_seleccionada_id"),
                    r.get("valor_numerico"),
                    r.get("valor_texto"),
                )
                for r in respuestas
            ]
            await self.conn.executemany(query_insert, valores)

    async def get_asignacion(
        self, asignacion_id: int
    ) -> AsignacionEncuestaResponse | None:
        row = await self.conn.fetchrow(
            """
            SELECT 
            id,
            estudiante_id,
            evento_id as evento_disparador,
            periodo_lectivo,
            completado
            FROM asignacion_encuesta WHERE id = $1 AND completado=false AND borrador = false""",
            asignacion_id,
        )
        return AsignacionEncuestaResponse(**row) if row else None

    async def get_preguntas(
        self, evento: int, carrera_id: int | None
    ) -> list[PreguntaResponse]:
        rows = await self.conn.fetch(
            """
            SELECT pregunta.id, indicador_id, carrera_id, texto_pregunta, pregunta.evento_id as evento_id,
                   tipo_pregunta::text, configuracion_riesgo::text, activa
            FROM pregunta
            INNER JOIN evento_disparador ON pregunta.evento_id = evento_disparador.id
            WHERE pregunta.activa = TRUE AND pregunta.evento_id = $1
              AND (carrera_id = $2 OR carrera_id IS NULL)
            """,
            evento,
            carrera_id,
        )
        return [PreguntaResponse(**r) for r in rows]

    async def get_evento_disparador(self, evento: int):
        val = await self.conn.fetchval(
            """
            SELECT periodicidad
            FROM evento_disparador
            WHERE id = $1
            """,
            evento,
        )
        return val

    async def get_opciones(
        self, pregunta_ids: list[int]
    ) -> list[OpcionEncuestaResponse]:
        rows = await self.conn.fetch(
            "SELECT id, pregunta_id, texto_opcion FROM opcion_pregunta WHERE pregunta_id = ANY($1::int[]) ORDER BY orden_visual ASC",
            pregunta_ids,
        )
        return [OpcionEncuestaResponse(**r) for r in rows]

    async def get_respuestas_previas(self, asignacion_id: int) -> list[RespuestaPrevia]:
        rows = await self.conn.fetch(
            "SELECT pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto FROM respuesta_estudiante WHERE asignacion_id = $1",
            asignacion_id,
        )
        return [RespuestaPrevia(**r) for r in rows]

    async def get_carrera_estudiante(self, estudiante_id: int) -> int | None:
        row = await self.conn.fetchrow(
            "SELECT carrera_id FROM estudiantes WHERE id = $1", estudiante_id
        )
        return row["carrera_id"] if row else None

    async def get_materias_cursando(self, estudiante_id: int) -> list[dict]:
        return await self._obtener_materias_alumno(estudiante_id, "cursando")

    async def get_materias_con_final(self, estudiante_id: int) -> list[dict]:
        return await self._obtener_materias_alumno(
            estudiante_id, "aprobada_falta_final"
        )

    async def get_materias_disponibles(self, estudiante_id: int) -> list[dict]:
        return await self._obtener_materias_disponibles(estudiante_id)

    async def publicar_asignacion(self, asignacion_id: int) -> bool:
        """Cambia el campo borrador a false para que sea visible por los estudiantes."""

        query = """
            UPDATE asignacion_encuesta 
            SET borrador = false 
            WHERE id = $1
            RETURNING id;
        """
        result = await self.conn.fetchval(query, asignacion_id)
        return result is not None

    async def get_encuestas_agrupadas_por_evento(self) -> list[dict]:
        """
        Trae métricas generales de las encuestas (totales y completadas)
        agrupadas por cada tipo de evento disparador.
        """
        query = """
            SELECT 
                ed.id as evento_id,
                ed.nombre as nombre_evento,
                COUNT(ae.id)::int as total_asignadas,
                COUNT(CASE WHEN ae.completado = TRUE THEN 1 END)::int as total_completadas
            FROM evento_disparador ed
            LEFT JOIN asignacion_encuesta ae ON ae.evento_id = ed.id
            GROUP BY ed.id, ed.nombre
            ORDER BY ed.id ASC;
        """
        return await self.conn.fetch(query)

    async def get_detalles_encuestas_ultimo_anio(
        self, carrera_id: int, evento_id: int, anio_actual: str
    ) -> list[asyncpg.Record]:
        """
        Trae el volcado completo de estudiantes de una carrera con sus respectivas preguntas,
        materias asociadas (si aplica), opciones elegidas y valores ingresados para un año específico.
        """
        query = """
            SELECT 
                e.id as estudiante_id,
                e.legajo,
                CONCAT(e.nombre, ' ', e.apellido) as nombre_completo,
                ae.id as asignacion_id,
                ae.periodo_lectivo,
                p.id as pregunta_id,
                p.texto_pregunta,
                m.nombre as materia_nombre,
                op.texto_opcion as opcion_texto,
                re.valor_numerico,
                re.valor_texto
            FROM asignacion_encuesta ae
            JOIN estudiantes e ON ae.estudiante_id = e.id
            JOIN pregunta p ON p.evento_id = ae.evento_id AND p.carrera_id = e.carrera_id
            LEFT JOIN respuesta_estudiante re ON re.asignacion_id = ae.id AND re.pregunta_id = p.id
            LEFT JOIN materias m ON re.materia_id = m.id
            LEFT JOIN opcion_pregunta op ON re.opcion_seleccionada_id = op.id
            WHERE e.carrera_id = $1
              AND ae.evento_id = $2
              AND ae.periodo_lectivo LIKE $3 || '%'
            ORDER BY e.id, ae.id, p.id, m.nombre;
        """
        return await self.conn.fetch(query, carrera_id, evento_id, anio_actual)

    async def get_encuestas_agrupadas_por_evento_y_carrera(
        self, carrera_id: int
    ) -> list[asyncpg.Record]:
        """
        Trae métricas de encuestas (asignadas vs completadas) agrupadas por evento,
        pero filtrando únicamente las asignaciones de los estudiantes de una carrera específica.
        """
        query = """
            SELECT 
                ed.id as evento_id,
                ed.nombre as nombre_evento,
                COUNT(ae.id)::int as total_asignadas,
                COUNT(CASE WHEN ae.completado = TRUE THEN 1 END)::int as total_completadas
            FROM evento_disparador ed
            -- Usamos una subconsulta en el JOIN para garantizar que los eventos con 0 asignaciones 
            -- para esta carrera sigan apareciendo en la lista final.
            LEFT JOIN (
                SELECT a.id, a.evento_id, a.completado
                FROM asignacion_encuesta a
                JOIN estudiantes e ON a.estudiante_id = e.id
                WHERE e.carrera_id = $1
            ) ae ON ae.evento_id = ed.id
            GROUP BY ed.id, ed.nombre
            ORDER BY ed.id ASC;
        """
        return await self.conn.fetch(query, carrera_id)

    async def get_encuestas_agrupadas_por_evento_y_carrera_cicloLectivoActual(
        self, carrera_id: int
    ) -> list[asyncpg.Record]:
        """
        Trae métricas de encuestas (asignadas vs completadas) agrupadas por evento,
        pero filtrando únicamente las asignaciones de los estudiantes de una carrera específica.
        Solo considera el ciclo lectivo actual.
        """
        query = """
            SELECT 
                ed.id as evento_id,
                ed.nombre as nombre_evento,
                ed.periodicidad as periodicidad_evento,
                COUNT(ae.id)::int as total_asignadas,
                COUNT(CASE WHEN ae.completado = TRUE THEN 1 END)::int as total_completadas
            FROM evento_disparador ed
            -- Usamos una subconsulta en el JOIN para garantizar que los eventos con 0 asignaciones 
            -- para esta carrera sigan apareciendo en la lista final.
            LEFT JOIN (
                SELECT a.id, a.evento_id, a.completado,a.fecha_asignacion
                FROM asignacion_encuesta a
                JOIN estudiantes e ON a.estudiante_id = e.id
                WHERE e.carrera_id = $1
            ) ae ON ae.evento_id = ed.id
            WHERE ae.fecha_asignacion >= date_trunc('year', current_date) -- Filtra solo asignaciones del ciclo lectivo actual
            GROUP BY ed.id, ed.nombre
            ORDER BY ed.id ASC;
        """
        return await self.conn.fetch(query, carrera_id)

    async def get_asignaciones_completadas_detalles(
        self, carrera_id: int, evento_id: int, periodo_lectivo: str
    ) -> list[asyncpg.Record]:
        """Trae los datos base de los estudiantes que completaron la encuesta."""
        query = """
            SELECT 
                ae.id as asignacion_id, 
                e.id as estudiante_id, 
                e.legajo, 
                CONCAT(e.nombre,' ',e.apellido) as nombre_completo,
                ae.periodo_lectivo
            FROM asignacion_encuesta ae
            JOIN estudiantes e ON ae.estudiante_id = e.id
            WHERE e.carrera_id = $1 
              AND ae.evento_id = $2 
              AND ae.periodo_lectivo LIKE $3 || '%'
              AND ae.completado = TRUE -------------------------- CHECKEAR COMPLETADO
        """
        return await self.conn.fetch(query, carrera_id, evento_id, periodo_lectivo)

    async def get_respuestas_previas_bulk(
        self, asignacion_ids: list[int]
    ) -> list[asyncpg.Record]:
        """Trae de una sola vez todas las respuestas de un lote de asignaciones."""
        query = """
            SELECT asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto
            FROM respuesta_estudiante
            WHERE asignacion_id = ANY($1::int[])
        """
        return await self.conn.fetch(query, asignacion_ids)
