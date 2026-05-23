
import asyncpg

from app.models.plan_estudio import PlanEstudio
from app.repositories.base import BaseRepository


class PlanEstudioRepository(BaseRepository[PlanEstudio]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(conn, PlanEstudio)

    async def get_all(self, solo_activos: bool = True) -> list[PlanEstudio]:
        """
        Devuelve todos los planes de estudio.
        Por defecto filtra solo los activos.
        """
        if solo_activos:
            rows = await self.conn.fetch(
                """
                SELECT id, carrera_id, nombre, anio_vigencia, activo
                FROM plan_estudios
                WHERE activo = TRUE
                ORDER BY nombre ASC
                """
            )
        else:
            rows = await self.conn.fetch(
                """
                SELECT id, carrera_id, nombre, anio_vigencia, activo
                FROM plan_estudios
                ORDER BY nombre ASC
                """
            )
        return self._map_many(rows)

    async def get_by_id(self, id: int) -> PlanEstudio | None:
        row = await self.conn.fetchrow(
            """
            SELECT id, carrera_id, nombre, anio_vigencia, activo
            FROM plan_estudios
            WHERE id = $1
            """,
            id,
        )
        return self._map(row)

    async def create(
        self,
        nombre: str,
        anio_vigencia: int,
        activo: bool,
    ) -> PlanEstudio:
        row = await self.conn.fetchrow(
            """
            INSERT INTO plan_estudios ( nombre, anio_vigencia, activo)
            VALUES ($1, $2, $3)
            RETURNING id, carrera_id, nombre, anio_vigencia, activo
            """,
            nombre,
            anio_vigencia,
            activo,
        )
        return self._map(row)  # type: ignore[return-value]

    async def update(
        self,
        id: int,
        carrera_id: int | None = None,
        nombre: str | None = None,
        anio_vigencia: int | None = None,
        activo: bool | None = None,
    ) -> PlanEstudio | None:
        """
        Actualización parcial: solo actualiza los campos que se pasan.
        """
        campos: list[str] = []
        valores: list = []  # ignore[annotation-unchecked]
        contador = 1

        if carrera_id is not None:
            campos.append(f"carrera_id = ${contador}")
            valores.append(carrera_id)
            contador += 1

        if nombre is not None:
            campos.append(f"nombre = ${contador}")
            valores.append(nombre)
            contador += 1

        if anio_vigencia is not None:
            campos.append(f"anio_vigencia = ${contador}")
            valores.append(anio_vigencia)
            contador += 1

        if activo is not None:
            campos.append(f"activo = ${contador}")
            valores.append(activo)
            contador += 1

        if not campos:
            return await self.get_by_id(id)

        valores.append(id)
        set_clause = ", ".join(campos)

        row = await self.conn.fetchrow(
            f"""
            UPDATE plan_estudios
            SET {set_clause}
            WHERE id = ${contador}
            RETURNING id, carrera_id, nombre, anio_vigencia, activo
            """,
            *valores,
        )
        return self._map(row)

    async def soft_delete(self, id: int) -> bool:
        result = await self.conn.execute(
            """
            UPDATE plan_estudios
            SET activo = FALSE
            WHERE id = $1 AND activo = TRUE
            """,
            id,
        )
        return result == "UPDATE 1"
