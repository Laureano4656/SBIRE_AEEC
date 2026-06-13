from datetime import datetime
from pydantic import BaseModel, Field

class RespuestaCreate(BaseModel):
    asignacion_id: int | None = Field(None, ge=1)
    pregunta_id: int | None = Field(None, ge=1)
    opcion_id: int | None = Field(None, ge=1)
    texto_libre: str | None = None
    # --- Campos exclusivos de la IA ---
    nivel_riesgo: float | None = None
    motivo_riesgo: str | None = None
    confianza: int | None = None
    # ----------------------------------
    fecha_respuesta: datetime | None = None

class RespuestaUpdate(BaseModel):
    asignacion_id: int | None = Field(None, ge=1)
    pregunta_id: int | None = Field(None, ge=1)
    opcion_id: int | None = Field(None, ge=1)
    texto_libre: str | None = None 
    # --- Campos exclusivos de la IA ---
    nivel_riesgo: float | None = None
    motivo_riesgo: str | None = None
    confianza: int | None = None
    # ----------------------------------
    fecha_respuesta: datetime | None = None

class RespuestaResponse(BaseModel):
    id: int
    asignacion_id: int | None
    pregunta_id: int | None
    opcion_id: int | None
    texto_libre: str | None
    # --- Campos exclusivos de la IA ---
    nivel_riesgo: float | None
    motivo_riesgo: str | None
    confianza: int | None
    # ---------------------------------- 
    fecha_respuesta: datetime | None

    class Config:
        from_attributes = True