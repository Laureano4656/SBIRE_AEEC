
import asyncpg
from fastapi import APIRouter, Depends, status

from app.api.deps import get_conn
from app.schemas.estudiante import (
    EstudianteCreate,
    EstudianteResponse,
    EstudianteUpdate,
)
from app.services.estudiantes_service import EstudianteService


router = APIRouter(prefix="/estudiantes", tags=["estudiantes"])


@router.get("/", response_model=list[EstudianteResponse])
async def listar_estudiantes(
    solo_activos: bool = True,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[EstudianteResponse]:
    service = EstudianteService(conn)
    estudiantes = await service.listar(solo_activos=solo_activos)
    return [EstudianteResponse.model_validate(e) for e in estudiantes]


@router.get("/{estudiante_id}", response_model=EstudianteResponse)
async def obtener_estudiante(
    estudiante_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> EstudianteResponse:
    service = EstudianteService(conn)
    estudiante = await service.obtener_por_id(estudiante_id)
    return EstudianteResponse.model_validate(estudiante)


@router.post("/", response_model=EstudianteResponse, status_code=status.HTTP_201_CREATED)
async def crear_estudiante(
    body: EstudianteCreate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> EstudianteResponse:
    service = EstudianteService(conn)
    estudiante = await service.crear(body)
    return EstudianteResponse.model_validate(estudiante)


@router.patch("/{estudiante_id}", response_model=EstudianteResponse)
async def actualizar_estudiante(
    estudiante_id: int,
    body: EstudianteUpdate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> EstudianteResponse:
    service = EstudianteService(conn)
    estudiante = await service.actualizar(
        estudiante_id,
        **body.model_dump(exclude_unset=True),
    )
    return EstudianteResponse.model_validate(estudiante)


@router.patch("/{estudiante_id}/desactivar", response_model=dict[str, str])
async def desactivar_estudiante(
    estudiante_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, str]:
    service = EstudianteService(conn)
    return await service.desactivar(estudiante_id)
