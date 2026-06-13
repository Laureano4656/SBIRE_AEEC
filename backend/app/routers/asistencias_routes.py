import asyncpg
from fastapi import APIRouter, Depends, status

from app.api.deps import get_conn
from app.schemas.asistencia import AsistenciaCreate, AsistenciaResponse, AsistenciaUpdate
from app.services.asistencia_service import AsistenciaService

router = APIRouter(prefix="/asistencias", tags=["asistencias"])


@router.get("/", response_model=list[AsistenciaResponse])
async def listar_asistencias(
    solo_activos: bool = True,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[AsistenciaResponse]:
    service = AsistenciaService(conn)
    items = await service.listar(solo_activos=solo_activos)
    return [AsistenciaResponse.model_validate(item) for item in items]


@router.get("/{asistencia_id}", response_model=AsistenciaResponse)
async def obtener_asistencia(
    asistencia_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> AsistenciaResponse:
    service = AsistenciaService(conn)
    item = await service.obtener_por_id(asistencia_id)
    return AsistenciaResponse.model_validate(item)


@router.post("/", response_model=AsistenciaResponse, status_code=status.HTTP_201_CREATED)
async def crear_asistencia(
    body: AsistenciaCreate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> AsistenciaResponse:
    service = AsistenciaService(conn)
    item = await service.crear(**body.model_dump())
    return AsistenciaResponse.model_validate(item)


@router.patch("/{asistencia_id}", response_model=AsistenciaResponse)
async def actualizar_asistencia(
    asistencia_id: int,
    body: AsistenciaUpdate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> AsistenciaResponse:
    service = AsistenciaService(conn)
    item = await service.actualizar(asistencia_id, **body.model_dump(exclude_unset=True))
    return AsistenciaResponse.model_validate(item)


@router.delete("/{asistencia_id}", response_model=dict[str, str])
async def eliminar_asistencia(
    asistencia_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, str]:
    service = AsistenciaService(conn)
    return await service.eliminar(asistencia_id)
