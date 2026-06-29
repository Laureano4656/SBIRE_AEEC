from datetime import datetime
from pydantic import BaseModel, Field


class RespuestaPendienteResponse(BaseModel):
    respuesta_id: int
    asignacion_id: int
    estudiante_id: int
    legajo: str
    nombre_completo: str
    texto_pregunta: str
    valor_texto: str
    fecha_asignacion: datetime | None

    class Config:
        from_attributes = True


class AprobarRevisionRequest(BaseModel):
    riesgo_calculado: float = Field(ge=0.0, le=1.0)
