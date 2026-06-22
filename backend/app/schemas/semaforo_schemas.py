from pydantic import BaseModel
from datetime import datetime

class DetalleIndicadorSemaforo(BaseModel):
    indicador_id: int
    nombre_indicador: str
    nombre_dimension: str | None
    score_bruto: float
    nivel_riesgo: str
    factor_ahp: float
    aporte_al_total: float

class SemaforoResponse(BaseModel):
    estudiante_id: int
    score_total_id: int
    riesgo_global: float
    estado_general: str
    fecha_calculo: datetime
    desglose_indicadores: list[DetalleIndicadorSemaforo]