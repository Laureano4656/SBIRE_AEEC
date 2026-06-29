import asyncpg

from app.schemas.dashboard_admin_dep import RolUpdate


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
            "SELECT usuarios.*, c.nombre AS nombre_carrera,c.id AS carrera_id FROM usuarios INNER JOIN carreras c ON usuarios.carrera_id = c.id"
        )
        return [dict(record) for record in records]

    async def crear_usuario(
        self,
        nombre: str,
        apellido: str,
        email: str,
        rol: str,
        carrera_id: int | None = None,
        moodle_id: str | None = None,
    ) -> dict | None:
        row = await self.conn.fetchrow(
            """
            INSERT INTO usuarios (nombre, apellido, email, rol, carrera_id, moodle_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            """,
            nombre,
            apellido,
            email,
            rol,
            carrera_id,
            moodle_id,
        )
        return dict(row) if row else None

    async def actualizar_usuario(self, user_id: int, **campos) -> dict | None:
        if not campos:
            return await self.conn.fetchrow("SELECT * FROM usuarios WHERE id = $1", user_id)

        sets = ", ".join(f"{col} = ${i}" for i, col in enumerate(campos, start=1))
        valores = list(campos.values())
        row = await self.conn.fetchrow(
            f"""
            UPDATE usuarios
            SET {sets}, actualizado_en = NOW()
            WHERE id = ${len(valores) + 1}
            RETURNING *
            """,
            *valores,
            user_id,
        )
        return dict(row) if row else None

    async def toggle_activo_usuario(self, user_id: int) -> dict | None:
        row = await self.conn.fetchrow(
            """
            UPDATE usuarios
            SET activo = NOT activo, actualizado_en = NOW()
            WHERE id = $1
            RETURNING *
            """,
            user_id,
        )
        return dict(row) if row else None
