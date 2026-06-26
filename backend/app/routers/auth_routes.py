# app/routers/auth_routes.py
# ─────────────────────────────────────────────────────────────────────────────
# Rutas de autenticación
# LTI 1.3 launch endpoint y token refresh
# ─────────────────────────────────────────────────────────────────────────────

import logging
import uuid
from fastapi import Cookie, Form
import asyncpg
from fastapi.responses import HTMLResponse, RedirectResponse
from urllib.parse import urlencode
from fastapi import APIRouter, Depends, Query, Response, Request, HTTPException, status
from pydantic import BaseModel

from app.api.deps import get_conn, get_current_user

from app.services.usuarios_service import UsuarioService

from app.models.usuario import Usuario
from app.core.config import settings
logger = logging.getLogger(__name__)


router = APIRouter(prefix="/auth", tags=["auth"])




@router.post("/lti/launch")
async def lti_launch(
    id_token: str = Form(...),
    state: str = Form(...),
    lti_state: str = Cookie(None),
    conn: asyncpg.Connection = Depends(get_conn),
) -> RedirectResponse:
    """
    Receives the LTI 1.3 launch token directly from Moodle as form fields.
    Redirects to the frontend with the session token in the URL so the
    frontend can set the httpOnly cookie through the Vite proxy (same-origin).
    """
    # --- TEMPORARY DEBUG PRINT ---
    print("--- CSRF VALIDATION DEBUG ---")
    print(f"Form State Received:  {state}")
    print(f"Cookie State Found:   {lti_state}")
    print("-----------------------------")

    try:
        usuario_service = UsuarioService(conn)
        auth_response = await usuario_service.upsert_desde_lti(id_token)

        frontend_url = f"{settings.FRONTEND_URL}/auth/callback?access_token={auth_response.access_token}"
        html_content = f"""<!DOCTYPE html>
<html>
<head><title>Redirigiendo...</title></head>
<body>
<script>
if (window.top !== window.self) {{
    window.top.location.href = "{frontend_url}";
}} else {{
    window.location.href = "{frontend_url}";
}}
</script>
</body>
</html>"""
        return HTMLResponse(content=html_content, status_code=200)

    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error crítico en LTI Launch handling: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error procesando autenticación interna: {e}"
        )


class SetSessionRequest(BaseModel):
    access_token: str


@router.post("/set-session")
async def set_session(payload: SetSessionRequest, response: Response):
    """
    Validates the token and sets it as an httpOnly cookie.
    Called by the frontend through the Vite proxy so the cookie
    is associated with the frontend's origin (port 5173).
    """
    from app.core.token_manager import TokenManager
    try:
        TokenManager.validate_session_token(payload.access_token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado.",
        )

    response.set_cookie(
        key="access_token",
        value=payload.access_token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=86400,
        path="/",
    )
    return {"message": "Sesión establecida"}


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        path="/",
        httponly=True,
        samesite="lax",
        secure=False,
    )
    return {"message": "Sesión cerrada"}




@router.api_route("/lti/login", methods=["GET", "POST"])
async def lti_login(request: Request, response: Response):
    """
    OIDC Third-Party Login Endpoint.
    Extracts data safely from query parameters or form fields without strict validation constraints.
    """
    # 1. Pull parameters dynamically depending on how Moodle sent them
    if request.method == "POST":
        form_data = await request.form()
        iss = form_data.get("iss")
        login_hint = form_data.get("login_hint")
        lti_message_hint = form_data.get("lti_message_hint")
        client_id = form_data.get("client_id")
    else:
        iss = request.query_params.get("iss")
        login_hint = request.query_params.get("login_hint")
        lti_message_hint = request.query_params.get("lti_message_hint")
        client_id = request.query_params.get("client_id")

    # 2. Manual guard validation check with an explicit, helpful error
    if not all([iss, login_hint, lti_message_hint, client_id]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "Missing LTI parameters",
                "received": {
                    "iss": iss,
                    "login_hint": login_hint,
                    "lti_message_hint": lti_message_hint,
                    "client_id": client_id
                }
            }
        )

    # 3. Security state tracking values
    state = str(uuid.uuid4())
    nonce = str(uuid.uuid4())

    # 4. Save your state anti-CSRF token in a temporary cookie
    response.set_cookie(
        key="lti_state",
        value=state,
        max_age=300,
        httponly=True,
        samesite="lax",   # Change from "none" to "lax" for local HTTP cross-port stability
        secure=False,     # Keep False because we are testing on unencrypted http://
        path="/"          # Ensure it is accessible across all API endpoints
    )

    # 5. Build the exact payload query parameters Moodle expects to verify
    auth_params : any = {
        "scope": "openid",
        "response_type": "id_token",
        "client_id": client_id,
        "redirect_uri": settings.REDIRECT_URI,
        "login_hint": login_hint,
        "lti_message_hint": lti_message_hint,
        "state": state,
        "nonce": nonce,
        "response_mode": "form_post"
    }

    # 6. Execute the redirect back to Moodle
    redirect_url = f"{settings.MOODLE_AUTH_URL}?{urlencode(auth_params)}"
    return RedirectResponse(url=redirect_url, status_code=status.HTTP_302_FOUND)


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


@router.get("/me")
async def get_current_user_info(
    current_user: Usuario = Depends(get_current_user),
) -> dict:
    """
    Retorna la información del usuario autenticado actual.
    """
    return {
        "id": current_user.id,
        "nombre": current_user.nombre,
        "apellido": current_user.apellido,
        "email": current_user.email,
        "rol": current_user.rol.value,
        "carrera_id": current_user.carrera_id,
        "activo": current_user.activo,
        "creado_en": current_user.creado_en,
        "actualizado_en": current_user.actualizado_en,
    }
