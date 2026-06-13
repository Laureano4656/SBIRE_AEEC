from pydantic import BaseModel, Field


class InscripcionCuatrimestreCreate(BaseModel):
    estudiante_id: int | None = Field(None, ge=1)
    anio: int = Field(..., ge=1900)
    cuatrimestre: int = Field(..., ge=1)
    materilas_anotadas: int = Field(..., ge=0)
    activo: bool = True


class InscripcionCuatrimestreUpdate(BaseModel):
    estudiante_id: int | None = Field(None, ge=1)
    anio: int | None = Field(None, ge=1900)
    cuatrimestre: int | None = Field(None, ge=1)
    materilas_anotadas: int | None = Field(None, ge=0)
    activo: bool | None = None


class InscripcionCuatrimestreResponse(BaseModel):
    id: int
    estudiante_id: int | None
    anio: int
    cuatrimestre: int
    materilas_anotadas: int
    activo: bool

    class Config:
        from_attributes = True
