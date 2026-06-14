import asyncpg
from fastapi import APIRouter, Depends, status

from app.api.deps import get_conn
from app.schemas.parcial import ParcialCreate, ParcialResponse, ParcialUpdate
from app.services.parcial_service import ParcialService

router = APIRouter(prefix="/parciales", tags=["parciales"])


@router.get("/", response_model=list[ParcialResponse])
async def listar_parciales(
    solo_activos: bool = True,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[ParcialResponse]:
    service = ParcialService(conn)
    items = await service.listar(solo_activos=solo_activos)
    return [ParcialResponse.model_validate(item) for item in items]


@router.get("/{parcial_id}", response_model=ParcialResponse)
async def obtener_parcial(
    parcial_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> ParcialResponse:
    service = ParcialService(conn)
    item = await service.obtener_por_id(parcial_id)
    return ParcialResponse.model_validate(item)


@router.post("/", response_model=ParcialResponse, status_code=status.HTTP_201_CREATED)
async def crear_parcial(
    body: ParcialCreate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> ParcialResponse:
    service = ParcialService(conn)
    item = await service.crear(**body.model_dump())
    return ParcialResponse.model_validate(item)


@router.patch("/{parcial_id}", response_model=ParcialResponse)
async def actualizar_parcial(
    parcial_id: int,
    body: ParcialUpdate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> ParcialResponse:
    service = ParcialService(conn)
    item = await service.actualizar(parcial_id, **body.model_dump(exclude_unset=True))
    return ParcialResponse.model_validate(item)


@router.delete("/{parcial_id}", response_model=dict[str, str])
async def eliminar_parcial(
    parcial_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, str]:
    service = ParcialService(conn)
    return await service.eliminar(parcial_id)
