from datetime import datetime

import asyncpg
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from app.api.deps import get_conn
from app.schemas.entrevista_planificada import EntrevistaPlanificadaCreate, EntrevistaPlanificadaResponse
from app.services.entrevista_planificada_service import EntrevistaPlanificadaService

router = APIRouter(prefix="/entrevistas", tags=["entrevistas planificadas"])

@router.post("/", response_model=EntrevistaPlanificadaResponse, status_code=status.HTTP_201_CREATED)
async def crear_entrevista(
    body: EntrevistaPlanificadaCreate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> EntrevistaPlanificadaResponse:
    service = EntrevistaPlanificadaService(conn)
    item = await service.crear_entrevista(body)
    return EntrevistaPlanificadaResponse.model_validate(item)

# schema auxiliar para recibir la fecha en el body
class ReprogramarUpdate(BaseModel):
    nueva_fecha: datetime


@router.patch("/{entrevista_id}/reprogramar", response_model=EntrevistaPlanificadaResponse)
async def reprogramar_entrevista(
    entrevista_id: int,
    body: ReprogramarUpdate,  
    conn: asyncpg.Connection = Depends(get_conn),
) -> EntrevistaPlanificadaResponse:
    service = EntrevistaPlanificadaService(conn)
    item = await service.reprogramar_entrevista(entrevista_id, body.nueva_fecha)
    return EntrevistaPlanificadaResponse.model_validate(item)

@router.patch("/{entrevista_id}/cancelar", response_model=EntrevistaPlanificadaResponse)
async def cancelar_entrevista(
    entrevista_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> EntrevistaPlanificadaResponse:
    service = EntrevistaPlanificadaService(conn)
    item = await service.cancelar_entrevista(entrevista_id)
    return EntrevistaPlanificadaResponse.model_validate(item)

@router.patch("/{entrevista_id}/completar", response_model=EntrevistaPlanificadaResponse)
async def completar_entrevista(
    entrevista_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> EntrevistaPlanificadaResponse:
    service = EntrevistaPlanificadaService(conn)
    item = await service.completar_entrevista(entrevista_id)
    return EntrevistaPlanificadaResponse.model_validate(item)