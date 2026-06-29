import asyncpg


from app.schemas.materia import MateriaListResponse
from app.schemas.usuario import UsuarioResponse


class dashboardEstudiantesRepository:
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.conn = conn

    
    async def get_datos_tutor(self, estudiante_id: int) -> UsuarioResponse | None:
        row = await self.conn.fetchrow(
            """
            SELECT DISTINCT ON (u.id)
                u.id,
                u.nombre,
                u.apellido,
                u.email,
                u.rol,
                u.carrera_id,
                u.moodle_id,
                u.max_casos_activos,
                u.activo
            FROM alertas a
            INNER JOIN intervenciones i ON i.alerta_id = a.id
            INNER JOIN usuarios u ON u.id = i.tutor_id
            WHERE a.estudiante_id = $1
            AND a.estado IN ('en_revision', 'intervenida')
            """,
            estudiante_id,
        )
        return UsuarioResponse(**row) if row else None
    
        
    async def materias_aprobadas(self, estudiante_id: int) -> int:
        row = await self.conn.fetchrow(
            """
            SELECT COUNT(DISTINCT materia_id) AS total
            FROM cursadas
            WHERE estudiante_id = $1
            AND estado = 'aprobada'
            """,
            estudiante_id,
        )
        return row["total"] if row else 0
    
    async def materias_totales(self, estudiante_id: int) -> int:
        row = await self.conn.fetchrow(
            """
            SELECT COUNT(DISTINCT m.id) AS total
            FROM plan_estudios pe
            INNER JOIN plan_materia pm ON pm.plan_id = pe.id
            INNER JOIN materias m ON m.id = pm.materia_id
            INNER JOIN estudiantes e ON e.carrera_id = pe.carrera_id
            WHERE pe.activo = TRUE
            AND e.id = $1
            """,
            estudiante_id,
        )
        return row["total"] if row else 0

    async def listado_materias_cursadas(self, estudiante_id: int) -> list[MateriaListResponse]:
        rows = await self.conn.fetch(
            """
            SELECT
                m.id,
                m.nombre,
                m.codigo,
                pm.cuatrimestre_sugerido,
                m.es_basica_critica,
                c.estado,
                m.cuatrimestre_dictado
            FROM cursadas c
            INNER JOIN materias m ON m.id = c.materia_id
            INNER JOIN plan_materia pm ON pm.materia_id = m.id
            INNER JOIN plan_estudios pe ON pe.id = pm.plan_id
            INNER JOIN estudiantes e ON e.id = c.estudiante_id AND e.carrera_id = pe.carrera_id
            WHERE c.estudiante_id = $1
              AND pe.activo = TRUE
            ORDER BY pm.cuatrimestre_sugerido, m.nombre
            """,
            estudiante_id,
        )
        return [MateriaListResponse(**dict(row)) for row in rows]

    async def encuestas_sin_responder(self, estudiante_id: int) -> int:
        row = await self.conn.fetchrow(
            """
            SELECT COUNT(*) AS total
            FROM asignacion_encuesta a
            WHERE a.estudiante_id = $1
            AND a.completado = FALSE
            """,
            estudiante_id,
        )
        return row["total"] if row else 0

    async def list_encuestas_pendientes(self, estudiante_id: int) -> list[dict]:
        rows = await self.conn.fetch(
            """
            SELECT
                a.id AS asignacion_id,
                a.evento_id AS evento_disparador,
                a.periodo_lectivo,
                a.completado,
                e.nombre AS nombre_evento
            FROM asignacion_encuesta a
            INNER JOIN evento_disparador e ON e.id = a.evento_id
            WHERE a.estudiante_id = $1
              AND a.completado = FALSE
              AND a.borrador = FALSE
            ORDER BY a.fecha_asignacion DESC
            """,
            estudiante_id,
        )
        return [dict(row) for row in rows]