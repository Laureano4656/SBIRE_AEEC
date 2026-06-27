import asyncpg
from fastapi import HTTPException, status

from app.repositories.dashboard_tutor import dashboardTutorRepository

from app.models.estudiante_dashboard import EstudianteDashboardResponse
from app.schemas.dashboard_admin_dep import GeneralEstudianteDashboardAdminResponse

class DashboardTutorService:
    """
    servicio para los datos analiticos y el dashboard del tutor.
    """
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.repo = dashboardTutorRepository(conn)

    async def obtener_estudiantes_por_tutor(self, tutor_id: int) -> list[EstudianteDashboardResponse]:
        return await self.repo.get_students_by_tutor(tutor_id)

    async def obtener_datos_generales_estudiante(self, legajo: str, carrera_id: int) -> GeneralEstudianteDashboardAdminResponse | None:
        return await self.repo.general_data_by_student(legajo, carrera_id)
    
    async def obtener_entrevistas_planificadas(self, tutor_id: int) -> int:
        return await self.repo.get_entrevistas_planificadas(tutor_id)
    
    