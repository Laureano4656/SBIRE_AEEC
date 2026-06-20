import asyncpg
# asumo que el modelo de sqlalchemy/pydantic base se llama Intervencion
from app.models.intervencion import Intervencion 
from app.services.crud_service import CrudService
from app.repositories.intervenciones_repository import IntervencionRepository
from app.schemas.intervenciones import IntervencionCreate, IntervencionResponse

class IntervencionService(CrudService[Intervencion]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        # instanciamos tu repo personalizado
        repo_custom = IntervencionRepository(conn)
        # se lo pasamos al padre
        super().__init__(repo_custom, "Intervencion")

    # mantenemos el crear custom porque tu repo tiene un metodo especifico para esto
    async def crear_intervencion(self, data: IntervencionCreate) -> IntervencionResponse:
        return await self.repo.create_intervencion(data)

    # mantenemos el actualizar custom
    async def actualizar_resultado(self, intervencion_id: int, resultado: str, descripcion: str) -> IntervencionResponse:
        # usamos el get_by_id que heredaste del crudservice base para validar
        intervencion = await self.get_by_id(intervencion_id)
        if not intervencion:
            raise ValueError(f"intervencion con id {intervencion_id} no encontrada")
            
        return await self.repo.update_intervencion(intervencion_id, resultado, descripcion)