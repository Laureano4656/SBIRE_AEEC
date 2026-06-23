import datetime

import asyncpg

from app.schemas.dashboard_admin_dep import DimensionAgrupadaResponse, EstudianteDashboardAdminResponse, EventoCronologicoResponse, GeneralEstudianteDashboardAdminResponse, IndicadorResponse, PreguntasRespuestasResponse, RolUpdate 

class dashboardAdminRepository:
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.conn = conn

    async def students_count(self, anio: int | None = None, carrera_id: int | None = None) -> int:
        row = await self.conn.fetchrow(
            """
            SELECT COUNT(*) AS count
            FROM estudiantes
            WHERE ($1::int IS NULL OR anio_ingreso = $1)
            AND ($2::int IS NULL OR carrera_id = $2) 
            AND activo = TRUE
            """,
            anio, carrera_id
        )
        return row["count"]
    
    async def total_critics(self, carrera_id: int | None = None) -> int:
        row = await self.conn.fetchrow(
            """
            SELECT COUNT(*) AS count
            FROM score_total 
            WHERE valor > (SELECT umbral_rojo FROM configuracion_indicador WHERE id = 1) 
            AND ($1::int IS NULL OR carrera_id = $1)
            """, carrera_id
        )

        return row["count"]
    
    async def total_new_alerts(self, carrera_id: int | None = None) -> int:
        row = await self.conn.fetchrow(
            """
            SELECT COUNT(*) AS count
            FROM alertas WHERE (estado = 'nueva' OR estado = 'en_revision')
            AND ($1::int IS NULL OR carrera_id = $1)
            """, carrera_id
        )

        return row["count"]

    async def total_interventions_month(self, month: int, year: int, carrera_id: int | None = None) -> int:
        row = await self.conn.fetchrow(
            """
            SELECT COUNT(*) AS count
            FROM intervenciones
            WHERE date_part('month', creado_en) = $1
            AND date_part('year', creado_en) = $2
            AND ($3::int IS NULL OR carrera_id = $3)
            """, month, year, carrera_id
        )
        return row["count"]
    
    async def count_by_risk(self, carrera_id: int, anio: int):
        rows = await self.conn.fetch(
            """
            SELECT
                c.nombre AS carrera,
                e.anio_ingreso, 
                CASE
                    WHEN s.valor > (SELECT umbral_rojo FROM configuracion_indicador WHERE carrera_id = $1) THEN 'rojo'
                    WHEN s.valor > (SELECT umbral_amarillo FROM configuracion_indicador WHERE carrera_id = $1) THEN 'amarillo'
                    ELSE 'verde'
                END AS tipo_riesgo,
                COUNT(*) AS count
            FROM score_total s
            INNER JOIN estudiantes e ON s.estudiante_id = e.id
            INNER JOIN carreras c ON e.carrera_id = c.id
            WHERE e.carrera_id = $1 AND e.anio_ingreso = $2 AND e.activo = TRUE
            GROUP BY tipo_riesgo, c.nombre, e.anio_ingreso
            """,
            carrera_id, anio
        )
        return {row["tipo_riesgo"]: row["count"] for row in rows}
    
    
    async def monthly_evolution_score(self, anio: int, carrera_id: int | None = None) -> dict[int, float]:
        rows = await self.conn.fetch(
            """
            SELECT
                date_part('month', creado_en) AS month,
                AVG(valor) AS average_score
            FROM score_total s
            INNER JOIN estudiantes e ON s.estudiante_id = e.id
            WHERE e.anio_ingreso = $1 AND e.activo = TRUE AND ($2::int IS NULL OR e.carrera_id = $2)
            GROUP BY month
            ORDER BY month
            """,
            anio, carrera_id
        )


        return {row["month"]: row["average_score"] for row in rows}
    
    
    async def get_student_by_dni(self, dni: str) -> EstudianteDashboardAdminResponse | None:
        row = await self.conn.fetchrow(
            """
            SELECT 
                e.nombre,
                e.apellido,
                e.dni,
                c.nombre AS carrera,
                e.etapa AS etapa,
                e.porcentaje_carrera,
                s.valor AS indice_riesgo,
                a.estado AS estado_alerta,
                s.creado_en AS ultima_fecha_recalculo
            FROM estudiantes e
            INNER JOIN carreras c ON e.carrera_id = c.id
            INNER JOIN (
                SELECT DISTINCT ON (estudiante_id) *
                FROM score_total
                ORDER BY estudiante_id, creado_en DESC
            ) s ON e.id = s.estudiante_id
            LEFT JOIN (
                SELECT DISTINCT ON (estudiante_id) *
                FROM alertas
                ORDER BY estudiante_id, generada_en DESC
            ) a ON e.id = a.estudiante_id
            WHERE dni = $1 AND e.activo = TRUE
            """,
            dni
        )

        return EstudianteDashboardAdminResponse(**dict(row)) if row else None

    async def get_students_by_career(self, carrera: str) -> list[EstudianteDashboardAdminResponse]:
        rows = await self.conn.fetch(
            """
            SELECT 
                e.nombre,
                e.apellido,
                e.dni,
                c.nombre AS carrera,
                e.etapa AS etapa,
                e.porcentaje_carrera,
                s.valor AS indice_riesgo,
                a.estado AS estado_alerta,
                s.creado_en AS ultima_fecha_recalculo
            FROM estudiantes e
            INNER JOIN carreras c ON e.carrera_id = c.id
            INNER JOIN (
                SELECT DISTINCT ON (estudiante_id) *
                FROM score_total
                ORDER BY estudiante_id, creado_en DESC
            ) s ON e.id = s.estudiante_id
            LEFT JOIN (
                SELECT DISTINCT ON (estudiante_id) *
                FROM alertas
                ORDER BY estudiante_id, generada_en DESC
            ) a ON e.id = a.estudiante_id
            WHERE c.nombre = $1 AND e.activo = TRUE
            """,
            carrera
        )

        return [EstudianteDashboardAdminResponse(**dict(row)) for row in rows]

    async def get_students_by_year(self, anio: int, carrera_id: int | None = None) -> list[EstudianteDashboardAdminResponse]:
        rows = await self.conn.fetch(
            """
            SELECT 
                e.nombre,
                e.apellido,
                e.dni,
                c.nombre AS carrera,
                e.etapa AS etapa,
                e.porcentaje_carrera,
                s.valor AS indice_riesgo,
                a.estado AS estado_alerta,
                s.creado_en AS ultima_fecha_recalculo
            FROM estudiantes e
            INNER JOIN carreras c ON e.carrera_id = c.id
            INNER JOIN (
                SELECT DISTINCT ON (estudiante_id) *
                FROM score_total
                ORDER BY estudiante_id, creado_en DESC
            ) s ON e.id = s.estudiante_id
            LEFT JOIN (
                SELECT DISTINCT ON (estudiante_id) *
                FROM alertas
                ORDER BY estudiante_id, generada_en DESC
            ) a ON e.id = a.estudiante_id
            WHERE e.anio_ingreso = $1 AND e.activo = TRUE AND ($2::int IS NULL OR e.carrera_id = $2)
            """,
            anio, carrera_id
        )

        return [EstudianteDashboardAdminResponse(**dict(row)) for row in rows]

    async def get_students_by_risk(self, risk_level: str, carrera_id: int | None = None) -> list[EstudianteDashboardAdminResponse]:
        rows = await self.conn.fetch(
            """
                SELECT 
                e.nombre,
                e.apellido,
                e.dni,
                c.nombre AS carrera,
                e.etapa AS etapa,
                e.porcentaje_carrera,
                s.valor AS indice_riesgo,
                a.estado AS estado_alerta,
                s.creado_en AS ultima_fecha_recalculo
            FROM estudiantes e
            INNER JOIN carreras c ON e.carrera_id = c.id
            INNER JOIN (
                SELECT DISTINCT ON (estudiante_id) *
                FROM score_total
                ORDER BY estudiante_id, creado_en DESC
            ) s ON e.id = s.estudiante_id
            LEFT JOIN (
                SELECT DISTINCT ON (estudiante_id) *
                FROM alertas
                ORDER BY estudiante_id, generada_en DESC
            ) a ON e.id = a.estudiante_id
            WHERE 
                CASE
                    WHEN s.valor > (SELECT umbral_rojo FROM configuracion_indicador WHERE id_carrera = e.carrera_id LIMIT 1) THEN 'rojo'
                    WHEN s.valor > (SELECT umbral_amarillo FROM configuracion_indicador WHERE id_carrera = e.carrera_id LIMIT 1)  THEN 'amarillo'
                    ELSE 'verde'
                END = $1 AND e.activo = TRUE AND ($2::int IS NULL OR e.carrera_id = $2)
            """,
            risk_level, carrera_id
        )

        return [EstudianteDashboardAdminResponse(**dict(row)) for row in rows]

    async def general_data_by_student(self, legajo: str, carrera_id: int) -> GeneralEstudianteDashboardAdminResponse | None:
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
            INNER JOIN (
                SELECT DISTINCT ON (estudiante_id) *
                FROM score_total
                ORDER BY estudiante_id, creado_en DESC
            ) s ON e.id = s.estudiante_id
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
                    pe.anio_vigencia,
                    COUNT(DISTINCT m.id) AS materias_totales
                FROM plan_estudios pe
                INNER JOIN materias m ON m.plan_id = pe.id
                WHERE pe.activo = TRUE
                GROUP BY pe.carrera_id, pe.anio_vigencia
                ) totales ON totales.carrera_id = e.carrera_id
                    AND totales.anio_vigencia = (
                        SELECT MAX(anio_vigencia)
                        FROM plan_estudios
                        WHERE carrera_id = e.carrera_id
                        AND anio_vigencia <= e.anio_ingreso
                        AND activo = TRUE
                    )
            WHERE e.legajo = $1 AND e.carrera_id = $2
        """, legajo, carrera_id)
        return GeneralEstudianteDashboardAdminResponse(**dict(row)) if row else None
    
    async def chronological_alerts(self, estudiante_id: str) -> list[EventoCronologicoResponse]:
        rows = await self.conn.fetch(
            """
            SELECT 
                'alerta' AS tipo,
                estado AS descripcion,
                generada_en AS fecha
            FROM alertas
            WHERE estudiante_id = $1

            UNION ALL

            SELECT 
                'intervencion' AS tipo,
                tipo AS descripcion,
                i.creado_en AS fecha
            FROM intervenciones i
            INNER JOIN alertas a ON i.alerta_id = a.id
            WHERE a.estudiante_id = $1 
            
            ORDER BY fecha DESC
            """,
            estudiante_id
        )
        return [EventoCronologicoResponse(**dict(row)) for row in rows]
    
    
    async def change_roles(self, user_id: int, new_role: str) -> RolUpdate | None:
        row = await self.conn.fetchrow(
            """
            UPDATE usuarios
            SET rol = $1, actualizado_en = NOW()
            WHERE id = $2
            RETURNING *
            """,
            new_role, user_id
        )
        return RolUpdate(row)
    
    async def indicadores_agrupados_por_dimension(self) -> list[DimensionAgrupadaResponse]:
        dimensiones = await self.conn.fetch(
            "SELECT id, nombre FROM indicadores WHERE dimension IS NULL"
        )
        indicadores = await self.conn.fetch(
            "SELECT nombre, dimension AS dimension_id FROM indicadores WHERE dimension IS NOT NULL"
        )

        dicc = {
            d['id']: DimensionAgrupadaResponse(nombre_dimension=d['nombre'], indicadores=[])
            for d in dimensiones
        }

        for ind in indicadores:
            dicc[ind['dimension_id']].indicadores.append(IndicadorResponse(nombre=ind['nombre']))

        return list(dicc.values())
