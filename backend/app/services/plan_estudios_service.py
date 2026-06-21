import asyncpg
from app.models.plan_estudio import PlanEstudio
from app.repositories.plan_estudio_repository import PlanEstudioRepository
from app.services.crud_service import CrudService

class PlanEstudioService(CrudService[PlanEstudio]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(PlanEstudioRepository(conn), "PlanEstudio")

    async def desactivar(self, id: int) -> dict[str, str]:
        return await self.eliminar(id)
