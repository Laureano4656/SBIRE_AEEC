from pydantic import BaseModel
from datetime import datetime

class IntervencionesTutorResponse(BaseModel):
    id: int
    alerta_id: int
    tutor_id: int
    tipo: str
    resultado: str | None = None
    fecha: datetime
    descripcion: str | None = None
    creado_en: datetime
    estudiante_id: int
    estudiante_nombre: str
    estudiante_apellido: str
    estudiante_dni: str
    class Config:
        from_attributes = True