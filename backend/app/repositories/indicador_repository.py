import asyncpg

from app.models.indicador import indicador
from app.repositories.base import BaseRepository

class IndicadorRepository(BaseRepository[indicador]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(conn, indicador)

    async def get_alls(self, solo_activos: bool = True) -> list[indicador]:
        """
        Devuelve todos los indicadores.
        Por defecto filtra solo los activos.
        """
        if solo_activos:
            rows = await self.conn.fetch(
                """
                SELECT id, nombre, activo
                FROM indicador
                WHERE activo = TRUE
                ORDER BY nombre ASC
                """
            )
        else:
            rows = await self.conn.fetch(
                """
                SELECT id, nombre, activo
                FROM indicador
                ORDER BY nombre ASC
                """
            )
        return self._map_many(rows)

    async def get_by_id(self, id: int) -> indicador | None:
        row = await self.conn.fetchrow(
            """
            SELECT id, nombre, activo
            FROM indicador
            WHERE id = $1
            """,
            id,
        )
        return self._map(row)