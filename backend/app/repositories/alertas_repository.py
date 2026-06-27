from datetime import datetime

import asyncpg 
from app.schemas.alertas import AlertaCreate, AlertaResponse
from app.repositories.crud_repository import CrudRepository, CrudTableConfig

class AlertasRepository(CrudRepository[AlertaResponse]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            conn,
            AlertaResponse,
            CrudTableConfig(
                table_name="alertas",
                columns=(
                    "id", "estudiante_id", "score_id", "asignacion_id", "tipo_desercion",
                    "nivel_riesgo", "origen", "estado", "anio_cursada", "generada_en", "fecha_cierre"
                ),
                order_by="generada_en DESC"
            )
        )
    
    async def create_alerta(self, alerta: AlertaCreate) -> AlertaResponse:
        return await self.create(
            estudiante_id=alerta.estudiante_id,
            score_id=alerta.score_id,
            asignacion_id=alerta.asignacion_id,
            tipo_desercion=alerta.tipo_desercion,
            nivel_riesgo=alerta.nivel_riesgo,
            origen=alerta.origen,
            estado="nueva",
            anio_cursada=alerta.anio_cursada
        )

    async def update_estado_alerta(self, alerta_id: int, nuevo_estado: str) -> AlertaResponse:
        if nuevo_estado == "resuelta":
            return await self.update(alerta_id, estado=nuevo_estado, fecha_cierre=datetime.now())
        return await self.update(alerta_id, estado=nuevo_estado)
    
    async def get_alertas_por_carrera(self, carrera_id: int) -> list[AlertaResponse]:
        query = """
            SELECT a.*
            FROM alertas a
            INNER JOIN estudiantes e ON a.estudiante_id = e.id
            WHERE e.carrera_id = $1 
            ORDER BY a.generada_en DESC
        """
        rows = await self.conn.fetch(query, carrera_id)
        return [AlertaResponse(**row) for row in rows]
    
    async def get_alertas_sin_atender_por_carrera(self, carrera_id: int) -> list[AlertaResponse]:
        query = """
            SELECT a.*
            FROM alertas a
            INNER JOIN estudiantes e ON a.estudiante_id = e.id
            WHERE e.carrera_id = $1 AND a.estado IN ('nueva', 'en_revision')
            ORDER BY a.generada_en DESC
        """
        rows = await self.conn.fetch(query, carrera_id)
        return [AlertaResponse(**row) for row in rows]

    async def get_alertas_por_estudiante(self, estudiante_id: int) -> list[AlertaResponse]:
        query = """
            SELECT a.*
            FROM alertas a
            INNER JOIN estudiantes e ON a.estudiante_id = e.id
            WHERE e.id = $1
            ORDER BY a.generada_en DESC
        """
        rows = await self.conn.fetch(query, estudiante_id)
        return [AlertaResponse(**row) for row in rows]

    async def get_alertas_pendientes_por_estudiante(self, estudiante_id: int) -> list[AlertaResponse]:
        query = """
            SELECT a.*
            FROM alertas a
            INNER JOIN estudiantes e ON a.estudiante_id = e.id
            WHERE e.id = $1 AND a.estado IN ('nueva', 'en_revision')
            ORDER BY a.generada_en DESC
        """
        rows = await self.conn.fetch(query, estudiante_id)
        return [AlertaResponse(**row) for row in rows]
    