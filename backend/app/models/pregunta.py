from typing import Literal, Any
from pydantic import BaseModel

class Pregunta(BaseModel):
    id: int
    indicador_id: int | None
    carrera_id: int | None
    texto_pregunta: str
    evento_disparador: Literal[
        "unica_vez",
        "cuatrimestral_general",
        "anual",
        "inicio_cuatrimestre_acad",
        "fin_cuatrimestre_acad",
        "llamado_final_acad"
    ]
    tipo_pregunta: Literal["texto_libre", "opcion_multiple", "escala", "si_no", "numero"]
    configuracion_riesgo: dict[str, Any] | str | None
    activa: bool

    class Config:
        from_attributes = True