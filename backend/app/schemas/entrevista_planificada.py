from pydantic import BaseModel
from datetime import datetime

class EntrevistaCreate(BaseModel):
    alerta_id: int
    tutor_id: int
    estudiante_id: int
    fecha_propuesta: datetime
    modalidad: str
    notas_previas: str | None = None
    intervencion_id : int
    
    class Config:
        from_attributes = True

class EntrevistaPlanificadaResponse(BaseModel):
    id: int
    alerta_id: int
    tutor_id: int
    estudiante_id: int
    fecha_propuesta: datetime
    modalidad: str
    notas_previas: str | None = None
    estado: str
    intervencion_id : int
    creado_en: datetime
    
    class Config:
        from_attributes = True