import asyncpg
from app.models.estudiante import Estudiante
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
from datetime import datetime

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

    async def asignar_encuesta_unica_vez(self, estudiante_id: int) -> None:
        """
        Asigna la encuesta inicial al estudiante.
        Calcula automáticamente el periodo lectivo según el mes actual y
        delega la fecha de asignación al motor de la base de datos.
        """
        now = datetime.now()
        anio_actual = now.year
        cuatrimestre = 1 if now.month <= 7 else 2 
        periodo_lectivo = f"{anio_actual}-{cuatrimestre}"

        query = """
            INSERT INTO asignacion_encuesta 
            (estudiante_id, evento_id, completado, borrador, periodo_lectivo, fecha_asignacion)
            SELECT 
                $1, 
                id, 
                false, 
                false, 
                $2, 
                CURRENT_TIMESTAMP
            FROM evento_disparador
            WHERE nombre = 'unica_vez'
            LIMIT 1
        """
        
        await self.conn.execute(query, estudiante_id, periodo_lectivo)
