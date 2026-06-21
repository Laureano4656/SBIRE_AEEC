import asyncpg
from app.models.cursada import Cursada
from app.repositories.crud_repository import CrudRepository, CrudTableConfig


class CursadaRepository(CrudRepository[Cursada]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            conn,
            Cursada,
            CrudTableConfig(
                table_name="cursadas",
                columns=("id", "estudiante_id", "materia_id", "inscripcion_id", "anio", "cuatrimestre", "estado"),
            ),
        )

    async def get_by_estudiante_materia_anio_cuatrimestre(
        self, estudiante_id: int, materia_id: int, anio: int, cuatrimestre: int
    ) -> Cursada | None:
        row = await self.conn.fetchrow(
            f"""
            SELECT {self._select_clause()}
            FROM {self.config.table_name}
            WHERE estudiante_id = $1 AND materia_id = $2 AND anio = $3 AND cuatrimestre = $4
            """,
            estudiante_id, materia_id, anio, cuatrimestre,
        )
        return self._map(row)
