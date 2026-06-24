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

    async def eliminar(self, indicador_id: int) -> dict[str, str]:
        """
        Realiza un borrado lógico (soft-delete) en cascada.
        Desactiva el indicador/dimensión solicitado, todos sus indicadores hijos,
        y todas las preguntas asociadas a cualquiera de ellos.
        """
        # Abrimos una transacción para garantizar la integridad de los datos
        async with self.repo.conn.transaction():
            
            # 1. Desactivamos el indicador principal y sus dependencias.
            # Si el id es de un indicador normal, solo apaga ese.
            # Si es de una dimensión, apaga la dimensión y todos sus hijos.
            query_indicadores = """
                UPDATE indicador
                SET activo = FALSE
                WHERE id = $1 OR dimension = $1
                RETURNING id;
            """
            
            # fetch nos devuelve las filas afectadas, extraemos los IDs
            registros = await self.repo.conn.fetch(query_indicadores, indicador_id)
            ids_afectados = [row["id"] for row in registros]

            # 2. Si efectivamente se desactivaron indicadores, bajamos sus preguntas
            if ids_afectados:
                query_preguntas = """
                    UPDATE pregunta
                    SET activa = FALSE
                    WHERE indicador_id = ANY($1::int[]);
                """
                # ANY() es la forma nativa y segura de PostgreSQL para buscar 
                # contra una lista de Python (array) sin hacer concatenación de strings
                await self.repo.conn.execute(query_preguntas, ids_afectados)

        return {
            "mensaje": f"Borrado lógico exitoso. Se desactivaron {len(ids_afectados)} indicador(es)/dimensión y sus preguntas asociadas."
        }