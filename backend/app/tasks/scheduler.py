from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.tasks.omision_encuesta import verificar_omisiones

scheduler = AsyncIOScheduler()

async def start_scheduler() -> None:
    scheduler.add_job(
        verificar_omisiones,
        trigger="interval",
        hours=168,  # 7 days
        id="omision_encuesta_job",
        replace_existing=True,
    )
    scheduler.start()
