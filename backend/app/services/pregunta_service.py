import json
import asyncpg
from typing import Any

from app.models.pregunta import Pregunta
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.services.crud_service import CrudService

class PreguntaService(CrudService[Pregunta]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            CrudRepository(
                conn,
                Pregunta,
                CrudTableConfig(
                    table_name="pregunta", # Ojo acá: asegurate que coincida con el nombre en tu BD ("pregunta" o "preguntas")
                    columns=(
                        "id",
                        "indicador_id",
                        "carrera_id",
                        "texto_pregunta",
                        "evento_disparador",
                        "tipo_pregunta",
                        "configuracion_riesgo",
                        "activa",
                    ),
                    active_column="activa" # Esto engancha perfecto con tu CrudRepository para el borrado lógico
                ),
            ),
            "Pregunta",
        )

    # Sobrescribimos para serializar el JSON antes de mandarlo al Repositorio Genérico
    async def crear(self, **kwargs: Any) -> Pregunta:
        if "configuracion_riesgo" in kwargs and kwargs["configuracion_riesgo"] is not None:
            kwargs["configuracion_riesgo"] = json.dumps(kwargs["configuracion_riesgo"])
        return await super().crear(**kwargs)

    async def actualizar(self, id: int, **kwargs: Any) -> Pregunta:
        if "configuracion_riesgo" in kwargs and kwargs["configuracion_riesgo"] is not None:
            kwargs["configuracion_riesgo"] = json.dumps(kwargs["configuracion_riesgo"])
        return await super().actualizar(id, **kwargs)
