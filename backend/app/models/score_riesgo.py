
from datetime import datetime

from pydantic import BaseModel

class ScoreRiesgo(BaseModel):
    """Representa una fila completa de la tabla `score_riesgo`."""

    id: int
    estudiante_id: int
    configuracion_id: int
    score: float
    nivel: str
    calculado_en: datetime | None
    score_total_id: int | None
    factor_aplicado: float | None

    class Config:
        from_attributes = True