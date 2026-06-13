from datetime import date

from pydantic import BaseModel


class IntentoFinal(BaseModel):
    id: int
    cursada_id: int | None
    numero_intento: int
    nota: float
    fecha: date
    aprobado: bool

    class Config:
        from_attributes = True
