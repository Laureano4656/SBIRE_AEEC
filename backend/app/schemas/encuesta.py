from datetime import date
from typing import Literal

from pydantic import BaseModel, Field


class EncuestaCreate(BaseModel):
    titulo: str = Field(..., min_length=1, max_length=100)
    estado: Literal["borrador", "activa", "pausada", "archivada"] = "borrador"
    modalidad: Literal["unica_ingreso", "periodica", "aleatoria"] = "aleatoria"
    fecha_desde: date = Field(...)
    fecha_hasta: date = Field(...)
    periodica: bool = False
    frecuencia_dias: int | None = Field(None, ge=1)


class EncuestaUpdate(BaseModel):
    titulo: str | None = Field(None, min_length=1, max_length=100)
    estado: Literal["borrador", "activa", "pausada", "archivada"] | None = None
    modalidad: Literal["unica_ingreso", "periodica", "aleatoria"] | None = None
    fecha_desde: date | None = None
    fecha_hasta: date | None = None
    periodica: bool | None = None
    frecuencia_dias: int | None = Field(None, ge=1)


class EncuestaResponse(BaseModel):
    id: int
    titulo: str
    estado: Literal["borrador", "activa", "pausada", "archivada"]
    modalidad: Literal["unica_ingreso", "periodica", "aleatoria"]
    fecha_desde: date
    fecha_hasta: date
    periodica: bool
    frecuencia_dias: int | None

    class Config:
        from_attributes = True
