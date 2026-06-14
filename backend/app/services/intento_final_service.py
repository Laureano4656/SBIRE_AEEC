import asyncpg

from app.models.intento_final import IntentoFinal
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.services.crud_service import CrudService


class IntentoFinalService(CrudService[IntentoFinal]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            CrudRepository(
                conn,
                IntentoFinal,
                CrudTableConfig(
                    table_name="intentos_finales",
                    columns=("id", "cursada_id", "numero_intento", "nota", "fecha", "aprobado"),
                ),
            ),
            "Intento final",
        )
