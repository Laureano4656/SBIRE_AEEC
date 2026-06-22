from pydantic import BaseModel

class RespuestaEstudiante(BaseModel):
    """Representa una fila completa de la tabla respuesta_estudiante"""
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
