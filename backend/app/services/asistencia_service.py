import asyncpg

from app.models.asistencia import Asistencia
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.services.crud_service import CrudService


class AsistenciaService(CrudService[Asistencia]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            CrudRepository(
                conn,
                Asistencia,
                CrudTableConfig(
                    table_name="asistencia",
                    columns=("id", "cursada_id", "fecha", "presente", "observacion"),
                ),
            ),
            "Asistencia",
        )
