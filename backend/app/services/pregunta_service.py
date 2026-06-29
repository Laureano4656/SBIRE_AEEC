import json
import asyncpg
from http.client import HTTPException
from typing import Any

from app.models.pregunta import Pregunta
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.services.crud_service import CrudService
from app.services.opcion_pregunta_service import OpcionPreguntaService

class PreguntaService(CrudService[Pregunta]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            CrudRepository(
                conn,
                Pregunta,
                CrudTableConfig(
                    table_name="pregunta",
                    columns=(
                        "id",
                        "indicador_id",
                        "carrera_id",
                        "texto_pregunta",
                        "evento_id",
                        "tipo_pregunta",
                        "configuracion_riesgo",
                        "activa",
                    ),
                    active_column="activa" 
                ),
            ),
            "Pregunta",
        )
        self.opcion_service = OpcionPreguntaService(conn)

    async def crear(self, **kwargs: Any) -> Pregunta:
        opciones = kwargs.pop("opciones", None)
        if "configuracion_riesgo" in kwargs and kwargs["configuracion_riesgo"] is not None:
            kwargs["configuracion_riesgo"] = json.dumps(kwargs["configuracion_riesgo"])
        pregunta = await super().crear(**kwargs)
        if opciones:
            await self.opcion_service.crear_en_masa(pregunta.id, opciones)
        return pregunta

    async def actualizar(self, id: int, **kwargs: Any) -> Pregunta:
        if "configuracion_riesgo" in kwargs and kwargs["configuracion_riesgo"] is not None:
            kwargs["configuracion_riesgo"] = json.dumps(kwargs["configuracion_riesgo"])
        return await super().actualizar(id, **kwargs)
