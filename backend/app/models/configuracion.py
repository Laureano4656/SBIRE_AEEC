from datetime import datetime
from pydantic import BaseModel
from typing import Dict, List, Any
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

class PreguntaResponse(BaseModel):
    id: int
    texto_pregunta: str
    tipo_pregunta: str

class IndicadorResponse(BaseModel):
    id: int
    nombre: str
    preguntas: list[PreguntaResponse] = []

class DimensionResponse(BaseModel):
    id: int
    nombre: str
    indicadores: list[IndicadorResponse] = []

class ConfiguracionIndicadorResponse(BaseModel):
    id: int
    carrera_id: int
    etapa: str
    umbral_amarillo: float
    umbral_rojo: float
    factor_extension: float
    descripcion: str | None = None
    activo: bool
    actualizado_en: datetime
    actualizado_por: int | None = None
    valores_saaty_crudos: dict[str, Any] | None = None
