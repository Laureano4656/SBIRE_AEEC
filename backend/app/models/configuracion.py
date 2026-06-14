from pydantic import BaseModel
from typing import Dict, List
from app.models.comparacion import Comparacion

class DatosConfiguracion(BaseModel):
    carrera_id: int
    etapa: str 
    umbral_amarillo: float
    umbral_rojo: float
    factor_extension: float
    descripcion: str
    actualizado_por: int

class AHPRequest(BaseModel):
    nodo_raiz: str
    jerarquia: dict[str, list[str]]
    comparaciones_por_nodo: dict[str, list[Comparacion]]