import asyncpg
from fastapi import APIRouter, Depends, status

from app.api.deps import get_conn
from app.schemas.opcion_respuesta import (
    OpcionRespuestaCreate,
    OpcionRespuestaResponse,
    OpcionRespuestaUpdate,
)
from app.services.opcion_respuesta_service import OpcionRespuestaService

router = APIRouter(prefix="/opciones-respuesta", tags=["opciones-respuesta"])


@router.get("/", response_model=list[OpcionRespuestaResponse])
async def listar_opciones_respuesta(
    solo_activos: bool = True,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[OpcionRespuestaResponse]:
    service = OpcionRespuestaService(conn)
    items = await service.listar(solo_activos=solo_activos)
    return [OpcionRespuestaResponse.model_validate(item) for item in items]


@router.get("/{opcion_respuesta_id}", response_model=OpcionRespuestaResponse)
async def obtener_opcion_respuesta(
    opcion_respuesta_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> OpcionRespuestaResponse:
    service = OpcionRespuestaService(conn)
    item = await service.obtener_por_id(opcion_respuesta_id)
    return OpcionRespuestaResponse.model_validate(item)


@router.post("/", response_model=OpcionRespuestaResponse, status_code=status.HTTP_201_CREATED)
async def crear_opcion_respuesta(
    body: OpcionRespuestaCreate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> OpcionRespuestaResponse:
    service = OpcionRespuestaService(conn)
    item = await service.crear_opcion_respuesta(body)
    return OpcionRespuestaResponse.model_validate(item)


@router.patch("/{opcion_respuesta_id}", response_model=OpcionRespuestaResponse)
async def actualizar_opcion_respuesta(
    opcion_respuesta_id: int,
    body: OpcionRespuestaUpdate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> OpcionRespuestaResponse:
    service = OpcionRespuestaService(conn)
    item = await service.actualizar_opcion_respuesta(opcion_respuesta_id, body)
    return OpcionRespuestaResponse.model_validate(item)


@router.delete("/{opcion_respuesta_id}", response_model=dict[str, str])
async def eliminar_opcion_respuesta(
    opcion_respuesta_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, str]:
    service = OpcionRespuestaService(conn)
    return await service.eliminar(opcion_respuesta_id)