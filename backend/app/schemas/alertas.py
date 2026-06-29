from pydantic import BaseModel, Field
from datetime import datetime


class AlertaCreate(BaseModel):
    estudiante_id: int
    score_id: int | None
    asignacion_id: int | None
    tipo_desercion: str
    nivel_riesgo: str
    origen: str
    anio_cursada: int
    
    class Config:
        from_attributes = True

class AlertaResponse(BaseModel):
    id: int
    estudiante_id: int
    score_id: int | None
    asignacion_id: int | None
    tipo_desercion: str
    nivel_riesgo: str
    origen: str
    estado: str
    anio_cursada: int
    generada_en: datetime
    fecha_cierre: datetime | None = None
    estudiante_nombre: str | None = None
    estudiante_apellido: str | None = None

    class Config:
        from_attributes = True

class AlertaUpdateEstado(BaseModel):
    estado: str = Field(..., description="Estado válido: 'nueva', 'en_revision', 'resuelta', etc.")