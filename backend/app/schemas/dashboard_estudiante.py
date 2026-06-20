from datetime import datetime
from pydantic import BaseModel

class OpcionDetalle(BaseModel):
    id: int
    texto: str
    orden: int

class PreguntaDetalle(BaseModel):
    id: int
    texto: str
    tipo: str
    orden: int
    obligatoria: bool
    condicion_pregunta_id: int | None
    opciones: list[OpcionDetalle] = []

class EncuestaResponse(BaseModel):
    id: int
    titulo: str
    modalidad: str
    preguntas: list[PreguntaDetalle] = []

    class Config:
        from_attributes = True

class AsignacionEncuestaResponse(BaseModel):
    asignacion_id: int
    encuesta_id: int
    titulo: str
    modalidad: str
    fecha_asignacion: datetime
    completada: bool
    fecha_completada: datetime | None

    class Config:
        from_attributes = True