import datetime

import asyncpg
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel

from app.api.deps import get_conn
from app.models.estudiante_dashboard import EstudianteDashboardResponse
from app.schemas.dashboard_admin_dep import GeneralEstudianteDashboardAdminResponse

from app.services.dashboard_tutor_service import DashboardTutorService
from app.schemas.alertas import AlertaResponse
from app.schemas.dashboard_tutor import IntervencionesTutorResponse
from app.schemas.entrevista_planificada import EntrevistaPlanificadaResponse, EntrevistaPlanificadaCreate
from app.schemas.intervenciones import IntervencionCreate, IntervencionResponse

router = APIRouter(prefix="/dashboard-tutor", tags=["dashboard tutor"])

# ---- ENDPOINTS DE INFORMACION PARA EL TUTOR DE LOS ESTUDIANTES -----

@router.get("/tutor/estudiantes", response_model=list[EstudianteDashboardResponse], status_code=status.HTTP_200_OK)
async def obtener_estudiantes_alertas(
    tutor_id: int,
    conn: asyncpg.Connection = Depends(get_conn)
):
    service = DashboardTutorService(conn)
    return await service.obtener_estudiantes_por_tutor(tutor_id)

@router.get("/tutor/estudiante/general", response_model=GeneralEstudianteDashboardAdminResponse | None, status_code=status.HTTP_200_OK)
async def obtener_datos_generales_estudiante(
    estudiante_id: int,
    conn: asyncpg.Connection = Depends(get_conn)
):
    service = DashboardTutorService(conn)
    return await service.obtener_datos_generales_estudiante(estudiante_id)

@router.get("/tutor/entrevistas/numero-planificadas", response_model=int)
async def obtener_numero_entrevistas_planificadas(
    tutor_id: int,
    conn: asyncpg.Connection = Depends(get_conn)
):
    service = DashboardTutorService(conn)
    return await service.obtener_numero_entrevistas_planificadas(tutor_id)

@router.get("/tutor/entrevistas", response_model=list[EntrevistaPlanificadaResponse], status_code=status.HTTP_200_OK)
async def obtener_entrevistas(
    tutor_id: int,
    conn: asyncpg.Connection = Depends(get_conn)
):
    service = DashboardTutorService(conn)
    return await service.obtener_entrevistas(tutor_id)

@router.get("/tutor/intervenciones", response_model=list[IntervencionesTutorResponse], status_code=status.HTTP_200_OK)
async def obtener_intervenciones_por_tutor(
    tutor_id: int,
    conn: asyncpg.Connection = Depends(get_conn)
):
    service = DashboardTutorService(conn)
    return await service.get_intervenciones_por_tutor(tutor_id)

@router.get("/tutor/alertas/sin-atender", response_model=list[AlertaResponse], status_code=status.HTTP_200_OK)
async def obtener_alertas_sin_atender(
    carrera_id: int,
    conn: asyncpg.Connection = Depends(get_conn)
):
    service = DashboardTutorService(conn)
    return await service.get_alertas_sin_atender_por_carrera(carrera_id)

@router.patch("/tutor/alertas/{alerta_id}/estado", response_model=AlertaResponse, status_code=status.HTTP_200_OK)
async def actualizar_estado_alerta(
    alerta_id: int,
    nuevo_estado: str,
    conn: asyncpg.Connection = Depends(get_conn)
):
    service = DashboardTutorService(conn)
    return await service.update_alerta_estado(alerta_id, nuevo_estado)

@router.post("/tutor/intervenciones", response_model=IntervencionResponse, status_code=status.HTTP_201_CREATED)
async def crear_intervencion(
    intervencion: IntervencionCreate,
    conn: asyncpg.Connection = Depends(get_conn)
):
    service = DashboardTutorService(conn)
    return await service.create_intervencion(intervencion)

@router.patch("/tutor/intervenciones/{intervencion_id}", response_model=IntervencionResponse, status_code=status.HTTP_200_OK)
async def actualizar_intervencion(
    intervencion_id: int,
    resultado: str,
    descripcion: str,
    conn: asyncpg.Connection = Depends(get_conn)
):
    service = DashboardTutorService(conn)
    return await service.update_intervencion(intervencion_id, resultado, descripcion)

@router.post("/tutor/entrevistas", response_model=EntrevistaPlanificadaResponse, status_code=status.HTTP_201_CREATED)
async def crear_entrevista(
    entrevista: EntrevistaPlanificadaCreate,
    conn: asyncpg.Connection = Depends(get_conn)
):
    service = DashboardTutorService(conn)
    return await service.create_entrevista(entrevista)

@router.patch("/tutor/entrevistas/{entrevista_id}/reprogramar", response_model=EntrevistaPlanificadaResponse, status_code=status.HTTP_200_OK)
async def reprogramar_entrevista(
    entrevista_id: int,
    nueva_fecha: str,
    conn: asyncpg.Connection = Depends(get_conn)
):
    service = DashboardTutorService(conn)
    nueva_fecha_dt = datetime.date.fromisoformat(nueva_fecha)
    return await service.reschedule_interview(entrevista_id, nueva_fecha_dt)

@router.patch("/tutor/entrevistas/{entrevista_id}/cancelar", response_model=EntrevistaPlanificadaResponse, status_code=status.HTTP_200_OK)
async def cancelar_entrevista(
    entrevista_id: int,
    conn: asyncpg.Connection = Depends(get_conn)
):
    service = DashboardTutorService(conn)
    return await service.cancel_interview(entrevista_id)

class CompletarEntrevistaBody(BaseModel):
    comentario: str | None = None

@router.patch("/tutor/entrevistas/{entrevista_id}/completar", response_model=EntrevistaPlanificadaResponse, status_code=status.HTTP_200_OK)
async def completar_entrevista(
    entrevista_id: int,
    body: CompletarEntrevistaBody,
    conn: asyncpg.Connection = Depends(get_conn)
):
    service = DashboardTutorService(conn)
    return await service.complete_interview(entrevista_id, body.comentario)
