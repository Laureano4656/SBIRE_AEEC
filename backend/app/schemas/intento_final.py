from datetime import date

from pydantic import BaseModel, Field


class IntentoFinalCreate(BaseModel):
    cursada_id: int | None = Field(None, ge=1)
    numero_intento: int = Field(1, ge=1, le=3)
    nota: float = Field(..., ge=0, le=10, description="Nota del examen (0-10)")
    fecha: date = Field(...)
    aprobado: bool = Field(...)


class IntentoFinalUpdate(BaseModel):
    cursada_id: int | None = Field(None, ge=1)
    numero_intento: int | None = Field(None, ge=1, le=3)
    nota: float  | None = Field(None, ge=0, le=10, description="Nota del examen (0-10)")
    fecha: date | None = None
    aprobado: bool | None = None


class IntentoFinalResponse(BaseModel):
    id: int
    cursada_id: int | None
    numero_intento: int = Field(1, ge=1, le=3)
    nota: float = Field(..., ge=0, le=10, description="Nota del examen (0-10)")
    fecha: date
    aprobado: bool

    class Config:
        from_attributes = True
