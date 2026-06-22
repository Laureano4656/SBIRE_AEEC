from pydantic import BaseModel, Field

class RespuestaItem(BaseModel):
    """Una respuesta individual dentro del formulario masivo."""
    pregunta_id: int = Field(..., ge=1)
    materia_id: int | None = Field(None, ge=1)
    opcion_seleccionada_id: int | None = Field(None, ge=1)
    valor_numerico: float | None = None
    valor_texto: str | None = None

class EncuestaSubmit(BaseModel):
    """Payload completo que envía el frontend."""
    respuestas: list[RespuestaItem]
    es_envio_final: bool = Field(
        default=False, 
        description="True: cierra la encuesta. False: guarda como borrador."
    )
    es_actualizacion: bool = Field(
        default=False, 
        description="True: el alumno está corrigiendo una encuesta ya enviada."
    )

class RespuestaResponse(BaseModel):
    """Respuesta estándar para devoluciones de la API."""
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