import asyncpg
from fastapi import APIRouter, Depends, status

from app.api.deps import get_conn
from app.schemas.inscripcion_cuatrimestre import (
    InscripcionCuatrimestreCreate,
    InscripcionCuatrimestreResponse,
    InscripcionCuatrimestreUpdate,
)
from app.services.inscripcion_cuatrimestre_service import InscripcionCuatrimestreService

router = APIRouter(prefix="/inscripciones-cuatrimestres", tags=["inscripciones-cuatrimestres"])


@router.get("/", response_model=list[InscripcionCuatrimestreResponse])
async def listar_inscripciones_cuatrimestres(
    solo_activos: bool = True,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[InscripcionCuatrimestreResponse]:
    service = InscripcionCuatrimestreService(conn)
    items = await service.listar(solo_activos=solo_activos)
    return [InscripcionCuatrimestreResponse.model_validate(item) for item in items]


@router.get("/{inscripcion_cuatrimestre_id}", response_model=InscripcionCuatrimestreResponse)
async def obtener_inscripcion_cuatrimestre(
    inscripcion_cuatrimestre_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> InscripcionCuatrimestreResponse:
    service = InscripcionCuatrimestreService(conn)
    item = await service.obtener_por_id(inscripcion_cuatrimestre_id)
    return InscripcionCuatrimestreResponse.model_validate(item)


@router.post(
    "/",
    response_model=InscripcionCuatrimestreResponse,
    status_code=status.HTTP_201_CREATED,
)
async def crear_inscripcion_cuatrimestre(
    body: InscripcionCuatrimestreCreate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> InscripcionCuatrimestreResponse:
    service = InscripcionCuatrimestreService(conn)
    item = await service.crear(**body.model_dump())
    return InscripcionCuatrimestreResponse.model_validate(item)


@router.patch("/{inscripcion_cuatrimestre_id}", response_model=InscripcionCuatrimestreResponse)
async def actualizar_inscripcion_cuatrimestre(
    inscripcion_cuatrimestre_id: int,
    body: InscripcionCuatrimestreUpdate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> InscripcionCuatrimestreResponse:
    service = InscripcionCuatrimestreService(conn)
    item = await service.actualizar(
        inscripcion_cuatrimestre_id,
        **body.model_dump(exclude_unset=True),
    )
    return InscripcionCuatrimestreResponse.model_validate(item)


@router.delete("/{inscripcion_cuatrimestre_id}", response_model=dict[str, str])
async def eliminar_inscripcion_cuatrimestre(
    inscripcion_cuatrimestre_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, str]:
    service = InscripcionCuatrimestreService(conn)
    return await service.eliminar(inscripcion_cuatrimestre_id)
