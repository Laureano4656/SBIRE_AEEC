import asyncpg
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.schemas.respuesta import RespuestaCreate, RespuestaResponse, RespuestaUpdate

class RespuestasRepository(CrudRepository[RespuestaResponse]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            conn,
            RespuestaResponse,
            CrudTableConfig(
                table_name="respuestas",
                columns=(
                    "id", "asignacion_id", "pregunta_id", "opcion_id", "texto_libre",
                    "valencia", "fecha_respuesta"
                ),
                order_by="id DESC"
            )
        )
    
    async def create_respuesta(self, respuesta: RespuestaCreate) -> RespuestaResponse:
        return await self.create(
            asignacion_id=respuesta.asignacion_id,
            pregunta_id=respuesta.pregunta_id,
            opcion_id=respuesta.opcion_id,
            texto_libre=respuesta.texto_libre,
            valencia=respuesta.valencia,
        )
        
    async def update_respuesta(self, respuesta_id: int, respuesta: RespuestaUpdate) -> RespuestaResponse:
        fields = respuesta.model_dump(exclude_none=True)
        return await self.update(respuesta_id, **fields)
