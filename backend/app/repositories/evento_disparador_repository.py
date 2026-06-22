import asyncpg

from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.schemas.evento_disparador import EventoDisparadorResponse, EventoDisparadorCreate


class EventoDisparadorRepository(CrudRepository[EventoDisparadorResponse]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            conn,
            EventoDisparadorResponse,
            CrudTableConfig(
                table_name="evento_disparador",
                columns=("id", "nombre"),
                order_by="id DESC"
            )
        )
        
    def create_evento_disparador(self, evento: EventoDisparadorCreate) -> EventoDisparadorResponse:
        return self.create(**evento.dict())
    
    def get_evento_disparador(self, evento_id: int) -> EventoDisparadorResponse:
        return self.get(evento_id)