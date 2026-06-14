
import asyncpg

from app.models.estudiante import Estudiante
from app.repositories.base import BaseRepository


class EstudianteRepository(BaseRepository[Estudiante]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(conn, Estudiante)

    async def get_all(self, solo_activos: bool = True) -> list[Estudiante]:
        """
        Devuelve todos los estudiantes.
        Por defecto filtra solo los activos.
        """
        if solo_activos:
            rows = await self.conn.fetch(
                """
                SELECT id, carrera_id, nombre, apellido, email, legajo, dni,
                       anio_ingreso, etapa, porcentaje_carrera, activo, moodle_id
                FROM estudiantes
                WHERE activo = TRUE
                ORDER BY apellido ASC, nombre ASC
                """
            )
        else:
            rows = await self.conn.fetch(
                """
                SELECT id, carrera_id, nombre, apellido, email, legajo, dni,
                       anio_ingreso, etapa, porcentaje_carrera, activo, moodle_id
                FROM estudiantes
                ORDER BY apellido ASC, nombre ASC
                """
            )
        return self._map_many(rows)

    async def get_by_id(self, id: int) -> Estudiante | None:
        row = await self.conn.fetchrow(
            """
            SELECT id, carrera_id, nombre, apellido, email, legajo, dni,
                   anio_ingreso, etapa, porcentaje_carrera, activo, moodle_id
            FROM estudiantes
            WHERE id = $1
            """,
            id,
        )
        return self._map(row)

    async def create(
        self,
        carrera_id: int,
        nombre: str,
        apellido: str,
        email: str | None,
        legajo: str,
        dni: str,
        anio_ingreso: int,
        etapa: str,
        porcentaje_carrera: float,
        activo: bool,
        moodle_id: str | None,
    ) -> Estudiante:
        row = await self.conn.fetchrow(
            """
            INSERT INTO estudiantes (
                carrera_id,
                nombre,
                apellido,
                email,
                legajo,
                dni,
                anio_ingreso,
                etapa,
                porcentaje_carrera,
                activo,
                moodle_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING id, carrera_id, nombre, apellido, email, legajo, dni,
                      anio_ingreso, etapa, porcentaje_carrera, activo, moodle_id
            """,
            carrera_id,
            nombre,
            apellido,
            email,
            legajo,
            dni,
            anio_ingreso,
            etapa,
            porcentaje_carrera,
            activo,
            moodle_id,
        )
        return self._map(row)  # type: ignore[return-value]

    async def update(
        self,
        id: int,
        carrera_id: int | None = None,
        nombre: str | None = None,
        apellido: str | None = None,
        email: str | None = None,
        legajo: str | None = None,
        dni: str | None = None,
        anio_ingreso: int | None = None,
        etapa: str | None = None,
        porcentaje_carrera: float | None = None,
        activo: bool | None = None,
        moodle_id: str | None = None,
    ) -> Estudiante | None:
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

        if apellido is not None:
            campos.append(f"apellido = ${contador}")
            valores.append(apellido)
            contador += 1

        if email is not None:
            campos.append(f"email = ${contador}")
            valores.append(email)
            contador += 1

        if legajo is not None:
            campos.append(f"legajo = ${contador}")
            valores.append(legajo)
            contador += 1

        if dni is not None:
            campos.append(f"dni = ${contador}")
            valores.append(dni)
            contador += 1

        if anio_ingreso is not None:
            campos.append(f"anio_ingreso = ${contador}")
            valores.append(anio_ingreso)
            contador += 1

        if etapa is not None:
            campos.append(f"etapa = ${contador}")
            valores.append(etapa)
            contador += 1

        if porcentaje_carrera is not None:
            campos.append(f"porcentaje_carrera = ${contador}")
            valores.append(porcentaje_carrera)
            contador += 1

        if activo is not None:
            campos.append(f"activo = ${contador}")
            valores.append(activo)
            contador += 1

        if moodle_id is not None:
            campos.append(f"moodle_id = ${contador}")
            valores.append(moodle_id)
            contador += 1

        if not campos:
            return await self.get_by_id(id)

        valores.append(id)
        set_clause = ", ".join(campos)

        row = await self.conn.fetchrow(
            f"""
            UPDATE estudiantes
            SET {set_clause}
            WHERE id = ${contador}
            RETURNING id, carrera_id, nombre, apellido, email, legajo, dni,
                      anio_ingreso, etapa, porcentaje_carrera, activo, moodle_id
            """,
            *valores,
        )
        return self._map(row)

    async def soft_delete(self, id: int) -> bool:
        result = await self.conn.execute(
            """
            UPDATE estudiantes
            SET activo = FALSE
            WHERE id = $1 AND activo = TRUE
            """,
            id,
        )
        return result == "UPDATE 1"
