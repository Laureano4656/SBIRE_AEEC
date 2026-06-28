from datetime import datetime
from pydantic import BaseModel, Field

class ReporteResponse(BaseModel):
    legajo: str
    nombre: str
    apellido: str
    carrera: str
    cursada: int
    riesgo: float
    fecha_riesgo: datetime
    aprobadas: int
    totales: int