from pydantic import BaseModel
from datetime import datetime


class AlertaCreate(BaseModel):
    estudiante_id: int
    score_id: int
    asignacion_id: int
    tipo_desercion: str
    nivel_riesgo: str
    origen: str
    estado: str
    anio_cursada: int
    generada_en: datetime
    fecha_cierre: datetime | None = None
    
    class Config:
        from_attributes = True

class AlertaResponse(BaseModel):
    id: int
    estudiante_id: int
    score_id: int
    asignacion_id: int
    tipo_desercion: str
    nivel_riesgo: str
    origen: str
    estado: str
    anio_cursada: int
    generada_en: datetime
    fecha_cierre: datetime | None = None

    class Config:
        from_attributes = True