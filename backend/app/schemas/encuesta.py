from pydantic import BaseModel, Field
from typing import Any
from app.schemas.pregunta import PreguntaResponse

# --- SCHEMAS DE OPCIONES Y RESPUESTAS PREVIAS ---


class OpcionEncuestaResponse(BaseModel):
    """La opción limpia, sin exponer los valores de riesgo al estudiante."""

    id: int
    pregunta_id: int
    texto_opcion: str


class RespuestaPrevia(BaseModel):
    """Estructura para pre-cargar lo que el alumno ya había contestado."""

    pregunta_id: int
    materia_id: int | None = None
    opcion_seleccionada_id: int | None = None
    valor_numerico: float | None = None
    valor_texto: str | None = None


class PreguntaParaEncuesta(PreguntaResponse):
    """Hereda todo de PreguntaResponse pero le incrusta las opciones y su estado actual."""

    opciones: list[OpcionEncuestaResponse] = Field(default_factory=list)
    respuesta_previa: RespuestaPrevia | None = None


# --- SCHEMAS DE SALIDA (Generación del Formulario) ---


class BloqueAcademico(BaseModel):
    materia_id: int
    materia_nombre: str
    preguntas: list[PreguntaParaEncuesta]


class FormularioEncuestaResponse(BaseModel):
    asignacion_id: int
    evento_disparador: int
    periodo_lectivo: str
    preguntas_generales: list[PreguntaParaEncuesta] = Field(default_factory=list)
    bloques_academicos: list[BloqueAcademico] = Field(default_factory=list)


class AsignacionEncuestaResponse(BaseModel):
    id: int
    estudiante_id: int
    evento_disparador: int
    periodo_lectivo: str
    completado: bool


# --- SCHEMAS DE ENTRADA (Recepción de Respuestas) ---


class RespuestaItemSubmit(BaseModel):
    """Una respuesta individual del estudiante."""

    pregunta_id: int
    materia_id: int | None = None
    opcion_seleccionada_id: int | None = None
    valor_numerico: float | None = None
    valor_texto: str | None = None


class EncuestaSubmit(BaseModel):
    """Payload que envía el frontend al hacer submit."""

    respuestas: list[RespuestaItemSubmit]


class MateriaResponse(BaseModel):
    """Representa una materia con su id y nombre."""

    materia_id: int
    materia_nombre: str


class EstadisticaEventoResponse(BaseModel):
    evento_id: int
    nombre_evento: str
    total_asignadas: int
    total_completadas: int
    periodicidad_evento: str | None = None


class RespuestaDetalle(BaseModel):
    pregunta_id: int
    texto_pregunta: str
    materia_nombre: str | None
    opcion_texto: str | None
    valor_numerico: float | None
    valor_texto: str | None


class EncuestaEstudianteDetalle(BaseModel):
    estudiante_id: int
    legajo: str
    nombre_completo: str
    asignacion_id: int
    periodo_lectivo: str
    respuestas: list[RespuestaDetalle] = []


class EncuestaHistoricoResponse(FormularioEncuestaResponse):
    """
    Hereda toda la estructura de preguntas_generales y bloques_academicos,
    sumando los datos del estudiante para la vista de listado histórico.
    """

    estudiante_id: int
    legajo: str
    nombre_completo: str
