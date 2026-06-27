import asyncpg

from backend.app.schemas.dashboard_admin_dep import RolUpdate

class DashboardAdminRepository:
    def __init__(self, pool: asyncpg.pool.Pool):
        self.pool = pool
        
    async def change_roles(self, user_id: int, new_role: str) -> RolUpdate | None:
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
        return RolUpdate(row)   