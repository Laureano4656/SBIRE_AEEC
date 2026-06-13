import asyncpg

from app.models.opcion_respuesta import OpcionRespuesta
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.services.crud_service import CrudService


class OpcionRespuestaService(CrudService[OpcionRespuesta]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            CrudRepository(
                conn,
                OpcionRespuesta,
                CrudTableConfig(
                    table_name="opcion_respuesta",
                    columns=("id", "pregunta_id", "texto", "orden"),
                ),
            ),
            "Opcion de respuesta",
        )
