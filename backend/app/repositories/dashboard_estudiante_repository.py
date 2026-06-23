import asyncpg

from app.schemas.asignacion_encuesta import AsignacionEncuestaResponse
from app.schemas.materia import MateriaListResponse
from app.schemas.pregunta import PreguntaResponse
from app.schemas.respuesta import RespuestaItem, RespuestaResponse
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
                u.rol
            FROM alertas a
            INNER JOIN intervenciones i ON i.alerta_id = a.id
            INNER JOIN usuarios u ON u.id = i.tutor_id
            WHERE a.estudiante_id = $1
            AND a.estado IN ('en_revision', 'intervenida')
            """
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
            INNER JOIN materias m ON m.plan_id = pe.id
            INNER JOIN estudiantes e ON e.carrera_id = pe.carrera_id
            WHERE pe.activo = TRUE
            AND e.id = $1
            AND pe.anio_vigencia = (
                SELECT MAX(anio_vigencia)
                FROM plan_estudios
                WHERE carrera_id = e.carrera_id
                AND anio_vigencia <= e.anio_ingreso
                AND activo = TRUE
            )
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
                m.cuatrimestre_sugerido,
                m.es_basica_critica,
                c.estado
            FROM cursadas c
            INNER JOIN materias m ON m.id = c.materia_id
            WHERE c.estudiante_id = $1
            ORDER BY m.cuatrimestre_sugerido, m.nombre
            """,
            estudiante_id,
        )
        return [MateriaListResponse(**dict(row)) for row in rows]

    async def encuestas_sin_responder(self, estudiante_id: int) -> int:
        row = await self.conn.fetchrow(
            """
            SELECT COUNT(*) AS total
            FROM asignacion_encuestas a
            WHERE a.estudiante_id = $1
            AND a.completado = FALSE
            """,
            estudiante_id,
        )
        return row["total"] if row else 0