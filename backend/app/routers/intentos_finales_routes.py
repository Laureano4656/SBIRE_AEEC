import asyncpg
from fastapi import APIRouter, Depends, status

from app.api.deps import get_conn
from app.schemas.intento_final import IntentoFinalCreate, IntentoFinalResponse, IntentoFinalUpdate
from app.services.intento_final_service import IntentoFinalService

router = APIRouter(prefix="/intentos-finales", tags=["intentos-finales"])


@router.get("/", response_model=list[IntentoFinalResponse])
async def listar_intentos_finales(
    solo_activos: bool = True,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[IntentoFinalResponse]:
    service = IntentoFinalService(conn)
    items = await service.listar(solo_activos=solo_activos)
    return [IntentoFinalResponse.model_validate(item) for item in items]


@router.get("/{intento_final_id}", response_model=IntentoFinalResponse)
async def obtener_intento_final(
    intento_final_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> IntentoFinalResponse:
    service = IntentoFinalService(conn)
    item = await service.obtener_por_id(intento_final_id)
    return IntentoFinalResponse.model_validate(item)


@router.post("/", response_model=IntentoFinalResponse, status_code=status.HTTP_201_CREATED)
async def crear_intento_final(
    body: IntentoFinalCreate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> IntentoFinalResponse:
    service = IntentoFinalService(conn)
    item = await service.crear(**body.model_dump())
    return IntentoFinalResponse.model_validate(item)


@router.patch("/{intento_final_id}", response_model=IntentoFinalResponse)
async def actualizar_intento_final(
    intento_final_id: int,
    body: IntentoFinalUpdate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> IntentoFinalResponse:
    service = IntentoFinalService(conn)
    item = await service.actualizar(intento_final_id, **body.model_dump(exclude_unset=True))
    return IntentoFinalResponse.model_validate(item)


@router.delete("/{intento_final_id}", response_model=dict[str, str])
async def eliminar_intento_final(
    intento_final_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, str]:
    service = IntentoFinalService(conn)
    return await service.eliminar(intento_final_id)
