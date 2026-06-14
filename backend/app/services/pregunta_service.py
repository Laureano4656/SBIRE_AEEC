import asyncpg

from app.models.pregunta import Pregunta
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.services.crud_service import CrudService


class PreguntaService(CrudService[Pregunta]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            CrudRepository(
                conn,
                Pregunta,
                CrudTableConfig(
                    table_name="preguntas",
                    columns=(
                        "id",
                        "encuesta_id",
                        "texto",
                        "tipo",
                        "orden",
                        "obligatoria",
                        "condicion_pregunta_id",
                    ),
                ),
            ),
            "Pregunta",
        )
