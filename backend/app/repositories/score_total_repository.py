
import asyncpg

from app.models.score_total import score_total
from app.repositories.base import BaseRepository

class ScoreTotalRepository(BaseRepository[score_total]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(conn, score_total)

    async def get_all(self, solo_activos: bool = True) -> list[score_total]:
        """
        Devuelve todos los scores totales.
        Por defecto filtra solo los activos.
        """
        if solo_activos:
            rows = await self.conn.fetch(
                """
                SELECT id, estudiante_id, valor, creado_en
                FROM score_total
                WHERE activo = TRUE
                ORDER BY creado_en DESC
                """
            )
        else:
            rows = await self.conn.fetch(
                """
                SELECT id, estudiante_id, valor, creado_en
                FROM score_total
                ORDER BY creado_en DESC
                """
            )
        return self._map_many(rows)

    async def get_by_id(self, id: int) -> score_total | None:
        row = await self.conn.fetchrow(
            """
            SELECT id, estudiante_id, valor, creado_en
            FROM score_total
            WHERE id = $1
            """,
            id,
        )
        return self._map(row)