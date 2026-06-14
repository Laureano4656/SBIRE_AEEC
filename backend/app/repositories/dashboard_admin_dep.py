import datetime

from app.models import Estudiante, estudiante 
from app.models import EstudianteDashboardResponse
from app.models import GeneralEstudianteDashboardResponse
from app.models import QuestionAnswersResponse
import asyncpg

class dashboardAdminRepository:
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(conn, dashboardAdminRepository)

    async def students_count(self, anio, carrera) -> int:
        conditions = []
        params = []

        if anio is not None:
            params.append(anio)
            conditions.append(f"anio_ingreso = ${len(params)}")

        if carrera is not None:
            params.append(carrera)
            conditions.append(f"carrera = ${len(params)}")

        where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""

        row = await self.conn.fetchrow(
            f"""
            SELECT COUNT(*) AS count
            FROM usuarios
            {where_clause}
            """,
            *params
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
            FROM alertas WHERE (estado = 'nuevo' OR estado = 'en_revision')  
            """
        )

        return row["count"]

    async def total_interventions_month(self) -> int:
        row = await self.conn.fetchrow(
            """
            SELECT COUNT(*) AS count
            FROM alertas
            WHERE date_part('month', fecha) = date_part('month', CURRENT_DATE)
            AND date_part('year', fecha) = date_part('year', CURRENT_DATE) AND (estado = 'intervenida' OR estado = 'resuelta')
            """
        )

        return row["count"]
    
    async def count_by_risk(self, carrera: str, anio: int):
        rows = await self.conn.fetch(
            """
            SELECT
                e.carrera,
                e.anio, 
                CASE
                    WHEN s.valor > (SELECT umbral_rojo FROM configuracion_indicador WHERE id = 1) THEN 'rojo'
                    WHEN s.valor > (SELECT umbral_amarillo FROM configuracion_indicador WHERE id = 1)  THEN 'amarillo'
                    ELSE 'verde'
                END AS tipo_riesgo,
                COUNT(*) AS count
            FROM score_total s
            INNER JOIN estudiante e ON s.estudiante_id = e.id
            WHERE e.carrera = $1 AND e.anio = $2
            GROUP BY tipo_riesgo
            """,
            carrera, anio
        )
  
        return {row["tipo_riesgo"]: row["count"] for row in rows}
    
    async def monthly_evolution_score(self, anio): 
        rows = await self.conn.fetch(
            """
            SELECT
                date_part('month', creado_en) AS month,
                AVG(valor) AS average_score
            FROM score_total s
            INNER JOIN estudiante e ON s.estudiante_id = e.id
            WHERE e.anio = $1 
            GROUP BY month
            ORDER BY month
            """,
            anio
        )


        return {row["month"]: row["average_score"] for row in rows}
    
    
    async def get_student_by_dni(self, dni: str) -> EstudianteDashboardResponse | None:
        row = await self.conn.fetchrow(
            """
            SELECT 
                e.nombre,
                e.apellido,
                e.dni,
                e.carrera,
                e.porcentaje_carrera,
                s.valor AS indice_riesgo,
                a.estado AS estado_alerta,
                s.creado_en AS ultima_fecha_recalculo
            FROM estudiante e
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

        return EstudianteDashboardResponse(**dict(row)) if row else None

    async def get_students_by_career(self, carrera: str) -> list[EstudianteDashboardResponse]:
        rows = await self.conn.fetch(
            """
            SELECT 
                e.nombre,
                e.apellido,
                e.dni,
                e.carrera,
                e.porcentaje_carrera,
                s.valor AS indice_riesgo,
                a.estado AS estado_alerta,
                a.generada_en AS ultima_fecha_recalculo
            FROM estudiante e
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
            WHERE carrera = $1
            """,
            carrera
        )

        return [EstudianteDashboardResponse(**dict(row)) for row in rows]
    
    async def get_students_by_year(self, anio: int) -> list[EstudianteDashboardResponse]:
        rows = await self.conn.fetch(
            """
            SELECT 
                e.nombre,
                e.apellido,
                e.dni,
                e.carrera,
                e.porcentaje_carrera,
                s.valor AS indice_riesgo,
                a.estado AS estado_alerta,
                a.generada_en AS ultima_fecha_recalculo
            FROM estudiante e
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
            WHERE e.anio = $1
            """,
            anio
        )

        return [EstudianteDashboardResponse(**dict(row)) for row in rows]
    
    async def get_students_by_risk(self, risk_level: str) -> list[EstudianteDashboardResponse]:
        rows = await self.conn.fetch(
            """
                SELECT 
                e.nombre,
                e.apellido,
                e.dni,
                e.carrera,
                e.porcentaje_carrera,
                s.valor AS indice_riesgo,
                a.estado AS estado_alerta,
                a.generada_en AS ultima_fecha_recalculo
            FROM estudiante e
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
                    WHEN s.valor > (SELECT umbral_rojo FROM configuracion_indicador WHERE id = 1) THEN 'rojo'
                    WHEN s.valor > (SELECT umbral_amarillo FROM configuracion_indicador WHERE id = 1)  THEN 'amarillo'
                    ELSE 'verde'
                END = $1
            """,
            risk_level
        )

        return [EstudianteDashboardResponse(**dict(row)) for row in rows]
    
    async def general_data_by_student(self, legajo: str) -> GeneralEstudianteDashboardResponse | None:
        row = await self.conn.fetchrow("""
            SELECT
            e.nombre,
            e.apellido,
            e.anio_ingreso,
            e.carrera,
            s.valor,
            FROM estudiantes e
            INNER JOIN (
                SELECT DISTINCT ON (estudiante_id) *
                FROM score_total
                ORDER BY estudiante_id, creado_en DESC
            ) s ON e.id = s.estudiante_id
            WHERE e.legajo = $1
        """, legajo)
        return GeneralEstudianteDashboardResponse(**dict(row)) if row else None
    
    async def chronological_alerts(self, estudiante_id: str) -> list[dict]:
        rows = await self.conn.fetch(
            """
            SELECT 
                'alerta' AS tipo,
                estado AS descripcion,
                creado_en AS fecha
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
        return [dict(row) for row in rows]
    
    async def create_intervention(self, alerta_id: int, tutor_id: int, tipo: str, descripcion: str, fecha: datetime.date) -> dict:
        row = await self.conn.fetchrow(
            """
            INSERT INTO intervenciones (alerta_id, tutor_id, tipo, descripcion, fecha)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            """,
            alerta_id, tutor_id, tipo, descripcion, fecha
        )
        return dict(row)
    
    async def change_state_alert(self, alerta_id: int, new_state: str) -> dict:
        row = await self.conn.fetchrow(
            """
            UPDATE alertas
            SET 
            estado = $1,
            fecha_cierre = CASE WHEN $1 = 'resuelta' THEN NOW() ELSE fecha_cierre END
            WHERE id = $2
            RETURNING *
            """,
            new_state, alerta_id
        )
        return dict(row)
    
    async def create_interview(self, alerta_id: int, tutor_id: int, estudiante_id: int, fecha_propuesta: datetime, modalidad: str,  notas_previas: str, intervencion_id: int) -> dict:
        row = await self.conn.fetchrow(
            """
            INSERT INTO entrevista_planificada 
                (alerta_id, tutor_id, estudiante_id, fecha_propuesta, modalidad, notas_previas, estado, intervencion_id)
            VALUES ($1, $2, $3, $4, $5, $6, 'pendiente', $7)
            RETURNING *
            """,
            alerta_id, tutor_id, estudiante_id, fecha_propuesta, modalidad, notas_previas, intervencion_id
        )

        return dict(row)
    
    async def change_state_interview(self, entrevista_id: int, new_state: str) -> dict:
        row = await self.conn.fetchrow(
            """
            UPDATE entrevista_planificada
            SET estado = $1
            WHERE id = $2
            RETURNING *
            """,
            new_state, entrevista_id
        )
        return dict(row)
        
    async def reschedule_interview(self, entrevista_id: int, new_date: datetime) -> dict:
        row = await self.conn.fetchrow(
            """
            UPDATE entrevista_planificada
            SET fecha_propuesta = $1
            WHERE id = $2
            RETURNING *
            """,
            new_date, entrevista_id
        )
        return dict(row)
    
    async def update_interview(self, entrevista_id: int, new_state: str) -> dict:
        row = await self.conn.fetchrow(
            """
            UPDATE entrevista_planificada
            SET estado = $1
            WHERE id = $2
            RETURNING *
            """,
            new_state, entrevista_id
        )
        return dict(row)
    
    async def get_answers(self, estudiante_id: int) -> list[QuestionAnswersResponse]:
        rows = await self.conn.fetch(
            """
            SELECT 
                p.pregunta,
                r.texto_libre
                FROM respuestas r
                INNER JOIN preguntas p on r.pregunta_id = p.id
                WHERE r.estudiante_id = $1 
            """,
            estudiante_id
        )
        return [QuestionAnswersResponse(**dict(row)) for row in rows]
    
    async def set_threshold(self, umbral_rojo: float, umbral_amarillo: float) -> dict:
        row = await self.conn.fetchrow(
            """
            UPDATE configuracion_indicador
            SET umbral_rojo = $1, umbral_amarillo = $2
            RETURNING *
            """,
            umbral_rojo, umbral_amarillo
        )
        return dict(row)
    
    async def set_weight(self, id_indicador: int, nuevo_peso: float) -> dict:
        row = await self.conn.fetchrow(
            """
            UPDATE configuracion_indicador
            SET peso = $1
            WHERE id = $2
            RETURNING *
            """,
            nuevo_peso, id_indicador
        )
        return dict(row)