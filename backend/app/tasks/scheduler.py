from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.tasks.omision_encuesta import verificar_omisiones
from app.tasks.backfill_revisiones import backfill_revisiones

scheduler = AsyncIOScheduler()

async def start_scheduler() -> None:
    scheduler.add_job(
        verificar_omisiones,
        trigger="interval",
        hours=168,  # 7 days
        id="omision_encuesta_job",
        replace_existing=True,
    )
    scheduler.add_job(
        backfill_revisiones,
        trigger="interval",
        hours=24,  # daily
        id="backfill_revisiones_job",
        replace_existing=True,
    )
    scheduler.start()
