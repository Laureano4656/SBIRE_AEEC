import datetime

import asyncpg

from app.schemas.dashboard_admin_dep import EstudianteDashboardAdminResponse, EventoCronologicoResponse, GeneralEstudianteDashboardAdminResponse, PreguntasRespuestasResponse

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
            """,
            anio, carrera_id
        )
        return row["count"]
    
    async def total_critics(self) -> int:
        row = await self.conn.fetchrow(
            """
            SELECT COUNT(*) AS count
            FROM score_total WHERE valor > (SELECT umbral_rojo FROM configuracion_indicador WHERE id = 1)
            """
        )

        return row["count"]
    
    async def total_new_alerts(self) -> int:
        row = await self.conn.fetchrow(
            """
            SELECT COUNT(*) AS count
            FROM alertas WHERE (estado = 'nueva' OR estado = 'en_revision')  
            """
        )

        return row["count"]

    async def total_interventions_month(self) -> int:
        row = await self.conn.fetchrow(
            """
            SELECT COUNT(*) AS count
            FROM intervenciones
            WHERE date_part('month', creado_en) = date_part('month', CURRENT_DATE)
            AND date_part('year', creado_en) = date_part('year', CURRENT_DATE)
            """
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
            WHERE e.carrera_id = $1 AND e.anio_ingreso = $2
            GROUP BY tipo_riesgo, c.nombre, e.anio_ingreso
            """,
            carrera_id, anio
        )
        return {row["tipo_riesgo"]: row["count"] for row in rows}
    
    
    async def monthly_evolution_score(self, anio): 
        rows = await self.conn.fetch(
            """
            SELECT
                date_part('month', creado_en) AS month,
                AVG(valor) AS average_score
            FROM score_total s
            INNER JOIN estudiantes e ON s.estudiante_id = e.id
            WHERE e.anio_ingreso = $1 
            GROUP BY month
            ORDER BY month
            """,
            anio
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
            WHERE dni = $1
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
            WHERE c.nombre = $1
            """,
            carrera
        )

        return [EstudianteDashboardAdminResponse(**dict(row)) for row in rows]

    async def get_students_by_year(self, anio: int) -> list[EstudianteDashboardAdminResponse]:
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
            WHERE e.anio_ingreso = $1
            """,
            anio
        )

        return [EstudianteDashboardAdminResponse(**dict(row)) for row in rows]

    async def get_students_by_risk(self, risk_level: str) -> list[EstudianteDashboardAdminResponse]:
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
                END = $1
            """,
            risk_level
        )

        return [EstudianteDashboardAdminResponse(**dict(row)) for row in rows]

    async def general_data_by_student(self, legajo: str) -> GeneralEstudianteDashboardAdminResponse | None:
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
                    COUNT(DISTINCT m.id) AS materias_totales
                FROM plan_estudios pe
                INNER JOIN materias m ON m.plan_id = pe.id
                WHERE pe.activo = TRUE
                GROUP BY pe.carrera_id
            ) totales ON totales.carrera_id = e.carrera_id
            WHERE e.legajo = $1
        """, legajo)
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
    
    # async def get_answers(self, estudiante_id: int) -> list[PreguntasRespuestasResponse]:
    #     rows = await self.conn.fetch(
    #         """
    #         SELECT 
    #             p.texto AS pregunta,
    #             r.texto_libre AS respuesta
    #         FROM respuesta r
    #         INNER JOIN preguntas p ON r.pregunta_id = p.id
    #         INNER JOIN asignacion_encuestas ae ON r.asignacion_id = ae.id
    #         WHERE ae.estudiante_id = $1
    #         """,
    #         estudiante_id
    #     )
    #     return [PreguntasRespuestasResponse(**dict(row)) for row in rows]

    # async def create_full_survey(self, data: EncuestaCreateFull) -> dict:
    #     async with self.conn.transaction():
    #         # Crear la encuesta
    #         encuesta = await self.conn.fetchrow(
    #             """
    #             INSERT INTO encuestas (titulo, estado, modalidad, fecha_desde, fecha_hasta, periodica, frecuencia_dias)
    #             VALUES ($1, 'borrador', $2, $3, $4, $5, $6)
    #             RETURNING *
    #             """,
    #             data.titulo, data.modalidad, data.fecha_desde,
    #             data.fecha_hasta, data.periodica, data.frecuencia_dias
    #         )

    #         preguntas_creadas = []

    #         for pregunta in data.preguntas:
    #             # Crear cada pregunta
    #             p = await self.conn.fetchrow(
    #                 """
    #                 INSERT INTO preguntas (encuesta_id, texto, tipo, orden, obligatoria, condicion_pregunta_id)
    #                 VALUES ($1, $2, $3, $4, $5, $6)
    #                 RETURNING *
    #                 """,
    #                 encuesta["id"], pregunta.texto, pregunta.tipo,
    #                 pregunta.orden, pregunta.obligatoria, pregunta.condicion_pregunta_id
    #             )

    #             opciones_creadas = []

    #             for opcion in pregunta.opciones:
    #                 # Crear opciones si la pregunta las tiene
    #                 o = await self.conn.fetchrow(
    #                     """
    #                     INSERT INTO opcion_respuesta (pregunta_id, texto, orden)
    #                     VALUES ($1, $2, $3)
    #                     RETURNING *
    #                     """,
    #                     p["id"], opcion.texto, opcion.orden
    #                 )
    #                 opciones_creadas.append(dict(o))

    #             preguntas_creadas.append({**dict(p), "opciones": opciones_creadas})

    #         return {**dict(encuesta), "preguntas": preguntas_creadas}
        
    # async def change_status_survey(self, encuesta_id: int, new_status: str) -> dict:
    #     row = await self.conn.fetchrow(
    #         """
    #         UPDATE encuestas
    #         SET estado = $1
    #         WHERE id = $2
    #         RETURNING *
    #         """,
    #         new_status, encuesta_id
    #     )
    #     return dict(row)
        
    # async def assign_survey(self, data: AsignacionEncuestaCreate) -> AsignacionEncuestaResponse:
    #     row = await self.conn.fetchrow(
    #         """
    #         INSERT INTO asignacion_encuestas (encuesta_id, estudiante_id, fecha_asignacion, completada)
    #         VALUES ($1, $2, NOW(), false)
    #         RETURNING 
    #             id AS asignacion_id,
    #             encuesta_id,
    #             (SELECT titulo FROM encuestas WHERE id = $1) AS titulo,
    #             (SELECT modalidad FROM encuestas WHERE id = $1) AS modalidad,
    #             fecha_asignacion,
    #             completada,
    #             fecha_completada
    #         """,
    #         data.encuesta_id, data.estudiante_id
    #     )
    #     return AsignacionEncuestaResponse(**dict(row))
    
    async def change_roles(self, user_id: int, new_role: str) -> dict:
        row = await self.conn.fetchrow(
            """
            UPDATE usuarios
            SET rol = $1, actualizado_en = NOW()
            WHERE id = $2
            RETURNING *
            """,
            new_role, user_id
        )
        return dict(row)
    
    
