import asyncpg
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.api.deps import get_conn
from app.schemas.materia import MateriaListResponse
from app.schemas.usuario import UsuarioResponse

from app.services.dashboard_estudiante_service import DashboardEstudianteService

routes = APIRouter(prefix="/dashboard-estudiante", tags=["dashboard estudiante"])

# ---- ENDPOINTS DE INFORMACION PARA EL ESTUDIANTE -----

@routes.get("/estudiante/tutor", response_model=UsuarioResponse | None)
async def obtener_datos_tutor(
    estudiante_id: int,
    conn: asyncpg.Connection = Depends(get_conn)
):
    service = DashboardEstudianteService(conn)
    return await service.obtener_datos_tutor(estudiante_id)

@routes.get("/estudiante/materias/aprobadas", response_model=int)
async def obtener_materias_aprobadas(
    estudiante_id: int,
    conn: asyncpg.Connection = Depends(get_conn)
):
    service = DashboardEstudianteService(conn)
    return await service.obtener_materias_aprobadas(estudiante_id)

@routes.get("/estudiante/materias/totales", response_model=int)
async def obtener_materias_totales(
    estudiante_id: int,
    conn: asyncpg.Connection = Depends(get_conn)
):
    service = DashboardEstudianteService(conn)
    return await service.obtener_materias_totales(estudiante_id)

@routes.get("/estudiante/materias/cursadas", response_model=list[MateriaListResponse])
async def obtener_materias_cursadas(
    estudiante_id: int,
    conn: asyncpg.Connection = Depends(get_conn)
):
    service = DashboardEstudianteService(conn)
    return await service.obtener_materias_cursadas(estudiante_id)

@routes.get("/estudiante/encuestas/sin-responder", response_model=int)
async def obtener_encuestas_sin_responder(
    estudiante_id: int,
    conn: asyncpg.Connection = Depends(get_conn)
):
    service = DashboardEstudianteService(conn)
    return await service.encuestas_sin_responder(estudiante_id)

class AsignacionPendienteResponse(BaseModel):
    asignacion_id: int
    evento_disparador: int
    periodo_lectivo: str
    completado: bool
    nombre_evento: str

@routes.get("/estudiante/encuestas/pendientes", response_model=list[AsignacionPendienteResponse])
async def listar_encuestas_pendientes(
    estudiante_id: int,
    conn: asyncpg.Connection = Depends(get_conn)
):
    service = DashboardEstudianteService(conn)
    return await service.list_encuestas_pendientes(estudiante_id)