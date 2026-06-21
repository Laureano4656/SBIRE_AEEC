from pydantic import BaseModel

class indicador(BaseModel):
    nombre: str
    id: int
    activo: bool

    class Config:
        from_attributes = True