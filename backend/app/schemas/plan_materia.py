from pydantic import BaseModel, Field


class PlanMateriaCreate(BaseModel):
    plan_id: int = Field(..., ge=1)
    cuatrimestre_sugerido: int = Field(..., ge=1)


class PlanMateriaResponse(BaseModel):
    id: int
    plan_id: int
    materia_id: int
    cuatrimestre_sugerido: int

    class Config:
        from_attributes = True
