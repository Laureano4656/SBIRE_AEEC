
from typing import Literal

from pydantic import BaseModel


class Estudiante(BaseModel):
    """Representa una fila completa de la tabla `estudiantes`."""

    id: int
    carrera_id: int | None
    nombre: str
    apellido: str
    email: str | None
    legajo: str
    dni: str
    anio_ingreso: int
    etapa: Literal["temprana", "media", "tardia"]
    porcentaje_carrera: float
    activo: bool
    moodle_id: str | None

    class Config:
        from_attributes = True
