from datetime import datetime

from pydantic import BaseModel

from app.models.usuario import RolUsuario


class MeResponse(BaseModel):
    id: int
    nombre: str
    apellido: str
    email: str
    rol: RolUsuario
    carrera_id: int
    activo: bool
    creado_en: datetime
    actualizado_en: datetime
