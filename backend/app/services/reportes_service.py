import asyncpg
from fastapi import HTTPException, status
import datetime

from app.repositories.reportes import ReportesRepository
from app.schemas.reportes import ReporteResponse

class ReportesService:
    def __init__(self, conn: asyncpg.Connection):
        self.repo = ReportesRepository(conn)

    async def get_reporte_estudiantes_carrera(self, carrera_id: int) -> list[ReporteResponse]:
        resultado = await self.repo.get_reporte_estudiantes_carrera(carrera_id)
        if not resultado:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontraron estudiantes para la carrera {carrera_id}"
            )
        return resultado
        