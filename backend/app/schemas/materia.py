from pydantic import BaseModel, Field


class MateriaCreate(BaseModel):
    plan_id: int = Field(..., ge=1)
    nombre: str = Field(..., min_length=1, max_length=255)
    codigo: str = Field(..., min_length=1, max_length=50)
    cuatrimestre_sugerido: int = Field(..., ge=1)
    es_basica_critica: bool = False


class MateriaUpdate(BaseModel):
    plan_id: int | None = Field(None, ge=1)
    nombre: str | None = Field(None, min_length=1, max_length=255)
    codigo: str | None = Field(None, min_length=1, max_length=50)
    cuatrimestre_sugerido: int | None = Field(None, ge=1)
    es_basica_critica: bool | None = None


class MateriaResponse(BaseModel):
    id: int
    plan_id: int
    nombre: str
    codigo: str
    cuatrimestre_sugerido: int
    es_basica_critica: bool

    class Config:
        from_attributes = True
