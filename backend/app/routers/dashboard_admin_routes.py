from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
import asyncpg

from app.api.deps import get_conn
from app.services.dashboard_admin_service import DashboardAdminService
from app.schemas.usuario import UsuarioResponse
from app.schemas.dashboard_admin_dep import RolUpdate

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/usuarios", response_model=list[UsuarioResponse], status_code=status.HTTP_200_OK)
async def obtener_usuarios(
    conn: asyncpg.Connection = Depends(get_conn)
):
    """
    obtiene la lista completa de usuarios del sistema para el panel de administracion.
    """
    service = DashboardAdminService(conn)
    return await service.obtener_lista_usuarios()

@router.patch("/usuarios/{user_id}/rol", response_model=RolUpdate, status_code=status.HTTP_200_OK)
async def cambiar_rol_usuario(
    user_id: int,
    body: RolUpdate,
    conn: asyncpg.Connection = Depends(get_conn)
):
    """
    actualiza el rol de un usuario especifico.
    """
    service = DashboardAdminService(conn)
    return await service.cambiar_rol_usuario(user_id, body.nuevo_rol)