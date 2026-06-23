import asyncpg

from app.models.materia import Materia
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.services.crud_service import CrudService


class MateriaService(CrudService[Materia]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            CrudRepository(
                conn,
                Materia,
                CrudTableConfig(
                    table_name="materias",
                    columns=(
                        "id",
                        "plan_id",
                        "nombre",
                        "codigo",
                        "cuatrimestre_sugerido",
                        "es_basica_critica",
                        "cuatrimestre_dictado",
                    ),
                ),
            ),
            "Materia",
        )
