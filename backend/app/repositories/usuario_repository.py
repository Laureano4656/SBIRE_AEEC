import asyncpg

from app.models.usuario import Usuario
from app.repositories.base import BaseRepository


class UsuarioRepository(BaseRepository[Usuario]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(conn, Usuario)

    def _table_name(self) -> str:
        return "usuarios"

    async def get_by_id(self, id: int) -> Usuario | None:
        row = await self.conn.fetchrow(
            """
            SELECT id, carrera_id, nombre, apellido, email, moodle_id, rol,
                   max_casos_activos, activo, creado_en, actualizado_en
            FROM usuarios
            WHERE id = $1
            """,
            id,
        )
        return self._map(row)

    async def get_by_moodle_id(self, moodle_id: str) -> Usuario | None:
        row = await self.conn.fetchrow(
            """
            SELECT id, carrera_id, nombre, apellido, email, moodle_id, rol,
                   max_casos_activos, activo, creado_en, actualizado_en
            FROM usuarios
            WHERE moodle_id = $1
            """,
            moodle_id,
        )
        return self._map(row)

    async def upsert_from_lti(
        self,
        moodle_id: str,
        rol: str,
        nombre: str | None,
        apellido: str | None,
        email: str | None,
        carrera_id: int | None,
        max_casos_activos: int | None = None,
    ) -> Usuario:
        row = await self.conn.fetchrow(
            """
            INSERT INTO usuarios (
                carrera_id,
                nombre,
                apellido,
                email,
                moodle_id,
                rol,
                max_casos_activos,
                activo
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)
            ON CONFLICT (moodle_id) DO UPDATE SET
                nombre = COALESCE(EXCLUDED.nombre, usuarios.nombre),
                apellido = COALESCE(EXCLUDED.apellido, usuarios.apellido),
                email = COALESCE(EXCLUDED.email, usuarios.email),
                rol = EXCLUDED.rol,
                carrera_id = COALESCE(EXCLUDED.carrera_id, usuarios.carrera_id)
            RETURNING id, carrera_id, nombre, apellido, email, moodle_id, rol,
                      max_casos_activos, activo, creado_en, actualizado_en
            """,
            carrera_id,
            nombre,
            apellido,
            email,
            moodle_id,
            rol,
            max_casos_activos,
        )
        return self._map(row)  # type: ignore[return-value]
