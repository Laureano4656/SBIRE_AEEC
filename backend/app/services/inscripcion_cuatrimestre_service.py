import asyncpg

from app.models.inscripcion_cuatrimestre import InscripcionCuatrimestre
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.services.crud_service import CrudService


class InscripcionCuatrimestreService(CrudService[InscripcionCuatrimestre]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            CrudRepository(
                conn,
                InscripcionCuatrimestre,
                CrudTableConfig(
                    table_name="inscripciones_cuatrimestres",
                    columns=("id", "estudiante_id", "anio", "cuatrimestre", "materilas_anotadas", "activo"),
                    active_column="activo",
                ),
            ),
            "Inscripción de cuatrimestre",
        )
