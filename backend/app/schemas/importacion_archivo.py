from datetime import datetime
from pydantic import BaseModel, Field


class ImportacionArchivoCreate(BaseModel):
    usuario_id: int = Field(..., ge=1)
    nombre_archivo: str = Field(..., min_length=1, max_length=255)
    filas_importadas: int = Field(..., ge=0)
    filas_errores: int = Field(default=0, ge=0)


class ImportacionArchivoUpdate(BaseModel):
    nombre_archivo: str | None = Field(None, min_length=1, max_length=255)
    filas_importadas: int | None = Field(None, ge=0)
    filas_errores: int | None = Field(None, ge=0)


class ImportacionArchivoResponse(BaseModel):
    id: int
    usuario_id: int
    nombre_archivo: str
    fecha_importacion: datetime
    filas_importadas: int
    filas_errores: int

    class Config:
        from_attributes = True
