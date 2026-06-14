from app.models.estudiante_dashboard import EstudianteDashboardResponse
from app.models.intervenciones import EntrevistaCreate, IntervencionCreate
import asyncpg
import datetime


class dashboardTutorRepository:
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.conn = conn
    
    async def get_students_by_tutor(self, tutor_id: int) -> list[EstudianteDashboardResponse]:
        # Implementar la lógica para obtener los estudiantes asignados a un tutor
        async with self.conn.transaction() as conn:
            rows = await conn.fetch(
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
    
    async def take_alert(
        self,
        tutor_id: int,
        alerta_id: int,
        tipo: str = 'seguimiento_virtual',
        descripcion: str = '',
        fecha: datetime.date | None = None,
    ) -> dict:
        async with self.conn.transaction():
            # Cambiar estado de la alerta a intervenida
            alerta = await self.conn.fetchrow(
            """
            UPDATE alertas
            SET estado = 'intervenida'
            WHERE id = $1
            AND estado IN ('nueva', 'en_revision')
            RETURNING *
            """,
            alerta_id
        )
            
            if not alerta:
             return None  # La alerta no existe o ya fue tomada

        # Crear la intervencion automaticamente
        intervencion = await self.conn.fetchrow(
            """
            INSERT INTO intervenciones (alerta_id, tutor_id, tipo, resultado, descripcion, fecha)
            VALUES ($1, $2, $3, 'neutro', $4, $5)
            RETURNING *
            """,
            alerta_id, tutor_id, tipo, descripcion, fecha
        )   

        return {
            "alerta": dict(alerta),
            "intervencion": dict(intervencion)
        }
        
    async def schedule_interview(self, tutor_id: int, dataI:IntervencionCreate , data: EntrevistaCreate) -> dict:
        async with self.conn.transaction():
            # Primero crear la intervencion
            intervencion = await self.conn.fetchrow(
                """
                INSERT INTO intervenciones (alerta_id, tutor_id, tipo, resultado, descripcion, fecha)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
                """,
                dataI.alerta_id,
                tutor_id,
                dataI.tipo,
                dataI.resultado,
                dataI.descripcion,
                dataI.fecha,
            )

            # Luego crear la entrevista vinculada a esa intervencion
            entrevista = await self.conn.fetchrow(
                """
                INSERT INTO entrevista_planificada 
                    (alerta_id, tutor_id, estudiante_id, fecha_propuesta, modalidad, notas_previas, estado, intervencion_id)
                VALUES ($1, $2, $3, $4, $5, $6, 'pendiente', $7)
                RETURNING *
                """,
                data.alerta_id, tutor_id, data.estudiante_id,
                data.fecha_propuesta, data.modalidad, data.notas_previas,
                intervencion["id"]
            )

            return {
                "intervencion": dict(intervencion),
                "entrevista": dict(entrevista)
            }
    
    async def close_alert(self, tutor_id: int, alerta_id: int) -> dict | None:
        tiene_acceso = await self.conn.fetchval(
            """
            SELECT EXISTS (
                SELECT 1 FROM intervenciones
                WHERE tutor_id = $1 AND alerta_id = $2
            )
            """,
            tutor_id, alerta_id
        )

        if not tiene_acceso:
            return None

        row = await self.conn.fetchrow(
            """
            UPDATE alertas
            SET estado = 'resuelta', fecha_cierre = NOW()
            WHERE id = $1
            RETURNING *
            """,
            alerta_id
        )
        return dict(row)

    
