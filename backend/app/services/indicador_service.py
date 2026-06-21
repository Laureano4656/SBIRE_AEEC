import asyncpg
from typing import Any

from app.models.indicador import Indicador
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from app.services.crud_service import CrudService

class IndicadorService(CrudService[Indicador]):
    """
    Service de Indicador/Dimensión — lógica de negocio.
    """

    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            CrudRepository(
                conn,
                Indicador,
                CrudTableConfig(
                    table_name="indicador",
                    columns=("id", "nombre", "dimension", "activo"),
                    active_column="activo"
                ),
            ),
            "Indicador",
        )

    async def reasignar_preguntas(self, indicador_id: int, preguntas_ids: list[int]) -> None:
        """
        Ejecuta un UPDATE masivo para cambiar el indicador de múltiples preguntas a la vez.
        Ideal para cuando el administrador mueve preguntas en el tablero Drag & Drop.
        """
        if not preguntas_ids:
            return
            
        await self.repo.conn.execute(
            """
            UPDATE pregunta 
            SET indicador_id = $1 
            WHERE id = ANY($2::int[])
            """,
            indicador_id,
            preguntas_ids
        )

    async def crear_con_preguntas(self, **kwargs: Any) -> Indicador:
        """Crea el indicador y, si vienen preguntas, las asocia."""
        preguntas_ids = kwargs.pop("preguntas_ids", None)
        
        # 1. Crear el indicador usando el método padre
        nuevo_indicador = await super().crear(**kwargs)
        
        # 2. Reasignar preguntas si fueron enviadas
        if preguntas_ids:
            await self.reasignar_preguntas(nuevo_indicador.id, preguntas_ids)
            
        return nuevo_indicador

    async def actualizar_con_preguntas(self, id: int, **kwargs: Any) -> Indicador:
        """Actualiza el indicador y/o reasigna preguntas al mismo."""
        preguntas_ids = kwargs.pop("preguntas_ids", None)
        
        # 1. Actualizar datos del indicador si vinieron campos
        if kwargs:
            indicador = await super().actualizar(id, **kwargs)
        else:
            indicador = await self.obtener_por_id(id)
            
        # 2. Reasignar preguntas
        if preguntas_ids is not None:
            await self.reasignar_preguntas(indicador.id, preguntas_ids)
            
        return indicador