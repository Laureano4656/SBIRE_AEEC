import datetime 

from pydantic import BaseModel

class EstudianteDashboardResponse(BaseModel):
    nombre: str
    apellido: str
    dni: str
    carrera: str
    porcentaje_carrera: float | None
    indice_riesgo: float | None
    estado_alerta: str | None
    ultima_fecha_recalculo: datetime.datetime | None
    