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
    carrera_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> int:
    service = DashboardAdminDepService(conn)
    return await service.obtener_conteo_estudiantes(carrera_id)

@router.get("/estadisticas/riesgo", response_model=dict)
async def conteo_por_riesgo(
    carrera_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, int]:
    service = DashboardAdminDepService(conn)
    return await service.obtener_conteo_por_riesgo(carrera_id)


@router.get("/estadisticas/totales/criticos")
async def total_criticos(
    carrera_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict:
    service = DashboardAdminDepService(conn)
    total = await service.obtener_total_criticos(carrera_id)
    return {"total": total}


@router.get("/estadisticas/totales/alertas-nuevas")
async def total_alertas_nuevas(
    carrera_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict:
    service = DashboardAdminDepService(conn)
    total = await service.obtener_total_alertas_nuevas(carrera_id)
    return {"total": total}

@router.get("/estadisticas/totales/intervenciones")
async def intervenciones_totales(
    carrera_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict:
    service = DashboardAdminDepService(conn)
    total = await service.obtener_intervenciones(carrera_id)
    return {"total": total}

@router.get("/estadisticas/evolucion-score", response_model=dict)
async def evolucion_mensual_score(
    anio: int,
    carrera_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, float]:
    service = DashboardAdminDepService(conn)
    return await service.obtener_evolucion_mensual_score(anio, carrera_id)


# --- ENDPOINTS DE ESTUDIANTES ---
@router.get("/estudiantes/legajo", response_model=GeneralEstudianteDashboardAdminResponse)
async def estudiante_por_legajo(
    legajo: str,
    carrera_id: int | None = None,
    conn: asyncpg.Connection = Depends(get_conn),
) -> GeneralEstudianteDashboardAdminResponse:
    service = DashboardAdminDepService(conn)
    item = await service.obtener_datos_generales_estudiante(legajo, carrera_id)
    return GeneralEstudianteDashboardAdminResponse.model_validate(item)

@router.get("/estudiantes/historial", response_model=list[EventoCronologicoResponse])
async def historial_alertas(
    estudiante_id: str,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[EventoCronologicoResponse]:
    service = DashboardAdminDepService(conn)
    items = await service.obtener_alertas_cronologicas(estudiante_id)
    return [EventoCronologicoResponse.model_validate(item) for item in items]

@router.get("/estudiantes/dni", response_model=EstudianteDashboardAdminResponse)
async def estudiante_por_dni(
    dni: str,
    conn: asyncpg.Connection = Depends(get_conn),
) -> EstudianteDashboardAdminResponse:
    service = DashboardAdminDepService(conn)
    item = await service.obtener_estudiante_por_dni(dni)
    return EstudianteDashboardAdminResponse.model_validate(item)

@router.get("/estudiantes/carrera", response_model=list[EstudianteDashboardAdminResponse])
async def estudiantes_por_carrera(
    carrera_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[EstudianteDashboardAdminResponse]:
    service = DashboardAdminDepService(conn)
    items = await service.obtener_estudiantes_por_carrera(carrera_id)
    print(f"[DEBUG] GET /estudiantes/carrera?carrera_id={carrera_id} -> {len(items)} estudiantes")
    if len(items) == 0:
        total_estudiantes = await conn.fetchval("SELECT COUNT(*) FROM estudiantes WHERE carrera_id = $1", carrera_id)
        activos = await conn.fetchval("SELECT COUNT(*) FROM estudiantes WHERE carrera_id = $1 AND activo = TRUE", carrera_id)
        total_carrera = await conn.fetchval("SELECT COUNT(*) FROM carreras WHERE id = $1", carrera_id)
        print(f"[DEBUG]   total estudiantes carrera_id={carrera_id}: {total_estudiantes}")
        print(f"[DEBUG]   activos carrera_id={carrera_id}: {activos}")
        print(f"[DEBUG]   carrera existe id={carrera_id}: {total_carrera}")
    return [EstudianteDashboardAdminResponse.model_validate(item) for item in items]

@router.get("/estudiantes/anio", response_model=list[EstudianteDashboardAdminResponse])
async def estudiantes_por_anio(
    anio: int,
    carrera_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[EstudianteDashboardAdminResponse]:
    service = DashboardAdminDepService(conn)
    items = await service.obtener_estudiantes_por_anio(anio, carrera_id)
    return [EstudianteDashboardAdminResponse.model_validate(item) for item in items]

@router.get("/estudiantes/riesgo", response_model=list[EstudianteDashboardAdminResponse])
async def estudiantes_por_riesgo(
    nivel_riesgo: str,
    carrera_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[EstudianteDashboardAdminResponse]:
    service = DashboardAdminDepService(conn)
    items = await service.obtener_estudiantes_por_riesgo(nivel_riesgo, carrera_id)
    return [EstudianteDashboardAdminResponse.model_validate(item) for item in items]

@router.get("/estudiantes/historial", response_model=list[EventoCronologicoResponse])
async def historial_alertas(
    estudiante_id: str,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[EventoCronologicoResponse]:
    service = DashboardAdminDepService(conn)
    items = await service.obtener_alertas_cronologicas(estudiante_id)
    return [EventoCronologicoResponse.model_validate(item) for item in items]

@router.get("/carrera/historial", response_model=list[EventoCronologicoResponse])
async def historial_alertas_generales(
    carrera_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[EventoCronologicoResponse]:
    service = DashboardAdminDepService(conn)
    items = await service.obtener_alertas_cronologicas_generales(carrera_id)
    return [EventoCronologicoResponse.model_validate(item) for item in items]

#TODO: agregar endpoint para obtener indicadores agrupados por dimension

# --- ENDPOINTS DE ADMINISTRACION DE USUARIOS ---

# schema auxiliar para el cambio de rol
class RolUpdate(BaseModel):
    new_role: str

@router.patch("/usuarios/rol", response_model=dict)
async def cambiar_rol_usuario(
    user_id: int,
    body: RolUpdate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict:
    service = DashboardAdminDepService(conn)
    return await service.cambiar_rol_usuario(user_id, body.new_role)