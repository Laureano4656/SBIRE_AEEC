import asyncpg
from fastapi import HTTPException, status
from app.models.carrera import Carrera
from app.repositories.carrera_repository import CarreraRepository
from app.services.crud_service import CrudService

class CarreraService(CrudService[Carrera]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(CarreraRepository(conn), "Carrera")

    async def crear(self, **fields: object) -> Carrera:
        codigo = str(fields.get("codigo", ""))
        # Regla de negocio: código único
        existente = await self.repo.get_by_codigo(codigo)  # type: ignore
        if existente:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya existe una carrera con el código '{codigo.upper()}'.",
            )
        return await super().crear(**fields)

    async def desactivar(self, id: int) -> dict[str, str]:
        # Verificar existencia
        await self.obtener_por_id(id)

        # Regla de negocio: no desactivar con estudiantes activos
        if await self.repo.tiene_estudiantes_activos(id):  # type: ignore
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "No se puede desactivar la carrera porque tiene estudiantes activos. "
                    "Primero reasignar o desactivar los estudiantes."
                ),
            )

        return await self.eliminar(id)
