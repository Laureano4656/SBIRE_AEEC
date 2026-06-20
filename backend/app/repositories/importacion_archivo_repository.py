import asyncpg
from app.models.importacion_archivo import ImportacionArchivo
from app.repositories.crud_repository import CrudRepository, CrudTableConfig


class ImportacionArchivoRepository(CrudRepository[ImportacionArchivo]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            conn,
            ImportacionArchivo,
            CrudTableConfig(
                table_name="importacion_archivo",
                columns=(
                    "id",
                    "usuario_id",
                    "nombre_archivo",
                    "fecha_importacion",
                    "filas_importadas",
                    "filas_errores",
                ),
                order_by="fecha_importacion DESC",
            ),
        )

    async def get_by_usuario_id(self, usuario_id: int) -> list[ImportacionArchivo]:
        rows = await self.conn.fetch(
            f"SELECT {self._select_clause()} FROM {self.config.table_name} WHERE usuario_id = $1 ORDER BY {self.config.order_by}",
            usuario_id,
        )
        return self._map_many(rows)
