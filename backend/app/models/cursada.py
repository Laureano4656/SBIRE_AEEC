from typing import Literal

from pydantic import BaseModel


class Cursada(BaseModel):
    id: int
    estudiante_id: int | None
    materia_id: int | None
    inscripcion_id: int | None
    anio: int
    cuatrimestre: int
    estado: Literal["cursando", "aprobada", "desaprobada", "libre", "abandono"]

    class Config:
        from_attributes = True
