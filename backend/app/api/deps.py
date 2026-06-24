# app/api/deps.py
# ─────────────────────────────────────────────────────────────────────────────
# Inyección de dependencias para endpoints
# ─────────────────────────────────────────────────────────────────────────────

import logging

import asyncpg
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.database import get_pool
from app.core.token_manager import TokenManager
from app.models.usuario import RolUsuario, Usuario
from app.repositories.usuario_repository import UsuarioRepository

logger = logging.getLogger(__name__)

security = HTTPBearer()
security_optional = HTTPBearer(auto_error=False)


async def get_conn() -> asyncpg.Connection:  # type: ignore[no-untyped-def]
    """Adquiere conexión del pool, la libera al terminar el request."""
    async with get_pool().acquire() as conn:
        yield conn


async def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(security_optional),
    conn: asyncpg.Connection = Depends(get_conn),
) -> Usuario:
    """
    Valida el token JWT de sesión y retorna el usuario autenticado.

    El token se lee del header Authorization: Bearer <token>
    o, en su defecto, de la cookie httpOnly access_token.

    Levanta HTTPException si:
    - El token es inválido o expirado
    - El usuario no existe o está inactivo
    """
    # Try Authorization header first
    token = credentials.credentials if credentials else None

    # Fall back to cookie
    if not token:
        token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No autenticado.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Validar token
    try:
        payload = TokenManager.validate_session_token(token)
    except Exception as e:
        logger.warning(f"Invalid token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token no válido o expirado.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Extraer user_id del token
    user_id = payload.get("sub")
    if not user_id:
        logger.warning("Token sin user_id")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token no válido.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Obtener usuario de la BD
    try:
        usuario_id = int(user_id)
    except ValueError:
        logger.warning(f"Invalid user_id format: {user_id}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token no válido.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    repo = UsuarioRepository(conn)
    usuario = await repo.get_by_id(usuario_id)

    if not usuario:
        logger.warning(f"User {usuario_id} not found")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not usuario.activo:
        logger.warning(f"User {usuario_id} is inactive")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo.",
        )

    return usuario


async def get_current_user_optional(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(security_optional),
    conn: asyncpg.Connection = Depends(get_conn),
) -> Usuario | None:
    """
    Like get_current_user, pero retorna None si no hay token
    o el token es inválido/expirado. Útil para endpoints que
    se comportan distinto para usuarios autenticados vs anónimos.
    """
    # Try Authorization header first
    token = credentials.credentials if credentials else None

    # Fall back to cookie
    if not token:
        token = request.cookies.get("access_token")

    if not token:
        return None

    try:
        payload = TokenManager.validate_session_token(token)
    except Exception:
        return None

    user_id = payload.get("sub")
    if not user_id:
        return None

    try:
        usuario_id = int(user_id)
    except ValueError:
        return None

    repo = UsuarioRepository(conn)
    usuario = await repo.get_by_id(usuario_id)

    if not usuario or not usuario.activo:
        return None

    return usuario


def require_roles(*roles: RolUsuario):
    """
    Factory que retorna un Depends para verificar roles.
    Uso: Depends(require_roles(RolUsuario.administrador, RolUsuario.docente))
    """
    async def _role_checker(
        current_user: Usuario = Depends(get_current_user),
    ) -> Usuario:
        if current_user.rol not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos para acceder a este recurso.",
            )
        return current_user
    return _role_checker
