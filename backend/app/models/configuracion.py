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
    nodo_raiz: int
    jerarquia: Dict[int, List[int]]
    comparaciones_por_nodo: Dict[int, List[Comparacion]]
    configuracion: DatosConfiguracion

class AHPResponse(BaseModel):
    id_configuracion: int
    pesos_globales: Dict[int, float]  
    consistencia_matrices: Dict[int, float]