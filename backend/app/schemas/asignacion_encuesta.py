from datetime import datetime

from pydantic import BaseModel, Field


class AsignacionEncuestaCreate(BaseModel):
    encuesta_id: int | None = Field(None, ge=1)
    estudiante_id: int | None = Field(None, ge=1)
    fecha_asignacion: datetime = Field(...)
    completada: bool = False
    fecha_completada: datetime | None = None


class AsignacionEncuestaUpdate(BaseModel):
    encuesta_id: int | None = Field(None, ge=1)
    estudiante_id: int | None = Field(None, ge=1)
    fecha_asignacion: datetime | None = None
    completada: bool | None = None
    fecha_completada: datetime | None = None


class AsignacionEncuestaResponse(BaseModel):
    id: int
    encuesta_id: int | None
    estudiante_id: int | None
    fecha_asignacion: datetime
    completada: bool
    fecha_completada: datetime | None

    class Config:
        from_attributes = True
