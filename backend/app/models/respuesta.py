from datetime import datetime

from pydantic import BaseModel


class Respuesta(BaseModel):
    id: int
    asignacion_id: int | None
    pregunta_id: int | None
    opcion_id: int | None
    texto_libre: str | None
    valencia: int | None
    fecha_respuesta: datetime | None

    class Config:
        from_attributes = True
