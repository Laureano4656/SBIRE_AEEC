import asyncpg
from fastapi import APIRouter, Depends, status

from app.api.deps import get_conn
from app.schemas.alertas import AlertaCreate, AlertaResponse, AlertaUpdateEstado
from app.services.alertas_service import AlertasService

router = APIRouter(prefix="/alertas", tags=["alertas"])


@router.post("/", response_model=AlertaResponse, status_code=status.HTTP_201_CREATED)
async def crear_alerta(
    alerta: AlertaCreate,
    conn: asyncpg.Connection = Depends(get_conn)
) -> AlertaResponse:
    """
    Registra una nueva alerta de riesgo para un estudiante.
    """
    service = AlertasService(conn)
    return await service.crear_alerta(alerta)

@router.patch("/{alerta_id}/estado", response_model=AlertaResponse, status_code=status.HTTP_200_OK)
async def actualizar_estado_alerta(
    alerta_id: int,
    body: AlertaUpdateEstado,
    conn: asyncpg.Connection = Depends(get_conn)
) -> AlertaResponse:
    """
    Cambia el estado de una alerta. Si el estado es 'resuelta', se estampa la fecha de cierre.
    """
    service = AlertasService(conn)
    return await service.actualizar_estado_alerta(alerta_id, body.estado)

@router.get("/carreras/{carrera_id}", response_model=list[AlertaResponse], status_code=status.HTTP_200_OK)
async def obtener_todas_las_alertas(
    carrera_id: int,
    conn: asyncpg.Connection = Depends(get_conn)
) -> list[AlertaResponse]:
    """
    Obtiene el historial completo de alertas generadas en una carrera específica.
    """
    service = AlertasService(conn)
    return await service.obtener_alertas_por_carrera(carrera_id)


@router.get("/carreras/{carrera_id}/pendientes", response_model=list[AlertaResponse], status_code=status.HTTP_200_OK)
async def obtener_alertas_pendientes(
    carrera_id: int,
    conn: asyncpg.Connection = Depends(get_conn)
) -> list[AlertaResponse]:
    """
    Obtiene únicamente las alertas que están en estado 'nueva' o 'en_revision' para el dashboard.
    """
    service = AlertasService(conn)
    return await service.obtener_alertas_pendientes_por_carrera(carrera_id)

@router.get("/estudiante/{estudiante_id}", response_model=list[AlertaResponse], status_code=status.HTTP_200_OK)
async def obtener_alertas_por_estudiante(
    estudiante_id: int,
    conn: asyncpg.Connection = Depends(get_conn)
) -> list[AlertaResponse]:
    """
    Obtiene únicamente las alertas de un único estudiante.
    """
    service = AlertasService(conn)
    return await service.obtener_alertas_por_estudiante(estudiante_id)

@router.get("/estudiante/{estudiante_id}/pendientes", response_model=list[AlertaResponse], status_code=status.HTTP_200_OK)
async def obtener_alertas_por_estudiante_pendientes(
    estudiante_id: int,
    conn: asyncpg.Connection = Depends(get_conn)
) -> list[AlertaResponse]:
    """
    Obtiene únicamente las alertas de un único estudiante.
    """
    service = AlertasService(conn)
    return await service.obtener_alertas_pendientes_por_estudiante(estudiante_id)