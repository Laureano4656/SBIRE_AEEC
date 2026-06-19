import asyncpg

from app.models.peso_criterios import PesoCriterios
from app.repositories.base import BaseRepository


class PesoCriteriosRepository(BaseRepository[PesoCriterios]):
    def _init_(self, conn: asyncpg.Connection) -> None:
        super()._init_(model=PesoCriterios, conn=conn)

    async def crear_configuracion(self, config_data) -> int:
        """
        Inserta la nueva configuración del jefe departamental y devuelve el ID generado.
        """
        query = """
            INSERT INTO configuracion_indicador (
                carrera_id, etapa, umbral_amarillo, umbral_rojo, 
                factor_extension, descripcion, activo, actualizado_en, actualizado_por
            )
            VALUES (
                $1, $2::public.etapa_desercion_enum, $3, $4, 
                $5, $6, true, NOW(), $7
            )
            RETURNING id;
        """
        nuevo_id = await self.conn.fetchval(
            query,
            config_data.carrera_id,
            config_data.etapa,
            config_data.umbral_amarillo,
            config_data.umbral_rojo,
            config_data.factor_extension,
            config_data.descripcion,
            config_data.actualizado_por
        )
        return nuevo_id

    async def obtener_mapa_indicadores(self) -> dict[str, int]:
        query = """
            SELECT id, nombre 
            FROM indicador 
            WHERE activo = true AND dimension IS NOT NULL;
        """
        filas = await self.conn.fetch(query)
        return {fila["nombre"]: fila["id"] for fila in filas}

    async def guardar_peso_indicador(self, id_configuracion: int, id_indicador: int, peso_global: float) -> None:
        query = """
            INSERT INTO peso_indicadores (id_configuracion, id_indicador, peso_global)
            VALUES ($1, $2, $3);
        """
        await self.conn.execute(query, id_configuracion, id_indicador, peso_global)