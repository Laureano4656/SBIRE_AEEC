import asyncpg

from app.models.asignacion_encuesta import AsignacionEncuesta
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.services.crud_service import CrudService


class AsignacionEncuestaService(CrudService[AsignacionEncuesta]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            CrudRepository(
                conn,
                AsignacionEncuesta,
                CrudTableConfig(
                    table_name="asignacion_encuestas",
                    columns=(
                        "id",
                        "encuesta_id",
                        "estudiante_id",
                        "fecha_asignacion",
                        "completada",
                        "fecha_completada",
                    ),
                ),
            ),
            "Asignacion de encuesta",
        )
