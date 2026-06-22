import asyncpg
from fastapi import APIRouter, Depends, status

from app.api.deps import get_conn
from app.schemas.intervenciones import IntervencionCreate, IntervencionResponse, IntervencionUpdate
from app.services.intervenciones_service import IntervencionService

router = APIRouter(prefix="/intervenciones", tags=["intervenciones"])

@router.get("/", response_model=list[IntervencionResponse])
async def listar_intervenciones(
    solo_activos: bool = True,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[IntervencionResponse]:
    service = IntervencionService(conn)
    items = await service.listar(solo_activos=solo_activos)
    return [IntervencionResponse.model_validate(item) for item in items]

@router.get("/{intervencion_id}", response_model=IntervencionResponse)
async def obtener_intervencion(
    intervencion_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> IntervencionResponse:
    service = IntervencionService(conn)
    item = await service.obtener_por_id(intervencion_id)
    return IntervencionResponse.model_validate(item)

@router.post("/", response_model=IntervencionResponse, status_code=status.HTTP_201_CREATED)
async def crear_intervencion(
    body: IntervencionCreate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> IntervencionResponse:
    service = IntervencionService(conn)
    item = await service.crear_intervencion(body)
    return IntervencionResponse.model_validate(item)

@router.patch("/{intervencion_id}/resultado", response_model=IntervencionResponse)
async def actualizar_resultado_intervencion(
    intervencion_id: int,
    body: IntervencionUpdate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> IntervencionResponse:
    service = IntervencionService(conn)
    # le pasamos los datos desarmando el body
    item = await service.actualizar_resultado(
        intervencion_id=intervencion_id, 
        resultado=body.resultado, 
        descripcion=body.descripcion
    )
    return IntervencionResponse.model_validate(item)

@router.delete("/{intervencion_id}", response_model=dict[str, str])
async def eliminar_intervencion(
    intervencion_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, str]:
    service = IntervencionService(conn)
    return await service.eliminar(intervencion_id)