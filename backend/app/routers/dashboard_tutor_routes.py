import asyncpg
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.api.deps import get_conn
from app.schemas.dashboard_admin_dep import (
    EstudianteDashboardResponse,
    GeneralEstudianteDashboardAdminResponse
)

from app.services.dashboard_tutor_service import DashboardTutorService

router = APIRouter(prefix="/dashboard-tutor", tags=["dashboard tutor"])

# ---- ENDPOINTS DE INFORMACION PARA EL TUTOR DE LOS ESTUDIANTES -----

@router.get("/tutor/estudiantes", response_model=list[EstudianteDashboardResponse])
async def obtener_estudiantes_alertas(
    tutor_id: int,
    conn: asyncpg.Connection = Depends(get_conn)
):
    service = DashboardTutorService(conn)
    return await service.obtener_estudiantes_por_tutor(tutor_id)

@router.get("/tutor/estudiante/general", response_model=GeneralEstudianteDashboardAdminResponse | None)
async def obtener_datos_generales_estudiante(
    legajo: str,
    carrera_id: int,
    conn: asyncpg.Connection = Depends(get_conn)
):
    service = DashboardTutorService(conn)
    return await service.obtener_datos_generales_estudiante(legajo, carrera_id)