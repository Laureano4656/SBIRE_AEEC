from datetime import datetime

from pydantic import BaseModel


class AsignacionEncuesta(BaseModel):
    id: int
    encuesta_id: int | None
    estudiante_id: int | None
    fecha_asignacion: datetime
    completada: bool
    fecha_completada: datetime | None

    class Config:
        from_attributes = True
