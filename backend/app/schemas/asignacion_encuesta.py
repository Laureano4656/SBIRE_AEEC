from datetime import datetime

from pydantic import BaseModel, Field


class AsignacionEncuestaCreate(BaseModel):
    encuesta_id: int = Field(ge=1)
    estudiante_id: int = Field(ge=1)
    # fecha_asignacion la pone la base con NOW()
    # completada defaultea a false en la base


class AsignacionEncuestaUpdate(BaseModel):
    completada: bool | None = None
    fecha_completada: datetime | None = None
    # encuesta_id y estudiante_id no se cambian
    # fecha_asignacion tampoco, es cuando se asignó


class AsignacionEncuestaResponse(BaseModel):
    id: int
    encuesta_id: int
    estudiante_id: int
    fecha_asignacion: datetime
    completada: bool
    fecha_completada: datetime | None

    class Config:
        from_attributes = True