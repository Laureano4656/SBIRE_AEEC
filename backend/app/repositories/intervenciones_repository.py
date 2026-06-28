import asyncpg
from app.schemas.intervenciones import IntervencionCreate, IntervencionResponse
from app.repositories.crud_repository import CrudRepository, CrudTableConfig


class IntervencionRepository(CrudRepository[IntervencionResponse]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            conn,
            IntervencionResponse,
            CrudTableConfig(
                table_name="intervenciones",
                columns=("id", "alerta_id", "tutor_id", "tipo", "resultado", "fecha", "descripcion", "creado_en"),
                order_by="creado_en DESC"
            )
        )
        
    async def create_intervencion(self, intervencion: IntervencionCreate) -> IntervencionResponse:
        return await self.create(
            alerta_id=intervencion.alerta_id,
            tutor_id=intervencion.tutor_id,
            tipo=intervencion.tipo,
            resultado=intervencion.resultado,
            fecha=intervencion.fecha,
            descripcion=intervencion.descripcion
        )
        
    async def update_intervencion(self, intervencion_id: int, resultado: str, descripcion: str) -> IntervencionResponse:
        return await self.update(
            intervencion_id,
            resultado=resultado,
            descripcion=descripcion)

    async def get_by_id(self, intervencion_id: int) -> int:
        return await super().get_by_id(intervencion_id)