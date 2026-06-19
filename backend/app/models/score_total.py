from datetime import datetime

from pydantic import BaseModel

class ScoreTotal(BaseModel):
    """Representa una fila completa de la tabla `score_total`."""

    id: int
    estudiante_id: int
    valor: float
    creado_en: datetime

    class Config:
        from_attributes = True