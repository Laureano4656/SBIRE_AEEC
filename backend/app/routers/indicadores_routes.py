import asyncpg
from fastapi import APIRouter, Depends, status

from app.api.deps import get_conn
from app.schemas.indicador import IndicadorCreate, IndicadorResponse, IndicadorUpdate
from app.services.indicador_service import IndicadorService

router = APIRouter(prefix="/indicadores", tags=["indicadores"])

@router.get("/", response_model=list[IndicadorResponse])
async def listar_indicadores(
    solo_activos: bool = True,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[IndicadorResponse]:
    service = IndicadorService(conn)
    items = await service.listar(solo_activos=solo_activos)
    return [IndicadorResponse.model_validate(item) for item in items]

@router.get("/{indicador_id}", response_model=IndicadorResponse)
async def obtener_indicador(
    indicador_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> IndicadorResponse:
    service = IndicadorService(conn)
    item = await service.obtener_por_id(indicador_id)
    return IndicadorResponse.model_validate(item)

@router.post("/", response_model=IndicadorResponse, status_code=status.HTTP_201_CREATED)
async def crear_indicador(
    body: IndicadorCreate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> IndicadorResponse:
    service = IndicadorService(conn)
    item = await service.crear_con_preguntas(**body.model_dump())
    return IndicadorResponse.model_validate(item)

@router.patch("/{indicador_id}", response_model=IndicadorResponse)
async def actualizar_indicador(
    indicador_id: int,
    body: IndicadorUpdate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> IndicadorResponse:
    service = IndicadorService(conn)
    item = await service.actualizar_con_preguntas(indicador_id, **body.model_dump(exclude_unset=True))
    return IndicadorResponse.model_validate(item)

@router.delete("/{indicador_id}", response_model=dict[str, str])
async def eliminar_indicador(
    indicador_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, str]:
    service = IndicadorService(conn)
    return await service.eliminar(indicador_id)