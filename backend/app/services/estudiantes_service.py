import asyncpg
from app.models.estudiante import Estudiante
from app.repositories.estudiante_repository import EstudianteRepository
from app.services.crud_service import CrudService
from app.schemas.estudiante import EstudianteCreate


class EstudianteService(CrudService[Estudiante]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(EstudianteRepository(conn), "Estudiante")

    async def desactivar(self, id: int) -> dict[str, str]:
        return await self.eliminar(id)

    async def crear(self, data: EstudianteCreate) -> Estudiante:
        """
        Sobrescribimos el método crear del padre (CrudService) para inyectar
        la lógica de negocio de la encuesta inicial.
        """
        nuevo_estudiante = await super().crear(**data.model_dump())

        if nuevo_estudiante and nuevo_estudiante.id:
            await self.repo.asignar_encuesta_unica_vez(nuevo_estudiante.id)

        return nuevo_estudiante
