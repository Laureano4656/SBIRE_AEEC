import asyncpg
from app.models.estudiante import Estudiante
from app.repositories.crud_repository import CrudRepository, CrudTableConfig

class EstudianteRepository(CrudRepository[Estudiante]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            conn,
            Estudiante,
            CrudTableConfig(
                table_name="estudiantes",
                columns=("id", "carrera_id", "nombre", "apellido", "email", "legajo", "dni",
                         "anio_ingreso", "etapa", "porcentaje_carrera", "activo", "moodle_id"),
                active_column="activo"
            )
        )

    async def get_by_legajo_and_carrera(self, legajo: str, carrera_id: int) -> Estudiante | None:
        row = await self.conn.fetchrow(
            f"""
            SELECT {self._select_clause()}
            FROM {self.config.table_name}
            WHERE legajo = $1 AND carrera_id = $2
            """,
            legajo, carrera_id,
        )
        return self._map(row)
