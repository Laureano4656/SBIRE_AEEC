from datetime import date

from pydantic import BaseModel


class Asistencia(BaseModel):
    id: int
    cursada_id: int | None
    fecha: date
    presente: bool
    observacion: str | None

    class Config:
        from_attributes = True
