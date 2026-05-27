# app/core/lti_handler.py
# ─────────────────────────────────────────────────────────────────────────────
# LTI 1.3 authentication handler
# Validates JWT tokens signed by Moodle and extracts user claims
# ─────────────────────────────────────────────────────────────────────────────

import json
import logging
from datetime import datetime, timedelta
from typing import Any

import httpx
import jwt
from fastapi import HTTPException, status
from jwt import PyJWTError

from app.core.config import settings
from app.models.usuario import RolUsuario

logger = logging.getLogger(__name__)


class LTIHandler:
    """
    Valida y procesa tokens JWT de LTI 1.3 emitidos por Moodle.

    Incluye cache de JWKS para evitar llamadas repetidas a Moodle.
    """

    def __init__(self, jwks_url: str = settings.LTI_JWKS_URL):
        self.jwks_url = jwks_url
        self._jwks_cache: dict[str, Any] | None = None
        self._jwks_cache_expires: datetime | None = None
        self._cache_ttl = timedelta(hours=24)

    async def _fetch_jwks(self) -> dict[str, Any]:
        """Obtiene y cachea el JWKS de Moodle."""
        now = datetime.now()

        # Si el cache es válido, devolverlo
        if (
            self._jwks_cache is not None
            and self._jwks_cache_expires is not None
            and now < self._jwks_cache_expires
        ):
            return self._jwks_cache

        # Fetch nuevo JWKS de Moodle
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(self.jwks_url, timeout=10)
                response.raise_for_status()

                jwks = response.json()
                self._jwks_cache = jwks
                self._jwks_cache_expires = now + self._cache_ttl
                logger.info("JWKS fetched and cached from Moodle")
                return jwks
        except httpx.HTTPError as e:
            logger.error(f"Error fetching JWKS from Moodle: {e}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="No se pudo obtener las claves de Moodle. Intente más tarde.",
            )

    def _get_key_from_jwks(self, kid: str, jwks: dict[str, Any]) -> dict[str, Any]:
        """
        Obtiene la clave pública del JWKS usando el key id (kid).
        """
        keys = jwks.get("keys", [])
        for key in keys:
            if key.get("kid") == kid:
                return key

        logger.warning(f"Key with kid '{kid}' not found in JWKS")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token no válido: clave no encontrada.",
        )

    def _convert_jwks_key_to_pem(self, key: dict[str, Any]) -> str:
        """
        Convierte una clave JWK a formato PEM para validación con PyJWT.
        """
        try:
            from jwt.algorithms import RSAAlgorithm

            return RSAAlgorithm.from_jwk(json.dumps(key))  # type: ignore[return-value]
        except Exception as e:
            logger.error(f"Error converting JWK to PEM: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token no válido: no se pudo procesar la clave.",
            )

    async def validate_token(self, token: str) -> dict[str, Any]:
        """
        Valida un token JWT de LTI 1.3.

        Retorna el payload decodificado si es válido.

        Raises:
            HTTPException si el token no es válido.
        """
        # Obtener headers sin validar primero (para extraer kid)
        try:
            unverified_header = jwt.get_unverified_header(token)
            kid = unverified_header.get("kid")

            if not kid:
                logger.warning("Token JWT sin 'kid' en header")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token no válido: sin identificador de clave.",
                )
        except PyJWTError as e:
            logger.warning(f"Error decoding JWT header: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token no válido: no es un JWT válido.",
            )

        # Obtener JWKS de Moodle
        jwks = await self._fetch_jwks()

        # Obtener la clave pública
        key_data = self._get_key_from_jwks(kid, jwks)
        public_key = self._convert_jwks_key_to_pem(key_data)

        # Validar y decodificar token
        try:
            payload = jwt.decode(
                token,
                public_key,
                algorithms=["RS256"],
                audience=settings.LTI_CLIENT_ID,
            )
            return payload
        except jwt.ExpiredSignatureError:
            logger.warning("LTI token expirado")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expirado.",
            )
        except jwt.InvalidAudienceError:
            logger.warning(f"Invalid audience in token. Expected: {settings.LTI_CLIENT_ID}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token no válido: audience inválido.",
            )
        except PyJWTError as e:
            logger.warning(f"JWT validation error: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token no válido.",
            )

    @staticmethod
    def extract_user_claims(payload: dict[str, Any]) -> dict[str, Any]:
        """
        Extrae información del usuario del payload de LTI.

        Retorna:
            {
                'moodle_id': str,
                'email': str | None,
                'nombre': str | None,
                'apellido': str | None,
                'rol': RolUsuario,
                'carrera_id': int | None,
            }
        """
        # moodle_id: viene como 'sub' (subject) en LTI 1.3
        moodle_id = payload.get("sub")
        if not moodle_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token incompleto: falta identificador de usuario.",
            )

        # Email
        email = payload.get("email")

        # Nombre y apellido (pueden venir en 'name' o como campos separados)
        name = payload.get("name", "").strip()
        nombre = None
        apellido = None

        if name:
            parts = name.split(maxsplit=1)
            nombre = parts[0] if len(parts) > 0 else None
            apellido = parts[1] if len(parts) > 1 else None
        else:
            nombre = payload.get("given_name")
            apellido = payload.get("family_name")

        # Rol: viene en el claim 'roles' como array de URIs
        # Mapear roles de Moodle a nuestros roles internos
        lti_roles = payload.get("https://purl.imsglobal.org/spec/lti/claim/roles", [])
        rol = LTIHandler._map_lti_roles_to_internal(lti_roles)

        # carrera_id: generalmente no viene en LTI, se sincroniza manualmente en BD
        carrera_id = None

        return {
            "moodle_id": moodle_id,
            "email": email,
            "nombre": nombre,
            "apellido": apellido,
            "rol": rol,
            "carrera_id": carrera_id,
        }

    @staticmethod
    def _map_lti_roles_to_internal(lti_roles: list[str]) -> RolUsuario:
        """
        Mapea roles de LTI 1.3 a roles internos de SBIRE.

        Roles de LTI vienen como URIs como:
        - http://purl.imsglobal.org/vocab/lis/v2/institution/person#Administrator
        - http://purl.imsglobal.org/vocab/lis/v2/institution/person#Instructor
        - http://purl.imsglobal.org/vocab/lis/v2/institution/person#Student
        """
        # Procesar en orden de prioridad (admin > docente > estudiante)
        for role_uri in lti_roles:
            if "Administrator" in role_uri:
                return RolUsuario.administrador
            elif "Instructor" in role_uri:
                # Instructor en Moodle = docente_carga o docente_tutor según contexto
                # Por defecto asignamos docente_carga
                return RolUsuario.docente_carga
            elif "CourseCoordinator" in role_uri or "ContentDeveloper" in role_uri:
                return RolUsuario.admin_departamental

        # Por defecto, estudiante
        return RolUsuario.estudiante
