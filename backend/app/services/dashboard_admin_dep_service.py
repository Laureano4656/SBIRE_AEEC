import asyncpg
from fastapi import HTTPException, status

from app.repositories.dashboard_admin_dep_repository import dashboardAdminRepository

from app.schemas.dashboard_admin_dep import (
    EstudianteDashboardAdminResponse,
    GeneralEstudianteDashboardAdminResponse,
    EventoCronologicoResponse
)

class DashboardAdminDepService:
    """
    servicio para los datos analiticos y el dashboard del administrador.
    """
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.repo = dashboardAdminRepository(conn)

    async def obtener_conteo_estudiantes(self, anio: int | None = None, carrera_id: int | None = None) -> int:
        return await self.repo.students_count(anio, carrera_id)

    async def obtener_total_criticos(self) -> int:
        return await self.repo.total_critics()

    async def obtener_total_alertas_nuevas(self) -> int:
        return await self.repo.total_new_alerts()

    async def obtener_intervenciones_del_mes(self) -> int:
        return await self.repo.total_interventions_month()

    async def obtener_conteo_por_riesgo(self, carrera_id: int, anio: int) -> dict[str,int]:
        return await self.repo.count_by_risk(carrera_id, anio)

    async def obtener_evolucion_mensual_score(self, anio: int) -> dict[int, float]:
        return await self.repo.monthly_evolution_score(anio)

    async def obtener_estudiante_por_dni(self, dni: str) -> EstudianteDashboardAdminResponse:
        estudiante = await self.repo.get_student_by_dni(dni)
        if not estudiante:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"estudiante con dni '{dni}' no encontrado."
            )
        return estudiante

    async def obtener_estudiantes_por_carrera(self, carrera: str) -> list[EstudianteDashboardAdminResponse]:
        return await self.repo.get_students_by_career(carrera)

    async def obtener_estudiantes_por_anio(self, anio: int) -> list[EstudianteDashboardAdminResponse]:
        return await self.repo.get_students_by_year(anio)

    async def obtener_estudiantes_por_riesgo(self, risk_level: str) -> list[EstudianteDashboardAdminResponse]:
        # validacion rapida para evitar consultas mal formadas
        if risk_level not in ['rojo', 'amarillo', 'verde']:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="el nivel de riesgo debe ser 'rojo', 'amarillo' o 'verde'."
            )
        return await self.repo.get_students_by_risk(risk_level)

    async def obtener_datos_generales_estudiante(self, legajo: str) -> GeneralEstudianteDashboardAdminResponse:
        datos = await self.repo.general_data_by_student(legajo)
        if not datos:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"estudiante con legajo '{legajo}' no encontrado."
            )
        return datos

    async def obtener_alertas_cronologicas(self, estudiante_id: str) -> list[EventoCronologicoResponse]:
        return await self.repo.chronological_alerts(estudiante_id)

    async def cambiar_rol_usuario(self, user_id: int, new_role: str) -> dict:
        # aca tambien podrias validar que el new_role exista en tu sistema (ej: 'admin', 'tutor', etc)
        return await self.repo.change_roles(user_id, new_role)