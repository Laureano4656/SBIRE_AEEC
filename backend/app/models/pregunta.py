from typing import Literal

from pydantic import BaseModel


class Pregunta(BaseModel):
    id: int
    encuesta_id: int | None
    texto: str | None
    tipo: Literal["texto_libre", "opcion_multiple", "escala", "si_no", "numero"]
    orden: int | None
    obligatoria: bool
    condicion_pregunta_id: int | None

    class Config:
        from_attributes = True
