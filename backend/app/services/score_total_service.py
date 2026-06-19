import asyncpg

from app.models.score_total import score_total
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.services.crud_service import CrudService

class ScoreTotalService(CrudService[score_total]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            CrudRepository(
                conn,
                score_total,
                CrudTableConfig(
                    table_name="score_total",
                    columns=(
                        "id",
                        "estudiante_id",
                        "valor",
                        "creado_en",
                    ),
                ),
            ),
            "ScoreTotal",
        )

#Tanto la creacion como la actualizacion de un score total deben realizar la sumatoria de todos los score riesgo normalizados del estudiante al que corresponden
    async def crete(self,):
    async def actualizar(self, id: int, datos: dict):