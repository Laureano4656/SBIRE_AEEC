import asyncpg
from fastapi import HTTPException, status


from app.repositories.dashboard_estudiante_repository import dashboardEstudiantesRepository
from app.schemas.dashboard_estudiante import EncuestaResponse, AsignacionEncuestaResponse

class DashboardEstudianteService:
    """
    servicio para los datos del dashboard del estudiante (pantalla principal del alumno).
    """
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.repo = dashboardEstudiantesRepository(conn)

    async def obtener_encuesta_completa(self, encuesta_id: int) -> EncuestaResponse:
        encuesta = await self.repo.get_survey_with_questions(encuesta_id)
        if not encuesta:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"encuesta con id {encuesta_id} no encontrada."
            )
        return encuesta

    async def obtener_encuestas_asignadas(self, estudiante_id: int) -> list[AsignacionEncuestaResponse]:
        # devuelve una lista vacia [] si el alumno no tiene encuestas pendientes
        return await self.repo.get_assigned_surveys(estudiante_id)