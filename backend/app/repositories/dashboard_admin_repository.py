import asyncpg

from backend.app.schemas.dashboard_admin_dep import RolUpdate

class DashboardAdminRepository:
    def __init__(self, conn: asyncpg.Connection):
        self.conn = conn
        
    
    async def change_roles(self, user_id: int, new_role: str) -> RolUpdate | None:
        """Actualiza el rol de un usuario."""
        row = await self.conn.fetchrow(
            """
            UPDATE usuarios
            SET rol = $1, actualizado_en = NOW()
            WHERE id = $2
            RETURNING *
            """,
            new_role,
            user_id,
        )
        return RolUpdate(**dict(row)) if row else None

    async def obtener_todos_los_usuarios(self) -> list[dict]:
        """Obtiene la lista completa para gestionar permisos de usuarios."""
        records = await self.conn.fetch(
            "SELECT id, nombre, apellido, email, rol, activo FROM usuarios"
        )
        return [dict(record) for record in records]
    
