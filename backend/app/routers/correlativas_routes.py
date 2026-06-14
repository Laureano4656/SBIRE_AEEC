import asyncpg
from fastapi import APIRouter, Depends, status

from app.api.deps import get_conn
from app.schemas.correlativa import CorrelativaCreate, CorrelativaResponse, CorrelativaUpdate
from app.services.correlativa_service import CorrelativaService

router = APIRouter(prefix="/correlativas", tags=["correlativas"])


@router.get("/", response_model=list[CorrelativaResponse])
async def listar_correlativas(
    solo_activos: bool = True,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[CorrelativaResponse]:
    service = CorrelativaService(conn)
    items = await service.listar(solo_activos=solo_activos)
    return [CorrelativaResponse.model_validate(item) for item in items]


@router.get("/{correlativa_id}", response_model=CorrelativaResponse)
async def obtener_correlativa(
    correlativa_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> CorrelativaResponse:
    service = CorrelativaService(conn)
    item = await service.obtener_por_id(correlativa_id)
    return CorrelativaResponse.model_validate(item)


@router.post("/", response_model=CorrelativaResponse, status_code=status.HTTP_201_CREATED)
async def crear_correlativa(
    body: CorrelativaCreate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> CorrelativaResponse:
    service = CorrelativaService(conn)
    item = await service.crear(**body.model_dump())
    return CorrelativaResponse.model_validate(item)


@router.patch("/{correlativa_id}", response_model=CorrelativaResponse)
async def actualizar_correlativa(
    correlativa_id: int,
    body: CorrelativaUpdate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> CorrelativaResponse:
    service = CorrelativaService(conn)
    item = await service.actualizar(correlativa_id, **body.model_dump(exclude_unset=True))
    return CorrelativaResponse.model_validate(item)


@router.delete("/{correlativa_id}", response_model=dict[str, str])
async def eliminar_correlativa(
    correlativa_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, str]:
    service = CorrelativaService(conn)
    return await service.eliminar(correlativa_id)
