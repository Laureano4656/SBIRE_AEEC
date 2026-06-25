from typing import Any

import asyncpg

from app.models.materia import Materia
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.services.crud_service import CrudService


class MateriaService(CrudService[Materia]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.conn = conn
        super().__init__(
            CrudRepository(
                conn,
                Materia,
                CrudTableConfig(
                    table_name="materias",
                    columns=(
                        "id",
                        "nombre",
                        "codigo",
                        "es_basica_critica",
                        "cuatrimestre_dictado",
                    ),
                ),
            ),
            "Materia",
        )

    async def crear(self, **kwargs: Any) -> Materia:
        planes = kwargs.pop("planes", [])
        materia = await super().crear(**kwargs)
        if planes:
            for p in planes:
                await self.conn.execute(
                    """
                    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = $3
                    """,
                    p["plan_id"], materia.id, p["cuatrimestre_sugerido"],
                )
        return materia

    async def actualizar(self, id: int, **kwargs: Any) -> Materia:
        planes = kwargs.pop("planes", None)
        materia = await super().actualizar(id, **kwargs)
        if planes is not None:
            await self.conn.execute("DELETE FROM plan_materia WHERE materia_id = $1", id)
            for p in planes:
                await self.conn.execute(
                    """
                    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
                    VALUES ($1, $2, $3)
                    """,
                    p["plan_id"], id, p["cuatrimestre_sugerido"],
                )
        return materia
