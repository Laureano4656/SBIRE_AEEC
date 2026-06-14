from datetime import datetime
from enum import Enum

from pydantic import BaseModel


class RolUsuario(str, Enum):
    administrador = "administrador"
    admin_departamental = "admin_departamental"
    docente_carga = "docente_carga"
    docente_tutor = "docente_tutor"
    asesor_par = "asesor_par"
    estudiante = "estudiante"


class Usuario(BaseModel):
    """Representa una fila completa de la tabla `usuarios`."""

    id: int
    carrera_id: int | None
    nombre: str
    apellido: str
    email: str
    moodle_id: str
    rol: RolUsuario
    max_casos_activos: int | None
    activo: bool
    creado_en: datetime
    actualizado_en: datetime

    class Config:
        from_attributes = True
