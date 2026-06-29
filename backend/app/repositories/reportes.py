import asyncpg

from app.schemas.reportes import ReporteResponse

class ReportesRepository:
    def __init__(self, conn: asyncpg.Connection):
        self.conn = conn
    
    async def get_reporte_estudiantes_carrera(self, carrera_id: int) -> list[ReporteResponse]:
        rows =  await self.conn.fetch("""
            SELECT 
            e.legajo,
            e.nombre,
            e.apellido,
            c.nombre AS carrera,
            date_part('year', CURRENT_DATE) - e.anio_ingreso + 1 AS cursada,
            s.valor AS riesgo,
            s.creado_en AS fecha_riesgo,
            (
                SELECT COUNT(DISTINCT materia_id)
                FROM cursadas
                WHERE estudiante_id = e.id
                AND estado = 'aprobada'
            ) AS aprobadas,
            (
                SELECT COUNT(DISTINCT m.id) AS total
                FROM plan_estudios pe
                INNER JOIN plan_materia pm ON pm.plan_id = pe.id
                INNER JOIN materias m ON m.id = pm.materia_id
                INNER JOIN estudiantes e ON e.carrera_id = pe.carrera_id
                WHERE pe.activo = TRUE AND pe.carrera_id = $1
            ) AS totales
            FROM estudiantes e
            INNER JOIN carreras c ON c.id = e.carrera_id
            LEFT JOIN score_total s ON e.id = s.estudiante_id
                AND s.creado_en = (
                    SELECT MAX(creado_en) 
                    FROM score_total 
                    WHERE estudiante_id = e.id
                )
            WHERE e.carrera_id = $1
        """, carrera_id)
        return [ReporteResponse(**dict(row)) for row in rows]