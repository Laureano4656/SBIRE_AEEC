import asyncpg

from app.models.cursada import Cursada
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.services.crud_service import CrudService


class CursadaService(CrudService[Cursada]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            CrudRepository(
                conn,
                Cursada,
                CrudTableConfig(
                    table_name="cursadas",
                    columns=(
                        "id",
                        "estudiante_id",
                        "materia_id",
                        "anio",
                        "cuatrimestre",
                        "estado",
                    ),
                ),
            ),
            "Cursada",
        )
