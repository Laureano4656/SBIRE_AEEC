from datetime import date

from pydantic import BaseModel, Field


class AsistenciaCreate(BaseModel):
    cursada_id: int | None = Field(None, ge=1)
    fecha: date = Field(...)
    presente: bool = False
    observacion: str | None = Field(None, max_length=255)


class AsistenciaUpdate(BaseModel):
    cursada_id: int | None = Field(None, ge=1)
    fecha: date | None = None
    presente: bool | None = None
    observacion: str | None = Field(None, max_length=255)


class AsistenciaResponse(BaseModel):
    id: int
    cursada_id: int | None
    fecha: date
    presente: bool
    observacion: str | None

    class Config:
        from_attributes = True
