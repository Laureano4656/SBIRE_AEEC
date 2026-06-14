import asyncpg

from app.models.correlativa import Correlativa
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.services.crud_service import CrudService


class CorrelativaService(CrudService[Correlativa]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            CrudRepository(
                conn,
                Correlativa,
                CrudTableConfig(
                    table_name="correlativas",
                    columns=("id", "materia_id", "requiere_materia_id"),
                ),
            ),
            "Correlativa",
        )
