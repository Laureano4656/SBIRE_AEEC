from datetime import datetime, date
from pydantic import BaseModel

class Intervencion(BaseModel):
    id: int
    alerta_id: int
    tutor_id: int
    tipo: str
    resultado: str
    fecha: date  # o str, dependiendo de como lo maneje tu base, pero date es lo ideal
    descripcion: str | None = None
    creado_en: datetime

    class Config:
        from_attributes = True