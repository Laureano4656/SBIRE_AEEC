import asyncpg

from app.models.encuesta import Encuesta
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.services.crud_service import CrudService


class EncuestaService(CrudService[Encuesta]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            CrudRepository(
                conn,
                Encuesta,
                CrudTableConfig(
                    table_name="encuestas",
                    columns=(
                        "id",
                        "titulo",
                        "estado",
                        "modalidad",
                        "fecha_desde",
                        "fecha_hasta",
                        "periodica",
                        "frecuencia_dias",
                    ),
                ),
            ),
            "Encuesta",
        )
