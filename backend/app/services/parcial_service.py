import asyncpg

from app.models.parcial import Parcial
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.services.crud_service import CrudService
from typing import Any
from fastapi import HTTPException


class ParcialService(CrudService[Parcial]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            CrudRepository(
                conn,
                Parcial,
                CrudTableConfig(
                    table_name="parciales",
                    columns=("id", "cursada_id", "numero_parcial", "nota", "recuperatorio"),
                ),
            ),
            "Parcial",
        )

    async def crear(self, **kwargs: Any) -> Parcial:
        try:
            return await super().crear(**kwargs)
        except asyncpg.exceptions.UniqueViolationError:
            raise HTTPException(
                status_code=409, 
                detail="Este número de parcial ya se encuentra registrado para esta cursada."
            )

    async def actualizar(self, id: int, **kwargs: Any) -> Parcial:
        try:
            return await super().actualizar(id, **kwargs)
        except asyncpg.exceptions.UniqueViolationError:
            raise HTTPException(
                status_code=409, 
                detail="La actualización choca con otro parcial ya registrado para esta cursada."
            )