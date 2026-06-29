import asyncpg

from app.models.opcion_pregunta import OpcionPregunta
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.schemas.opcion_pregunta import OpcionPreguntaCrearOpcion


class OpcionPreguntaRepository(CrudRepository[OpcionPregunta]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            conn,
            OpcionPregunta,
            CrudTableConfig(
                table_name="opcion_pregunta",
                columns=("id", "pregunta_id", "texto_opcion", "valor_riesgo_manual", "orden_visual"),
                order_by="orden_visual ASC",
            ),
        )

    async def create_many(
        self, pregunta_id: int, opciones: list[OpcionPreguntaCrearOpcion]
    ) -> list[OpcionPregunta]:
        if not opciones:
            return []

        values = []
        params: list = []
        for i, opcion in enumerate(opciones):
            base = i * 4
            params.extend([pregunta_id, opcion.texto_opcion, opcion.valor_riesgo_manual, opcion.orden_visual])
            values.append(f"($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})")

        query = f"""
            INSERT INTO opcion_pregunta (pregunta_id, texto_opcion, valor_riesgo_manual, orden_visual)
            VALUES {', '.join(values)}
            RETURNING {self._select_clause()}
        """
        rows = await self.conn.fetch(query, *params)
        return self._map_many(rows)
