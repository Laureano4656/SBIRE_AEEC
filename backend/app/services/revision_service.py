import asyncpg
from fastapi import HTTPException

from app.repositories.riesgo_repository import RiesgoRepository
from app.schemas.revision import RespuestaPendienteResponse
from app.services.riesgo_service import RiesgoService
from app.core.database import get_pool


class RevisionService:
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.conn = conn
        self.repo = RiesgoRepository(conn)

    async def obtener_pendientes(
        self, carrera_id: int
    ) -> list[RespuestaPendienteResponse]:
        rows = await self.repo.obtener_pendientes_revision(carrera_id)
        return [RespuestaPendienteResponse(**dict(row)) for row in rows]

    async def aprobor_revision(
        self, respuesta_id: int, riesgo: float
    ) -> dict:
        resultado = await self.repo.aprobar_revision(respuesta_id, riesgo)
        if not resultado:
            raise HTTPException(
                status_code=404,
                detail=f"Respuesta con ID {respuesta_id} no encontrada.",
            )
        return resultado
