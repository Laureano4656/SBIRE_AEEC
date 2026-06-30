from fastapi import APIRouter, Depends, status
import asyncpg

from app.api.deps import get_conn
from app.services.dashboard_admin_service import DashboardAdminService
from app.schemas.usuario import UsuarioAdminResponse, UsuarioResponse
from app.schemas.dashboard_admin_dep import (
    ActualizarUsuarioRequest,
    CrearUsuarioRequest,
    RolUpdate,
)

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get(
    "/usuarios",
    response_model=list[UsuarioAdminResponse],
    status_code=status.HTTP_200_OK,
)
async def obtener_usuarios(conn: asyncpg.Connection = Depends(get_conn)):
    """
    obtiene la lista completa de usuarios del sistema para el panel de administracion.
    """
    service = DashboardAdminService(conn)
    return await service.obtener_lista_usuarios()


@router.patch(
    "/usuarios/{user_id}/rol", response_model=RolUpdate, status_code=status.HTTP_200_OK
)
async def cambiar_rol_usuario(
    user_id: int, body: RolUpdate, conn: asyncpg.Connection = Depends(get_conn)
):
    """
    actualiza el rol de un usuario especifico.
    """
    service = DashboardAdminService(conn)
    return await service.cambiar_rol_usuario(user_id, body.nuevo_rol)


@router.post(
    "/usuarios", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED
)
async def agregar_usuario(
    body: CrearUsuarioRequest, conn: asyncpg.Connection = Depends(get_conn)
):
    """
    crea un nuevo usuario en el sistema.
    """
    service = DashboardAdminService(conn)
    return await service.agregar_usuario(body)


@router.put(
    "/usuarios/{user_id}",
    response_model=UsuarioResponse,
    status_code=status.HTTP_200_OK,
)
async def actualizar_usuario(
    user_id: int,
    body: ActualizarUsuarioRequest,
    conn: asyncpg.Connection = Depends(get_conn),
):
    """
    actualiza los datos de un usuario. solo se actualizan los campos enviados.
    """
    service = DashboardAdminService(conn)
    return await service.actualizar_usuario(user_id, body)


@router.patch("/usuarios/{user_id}/toggle-activo", status_code=status.HTTP_200_OK)
async def toggle_activo_usuario(
    user_id: int, conn: asyncpg.Connection = Depends(get_conn)
):
    """
    activa o desactiva (toggle) un usuario del sistema.
    """
    service = DashboardAdminService(conn)
    return await service.toggle_activo_usuario(user_id)
