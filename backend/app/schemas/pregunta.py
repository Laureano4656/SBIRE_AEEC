from typing import Literal, Any
from pydantic import BaseModel, Field, field_validator
import json

from app.schemas.opcion_pregunta import OpcionPreguntaCrearOpcion

class PreguntaCreate(BaseModel):
    indicador_id: int | None = Field(None, ge=1)
    carrera_id: int | None = Field(None, ge=1)
    texto_pregunta: str = Field(..., min_length=5)
    evento_id: int
    tipo_pregunta: Literal["texto_libre", "opcion_multiple", "escala", "si_no", "numero"]
    configuracion_riesgo: dict[str, Any] | None = None
    activa: bool = True
    opciones: list[OpcionPreguntaCrearOpcion] | None = None

class PreguntaUpdate(BaseModel):
    indicador_id: int | None = Field(None, ge=1)
    carrera_id: int | None = Field(None, ge=1)
    texto_pregunta: str | None = Field(None, min_length=5)
    evento_id: int
    tipo_pregunta: Literal["texto_libre", "opcion_multiple", "escala", "si_no", "numero"] | None = None
    configuracion_riesgo: dict[str, Any] | None = None
    activa: bool | None = None

class PreguntaResponse(BaseModel):
    id: int
    indicador_id: int | None
    carrera_id: int | None
    texto_pregunta: str
    evento_id: int
    tipo_pregunta: str
    configuracion_riesgo: dict[str, Any] | None
    activa: bool
    
    @field_validator('configuracion_riesgo', mode='before')
    @classmethod
    def parsear_json(cls, v):
        if isinstance(v, str):
            return json.loads(v)
        return v

    class Config:
        from_attributes = True
