from datetime import date

from pydantic import BaseModel, Field


class IntentoFinalCreate(BaseModel):
    cursada_id: int | None = Field(None, ge=1)
    numero_intento: int = Field(1, ge=1)
    nota: float = Field(...)
    fecha: date = Field(...)
    aprobado: bool = Field(...)


class IntentoFinalUpdate(BaseModel):
    cursada_id: int | None = Field(None, ge=1)
    numero_intento: int | None = Field(None, ge=1)
    nota: float | None = None
    fecha: date | None = None
    aprobado: bool | None = None


class IntentoFinalResponse(BaseModel):
    id: int
    cursada_id: int | None
    numero_intento: int
    nota: float
    fecha: date
    aprobado: bool

    class Config:
        from_attributes = True
