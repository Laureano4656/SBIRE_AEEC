from datetime import datetime

from pydantic import BaseModel, Field


class EstudianteDashboardAdminResponse(BaseModel):
    nombre: str
    apellido: str
    dni: str
    carrera: str
    etapa: str
    porcentaje_carrera: float | None
    indice_riesgo: float | None
    estado_alerta: str | None
    ultima_fecha_recalculo: datetime | None


class GeneralEstudianteDashboardAdminResponse(BaseModel):
    nombre: str
    apellido: str
    anio: int
    carrera: str
    materias_aprobadas: int
    materias_totales: int
    score_riesgo: float | None


class EventoCronologicoResponse(BaseModel):
    tipo: str
    descripcion: str
    fecha: datetime


class PreguntasRespuestasResponse(BaseModel):
    pregunta: str
    respuesta: str


class Config:
    from_attributes = True

    from pydantic import BaseModel


class FiltroRiesgo(BaseModel):
    carrera_id: int
    anio: int


class FiltroEstudiantes(BaseModel):
    anio: int | None = None
    carrera_id: int | None = None


class IndicadorResponse(BaseModel):
    nombre: str


class DimensionAgrupadaResponse(BaseModel):
    nombre_dimension: str
    indicadores: list[IndicadorResponse]


class RolUpdate(BaseModel):
    nombre: str


class CrearUsuarioRequest(BaseModel):
    nombre: str
    apellido: str
    email: str
    rol: str
    carrera_id: int | None = None
    moodle_id: str | None = None


class ActualizarUsuarioRequest(BaseModel):
    nombre: str | None = None
    apellido: str | None = None
    email: str | None = None
    rol: str | None = None
    carrera_id: int | None = None
    moodle_id: str | None = None
    max_casos_activos: int | None = None
