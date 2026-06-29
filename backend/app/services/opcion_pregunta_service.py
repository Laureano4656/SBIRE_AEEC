import asyncpg

from app.models.opcion_pregunta import OpcionPregunta
from app.repositories.opcion_pregunta_repository import OpcionPreguntaRepository
from app.schemas.opcion_pregunta import OpcionPreguntaCrearOpcion, OpcionPreguntaCreate
from app.services.crud_service import CrudService


class OpcionPreguntaService(CrudService[OpcionPregunta]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(OpcionPreguntaRepository(conn), "OpcionPregunta")

    async def crear(self, data: OpcionPreguntaCreate) -> OpcionPregunta:
        return await super().crear(**data.model_dump())

    async def crear_en_masa(
        self, pregunta_id: int, opciones: list[OpcionPreguntaCrearOpcion]
    ) -> list[OpcionPregunta]:
        return await self.repo.create_many(pregunta_id, opciones)
