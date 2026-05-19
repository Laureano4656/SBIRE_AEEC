from asyncpg import Connection, Record
from typing import TypeVar, Type, Generic
from pydantic import BaseModel
from uuid import UUID

T = TypeVar("T", bound=BaseModel)

class BaseRepository(Generic[T]):
  def __init__(self, conn: Connection, model: Type[T]):
    self.conn = conn
    self.model = model

  def _map(self, record: Record | None) -> T | None:
    # Convierte un asyncpg Record en el modelo Pydantic
    if not record: return None
    return self.model(**dict(record))

  def _map_many(self, records: list[Record]) -> list[T]:
    return [self.model(**dict(r)) for r in records]
  
  async def get_by_id(self, id: int) -> T | None:
        """
        Busca un registro por su PK (UUID).
        Cada repository asume que su tabla tiene una columna 'id'.
        Si la tabla tiene PK distinta, el repository concreto sobreescribe este método.
        """
        row = await self.conn.fetchrow(
            f"SELECT * FROM {self._table_name()} WHERE id = $1",
            id,
        )
        return self._map(row)

  async def delete(self, id: UUID) -> bool:
        """
        Elimina un registro por id. Devuelve True si existía y fue eliminado.
        En SBIRE preferimos soft delete (activo=False) para la mayoría de entidades,
        pero este método queda disponible para casos que lo necesiten.
        """
        result = await self.conn.execute(
            f"DELETE FROM {self._table_name()} WHERE id = $1",
            id,
        )
        # asyncpg devuelve "DELETE N" donde N es la cantidad de filas afectadas
        return result == "DELETE 1"

  def _table_name(self) -> str:
        """
        Infiere el nombre de la tabla desde el nombre del modelo.
        CarreraRepository → "carrera"
        Si la tabla tiene nombre distinto, sobreescribir este método.
        """
        return self.model.__name__.lower()
