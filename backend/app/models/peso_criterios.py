from pydantic import BaseModel


class PesoCriterios(BaseModel):
    """Representa una fila completa de la tabla `peso_criterios`."""

    id: int
    criterio_id: int
    valor: float

    class Config:
        # Permite construir desde objetos con atributos (asyncpg.Record)
        from_attributes = True