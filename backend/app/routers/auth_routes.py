# app/routers/auth_routes.py
# ─────────────────────────────────────────────────────────────────────────────
# Rutas de autenticación
# LTI 1.3 launch endpoint y token refresh
# ─────────────────────────────────────────────────────────────────────────────

import logging

import asyncpg
from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_conn, get_current_user

from app.models.usuario import Usuario
from app.services.usuarios_service import UsuarioService
from app.schemas.usuario import(
    AuthResponse,
    LTILaunchRequest

)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])




@router.post("/lti/launch", response_model=AuthResponse)
async def lti_launch(
    request: LTILaunchRequest,
    conn: asyncpg.Connection = Depends(get_conn),
) -> AuthResponse:

    token = request.id_token

    # 1. Validar token de LTI
    
    # 3. Upsert usuario en BD
    try:
        usuario_service = UsuarioService(conn)
        response = await usuario_service.upsert_desde_lti(token)
        #logger.info(f"User upserted: id={usuario.id}, moodle_id={usuario.moodle_id}")
    except HTTPException as e:
        logger.error(f"Error upserting user: {e.detail}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error upserting user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error procesando autenticación.",
        )
    return response



# @router.post("/refresh", response_model=AuthResponse)
# async def refresh_token(
#     current_user: Usuario = Depends(get_current_user),
# ) -> AuthResponse:
#     """
#     Refresca el token de sesión del usuario actual.

#     Requiere un token válido en el header Authorization.
#     """
#     # Generar nuevo token
#     new_token = TokenManager.create_session_token(current_user)

#     return AuthResponse(
#         access_token=new_token,
#         token_type="bearer",
#         usuario={
#             "id": current_user.id,
#             "nombre": current_user.nombre,
#             "apellido": current_user.apellido,
#             "email": current_user.email,
#             "rol": current_user.rol.value,
#             "carrera_id": current_user.carrera_id,
#         },
#     )


# @router.get("/me")
# async def get_current_user_info(
#     current_user: Usuario = Depends(get_current_user),
# ) -> dict:
#     """
#     Retorna la información del usuario autenticado actual.
#     """
#     return {
#         "id": current_user.id,
#         "nombre": current_user.nombre,
#         "apellido": current_user.apellido,
#         "email": current_user.email,
#         "rol": current_user.rol.value,
#         "carrera_id": current_user.carrera_id,
#         "activo": current_user.activo,
#         "creado_en": current_user.creado_en,
#         "actualizado_en": current_user.actualizado_en,
#     }
