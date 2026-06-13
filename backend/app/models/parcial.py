from pydantic import BaseModel


class Parcial(BaseModel):
    id: int
    cursada_id: int | None
    numero_parcial: int
    nota: float
    recuperatorio: bool

    class Config:
        from_attributes = True
