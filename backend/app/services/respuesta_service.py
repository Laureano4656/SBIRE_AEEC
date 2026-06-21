import asyncpg
from http.client import HTTPException
from app.models.respuesta import Respuesta
from app.services.crud_service import CrudService
from app.repositories.respuestas_repository import RespuestasRepository
from app.schemas.respuesta import RespuestaCreate, RespuestaUpdate, RespuestaResponse

class RespuestaService(CrudService[Respuesta]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        # instanciamos tu repo personalizado
        repo_custom = RespuestasRepository(conn)
        
        # se lo inyectamos al crudservice base
        super().__init__(repo_custom, "Respuesta")

    async def crear_respuesta(self, data: RespuestaCreate) -> RespuestaResponse:
        return await self.repo.create_respuesta(data)

    async def actualizar_respuesta(self, respuesta_id: int, data: RespuestaUpdate) -> RespuestaResponse:
        # reutilizamos el get_by_id del padre para validar que la respuesta exista
        respuesta_existente = await self.get_by_id(respuesta_id)
        if not respuesta_existente:
            raise HTTPException(status_code=404, detail=f"respuesta con id {respuesta_id} no encontrada")

        return await self.repo.update_respuesta(respuesta_id, data)
