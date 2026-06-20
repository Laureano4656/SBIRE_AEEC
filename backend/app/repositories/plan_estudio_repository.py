import asyncpg
from app.models.plan_estudio import PlanEstudio
from app.repositories.crud_repository import CrudRepository, CrudTableConfig

class PlanEstudioRepository(CrudRepository[PlanEstudio]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            conn,
            PlanEstudio,
            CrudTableConfig(
                table_name="plan_estudios",
                columns=("id", "carrera_id", "nombre", "anio_vigencia", "activo"),
                active_column="activo"
            )
        )
