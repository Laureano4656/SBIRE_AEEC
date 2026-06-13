import asyncpg

from app.models.respuesta import Respuesta
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.services.crud_service import CrudService


class RespuestaService(CrudService[Respuesta]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            CrudRepository(
                conn,
                Respuesta,
                CrudTableConfig(
                    table_name="respuesta",
                    columns=(
                        "id",
                        "asignacion_id",
                        "pregunta_id",
                        "opcion_id",
                        "texto_libre",
                        "valencia",
                        "fecha_respuesta",
                    ),
                ),
            ),
            "Respuesta",
        )
