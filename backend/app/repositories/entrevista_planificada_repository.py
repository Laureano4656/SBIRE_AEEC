from datetime import datetime

import asyncpg 
from app.schemas.entrevista_planificada import EntrevistaPlanificadaCreate, EntrevistaPlanificadaResponse
from app.repositories.crud_repository import CrudRepository, CrudTableConfig

class EntrevistaPlanificadaRepository(CrudRepository[EntrevistaPlanificadaResponse]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            conn,
            EntrevistaPlanificadaResponse,
            CrudTableConfig(
                table_name="entrevista_planificada",
                columns=(
                    "id", "alerta_id", "tutor_id", "estudiante_id", "fecha_propuesta",
                    "modalidad", "notas_previas", "estado", "intervencion_id", "creado_en"
                ),
                order_by="creado_en DESC"
            )
        )
    
    async def create_entrevista(self, entrevista: EntrevistaPlanificadaCreate) -> EntrevistaPlanificadaResponse:
        return await self.create(
            alerta_id=entrevista.alerta_id,
            tutor_id=entrevista.tutor_id,
            estudiante_id=entrevista.estudiante_id,
            fecha_propuesta=entrevista.fecha_propuesta,
            modalidad=entrevista.modalidad,
            notas_previas=entrevista.notas_previas,
            estado="pendiente",
            intervencion_id=entrevista.intervencion_id
        )
    
    async def reschedule_interview(self, entrevista_id: int, nueva_fecha: datetime.date) -> EntrevistaPlanificadaResponse:
        return await self.update(entrevista_id, fecha_propuesta=nueva_fecha)
    
    async def cancel_interview(self, entrevista_id: int) -> EntrevistaPlanificadaResponse:
        return await self.update(entrevista_id, estado="cancelada")
    
    async def complete_interview(self, entrevista_id: int) -> EntrevistaPlanificadaResponse:
        return await self.update(
            entrevista_id,
            estado="realizada")
    
    