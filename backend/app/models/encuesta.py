from datetime import datetime
from typing import Literal
from pydantic import BaseModel

class AsignacionEncuesta(BaseModel):
    id: int
    estudiante_id: int
    evento_disparador: str
    periodo_lectivo: str
    estado: Literal['Pendiente', 'Completada', 'Pendiente_Actualizacion']
    fecha_asignacion: datetime

    class Config:
        from_attributes = True

class RespuestaEstudiante(BaseModel):
    id: int
    asignacion_id: int
    pregunta_id: int
    materia_id: int | None
    opcion_seleccionada_id: int | None
    valor_numerico: float | None
    valor_texto: str | None
    riesgo_calculado: float | None

    class Config:
        from_attributes = True
