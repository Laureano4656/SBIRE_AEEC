from pydantic import BaseModel, Field


class MateriaCreate(BaseModel):
    plan_id: int = Field(..., ge=1)
    nombre: str = Field(..., min_length=1, max_length=255)
    codigo: str = Field(..., min_length=1, max_length=50)
    cuatrimestre_sugerido: int = Field(..., ge=1)
    es_basica_critica: bool = False
    cuatrimestre_dictado: int = Field(..., ge=0, le=1)


class MateriaUpdate(BaseModel):
    plan_id: int | None = Field(None, ge=1)
    nombre: str | None = Field(None, min_length=1, max_length=255)
    codigo: str | None = Field(None, min_length=1, max_length=50)
    cuatrimestre_sugerido: int | None = Field(None, ge=1)
    es_basica_critica: bool | None = None
    cuatrimestre_dictado: int | None = Field(None, ge=0, le=1)


class MateriaResponse(BaseModel):
    id: int
    plan_id: int
    nombre: str
    codigo: str
    cuatrimestre_sugerido: int
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
        
    
