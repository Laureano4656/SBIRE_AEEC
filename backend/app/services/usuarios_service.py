import asyncpg
from fastapi import HTTPException, status

from app.models.usuario import RolUsuario, Usuario
from app.repositories.usuario_repository import UsuarioRepository
from app.core.lti_handler import LTIHandler
from app.core.token_manager import TokenManager
from app.schemas.usuario import AuthResponse
from app.schemas.usuario import AuthResponse


class UsuarioService:
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.repo = UsuarioRepository(conn)

    @staticmethod
    def _normalize_optional(value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        return value or None

    async def obtener_por_id(self, id: int) -> Usuario:
        usuario = await self.repo.get_by_id(id)
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Usuario con id '{id}' no encontrado.",
            )
        return usuario

    async def obtener_por_moodle_id(self, moodle_id: str) -> Usuario | None:
        return await self.repo.get_by_moodle_id(moodle_id)

    async def upsert_desde_lti(self, token: str) -> AuthResponse:
        """
        Endpoint de launch de LTI 1.3.

        Recibe un JWT firmado por Moodle, lo valida, sincroniza el usuario,
        y retorna un token de sesión para futuras requests.

        Flujo:
        1. Validar JWT con JWKS de Moodle
        2. Extraer claims del usuario (moodle_id, rol, email, etc.)
        3. Upsert usuario en BD (crear o actualizar)
        4. Generar token de sesión
        5. Retornar token y datos del usuario
        """

        lti_handler = LTIHandler()
        try:
            payload = await lti_handler.validate_token(token)
            #logger.debug("LTI token validated successfully")
        except HTTPException as e:
            #logger.warning(f"LTI validation failed: {e.detail}")
            raise

        user_claims = LTIHandler.extract_user_claims(payload)
        #logger.debug(f"User claims extracted: moodle_id={user_claims['moodle_id']}, rol={user_claims['rol']}")
        moodle_id = user_claims["moodle_id"]
        if not moodle_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="moodle_id es requerido.",
            )
        print(f"Extracted claims: {user_claims}")
        # TODO mapear rol de LTI al rol del sistema
        rol=user_claims["rol"]
        
        # debo mapear el rol al rol del sistema
        # if rol == "student":
        #     rol = RolUsuario.estudiante
        # elif rol == "teacher":
        #     rol = RolUsuario.docente_tutor
        # else:
        #     rol = RolUsuario.
            
        nombre  =user_claims.get("nombre")
        apellido=user_claims.get("apellido")
        email=user_claims.get("email")
        carrera_id=user_claims.get("carrera_id")
        print (f"Mapped claims: rol={rol}, nombre={nombre}, apellido={apellido}, email={email}, carrera_id={carrera_id}")
        usuario =  await self.repo.upsert_from_lti(
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
            #logger.error(f"Error creating session token: {e}")
            raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error generando token de sesión.",
            )
            
            # 5. Retornar respuesta
        return AuthResponse(
            access_token=session_token,
            token_type="bearer",
            usuario={
                "id": usuario.id,
                "nombre": usuario.nombre,
                "moodle_id": usuario.moodle_id,
                "max_casos_activos": usuario.max_casos_activos,
                "activo": usuario.activo,
                "apellido": usuario.apellido,
                "email": usuario.email,
                "rol": usuario.rol,
                "carrera_id": usuario.carrera_id,
            },
        )
