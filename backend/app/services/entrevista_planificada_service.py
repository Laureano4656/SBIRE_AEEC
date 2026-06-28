from http.client import HTTPException

import asyncpg
from datetime import datetime
from app.models.entrevista_planificada import EntrevistaPlanificada 
from app.services.crud_service import CrudService
from app.repositories.entrevista_planificada_repository import EntrevistaPlanificadaRepository
from app.schemas.entrevista_planificada import EntrevistaPlanificadaCreate, EntrevistaPlanificadaResponse

class EntrevistaPlanificadaService(CrudService[EntrevistaPlanificada]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        repo_custom = EntrevistaPlanificadaRepository(conn)
        super().__init__(repo_custom, "EntrevistaPlanificada")

    async def crear_entrevista(self, data: EntrevistaPlanificadaCreate) -> EntrevistaPlanificadaResponse:
        return await self.repo.create_entrevista(data)

    async def reprogramar_entrevista(self, entrevista_id: int, nueva_fecha: datetime) -> EntrevistaPlanificadaResponse:
        entrevista = await self.repo.get_by_id(entrevista_id)
        if not entrevista:
            raise HTTPException(status_code=404, detail=f"entrevista con id {entrevista_id} no encontrada")
        return await self.repo.reschedule_interview(entrevista_id, nueva_fecha)

    async def cancelar_entrevista(self, entrevista_id: int) -> EntrevistaPlanificadaResponse:
        entrevista = await self.repo.get_by_id(entrevista_id)
        if not entrevista:
            raise HTTPException(status_code=404, detail=f"entrevista con id {entrevista_id} no encontrada")
        return await self.repo.cancel_interview(entrevista_id)

    async def completar_entrevista(self, entrevista_id: int) -> EntrevistaPlanificadaResponse:
        entrevista = await self.repo.get_by_id(entrevista_id)
        if not entrevista:
            raise HTTPException(status_code=404, detail=f"entrevista con id {entrevista_id} no encontrada")
        return await self.repo.complete_interview(entrevista_id)