import asyncpg
from app.models.carrera import Carrera
from app.repositories.crud_repository import CrudRepository, CrudTableConfig

class CarreraRepository(CrudRepository[Carrera]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            conn,
            Carrera,
            CrudTableConfig(
                table_name="carreras",
                columns=("id", "nombre", "codigo", "duracion_cuatrimestre", "activo"),
                active_column="activo"
            )
        )

    async def get_by_codigo(self, codigo: str) -> Carrera | None:
        row = await self.conn.fetchrow(
            f"""
            SELECT {self._select_clause()}
            FROM {self.config.table_name}
            WHERE codigo = $1
            """,
            codigo.upper(),
        )
        return self._map(row)

    async def tiene_estudiantes_activos(self, id: int) -> bool:
        count = await self.conn.fetchval(
            """
            SELECT COUNT(*)
            FROM estudiantes
            WHERE carrera_id = $1 AND activo = TRUE
            """,
            id,
        )
        return count > 0
