import asyncpg

from app.models.encuesta import Encuesta
from app.services.crud_service import CrudService
from app.repositories.encuestas_repository import EncuestasRepository
from app.schemas.encuesta import EncuestaListResponse


class EncuestaService(CrudService[Encuesta]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        # instanciamos repositorio personalizado para encuestas
        repo_custom = EncuestasRepository(conn)
        
        # se lo pasamos al padre junto con el nombre del modelo
        super().__init__(repo_custom, "Encuesta")

    # agregamos tu metodo exclusivo
    async def obtener_encuesta_completa(self, encuesta_id: int) -> EncuestaListResponse:
        encuesta_completa = await self.repo.get_survey_with_questions(encuesta_id)
        if not encuesta_completa:
            raise ValueError(f"encuesta con id {encuesta_id} no encontrada o sin preguntas")
        return encuesta_completa