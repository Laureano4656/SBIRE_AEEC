from pydantic import BaseModel, Field


class MateriaPlanAsoc(BaseModel):
    plan_id: int = Field(..., ge=1)
    cuatrimestre_sugerido: int = Field(..., ge=1)


class MateriaCreate(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=255)
    codigo: str = Field(..., min_length=1, max_length=50)
    es_basica_critica: bool = False
    cuatrimestre_dictado: int = Field(..., ge=0, le=1)
    planes: list[MateriaPlanAsoc] = Field(..., min_length=1)


class MateriaUpdate(BaseModel):
    nombre: str | None = Field(None, min_length=1, max_length=255)
    codigo: str | None = Field(None, min_length=1, max_length=50)
    es_basica_critica: bool | None = None
    cuatrimestre_dictado: int | None = Field(None, ge=0, le=1)
    planes: list[MateriaPlanAsoc] | None = None


class MateriaResponse(BaseModel):
    id: int
    nombre: str
    codigo: str
    es_basica_critica: bool
    cuatrimestre_dictado: int = Field(..., ge=0, le=1)

    class Config:
        from_attributes = True


class MateriaListResponse(BaseModel):
    id: int
    nombre: str
    codigo: str
    cuatrimestre_sugerido: int
    es_basica_critica: bool
    estado: str
    cuatrimestre_dictado: int = Field(..., ge=0, le=1)

    class Config:
        from_attributes = True
    
