# app/core/token_manager.py
# ─────────────────────────────────────────────────────────────────────────────
# Gestión de tokens JWT de sesión
# Genera y valida tokens para usuarios autenticados vía LTI
# ─────────────────────────────────────────────────────────────────────────────

import logging
from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from jwt import PyJWTError

from app.core.config import settings
from app.models.usuario import RolUsuario, Usuario

logger = logging.getLogger(__name__)

# TTL para tokens de sesión (24 horas)
SESSION_TOKEN_EXPIRY = timedelta(hours=24)


class TokenManager:
    """Gestiona generación y validación de tokens JWT de sesión."""

    @staticmethod
    def create_session_token(usuario: Usuario) -> str:
        """
        Crea un token JWT de sesión para un usuario autenticado.

        El token contiene:
        - sub: usuario.id (subject)
        - moodle_id: usuario.moodle_id
        - rol: usuario.rol
        - carrera_id: usuario.carrera_id
        - exp: tiempo de expiración
        """
        now = datetime.now(timezone.utc)
        expires_at = now + SESSION_TOKEN_EXPIRY

        payload = {
            "sub": str(usuario.id),
            "moodle_id": usuario.moodle_id,
            "rol": usuario.rol.value,
            "carrera_id": usuario.carrera_id,
            "email": usuario.email,
            "iat": now,
            "exp": expires_at,
        }

        token = jwt.encode(
            payload,
            settings.JWT_SECRET_KEY,
            algorithm="HS256",
        )

        logger.debug(f"Session token created for user {usuario.id}")
        return token

    @staticmethod
    def validate_session_token(token: str) -> dict[str, Any]:
        """
        Valida un token JWT de sesión.

        Retorna el payload si es válido.

        Raises:
            jwt.ExpiredSignatureError si el token expiró
            jwt.InvalidSignatureError si la firma es inválida
            PyJWTError si hay otros errores
        """
        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                algorithms=["HS256"],
            )
            return payload
        except jwt.ExpiredSignatureError:
            logger.warning("Session token expired")
            raise
        except jwt.InvalidSignatureError:
            logger.warning("Invalid session token signature")
            raise
        except PyJWTError as e:
            logger.warning(f"JWT validation error: {e}")
            raise

    @staticmethod
    def extract_user_id_from_token(token: str) -> int | None:
        """
        Extrae el ID del usuario del token sin validar la firma.
        Útil para debugging.
        """
        try:
            payload = jwt.decode(token, options={"verify_signature": False})
            user_id = payload.get("sub")
            return int(user_id) if user_id else None
        except (PyJWTError, ValueError):
            return None
