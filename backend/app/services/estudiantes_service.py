import asyncpg
from app.models.estudiante import Estudiante
from app.repositories.estudiante_repository import EstudianteRepository
from app.services.crud_service import CrudService

class EstudianteService(CrudService[Estudiante]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(EstudianteRepository(conn), "Estudiante")

    async def desactivar(self, id: int) -> dict[str, str]:
        return await self.eliminar(id)
