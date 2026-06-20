import asyncpg
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.schemas.asignacion_encuesta import AsignacionEncuestaCreate, AsignacionEncuestaResponse, AsignacionEncuestaUpdate

class AsignacionEncuestaRepository(CrudRepository[AsignacionEncuestaResponse]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            conn,
            AsignacionEncuestaResponse,
            CrudTableConfig(
                table_name="asignacion_encuesta",
                columns=(
                    "id", "encuesta_id", "usuario_id", "fecha_asignacion", "fecha_respuesta"
                ),
                order_by="id DESC"
            )
        )
    
    async def create_asignacion_encuesta(self, asignacion: AsignacionEncuestaCreate) -> AsignacionEncuestaResponse:
        return await self.create(
            encuesta_id=asignacion.encuesta_id,
            usuario_id=asignacion.usuario_id,
            fecha_asignacion=asignacion.fecha_asignacion
        )
        
    async def update_asignacion_encuesta(self, asignacion_id: int, asignacion: AsignacionEncuestaUpdate) -> AsignacionEncuestaResponse:
        fields = asignacion.model_dump(exclude_none=True)
        return await self.update(asignacion_id, **fields)