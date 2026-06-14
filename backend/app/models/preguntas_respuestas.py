from pydantic import BaseModel

class OpcionResponse(BaseModel):
    id: int
    texto: str
    orden: int

class PreguntaResponse(BaseModel):
    id: int
    texto: str
    tipo: str
    orden: int
    obligatoria: bool
    condicion_pregunta_id: int | None
    opciones: list[OpcionResponse]

class EncuestaResponse(BaseModel):
    id: int
    titulo: str
    modalidad: str
    preguntas: list[PreguntaResponse]

class RespuestaItem(BaseModel):
    pregunta_id: int
    opcion_id: int | None = None
    texto_libre: str | None = None

class SubmitEncuestaRequest(BaseModel):
    asignacion_id: int
    respuestas: list[RespuestaItem]
    
from datetime import datetime

class AsignacionEncuestaResponse(BaseModel):
    asignacion_id: int
    encuesta_id: int
    titulo: str
    modalidad: str
    fecha_asignacion: datetime
    completada: bool
    fecha_completada: datetime | None

class AsignacionEncuestaCreate(BaseModel):
    encuesta_id: int
    estudiante_id: int