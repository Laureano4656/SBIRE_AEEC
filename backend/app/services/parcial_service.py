import asyncpg

from app.models.parcial import Parcial
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.services.crud_service import CrudService


class ParcialService(CrudService[Parcial]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            CrudRepository(
                conn,
                Parcial,
                CrudTableConfig(
                    table_name="parciales",
                    columns=("id", "cursada_id", "numero_parcial", "nota", "recuperatorio"),
                ),
            ),
            "Parcial",
        )
