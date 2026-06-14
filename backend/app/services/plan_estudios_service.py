
import asyncpg
from fastapi import HTTPException, status

from app.models.plan_estudio import PlanEstudio
from app.repositories.plan_estudio_repository import PlanEstudioRepository


class PlanEstudioService:
    """
    Service de Plan de Estudio — lógica de negocio.
    """

    def __init__(self, conn: asyncpg.Connection) -> None:
        self.repo = PlanEstudioRepository(conn)

    async def listar(self, solo_activos: bool = True) -> list[PlanEstudio]:
        return await self.repo.get_all(solo_activos=solo_activos)

    async def obtener_por_id(self, id: int) -> PlanEstudio:
        plan = await self.repo.get_by_id(id)
        if not plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Plan de estudios con id '{id}' no encontrado.",
            )
        return plan

    async def crear(
        self,
        nombre: str,
        anio_vigencia: int,
        activo: bool,
        carrera_id: int | None = None,
    ) -> PlanEstudio:
        return await self.repo.create(
            nombre=nombre,
            anio_vigencia=anio_vigencia,
            activo=activo,
            carrera_id=carrera_id,
        )

    async def actualizar(
        self,
        id: int,
        carrera_id: int | None = None,
        nombre: str | None = None,
        anio_vigencia: int | None = None,
        activo: bool | None = None,
    ) -> PlanEstudio:
        await self.obtener_por_id(id)

        plan = await self.repo.update(
            id=id,
            carrera_id=carrera_id,
            nombre=nombre,
            anio_vigencia=anio_vigencia,
            activo=activo,
        )
        return plan  # type: ignore[return-value]

    async def desactivar(self, id: int) -> dict[str, str]:
        await self.obtener_por_id(id)

        desactivado = await self.repo.soft_delete(id)
        if not desactivado:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plan de estudios no encontrado o ya estaba desactivado.",
            )

        return {"mensaje": "Plan de estudios desactivado correctamente."}
