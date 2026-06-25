from pydantic import BaseModel


class PlanMateria(BaseModel):
    id: int
    plan_id: int
    materia_id: int
    cuatrimestre_sugerido: int

    class Config:
        from_attributes = True
