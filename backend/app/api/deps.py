
from app.core.database import get_pool

async def get_conn():
  # Adquiere conexión del pool, la libera al terminar el request
  async with get_pool().acquire() as conn:
    yield conn