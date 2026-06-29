from app.core.database import get_pool
from app.services.revision_service import RevisionService


async def backfill_revisiones() -> None:
    pool = get_pool()
    print("⏳ Iniciando backfill automático de revisiones pendientes...")
    await RevisionService.backfill_analizar_pendientes(pool)
