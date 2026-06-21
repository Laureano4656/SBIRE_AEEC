import asyncpg
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.schemas.opcion_respuesta import OpcionRespuestaCreate, OpcionRespuestaResponse, OpcionRespuestaUpdate


class OpcionRespuestaRepository(CrudRepository[OpcionRespuestaResponse]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            conn,
            OpcionRespuestaResponse,
            CrudTableConfig(
                table_name="opcion_respuesta",
                columns=(
                    "id", "pregunta_id", "texto", "orden"
                ),
                order_by="orden ASC"
            )
        )
    
    async def create_opcion_respuesta(self, opcion_respuesta: OpcionRespuestaCreate) -> OpcionRespuestaResponse:
        return await self.create(
            pregunta_id=opcion_respuesta.pregunta_id,
            texto=opcion_respuesta.texto,
            orden=opcion_respuesta.orden
        )
        
    async def update_opcion_respuesta(self, opcion_respuesta_id: int, opcion_respuesta: OpcionRespuestaUpdate) -> OpcionRespuestaResponse:
        fields = opcion_respuesta.model_dump(exclude_none=True)
        return await self.update(opcion_respuesta_id, **fields)