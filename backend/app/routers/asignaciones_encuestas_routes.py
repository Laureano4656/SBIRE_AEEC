import asyncpg
from fastapi import APIRouter, Depends, status

from app.api.deps import get_conn
from app.schemas.asignacion_encuesta import (
    AsignacionEncuestaCreate,
    AsignacionEncuestaResponse,
    AsignacionEncuestaUpdate,
)
from app.services.asignacion_encuesta_service import AsignacionEncuestaService

router = APIRouter(prefix="/asignaciones-encuestas", tags=["asignaciones-encuestas"])


@router.get("/", response_model=list[AsignacionEncuestaResponse])
async def listar_asignaciones_encuestas(
    solo_activos: bool = True,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[AsignacionEncuestaResponse]:
    service = AsignacionEncuestaService(conn)
    items = await service.listar(solo_activos=solo_activos)
    return [AsignacionEncuestaResponse.model_validate(item) for item in items]


@router.get("/{asignacion_encuesta_id}", response_model=AsignacionEncuestaResponse)
async def obtener_asignacion_encuesta(
    asignacion_encuesta_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> AsignacionEncuestaResponse:
    service = AsignacionEncuestaService(conn)
    item = await service.obtener_por_id(asignacion_encuesta_id)
    return AsignacionEncuestaResponse.model_validate(item)


@router.post("/", response_model=AsignacionEncuestaResponse, status_code=status.HTTP_201_CREATED)
async def crear_asignacion_encuesta(
    body: AsignacionEncuestaCreate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> AsignacionEncuestaResponse:
    service = AsignacionEncuestaService(conn)
    item = await service.crear(**body.model_dump())
    return AsignacionEncuestaResponse.model_validate(item)


@router.patch("/{asignacion_encuesta_id}", response_model=AsignacionEncuestaResponse)
async def actualizar_asignacion_encuesta(
    asignacion_encuesta_id: int,
    body: AsignacionEncuestaUpdate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> AsignacionEncuestaResponse:
    service = AsignacionEncuestaService(conn)
    item = await service.actualizar(asignacion_encuesta_id, **body.model_dump(exclude_unset=True))
    return AsignacionEncuestaResponse.model_validate(item)


@router.delete("/{asignacion_encuesta_id}", response_model=dict[str, str])
async def eliminar_asignacion_encuesta(
    asignacion_encuesta_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, str]:
    service = AsignacionEncuestaService(conn)
    return await service.eliminar(asignacion_encuesta_id)
