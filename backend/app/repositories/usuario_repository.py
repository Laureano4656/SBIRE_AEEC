import asyncpg
from app.models.usuario import Usuario
from app.repositories.crud_repository import CrudRepository, CrudTableConfig

class UsuarioRepository(CrudRepository[Usuario]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            conn,
            Usuario,
            CrudTableConfig(
                table_name="usuarios",
                columns=("id", "carrera_id", "nombre", "apellido", "email", "moodle_id", "rol",
                         "max_casos_activos", "activo", "creado_en", "actualizado_en"),
                active_column="activo"
            )
        )

    async def get_by_moodle_id(self, moodle_id: str) -> Usuario | None:
        row = await self.conn.fetchrow(
            f"""
            SELECT {self._select_clause()}
            FROM {self.config.table_name}
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
            f"""
            INSERT INTO {self.config.table_name} (
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
            RETURNING {self._select_clause()}
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
