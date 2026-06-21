import asyncpg
from app.models.inscripcion_cuatrimestre import InscripcionCuatrimestre
from app.repositories.crud_repository import CrudRepository, CrudTableConfig


class InscripcionCuatrimestreRepository(CrudRepository[InscripcionCuatrimestre]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            conn,
            InscripcionCuatrimestre,
            CrudTableConfig(
                table_name="inscripciones_cuatrimestres",
                columns=("id", "estudiante_id", "anio", "cuatrimestre", "materilas_anotadas", "activo"),
                active_column="activo",
            ),
        )

    async def get_by_estudiante_anio_cuatrimestre(
        self, estudiante_id: int, anio: int, cuatrimestre: int
    ) -> InscripcionCuatrimestre | None:
        row = await self.conn.fetchrow(
            f"""
            SELECT {self._select_clause()}
            FROM {self.config.table_name}
            WHERE estudiante_id = $1 AND anio = $2 AND cuatrimestre = $3
            """,
            estudiante_id, anio, cuatrimestre,
        )
        return self._map(row)
