import asyncpg
from fastapi import APIRouter, Depends, status

from app.api.deps import get_conn
from app.schemas.respuesta import RespuestaCreate, RespuestaResponse, RespuestaUpdate
from app.services.respuesta_service import RespuestaService

router = APIRouter(prefix="/respuestas", tags=["respuestas"])


@router.get("/", response_model=list[RespuestaResponse])
async def listar_respuestas(
    solo_activos: bool = True,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[RespuestaResponse]:
    service = RespuestaService(conn)
    items = await service.listar(solo_activos=solo_activos)
    return [RespuestaResponse.model_validate(item) for item in items]


@router.get("/{respuesta_id}", response_model=RespuestaResponse)
async def obtener_respuesta(
    respuesta_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> RespuestaResponse:
    service = RespuestaService(conn)
    item = await service.obtener_por_id(respuesta_id)
    return RespuestaResponse.model_validate(item)


@router.post("/", response_model=RespuestaResponse, status_code=status.HTTP_201_CREATED)
async def crear_respuesta(
    body: RespuestaCreate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> RespuestaResponse:
    service = RespuestaService(conn)
    item = await service.crear(**body.model_dump())
    return RespuestaResponse.model_validate(item)


@router.patch("/{respuesta_id}", response_model=RespuestaResponse)
async def actualizar_respuesta(
    respuesta_id: int,
    body: RespuestaUpdate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> RespuestaResponse:
    service = RespuestaService(conn)
    item = await service.actualizar(respuesta_id, **body.model_dump(exclude_unset=True))
    return RespuestaResponse.model_validate(item)


@router.delete("/{respuesta_id}", response_model=dict[str, str])
async def eliminar_respuesta(
    respuesta_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, str]:
    service = RespuestaService(conn)
    return await service.eliminar(respuesta_id)
