
import asyncpg

from app.models.score_riesgo import ScoreRiesgo
from app.repositories.base import BaseRepository

class ScoreRiesgoRepository(BaseRepository[ScoreRiesgo]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(conn, ScoreRiesgo)

    async def get_all(self, solo_activos: bool = True) -> list[ScoreRiesgo]:
        """
        Devuelve todos los scores de riesgo.
        Por defecto filtra solo los activos.
        """
        if solo_activos:
            rows = await self.conn.fetch(
                """
                SELECT id, estudiante_id, configuracion_id, score, nivel, calculado_en, score_total_id, factor_aplicado
                FROM score_riesgo
                WHERE activo = TRUE
                ORDER BY nombre ASC
                """
            )
        else:
            rows = await self.conn.fetch(
                """
                SELECT id, estudiante_id, configuracion_id, score, nivel, calculado_en, score_total_id, factor_aplicado
                FROM score_riesgo
                ORDER BY nombre ASC
                """
            )
        return self._map_many(rows)

    async def get_by_id(self, id: int) -> ScoreRiesgo | None:
        row = await self.conn.fetchrow(
            """
            SELECT id, estudiante_id, configuracion_id, score, nivel, calculado_en, score_total_id, factor_aplicado
            FROM score_riesgo
            WHERE id = $1
            """,
            id,
        )
        return self._map(row)