import asyncpg
from fastapi import APIRouter, Depends, status, Request, BackgroundTasks, HTTPException
from app.api.deps import get_conn
from app.schemas.semaforo_schemas import SemaforoResponse
from app.services.riesgo_service import RiesgoService

router = APIRouter(prefix="/semaforo", tags=["semaforo"])

@router.get("/{estudiante_id}", response_model=SemaforoResponse)
async def obtener_semaforo(
    estudiante_id: int,
    conn: asyncpg.Connection = Depends(get_conn)
) -> SemaforoResponse:
    service = RiesgoService(conn)
    return await service.armar_semaforo_estudiante(estudiante_id)