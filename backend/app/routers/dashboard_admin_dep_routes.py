import asyncpg
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.api.deps import get_conn
from app.schemas.dashboard_admin_dep import (
    EstudianteDashboardAdminResponse,
    EventoCronologicoResponse,
    GeneralEstudianteDashboardAdminResponse,
    FiltroRiesgo,
    FiltroEstudiantes,
)

from app.services.dashboard_admin_dep_service import DashboardAdminDepService


router = APIRouter(prefix="/dashboard-admin-dep", tags=["dashboard admin departamental"])


# --- ENDPOINTS DE ESTADISTICAS GENERALES ---

@router.get("/estadisticas/estudiantes", response_model=int)
async def conteo_estudiantes(
    anio: int, carrera_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> int:
    service = DashboardAdminDepService(conn)
    return await service.obtener_conteo_estudiantes(anio, carrera_id)

@router.get("/estadisticas/riesgo", response_model=dict)
async def conteo_por_riesgo(
    carrera_id: int,
    anio: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, int]:
    service = DashboardAdminDepService(conn)
    return await service.obtener_conteo_por_riesgo(carrera_id, anio)


@router.get("/estadisticas/totales/criticos", response_model=int)
async def total_criticos(
    carrera_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> int:
    service = DashboardAdminDepService(conn)
    return await service.obtener_total_criticos(carrera_id)  # Puedes pasar un valor específico de carrera_id si es necesario


@router.get("/estadisticas/totales/alertas-nuevas", response_model=int)
async def total_alertas_nuevas(
    carrera_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> int:
    service = DashboardAdminDepService(conn)
    return await service.obtener_total_alertas_nuevas(carrera_id)

@router.get("/estadisticas/totales/intervenciones", response_model=int)
async def intervenciones_totales(
    carrera_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> int:
    service = DashboardAdminDepService(conn)
    return await service.obtener_intervenciones(carrera_id)

@router.get("/estadisticas/evolucion-score/{anio}", response_model=dict)
async def evolucion_mensual_score(
    anio: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, float]:
    service = DashboardAdminDepService(conn)
    return await service.obtener_evolucion_mensual_score(anio)


# --- ENDPOINTS DE ESTUDIANTES ---
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

@router.get("/estudiantes/{estudiante_id}/historial", response_model=list[EventoCronologicoResponse])
async def historial_alertas(
    estudiante_id: str,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[EventoCronologicoResponse]:
    service = DashboardAdminDepService(conn)
    items = await service.obtener_alertas_cronologicas(estudiante_id)
    return [EventoCronologicoResponse.model_validate(item) for item in items]

@router.get("/carrera/{carrera_id}/historial", response_model=list[EventoCronologicoResponse])
async def historial_alertas_generales(
    carrera_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[EventoCronologicoResponse]:
    service = DashboardAdminDepService(conn)
    items = await service.obtener_alertas_cronologicas_generales(carrera_id)
    return [EventoCronologicoResponse.model_validate(item) for item in items]


# --- ENDPOINTS DE ADMINISTRACION DE USUARIOS ---

# schema auxiliar para el cambio de rol
class RolUpdate(BaseModel):
    new_role: str

@router.patch("/usuarios/{user_id}/rol", response_model=dict)
async def cambiar_rol_usuario(
    user_id: int,
    body: RolUpdate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict:
    service = DashboardAdminDepService(conn)
    return await service.cambiar_rol_usuario(user_id, body.new_role)