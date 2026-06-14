import asyncpg
from fastapi import APIRouter, Depends, status

from app.api.deps import get_conn
from app.schemas.cursada import CursadaCreate, CursadaResponse, CursadaUpdate
from app.services.cursada_service import CursadaService

router = APIRouter(prefix="/cursadas", tags=["cursadas"])


@router.get("/", response_model=list[CursadaResponse])
async def listar_cursadas(
    solo_activos: bool = True,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[CursadaResponse]:
    service = CursadaService(conn)
    items = await service.listar(solo_activos=solo_activos)
    return [CursadaResponse.model_validate(item) for item in items]


@router.get("/{cursada_id}", response_model=CursadaResponse)
async def obtener_cursada(
    cursada_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> CursadaResponse:
    service = CursadaService(conn)
    item = await service.obtener_por_id(cursada_id)
    return CursadaResponse.model_validate(item)


@router.post("/", response_model=CursadaResponse, status_code=status.HTTP_201_CREATED)
async def crear_cursada(
    body: CursadaCreate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> CursadaResponse:
    service = CursadaService(conn)
    item = await service.crear(**body.model_dump())
    return CursadaResponse.model_validate(item)


@router.patch("/{cursada_id}", response_model=CursadaResponse)
async def actualizar_cursada(
    cursada_id: int,
    body: CursadaUpdate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> CursadaResponse:
    service = CursadaService(conn)
    item = await service.actualizar(cursada_id, **body.model_dump(exclude_unset=True))
    return CursadaResponse.model_validate(item)


@router.delete("/{cursada_id}", response_model=dict[str, str])
async def eliminar_cursada(
    cursada_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, str]:
    service = CursadaService(conn)
    return await service.eliminar(cursada_id)
