import asyncpg
from app.models.respuesta import Respuesta
from app.schemas.respuesta import RespuestaCreate
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.services.crud_service import CrudService

# Importás la función que creaste para Gemini
from app.services.ia_service import analizar_comentario

class RespuestaService(CrudService[Respuesta]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            CrudRepository(
                conn,
                Respuesta,
                CrudTableConfig(
                    table_name="respuesta",
                    columns=(
                        "id",
                        "asignacion_id",
                        "pregunta_id",
                        "opcion_id",
                        "texto_libre",
                        "nivel_riesgo",
                        "motivo_riesgo",
                        "confianza",
                        "fecha_respuesta",
                    ),
                ),
            ),
            "Respuesta",
        )

    # ---  MÉTODO CON IA ---
    async def guardar_respuesta_analizada(self, body: RespuestaCreate, texto_pregunta: str):
        # Filtro: Solo llamamos a la IA si el alumno escribió texto libre
        if body.texto_libre:
            try:
                # Llamamos a nuestro módulo de IA
                resultado_ia = await analizar_comentario(
                    pregunta=texto_pregunta,
                    comentario=body.texto_libre
                )
                
                # Inyectamos los resultados en el body de Pydantic
                body.nivel_riesgo = resultado_ia.nivel_riesgo
                body.motivo_riesgo = resultado_ia.motivo_riesgo
                body.confianza = resultado_ia.confianza
                
            except Exception as e:
                print(f"Error en Gemini, guardando con valores por defecto: {e}")
                body.nivel_riesgo = 0.0
                body.motivo_riesgo = "error_api"
                body.confianza = 0

        # Llamamos al método "crear" original de tu CrudService pasando el diccionario
        return await super().crear(**body.model_dump())