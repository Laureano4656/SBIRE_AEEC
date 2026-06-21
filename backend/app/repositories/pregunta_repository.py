import asyncpg
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.schemas.pregunta import PreguntaCreate, PreguntaResponse, PreguntaUpdate


class PreguntaRepository(CrudRepository[PreguntaResponse]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            conn,
            PreguntaResponse,
            CrudTableConfig(
                table_name="preguntas",
                columns=(
                    "id", "encuesta_id", "texto", "tipo", "orden", "obligatoria",
                    "condicion_pregunta_id"
                ),
                order_by="orden ASC"
            )
        )
    
    async def create_pregunta(self, pregunta: PreguntaCreate) -> PreguntaResponse:
        return await self.create(
            encuesta_id=pregunta.encuesta_id,
            texto=pregunta.texto,
            tipo=pregunta.tipo,
            orden=pregunta.orden,
            obligatoria=pregunta.obligatoria,
            condicion_pregunta_id=pregunta.condicion_pregunta_id
        )
        
    async def update_pregunta(self, pregunta_id: int, pregunta: PreguntaUpdate) -> PreguntaResponse:
        fields = pregunta.model_dump(exclude_none=True)
        return await self.update(pregunta_id, **fields)
    
    