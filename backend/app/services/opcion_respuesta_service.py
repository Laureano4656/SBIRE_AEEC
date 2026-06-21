from email.policy import HTTP
from http.client import HTTPException

import asyncpg
from app.models.opcion_respuesta import OpcionRespuesta
from app.services.crud_service import CrudService
from app.repositories.opcion_respuesta_repository import OpcionRespuestaRepository
from app.schemas.opcion_respuesta import OpcionRespuestaCreate, OpcionRespuestaUpdate, OpcionRespuestaResponse

class OpcionRespuestaService(CrudService[OpcionRespuesta]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        # instanciamos el repo personalizado
        repo_custom = OpcionRespuestaRepository(conn)
        
        # se lo inyectamos al crudservice base
        super().__init__(repo_custom, "OpcionRespuesta")

    async def crear_opcion_respuesta(self, data: OpcionRespuestaCreate) -> OpcionRespuestaResponse:
        return await self.repo.create_opcion_respuesta(data)

    async def actualizar_opcion_respuesta(self, opcion_id: int, data: OpcionRespuestaUpdate) -> OpcionRespuestaResponse:
        # reutilizamos el get_by_id del padre para validar que la opcion exista
        opcion_existente = await self.get_by_id(opcion_id)
        if not opcion_existente:
            raise HTTPException(status_code=404, detail=f"opcion de respuesta con id {opcion_id} no encontrada")
            
        return await self.repo.update_opcion_respuesta(opcion_id, data)