from typing import Literal
import datetime 

from pydantic import BaseModel

class GeneralEstudianteDashboardResponse(BaseModel):
    nombre: str
    apellido: str
    anio: str
    carrera: str
    materias_aprobadas: int
    materias_totales: int
    score_riesgo: float
    
    
    