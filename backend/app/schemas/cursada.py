from typing import Literal

from pydantic import BaseModel, Field


class CursadaCreate(BaseModel):
    estudiante_id: int | None = Field(None, ge=1)
    materia_id: int | None = Field(None, ge=1)
    inscripcion_id: int | None = Field(None, ge=1)
    anio: int = Field(..., ge=1900)
    cuatrimestre: int = Field(..., ge=1)
    estado: Literal["cursando", "aprobada", "desaprobada", "libre", "abandono"] = "cursando"


class CursadaUpdate(BaseModel):
    estudiante_id: int | None = Field(None, ge=1)
    materia_id: int | None = Field(None, ge=1)
    inscripcion_id: int | None = Field(None, ge=1)
    anio: int | None = Field(None, ge=1900)
    cuatrimestre: int | None = Field(None, ge=1)
    estado: Literal["cursando", "aprobada", "desaprobada", "libre", "abandono"] | None = None


class CursadaResponse(BaseModel):
    id: int
    estudiante_id: int | None
    materia_id: int | None
    inscripcion_id: int | None
    anio: int
    cuatrimestre: int
    estado: Literal["cursando", "aprobada", "desaprobada", "libre", "abandono"]

    class Config:
        from_attributes = True
