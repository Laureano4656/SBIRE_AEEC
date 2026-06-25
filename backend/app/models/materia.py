from pydantic import BaseModel


class Materia(BaseModel):
    id: int
    nombre: str
    codigo: str
    es_basica_critica: bool
    cuatrimestre_dictado: int

    class Config:
        from_attributes = True
