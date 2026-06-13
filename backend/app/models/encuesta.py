from datetime import date
from typing import Literal

from pydantic import BaseModel


class Encuesta(BaseModel):
    id: int
    titulo: str
    estado: Literal["borrador", "activa", "pausada", "archivada"]
    modalidad: Literal["unica_ingreso", "periodica", "aleatoria"]
    fecha_desde: date
    fecha_hasta: date
    periodica: bool
    frecuencia_dias: int | None

    class Config:
        from_attributes = True
