from app.models.estudiante_dashboard import EstudianteDashboardResponse
from app.schemas.dashboard_admin_dep import GeneralEstudianteDashboardAdminResponse
import asyncpg
import datetime

from app.schemas.alertas import AlertaResponse
from app.schemas.dashboard_tutor import IntervencionesTutorResponse
from app.schemas.entrevista_planificada import EntrevistaPlanificadaResponse


class dashboardTutorRepository:
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.conn = conn
    
    async def get_students_by_tutor(self, tutor_id: int) -> list[EstudianteDashboardResponse]:
        rows = await self.conn.fetch(
            """
            SELECT
                e.nombre,
                e.apellido,
                e.dni,
                c.nombre AS carrera,
                e.porcentaje_carrera,
                s.valor AS indice_riesgo,
                a.estado AS estado_alerta,
                s.creado_en AS ultima_fecha_recalculo
            FROM estudiantes e
            INNER JOIN carreras c ON e.carrera_id = c.id
            LEFT JOIN score_total s ON e.id = s.estudiante_id
                AND s.creado_en = (
                    SELECT MAX(creado_en) 
                    FROM score_total 
                    WHERE estudiante_id = e.id
                )
            LEFT JOIN alertas a ON e.id = a.estudiante_id
                AND a.generada_en = (
                    SELECT MAX(generada_en) 
                    FROM alertas 
                    WHERE estudiante_id = e.id
                )
            WHERE e.carrera_id = (SELECT carrera_id FROM usuarios WHERE id = $1)
              AND e.activo = TRUE
            """,
            tutor_id
        )
        return [EstudianteDashboardResponse(**dict(row)) for row in rows]

    async def general_data_by_student(self, estudiante_id: int) -> GeneralEstudianteDashboardAdminResponse | None:
        row = await self.conn.fetchrow("""
            SELECT
                e.nombre,
                e.apellido,
                e.anio_ingreso AS anio,
                c.nombre AS carrera,
                COALESCE(aprobadas.materias_aprobadas, 0) AS materias_aprobadas,
                COALESCE(totales.materias_totales, 0) AS materias_totales,
                s.valor AS score_riesgo
            FROM estudiantes e
            INNER JOIN carreras c ON e.carrera_id = c.id
            LEFT JOIN score_total s on e.id = s.estudiante_id
            and s.creado_en = (
		        SELECT MAX(creado_en) 
		        FROM score_total 
		        WHERE estudiante_id = e.id
		    )
            LEFT JOIN (
                SELECT
                    estudiante_id,
                    COUNT(DISTINCT materia_id) AS materias_aprobadas
                FROM cursadas
                WHERE estado = 'aprobada'
                GROUP BY estudiante_id
            ) aprobadas ON aprobadas.estudiante_id = e.id
            LEFT JOIN (
                SELECT
                    pe.carrera_id,
                    COUNT(DISTINCT m.id) AS materias_totales
                FROM plan_estudios pe
                INNER JOIN plan_materia pm ON pm.plan_id = pe.id
                INNER JOIN materias m ON m.id = pm.materia_id
                WHERE pe.activo = TRUE
                GROUP BY pe.carrera_id
            ) totales ON totales.carrera_id = e.carrera_id
            WHERE e.id = $1 
        """, estudiante_id)
        return GeneralEstudianteDashboardAdminResponse(**dict(row)) if row else None
    
    async def get_numero_entrevistas_planificadas(self, tutor_id: int) -> int:
        row = await self.conn.fetchrow("""
            SELECT COUNT(*) AS entrevistas_planificadas
            FROM entrevista_planificada
            WHERE tutor_id = $1 AND estado = 'pendiente'
        """, tutor_id)
        return row['entrevistas_planificadas'] if row else 0

    async def get_entrevistas(self, tutor_id:int) -> list[EntrevistaPlanificadaResponse]:
        rows = await self.conn.fetch("""
            SELECT ep.*, e.nombre AS estudiante_nombre, e.apellido AS estudiante_apellido
            FROM entrevista_planificada ep
            INNER JOIN estudiantes e ON ep.estudiante_id = e.id
            WHERE ep.tutor_id = $1
        """, tutor_id)
        return [EntrevistaPlanificadaResponse(**dict(row)) for row in rows]
    
    async def get_intervenciones_por_tutor(self, tutor_id: int) -> list[IntervencionesTutorResponse]:
        rows = await self.conn.fetch("""
            SELECT i.*,
            a.estudiante_id,
            e.nombre AS estudiante_nombre,
            e.apellido AS estudiante_apellido,
            e.dni AS estudiante_dni
            FROM intervenciones i
            INNER JOIN alertas a ON i.alerta_id = a.id
            INNER JOIN estudiantes e ON a.estudiante_id = e.id
            WHERE i.tutor_id = $1
        """, tutor_id)
        return [IntervencionesTutorResponse(**dict(row)) for row in rows]
    
    async def get_alertas_sin_atender_por_carrera(self, carrera_id: int) -> list[AlertaResponse]:
            query = """
                SELECT a.*, e.nombre AS estudiante_nombre, e.apellido AS estudiante_apellido
                FROM alertas a
                INNER JOIN estudiantes e ON a.estudiante_id = e.id
                WHERE e.carrera_id = $1 AND a.estado IN ('nueva', 'en_revision')
                ORDER BY a.generada_en DESC
            """
            rows = await self.conn.fetch(query, carrera_id)
            return [AlertaResponse(**row) for row in rows]
    
    