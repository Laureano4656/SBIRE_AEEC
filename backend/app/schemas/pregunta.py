from typing import Literal, Any
from pydantic import BaseModel, Field

class PreguntaCreate(BaseModel):
    indicador_id: int | None = Field(None, ge=1)
    carrera_id: int | None = Field(None, ge=1)
    texto_pregunta: str = Field(..., min_length=5)
    evento_disparador: Literal[
        "unica_vez",
        "cuatrimestral_general",
        "anual",
        "inicio_cuatrimestre_acad",
        "fin_cuatrimestre_acad",
        "llamado_final_acad"
    ]
    tipo_pregunta: Literal["texto_libre", "opcion_multiple", "escala", "si_no", "numero"]
    configuracion_riesgo: dict[str, Any] | None = None
    activa: bool = True

class PreguntaUpdate(BaseModel):
    indicador_id: int | None = Field(None, ge=1)
    carrera_id: int | None = Field(None, ge=1)
    texto_pregunta: str | None = Field(None, min_length=5)
    evento_disparador: Literal[
        "unica_vez",
        "cuatrimestral_general",
        "anual",
        "inicio_cuatrimestre_acad",
        "fin_cuatrimestre_acad",
        "llamado_final_acad"
    ] | None = None
    tipo_pregunta: Literal["texto_libre", "opcion_multiple", "escala", "si_no", "numero"] | None = None
    configuracion_riesgo: dict[str, Any] | None = None
    activa: bool | None = None

class PreguntaResponse(BaseModel):
    id: int
    indicador_id: int | None
    carrera_id: int | None
    texto_pregunta: str
    evento_disparador: str
    tipo_pregunta: str
    configuracion_riesgo: dict[str, Any] | str | None
    activa: bool

    class Config:
        from_attributes = True
