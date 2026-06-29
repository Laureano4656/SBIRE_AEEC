import asyncpg
from fastapi import APIRouter, Depends, status

from app.api.deps import get_conn
from app.schemas.opcion_pregunta import (
    OpcionPreguntaBulkCreate,
    OpcionPreguntaCreate,
    OpcionPreguntaResponse,
    OpcionPreguntaUpdate,
)
from app.services.opcion_pregunta_service import OpcionPreguntaService

router = APIRouter(prefix="/opciones-pregunta", tags=["opciones-pregunta"])


@router.get("/", response_model=list[OpcionPreguntaResponse])
async def listar_opciones_pregunta(
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[OpcionPreguntaResponse]:
    service = OpcionPreguntaService(conn)
    items = await service.listar()
    return [OpcionPreguntaResponse.model_validate(item) for item in items]


@router.get("/{opcion_pregunta_id}", response_model=OpcionPreguntaResponse)
async def obtener_opcion_pregunta(
    opcion_pregunta_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> OpcionPreguntaResponse:
    service = OpcionPreguntaService(conn)
    item = await service.obtener_por_id(opcion_pregunta_id)
    return OpcionPreguntaResponse.model_validate(item)


@router.post("/masivo", response_model=list[OpcionPreguntaResponse], status_code=status.HTTP_201_CREATED)
async def crear_opciones_pregunta_en_masa(
    body: OpcionPreguntaBulkCreate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[OpcionPreguntaResponse]:
    service = OpcionPreguntaService(conn)
    items = await service.crear_en_masa(body.pregunta_id, body.opciones)
    return [OpcionPreguntaResponse.model_validate(item) for item in items]


@router.post("/", response_model=OpcionPreguntaResponse, status_code=status.HTTP_201_CREATED)
async def crear_opcion_pregunta(
    body: OpcionPreguntaCreate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> OpcionPreguntaResponse:
    service = OpcionPreguntaService(conn)
    item = await service.crear(body)
    return OpcionPreguntaResponse.model_validate(item)


@router.patch("/{opcion_pregunta_id}", response_model=OpcionPreguntaResponse)
async def actualizar_opcion_pregunta(
    opcion_pregunta_id: int,
    body: OpcionPreguntaUpdate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> OpcionPreguntaResponse:
    service = OpcionPreguntaService(conn)
    item = await service.actualizar(opcion_pregunta_id, **body.model_dump(exclude_unset=True))
    return OpcionPreguntaResponse.model_validate(item)


@router.delete("/{opcion_pregunta_id}", response_model=dict[str, str])
async def eliminar_opcion_pregunta(
    opcion_pregunta_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, str]:
    service = OpcionPreguntaService(conn)
    return await service.eliminar(opcion_pregunta_id)
