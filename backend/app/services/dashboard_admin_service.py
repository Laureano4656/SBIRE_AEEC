import asyncpg
from fastapi import HTTPException, status

from app.repositories.dashboard_admin_repository import DashboardAdminRepository
from app.schemas.dashboard_admin_dep import ActualizarUsuarioRequest, CrearUsuarioRequest, RolUpdate
from app.schemas.usuario import UsuarioResponse

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

    async def agregar_usuario(self, data: CrearUsuarioRequest) -> UsuarioResponse:
        roles_permitidos = ['administrador', 'admin_departamental', 'docente_tutor', 'estudiante', 'docente_carga', 'asesor_par']
        if data.rol not in roles_permitidos:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"el rol debe ser uno de los siguientes: {roles_permitidos}."
            )

        resultado = await self.repo.crear_usuario(
            nombre=data.nombre,
            apellido=data.apellido,
            email=data.email,
            rol=data.rol,
            carrera_id=data.carrera_id,
            moodle_id=data.moodle_id,
        )

        if not resultado:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="no se pudo crear el usuario."
            )

        return UsuarioResponse(**resultado)

    async def actualizar_usuario(self, user_id: int, data: ActualizarUsuarioRequest) -> UsuarioResponse:
        campos = data.model_dump(exclude_none=True)
        if not campos:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="no se enviaron campos para actualizar."
            )

        if "rol" in campos:
            roles_permitidos = ['administrador', 'admin_departamental', 'docente_tutor', 'estudiante', 'docente_carga', 'asesor_par']
            if campos["rol"] not in roles_permitidos:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"el rol debe ser uno de los siguientes: {roles_permitidos}."
                )

        resultado = await self.repo.actualizar_usuario(user_id, **campos)

        if not resultado:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"usuario con id '{user_id}' no encontrado."
            )

        return UsuarioResponse(**resultado)

    async def toggle_activo_usuario(self, user_id: int) -> dict[str, str]:
        resultado = await self.repo.toggle_activo_usuario(user_id)

        if not resultado:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"usuario con id '{user_id}' no encontrado."
            )

        estado = "activado" if resultado["activo"] else "desactivado"
        return {"mensaje": f"Usuario {estado} correctamente.", "activo": resultado["activo"]}