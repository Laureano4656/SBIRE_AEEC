import asyncpg
from fastapi import HTTPException, status
from app.models.usuario import RolUsuario, Usuario
from app.repositories.usuario_repository import UsuarioRepository
from app.services.crud_service import CrudService
from app.core.lti_handler import LTIHandler
from app.core.token_manager import TokenManager
from app.schemas.usuario import AuthResponse, UsuarioResponse

class UsuarioService(CrudService[Usuario]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(UsuarioRepository(conn), "Usuario")

    @staticmethod
    def _normalize_optional(value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        return value or None

    async def obtener_por_moodle_id(self, moodle_id: str) -> Usuario | None:
        return await self.repo.get_by_moodle_id(moodle_id)  # type: ignore

    async def upsert_desde_lti(self, token: str) -> AuthResponse:
        lti_handler = LTIHandler()
        try:
            payload = await lti_handler.validate_token(token)
        except HTTPException as e:
            raise

        user_claims = LTIHandler.extract_user_claims(payload)
        moodle_id = user_claims["moodle_id"]
        if not moodle_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="moodle_id es requerido.",
            )
        print(f"Extracted claims: {user_claims}")
        rol = user_claims["rol"]

        nombre = user_claims.get("nombre")
        apellido = user_claims.get("apellido")
        email = user_claims.get("email")
        carrera_id = user_claims.get("carrera_id")
        print (f"Mapped claims: rol={rol}, nombre={nombre}, apellido={apellido}, email={email}, carrera_id={carrera_id}")

        usuario: Usuario = await self.repo.create(  # type: ignore
            moodle_id=moodle_id,
            rol=rol,
            nombre=self._normalize_optional(nombre),
            apellido=self._normalize_optional(apellido),
            email=self._normalize_optional(email),
            carrera_id=carrera_id,
            max_casos_activos=5 if rol == RolUsuario.estudiante else None,
        )
        try:
            session_token = TokenManager.create_session_token(usuario)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error generando token de sesión.",
            )

        return AuthResponse(
            access_token=session_token,
            token_type="bearer",
            usuario=UsuarioResponse.model_validate(usuario),
        )
