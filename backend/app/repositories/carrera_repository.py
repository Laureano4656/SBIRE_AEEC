# repositories/carrera_repository.py
# ─────────────────────────────────────────────────────────────────────────────
# Repository de Carrera — único responsable de las queries SQL de esta entidad.
#
# este archivo solo contiene SQL y conversión de tipos.
# NUNCA toma decisiones de negocio. Si necesita decidir algo
# (ej. "¿puedo eliminar esta carrera?"), esa lógica va en CarreraService.
#
# Todas las queries usan parámetros posicionales ($1, $2...) — nunca
# interpolación de strings con valores del usuario (prevención de SQL injection).
# ─────────────────────────────────────────────────────────────────────────────

import asyncpg

from app.models.carrera import Carrera
from app.repositories.base import BaseRepository


class CarreraRepository(BaseRepository[Carrera]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(conn, Carrera)

    async def get_all(self, solo_activas: bool = True) -> list[Carrera]:
        """
        Devuelve todas las carreras.
        Por defecto filtra solo las activas — en SBIRE las carreras
        desactivadas se conservan por integridad histórica.
        """
        if solo_activas:
            rows = await self.conn.fetch(
                """
                SELECT id, nombre, codigo, duracion_cuatrimestre AS duracion_cuatrimestres, activo
                FROM carreras
                WHERE activo = TRUE
                ORDER BY nombre ASC
                """
            )
        else:
            rows = await self.conn.fetch(
                """
                SELECT id, nombre, codigo, duracion_cuatrimestre AS duracion_cuatrimestres, activo
                FROM carreras
                ORDER BY nombre ASC
                """
            )
        return self._map_many(rows)

    async def get_by_id(self, id: int) -> Carrera | None:
        """
        Sobreescribe el método base para seleccionar columnas explícitamente
        en lugar de usar SELECT *. Más seguro si la tabla agrega columnas futuras.
        """
        row = await self.conn.fetchrow(
            """
            SELECT id, nombre, codigo, duracion_cuatrimestre AS duracion_cuatrimestres, activo
            FROM carreras
            WHERE id = $1
            """,
            id,
        )
        return self._map(row)

    async def get_by_codigo(self, codigo: str) -> Carrera | None:
        """
        Busca por código único. Usado por el service para verificar
        duplicados antes de crear una nueva carrera.
        """
        row = await self.conn.fetchrow(
            """
            SELECT id, nombre, codigo, duracion_cuatrimestre AS duracion_cuatrimestres, activo
            FROM carreras
            WHERE codigo = $1
            """,
            codigo.upper(),
        )
        return self._map(row)

    async def create(
        self,
        nombre: str,
        codigo: str,
        duracion_cuatrimestres: int,
    ) -> Carrera:
        
        new_id = await self.conn.fetchval(
            """
            INSERT INTO carreras (nombre, codigo, duracion_cuatrimestre, activo)
            VALUES ($1, $2, $3, TRUE)
            RETURNING id
            """,
            nombre,
            codigo.upper(),
            duracion_cuatrimestres,
        )
        row = await self.conn.fetchrow(
            """
            SELECT id, nombre, codigo, duracion_cuatrimestre AS duracion_cuatrimestres, activo
            FROM carreras
            WHERE id = $1
            """,
            new_id,
        )
        return self._map(row)  # type: ignore[return-value]

    async def update(
        self,
        id: int,
        nombre: str | None = None,
        duracion_cuatrimestres: int | None = None,
        activo: bool | None = None,
    ) -> Carrera | None:
        """
        Actualización parcial: solo actualiza los campos que se pasan.
        Construye la cláusula SET dinámicamente para evitar sobreescribir
        campos con NULL cuando no se envían en el PATCH.
        """
        campos: list[str] = []
        valores: list = [] # ignore[annotation-unchecked] 
        contador = 1  # índice del parámetro posicional ($1, $2...)

        if nombre is not None:
            campos.append(f"nombre = ${contador}")
            valores.append(nombre)
            contador += 1

        if duracion_cuatrimestres is not None:
            campos.append(f"duracion_cuatrimestre = ${contador}")
            valores.append(duracion_cuatrimestres)
            contador += 1

        if activo is not None:
            campos.append(f"activo = ${contador}")
            valores.append(activo)
            contador += 1

        if not campos:
            # No se envió nada para actualizar — devolver el registro actual
            return await self.get_by_id(id)

        valores.append(id)  # el id siempre va al final como último parámetro
        set_clause = ", ".join(campos)

        row = await self.conn.fetchrow(
            f"""
            UPDATE carreras
            SET {set_clause}
            WHERE id = ${contador}
            RETURNING id, nombre, codigo, duracion_cuatrimestre AS duracion_cuatrimestres, activo
            """,
            *valores,
        )
        return self._map(row)

    async def soft_delete(self, id: int) -> bool:
        """
        Desactiva una carrera (activo = FALSE) en lugar de eliminarla.
        Preserva la integridad referencial con planes de estudio y estudiantes.
        Devuelve True si la carrera existía y fue desactivada.
        """
        result = await self.conn.execute(
            """
            UPDATE carreras
            SET activo = FALSE
            WHERE id = $1 AND activo = TRUE
            """,
            id,
        )
        return result == "UPDATE 1"

    async def tiene_estudiantes_activos(self, id: int) -> bool:
        """
        Verifica si la carrera tiene estudiantes activos.
        Usado por el service antes de permitir una desactivación.
        Esta query pertenece al repository porque es puro acceso a datos —
        la DECISIÓN de qué hacer con el resultado la toma el service.
        """
        count = await self.conn.fetchval(
            """
            SELECT COUNT(*)
            FROM estudiantes
            WHERE carrera_id = $1 AND activo = TRUE
            """,
            id,
        )
        return count > 0
