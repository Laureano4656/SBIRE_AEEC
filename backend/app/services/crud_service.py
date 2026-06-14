from typing import Generic, TypeVar

from fastapi import HTTPException, status
from pydantic import BaseModel

from app.repositories.crud_repository import CrudRepository

T = TypeVar("T", bound=BaseModel)


class CrudService(Generic[T]):
    def __init__(self, repo: CrudRepository[T], entity_name: str) -> None:
        self.repo = repo
        self.entity_name = entity_name

    async def listar(self, solo_activos: bool = True) -> list[T]:
        return await self.repo.get_all(solo_activos=solo_activos)

    async def obtener_por_id(self, id: int) -> T:
        item = await self.repo.get_by_id(id)
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{self.entity_name} con id '{id}' no encontrado.",
            )
        return item

    async def crear(self, **fields: object) -> T:
        item = await self.repo.create(**fields)
        if not item:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"No se pudo crear {self.entity_name.lower()}.",
            )
        return item

    async def actualizar(self, id: int, **fields: object) -> T:
        await self.obtener_por_id(id)
        item = await self.repo.update(id, **fields)
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{self.entity_name} con id '{id}' no encontrado.",
            )
        return item

    async def eliminar(self, id: int) -> dict[str, str]:
        await self.obtener_por_id(id)
        deleted = await self.repo.delete(id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{self.entity_name} con id '{id}' no encontrado o ya eliminado.",
            )
        return {"mensaje": f"{self.entity_name} eliminado correctamente."}
