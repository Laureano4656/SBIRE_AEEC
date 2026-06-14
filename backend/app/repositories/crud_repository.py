from dataclasses import dataclass
from typing import Any, Generic, TypeVar

import asyncpg
from asyncpg import Record
from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)


@dataclass(frozen=True)
class CrudTableConfig:
    table_name: str
    columns: tuple[str, ...]
    order_by: str = "id ASC"
    active_column: str | None = None


class CrudRepository(Generic[T]):
    def __init__(self, conn: asyncpg.Connection, model: type[T], config: CrudTableConfig) -> None:
        self.conn = conn
        self.model = model
        self.config = config

    def _map(self, record: Record | None) -> T | None:
        if not record:
            return None
        return self.model(**dict(record))

    def _map_many(self, records: list[Record]) -> list[T]:
        return [self.model(**dict(record)) for record in records]

    def _select_clause(self) -> str:
        return ", ".join(self.config.columns)

    async def get_all(self, solo_activos: bool = True) -> list[T]:
        query = f"SELECT {self._select_clause()} FROM {self.config.table_name}"
        if solo_activos and self.config.active_column:
            query += f" WHERE {self.config.active_column} = TRUE"
        if self.config.order_by:
            query += f" ORDER BY {self.config.order_by}"
        rows = await self.conn.fetch(query)
        return self._map_many(rows)

    async def get_by_id(self, id: int) -> T | None:
        row = await self.conn.fetchrow(
            f"""
            SELECT {self._select_clause()}
            FROM {self.config.table_name}
            WHERE id = $1
            """,
            id,
        )
        return self._map(row)

    async def create(self, **fields: Any) -> T | None:
        columns = list(fields.keys())
        placeholders = ", ".join(f"${index}" for index in range(1, len(columns) + 1))
        row = await self.conn.fetchrow(
            f"""
            INSERT INTO {self.config.table_name} ({", ".join(columns)})
            VALUES ({placeholders})
            RETURNING {self._select_clause()}
            """,
            *fields.values(),
        )
        return self._map(row)

    async def update(self, id: int, **fields: Any) -> T | None:
        if not fields:
            return await self.get_by_id(id)

        columns = list(fields.keys())
        set_clause = ", ".join(f"{column} = ${index}" for index, column in enumerate(columns, start=1))
        row = await self.conn.fetchrow(
            f"""
            UPDATE {self.config.table_name}
            SET {set_clause}
            WHERE id = ${len(columns) + 1}
            RETURNING {self._select_clause()}
            """,
            *fields.values(),
            id,
        )
        return self._map(row)

    async def delete(self, id: int) -> bool:
        if self.config.active_column:
            result = await self.conn.execute(
                f"""
                UPDATE {self.config.table_name}
                SET {self.config.active_column} = FALSE
                WHERE id = $1 AND {self.config.active_column} = TRUE
                """,
                id,
            )
            return result == "UPDATE 1"

        result = await self.conn.execute(
            f"DELETE FROM {self.config.table_name} WHERE id = $1",
            id,
        )
        return result == "DELETE 1"
