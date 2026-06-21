import asyncpg
from fastapi import APIRouter, Depends

from app.api.deps import get_conn
from app.schemas.dashboard_admin_dep import (
    EstudianteDashboardAdminResponse,
    EventoCronologicoResponse,
    GeneralEstudianteDashboardAdminResponse,
)

from app.services.dashboard_admin_dep_service import DashboardAdminDepService


router = APIRouter(prefix="/dashboard-admin-dep", tags=["dashboard admin departamental"])

@router.get("/estadisticas/estudiantes", response_model=int)
async def conteo_estudiantes(
    anio: int | None = None,
    carrera_id: int | None = None,
    conn: asyncpg.Connection = Depends(get_conn),
) -> int:
    service = DashboardAdminDepService(conn)
    return await service.obtener_conteo_estudiantes(anio, carrera_id)

@router.get("/estadisticas/riesgo", response_model=dict)
async def conteo_por_riesgo(
    carrera_id: int,
    anio: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict:
    service = DashboardAdminDepService(conn)
    return await service.obtener_conteo_por_riesgo(carrera_id, anio)

@router.get("/estudiantes/legajo/{legajo}", response_model=GeneralEstudianteDashboardAdminResponse)
async def estudiante_por_legajo(
    legajo: str,
    conn: asyncpg.Connection = Depends(get_conn),
) -> GeneralEstudianteDashboardAdminResponse:
    service = DashboardAdminDepService(conn)
    item = await service.obtener_datos_generales_estudiante(legajo)
    return GeneralEstudianteDashboardAdminResponse.model_validate(item)

@router.get("/estudiantes/{estudiante_id}/historial", response_model=list[EventoCronologicoResponse])
async def historial_alertas(
    estudiante_id: str,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[EventoCronologicoResponse]:
    service = DashboardAdminDepService(conn)
    items = await service.obtener_alertas_cronologicas(estudiante_id)
    return [EventoCronologicoResponse.model_validate(item) for item in items]

@router.get("/estudiantes/dni/{dni}", response_model=EstudianteDashboardAdminResponse)
async def estudiante_por_dni(
    dni: str,
    conn: asyncpg.Connection = Depends(get_conn),
) -> EstudianteDashboardAdminResponse:
    service = DashboardAdminDepService(conn)
    item = await service.obtener_estudiante_por_dni(dni)
    return EstudianteDashboardAdminResponse.model_validate(item)

@router.get("/estudiantes/carrera/{carrera}", response_model=list[EstudianteDashboardAdminResponse])
async def estudiantes_por_carrera(
    carrera: str,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[EstudianteDashboardAdminResponse]:
    service = DashboardAdminDepService(conn)
    items = await service.obtener_estudiantes_por_carrera(carrera)
    return [EstudianteDashboardAdminResponse.model_validate(item) for item in items]

@router.get("/estudiantes/anio/{anio}", response_model=list[EstudianteDashboardAdminResponse])
async def estudiantes_por_anio(
    anio: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[EstudianteDashboardAdminResponse]:
    service = DashboardAdminDepService(conn)
    items = await service.obtener_estudiantes_por_anio(anio)
    return [EstudianteDashboardAdminResponse.model_validate(item) for item in items]

@router.get("/estudiantes/riesgo/{nivel_riesgo}", response_model=list[EstudianteDashboardAdminResponse])
async def estudiantes_por_riesgo(
    nivel_riesgo: str,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[EstudianteDashboardAdminResponse]:
    service = DashboardAdminDepService(conn)
    items = await service.obtener_estudiantes_por_riesgo(nivel_riesgo)
    return [EstudianteDashboardAdminResponse.model_validate(item) for item in items]