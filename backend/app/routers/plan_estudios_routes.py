
import asyncpg
from fastapi import APIRouter, Depends, status

from app.api.deps import get_conn
from app.schemas.plan_estudio import (
    PlanEstudioCreate,
    PlanEstudioResponse,
    PlanEstudioUpdate,
)
from app.services.plan_estudios_service import PlanEstudioService


router = APIRouter(prefix="/plan-estudios", tags=["plan-estudios"])


@router.get("/", response_model=list[PlanEstudioResponse])
async def listar_plan_estudios(
    solo_activos: bool = True,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[PlanEstudioResponse]:
    service = PlanEstudioService(conn)
    planes = await service.listar(solo_activos=solo_activos)
    return [PlanEstudioResponse.model_validate(p) for p in planes]


@router.get("/{plan_id}", response_model=PlanEstudioResponse)
async def obtener_plan_estudio(
    plan_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> PlanEstudioResponse:
    service = PlanEstudioService(conn)
    plan = await service.obtener_por_id(plan_id)
    return PlanEstudioResponse.model_validate(plan)


@router.post("/", response_model=PlanEstudioResponse, status_code=status.HTTP_201_CREATED)
async def crear_plan_estudio(
    body: PlanEstudioCreate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> PlanEstudioResponse:
    service = PlanEstudioService(conn)
    plan = await service.crear(**body.model_dump())
    return PlanEstudioResponse.model_validate(plan)


@router.patch("/{plan_id}", response_model=PlanEstudioResponse)
async def actualizar_plan_estudio(
    plan_id: int,
    body: PlanEstudioUpdate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> PlanEstudioResponse:
    service = PlanEstudioService(conn)
    plan = await service.actualizar(plan_id, **body.model_dump(exclude_unset=True))
    return PlanEstudioResponse.model_validate(plan)


@router.patch("/{plan_id}/desactivar", response_model=dict[str, str])
async def desactivar_plan_estudio(
    plan_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, str]:
    service = PlanEstudioService(conn)
    return await service.desactivar(plan_id)
