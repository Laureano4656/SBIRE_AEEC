from typing import Literal
import datetime 

from pydantic import BaseModel

class EstudianteDashboardResponse(BaseModel):
    nombre: str
    apellido: str
    dni: str
    carrera: str
    porcentaje_carrera: float
    indice_riesgo: float | None
    estado_alerta: Literal["nueva", "en_revision", "resuelta", "intervenida", "falso_positivo"] | None
    ultima_fecha_recalculo: datetime.datetime | None
    