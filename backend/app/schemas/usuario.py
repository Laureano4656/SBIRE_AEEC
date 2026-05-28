from pydantic import BaseModel

from app.models.usuario import RolUsuario


class UsuarioResponse(BaseModel):
    """Respuesta estándar de Usuario."""

    id: int
    carrera_id: int | None
    nombre: str
    apellido: str
    email: str
    moodle_id: str
    rol: RolUsuario
    max_casos_activos: int | None
    activo: bool

    class Config:
        from_attributes = True

class LTILaunchRequest(BaseModel):
    """Solicitud de launch de LTI con el token JWT."""

    id_token: str


class AuthResponse(BaseModel):
    """Respuesta con el token de sesión."""

    access_token: str
    token_type: str = "bearer"
    usuario: dict  # resumen del usuario