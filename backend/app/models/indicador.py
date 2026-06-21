from pydantic import BaseModel

class Indicador(BaseModel):
    """Representa una fila completa de la tabla `indicador` (Dimensiones e Indicadores)."""
    id: int
    nombre: str
    dimension: int | None
    activo: bool

    class Config:
        from_attributes = True