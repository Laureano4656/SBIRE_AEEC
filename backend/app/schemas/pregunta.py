from typing import Literal

from pydantic import BaseModel, Field


class PreguntaCreate(BaseModel):
    encuesta_id: int | None = Field(None, ge=1)
    texto: str | None = Field(None)
    tipo: Literal["texto_libre", "opcion_multiple", "escala", "si_no", "numero"] = "texto_libre"
    orden: int | None = Field(None, ge=1)
    obligatoria: bool = True
    condicion_pregunta_id: int | None = Field(None, ge=1)


class PreguntaUpdate(BaseModel):
    encuesta_id: int | None = Field(None, ge=1)
    texto: str | None = None
    tipo: Literal["texto_libre", "opcion_multiple", "escala", "si_no", "numero"] | None = None
    orden: int | None = Field(None, ge=1)
    obligatoria: bool | None = None
    condicion_pregunta_id: int | None = Field(None, ge=1)


class PreguntaResponse(BaseModel):
    id: int
    encuesta_id: int | None
    texto: str | None
    tipo: Literal["texto_libre", "opcion_multiple", "escala", "si_no", "numero"]
    orden: int | None
    obligatoria: bool
    condicion_pregunta_id: int | None

    class Config:
        from_attributes = True
