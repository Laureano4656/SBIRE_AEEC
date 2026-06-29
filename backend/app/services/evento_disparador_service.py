import asyncpg

from app.repositories.evento_disparador_repository import EventoDisparadorRepository
from app.schemas.evento_disparador import EventoDisparadorCreate, EventoDisparadorResponse
from app.services.crud_service import CrudService


class EventoDisparadorService(CrudService[EventoDisparadorResponse]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(EventoDisparadorRepository(conn), "EventoDisparador")

    async def crear(self, data: EventoDisparadorCreate) -> EventoDisparadorResponse:
        return await super().crear(**data.model_dump())
