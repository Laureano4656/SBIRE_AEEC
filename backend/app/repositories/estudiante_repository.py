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
