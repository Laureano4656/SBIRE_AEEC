import asyncpg
from fastapi import APIRouter, Depends, status

from app.api.deps import get_conn
from app.schemas.evento_disparador import (
    EventoDisparadorCreate,
    EventoDisparadorResponse,
    EventoDisparadorUpdate,
)
from app.services.evento_disparador_service import EventoDisparadorService

router = APIRouter(prefix="/eventos-disparadores", tags=["eventos_disparadores"])


@router.get("/", response_model=list[EventoDisparadorResponse])
async def listar_eventos_disparadores(
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[EventoDisparadorResponse]:
    service = EventoDisparadorService(conn)
    items = await service.listar()
    return [EventoDisparadorResponse.model_validate(i) for i in items]


@router.get("/{evento_disparador_id}", response_model=EventoDisparadorResponse)
async def obtener_evento_disparador(
    evento_disparador_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> EventoDisparadorResponse:
    service = EventoDisparadorService(conn)
    item = await service.obtener_por_id(evento_disparador_id)
    return EventoDisparadorResponse.model_validate(item)


@router.post("/", response_model=EventoDisparadorResponse, status_code=status.HTTP_201_CREATED)
async def crear_evento_disparador(
    body: EventoDisparadorCreate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> EventoDisparadorResponse:
    service = EventoDisparadorService(conn)
    item = await service.crear(body)
    return EventoDisparadorResponse.model_validate(item)


@router.patch("/{evento_disparador_id}", response_model=EventoDisparadorResponse)
async def actualizar_evento_disparador(
    evento_disparador_id: int,
    body: EventoDisparadorUpdate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> EventoDisparadorResponse:
    service = EventoDisparadorService(conn)
    item = await service.actualizar(evento_disparador_id, **body.model_dump(exclude_unset=True))
    return EventoDisparadorResponse.model_validate(item)


@router.delete("/{evento_disparador_id}", response_model=dict[str, str])
async def eliminar_evento_disparador(
    evento_disparador_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, str]:
    service = EventoDisparadorService(conn)
    return await service.eliminar(evento_disparador_id)
