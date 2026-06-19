
import asyncpg
from fastapi import HTTPException, status

from app.models.estudiante import Estudiante
from app.repositories.estudiante_repository import EstudianteRepository

class EstudianteService:
    """
    Service de Estudiante — lógica de negocio.
    """

    def __init__(self, conn: asyncpg.Connection) -> None:
        self.repo = EstudianteRepository(conn)

    async def listar(self, solo_activos: bool = True) -> list[Estudiante]:
        return await self.repo.get_all(solo_activos=solo_activos)

    async def obtener_por_id(self, id: int) -> Estudiante:
        estudiante = await self.repo.get_by_id(id)
        if not estudiante:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Estudiante con id '{id}' no encontrado.",
            )
        return estudiante

    async def crear(
        self,
        carrera_id: int,
        nombre: str,
        apellido: str,
        email: str | None,
        legajo: str,
        dni: str,
        anio_ingreso: int,
        etapa: str,
        porcentaje_carrera: float,
        activo: bool,
        moodle_id: str | None,
    ) -> Estudiante:
        return await self.repo.create(
            carrera_id=carrera_id,
            nombre=nombre,
            apellido=apellido,
            email=email,
            legajo=legajo,
            dni=dni,
            anio_ingreso=anio_ingreso,
            etapa=etapa,
            porcentaje_carrera=porcentaje_carrera,
            activo=activo,
            moodle_id=moodle_id,
        )

    async def actualizar(
        self,
        id: int,
        carrera_id: int | None = None,
        nombre: str | None = None,
        apellido: str | None = None,
        email: str | None = None,
        legajo: str | None = None,
        dni: str | None = None,
        anio_ingreso: int | None = None,
        etapa: str | None = None,
        porcentaje_carrera: float | None = None,
        activo: bool | None = None,
        moodle_id: str | None = None,
    ) -> Estudiante:
        await self.obtener_por_id(id)

        estudiante = await self.repo.update(
            id=id,
            carrera_id=carrera_id,
            nombre=nombre,
            apellido=apellido,
            email=email,
            legajo=legajo,
            dni=dni,
            anio_ingreso=anio_ingreso,
            etapa=etapa,
            porcentaje_carrera=porcentaje_carrera,
            activo=activo,
            moodle_id=moodle_id,
        )
        return estudiante  # type: ignore[return-value]

    async def desactivar(self, id: int) -> dict[str, str]:
        await self.obtener_por_id(id)

        desactivado = await self.repo.soft_delete(id)
        if not desactivado:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Estudiante no encontrado o ya estaba desactivado.",
            )

        return {"mensaje": "Estudiante desactivado correctamente."}
