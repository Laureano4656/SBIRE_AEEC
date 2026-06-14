from pydantic import BaseModel


class PesoIndicadores(BaseModel):
    """Representa una fila completa de la tabla `peso_indicadores`."""

    id: int
    id_indicador: int
    peso_global: float

    class Config:
        # Permite construir desde objetos con atributos (asyncpg.Record)
        from_attributes = True