import datetime

import asyncpg
from fastapi import HTTPException, status

from app.repositories.dashboard_tutor import dashboardTutorRepository
from app.repositories.intervenciones_repository import IntervencionRepository
from app.repositories.entrevista_planificada_repository import EntrevistaPlanificadaRepository
from app.repositories.alertas_repository import AlertasRepository

from app.models.estudiante_dashboard import EstudianteDashboardResponse
from app.schemas.dashboard_admin_dep import GeneralEstudianteDashboardAdminResponse
from app.schemas.dashboard_tutor import IntervencionesTutorResponse
from app.schemas.entrevista_planificada import EntrevistaPlanificadaCreate, EntrevistaPlanificadaResponse
from app.schemas.alertas import AlertaResponse
from app.schemas.intervenciones import IntervencionResponse, IntervencionCreate

class DashboardTutorService:
    """
    servicio para los datos analiticos y el dashboard del tutor.
    """
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.repo = dashboardTutorRepository(conn)
        self.intervencion_repo = IntervencionRepository(conn)
        self.entrevista_repo = EntrevistaPlanificadaRepository(conn)
        self.alerta_repo = AlertasRepository(conn)

    async def obtener_estudiantes_por_tutor(self, tutor_id: int) -> list[EstudianteDashboardResponse]:
        return await self.repo.get_students_by_tutor(tutor_id)

    async def obtener_datos_generales_estudiante(self, estudiante_id: int) -> GeneralEstudianteDashboardAdminResponse | None:
        return await self.repo.general_data_by_student(estudiante_id)
    
    async def obtener_numero_entrevistas_planificadas(self, tutor_id: int) -> int:
        return await self.repo.get_numero_entrevistas_planificadas(tutor_id)
    
    async def obtener_entrevistas(self, tutor_id: int) -> list[EntrevistaPlanificadaResponse]:
        return await self.repo.get_entrevistas(tutor_id)
    
    async def get_intervenciones_por_tutor(self, tutor_id: int) -> list[IntervencionesTutorResponse]:
        return await self.repo.get_intervenciones_por_tutor(tutor_id)
    
    async def get_alertas_sin_atender_por_carrera(self, carrera_id: int) -> list[AlertaResponse]:
        return await self.repo.get_alertas_sin_atender_por_carrera(carrera_id)
    
    async def update_alerta_estado(self, alerta_id: int, nuevo_estado: str) -> AlertaResponse:
        return await self.alerta_repo.update_estado_alerta(alerta_id, nuevo_estado)
    
    async def create_intervencion(self, intervencion: IntervencionCreate) -> IntervencionResponse:
        return await self.intervencion_repo.create_intervencion(intervencion)
    
    async def update_intervencion(self, intervencion_id: int, resultado: str, descripcion: str) -> IntervencionResponse:
        return await self.intervencion_repo.update_intervencion(intervencion_id, resultado, descripcion)
    
    async def create_entrevista(self, entrevista: EntrevistaPlanificadaCreate) -> EntrevistaPlanificadaResponse:
        return await self.entrevista_repo.create_entrevista(entrevista)
    
    async def reschedule_interview(self, entrevista_id: int, nueva_fecha: datetime.date) -> EntrevistaPlanificadaResponse:
        return await self.entrevista_repo.reschedule_interview(entrevista_id, nueva_fecha)
    
    async def cancel_interview(self, entrevista_id: int) -> EntrevistaPlanificadaResponse:
        return await self.entrevista_repo.cancel_interview(entrevista_id)
    
    async def complete_interview(self, entrevista_id: int) -> EntrevistaPlanificadaResponse:
        return await self.entrevista_repo.complete_interview(entrevista_id)
    
    
    
    