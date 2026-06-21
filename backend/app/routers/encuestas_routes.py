import asyncpg
from fastapi import APIRouter, Depends, status

from app.api.deps import get_conn
from app.schemas.encuesta import EncuestaCreate, EncuestaListResponse, EncuestaResponse, EncuestaUpdate
from app.services.encuesta_service import EncuestaService

router = APIRouter(prefix="/encuestas", tags=["encuestas"])


@router.get("/", response_model=list[EncuestaResponse])
async def listar_encuestas(
    solo_activos: bool = True,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[EncuestaResponse]:
    service = EncuestaService(conn)
    items = await service.listar(solo_activos=solo_activos)
    return [EncuestaResponse.model_validate(item) for item in items]


@router.get("/{encuesta_id}", response_model=EncuestaResponse)
async def obtener_encuesta(
    encuesta_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> EncuestaResponse:
    service = EncuestaService(conn)
    item = await service.obtener_por_id(encuesta_id)
    return EncuestaResponse.model_validate(item)

@router.get("/{encuesta_id}/completa", response_model=EncuestaListResponse)
async def obtener_encuesta_completa(
    encuesta_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> EncuestaListResponse:
    service = EncuestaService(conn)
    # llamamos al método exclusivo que le agregaste al servicio
    item = await service.obtener_encuesta_completa(encuesta_id)
    return EncuestaListResponse.model_validate(item)

@router.post("/", response_model=EncuestaResponse, status_code=status.HTTP_201_CREATED)
async def crear_encuesta(
    body: EncuestaCreate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> EncuestaResponse:
    service = EncuestaService(conn)
    item = await service.crear(**body.model_dump())
    return EncuestaResponse.model_validate(item)


@router.patch("/{encuesta_id}", response_model=EncuestaResponse)
async def actualizar_encuesta(
    encuesta_id: int,
    body: EncuestaUpdate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> EncuestaResponse:
    service = EncuestaService(conn)
    item = await service.actualizar(encuesta_id, **body.model_dump(exclude_unset=True))
    return EncuestaResponse.model_validate(item)


@router.delete("/{encuesta_id}", response_model=dict[str, str])
async def eliminar_encuesta(
    encuesta_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, str]:
    service = EncuestaService(conn)
    return await service.eliminar(encuesta_id)
