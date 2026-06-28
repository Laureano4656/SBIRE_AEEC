from datetime import datetime
from pydantic import BaseModel, Field

class ReporteResponse(BaseModel):
    legajo: str
    nombre: str
    apellido: str
    carrera: str
    cursada: int
    riesgo: float | None = Field(default=None, description="Valor de riesgo del estudiante")
    fecha_riesgo: datetime | None = Field(default=None, description="Fecha en la que se calculó el riesgo del estudiante")
    aprobadas: int
    totales: int
    
    class Config:
        from_attributes = True