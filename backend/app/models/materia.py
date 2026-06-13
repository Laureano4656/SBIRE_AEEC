from pydantic import BaseModel


class Materia(BaseModel):
    id: int
    plan_id: int
    nombre: str
    codigo: str
    cuatrimestre_sugerido: int
    es_basica_critica: bool

    class Config:
        from_attributes = True
