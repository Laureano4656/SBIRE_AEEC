import asyncpg
from http.client import HTTPException
from app.models.pregunta import Pregunta
from app.services.crud_service import CrudService
from app.repositories.pregunta_repository import PreguntaRepository
from app.schemas.pregunta import PreguntaCreate, PreguntaUpdate, PreguntaResponse

class PreguntaService(CrudService[Pregunta]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        # instanciamos tu repo personalizado
        repo_custom = PreguntaRepository(conn)
        
        # se lo inyectamos al crudservice base
        super().__init__(repo_custom, "Pregunta")

    async def crear_pregunta(self, data: PreguntaCreate) -> PreguntaResponse:
        return await self.repo.create_pregunta(data)

    async def actualizar_pregunta(self, pregunta_id: int, data: PreguntaUpdate) -> PreguntaResponse:
        # reutilizamos el get_by_id del padre para validar que la pregunta exista
        pregunta_existente = await self.get_by_id(pregunta_id)
        if not pregunta_existente:
            raise HTTPException(status_code=404, detail=f"pregunta con id {pregunta_id} no encontrada")

        return await self.repo.update_pregunta(pregunta_id, data)