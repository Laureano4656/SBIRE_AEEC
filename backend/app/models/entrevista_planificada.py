from datetime import datetime
from pydantic import BaseModel

class EntrevistaPlanificada(BaseModel):
    id: int
    alerta_id: int
    tutor_id: int
    estudiante_id: int
    fecha_propuesta: datetime
    modalidad: str
    notas_previas: str | None = None
    estado: str
    intervencion_id: int
    creado_en: datetime

    class Config:
        from_attributes = True