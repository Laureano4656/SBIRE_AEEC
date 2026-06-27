import asyncpg
from fastapi import HTTPException, status

from app.repositories.dashboard_admin_repository import DashboardAdminRepository
from app.schemas.dashboard_admin_dep import RolUpdate

class DashboardAdminService:
    """
    Servicio para las funcionalidades exclusivas del Administrador Supremo (gestión de usuarios).
    """
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.repo = DashboardAdminRepository(conn)

    async def obtener_lista_usuarios(self) -> list[dict]:
        """Obtiene el listado completo de usuarios para la gestión de permisos."""
        usuarios = await self.repo.obtener_todos_los_usuarios()
        return usuarios

    async def cambiar_rol_usuario(self, user_id: int, new_role: str) -> RolUpdate:
        """Modifica el rol de un usuario en el sistema validando las reglas de negocio."""
        roles_permitidos = ['admin','admin_departamental' , 'docente_tutor', 'estudiante', 'docente_carga', 'asesor_par']
        if new_role not in roles_permitidos:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"el rol debe ser uno de los siguientes: {roles_permitidos}."
            )

        resultado = await self.repo.change_roles(user_id, new_role)
        
        if not resultado:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"usuario con id '{user_id}' no encontrado."
            )
            
        return resultado