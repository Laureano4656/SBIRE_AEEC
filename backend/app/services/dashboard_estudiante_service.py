import asyncpg
from fastapi import HTTPException, status

from app.repositories.dashboard_estudiante_repository import dashboardEstudiantesRepository
from app.schemas.materia import (
    MateriaListResponse,
)
from app.schemas.usuario import UsuarioResponse

class DashboardEstudianteService:
    """
    Servicio para los datos analiticos y el dashboard del estudiante.
    """
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.repo = dashboardEstudiantesRepository(conn)

    async def obtener_datos_tutor(self, estudiante_id: int) -> UsuarioResponse | None:
        return await self.repo.get_datos_tutor(estudiante_id)

    async def obtener_materias_aprobadas(self, estudiante_id: int) -> int:
        return await self.repo.materias_aprobadas(estudiante_id)

    async def obtener_materias_totales(self, estudiante_id: int) -> int:
        return await self.repo.materias_totales(estudiante_id)
    
    async def obtener_materias_cursadas(self, estudiante_id: int) -> list[MateriaListResponse]:
        return await self.repo.listado_materias_cursadas(estudiante_id)

    async def encuestas_sin_responder(self, estudiante_id: int) -> int:
        return await self.repo.encuestas_sin_responder(estudiante_id)

    async def list_encuestas_pendientes(self, estudiante_id: int) -> list[dict]:
        return await self.repo.list_encuestas_pendientes(estudiante_id)