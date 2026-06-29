import datetime
import asyncpg
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel

from app.api.deps import get_conn
from app.schemas.reportes import ReporteResponse
from app.services.reportes_service import ReportesService

router = APIRouter(prefix="/reportes", tags=["reportes"])

@router.get("/estudiantes/carrera", response_model=list[ReporteResponse], status_code=status.HTTP_200_OK)
async def obtener_reporte_estudiantes_carrera(
    carrera_id: int,
    conn: asyncpg.Connection = Depends(get_conn)
):
    service = ReportesService(conn)
    return await service.get_reporte_estudiantes_carrera(carrera_id)