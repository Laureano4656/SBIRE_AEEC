# core/database.py
# ─────────────────────────────────────────────────────────────────────────────
# Pool de conexiones asyncpg.
# Un solo pool compartido por toda la aplicación — se inicializa en el
# startup de FastAPI y se cierra en el shutdown.
#
# Por qué asyncpg en lugar de SQLAlchemy + asyncpg:
#   - Acceso directo a features de PostgreSQL (JSONB, window functions, CTEs)
#   - Menos capas de abstracción = queries más predecibles y fáciles de debuggear
#   - Sin overhead del ORM en queries masivas del motor de detección
# ─────────────────────────────────────────────────────────────────────────────

import asyncpg
from asyncpg import Pool

from app.core.config import settings


# Pool global. Se asigna en el lifespan de FastAPI (ver main.py).
# No se instancia directamente aquí — siempre se accede vía get_pool().
_pool: Pool | None = None


async def init_pool() -> None:
    """
    Crea el pool de conexiones. Se llama una sola vez en el startup.
    El pool mantiene conexiones abiertas y las reutiliza entre requests,
    evitando el costo de establecer una nueva conexión TCP por cada request.
    """
    global _pool
    _pool = await asyncpg.create_pool(
        dsn=settings.DATABASE_URL,
        min_size=settings.DB_POOL_MIN_SIZE,
        max_size=settings.DB_POOL_MAX_SIZE,
        command_timeout=settings.DB_COMMAND_TIMEOUT,
    )


async def close_pool() -> None:
    """
    Cierra el pool limpiamente. Se llama en el shutdown de FastAPI.
    Espera a que las conexiones activas terminen antes de cerrar.
    """
    global _pool
    if _pool:
        await _pool.close()
        _pool = None


def get_pool() -> Pool:
    """
    Devuelve el pool activo. Falla rápido si no fue inicializado
    (indica un error de configuración en el startup).
    """
    if _pool is None:
        raise RuntimeError(
            "El pool de conexiones no fue inicializado. "
            "Verificar que init_pool() se llame en el startup de FastAPI."
        )
    return _pool
