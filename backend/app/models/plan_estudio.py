
from pydantic import BaseModel


class PlanEstudio(BaseModel):
    """Representa una fila completa de la tabla `plan_estudios`."""

    id: int
    carrera_id: int
    nombre: str
    anio_vigencia: int
    activo: bool

    class Config:
        # Permite construir desde objetos con atributos (asyncpg.Record)
        from_attributes = True
