import asyncpg

from app.core.utils.normalizacion import normalizar_score
from app.models.score_riesgo import score_riesgo
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.services.crud_service import CrudService
from app.services.estudiantes_service import EstudianteService
from app.services.indicador_service import IndicadorService

class ScoreRiesgoService(CrudService[score_riesgo]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            CrudRepository(
                conn,
                score_riesgo,
                CrudTableConfig(
                    table_name="score_riesgo",
                    columns=(
                        "id",
                        "estudiante_id",
                        "valor",
                        "creado_en",
                    ),
                ),
            ),
            "ScoreRiesgo",
        )
#Tanto la creacion como la actualizacion de un score de riesgo deben normalizar el valor del score total a un rango entre 0 y 1, utilizando la función `normalizar_score` y teniendo en cuenta los valores máximos y mínimos de los indicadores asociados al estudiante.
    async def obtener_por_id(self, id: int):
    async def crear(self,)
    async def actualizar(self, id: int, datos: dict):