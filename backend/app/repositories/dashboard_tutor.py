from app.models.estudiante_dashboard import EstudianteDashboardResponse
from app.schemas.intervenciones import EntrevistaCreate, IntervencionCreate
import asyncpg
import datetime


class dashboardTutorRepository:
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.conn = conn
    
    async def get_students_by_tutor(self, tutor_id: int) -> list[EstudianteDashboardResponse]:
        # Implementar la lógica para obtener los estudiantes asignados a un tutor
        rows = await self.conn.fetch(
            """
            SELECT DISTINCT ON (e.id)
                e.nombre,
                e.apellido,
                e.dni,
                c.nombre AS carrera,
                e.porcentaje_carrera AS porcentaje_carrera,
                s.valor AS indice_riesgo,
                a.estado AS estado_alerta,
                s.creado_en AS ultima_fecha_recalculo
            FROM intervenciones i
            INNER JOIN alertas a ON i.alerta_id = a.id
            INNER JOIN estudiantes e ON a.estudiante_id = e.id
            INNER JOIN carreras c ON e.carrera_id = c.id
            INNER JOIN (
                SELECT DISTINCT ON (estudiante_id) *
                FROM score_total
                ORDER BY estudiante_id, creado_en DESC
            ) s ON e.id = s.estudiante_id
            WHERE i.tutor_id = $1
            AND a.estado IN ('en_revision', 'intervenida')
            ORDER BY e.id, i.creado_en DESC
            """,
            tutor_id
        )
        return [EstudianteDashboardResponse(**dict(row)) for row in rows]


    
