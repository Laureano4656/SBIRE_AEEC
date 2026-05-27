# app/api/deps.py
# ─────────────────────────────────────────────────────────────────────────────
# Inyección de dependencias para endpoints
# ─────────────────────────────────────────────────────────────────────────────

import logging

import asyncpg
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.database import get_pool
from app.core.token_manager import TokenManager
from app.models.usuario import Usuario
from app.repositories.usuario_repository import UsuarioRepository

logger = logging.getLogger(__name__)

security = HTTPBearer()


async def get_conn() -> asyncpg.Connection:  # type: ignore[no-untyped-def]
    """Adquiere conexión del pool, la libera al terminar el request."""
    async with get_pool().acquire() as conn:
        yield conn


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    conn: asyncpg.Connection = Depends(get_conn),
) -> Usuario:
    """
    Valida el token JWT de sesión y retorna el usuario autenticado.

    El token debe enviarse en el header:
        Authorization: Bearer <token>

    Levanta HTTPException si:
    - El token es inválido o expirado
    - El usuario no existe o está inactivo
    """
    token = credentials.credentials

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
