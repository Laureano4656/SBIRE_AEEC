
from pydantic import BaseModel

class Carrera(BaseModel):
    """Representa una fila completa de la tabla `carrera`."""

    id: int
    nombre: str
    codigo: str
    duracion_cuatrimestre: int
    activo: bool

    class Config:
        # Permite construir desde objetos con atributos (asyncpg.Record)
        from_attributes = True
