import asyncpg
from fastapi import APIRouter, Depends, BackgroundTasks

from app.api.deps import get_conn
from app.core.database import get_pool
from app.schemas.revision import RespuestaPendienteResponse, AprobarRevisionRequest
from app.services.revision_service import RevisionService
from app.services.riesgo_service import RiesgoService

router = APIRouter(prefix="/revisiones", tags=["revisiones"])


@router.get(
    "/pendientes",
    response_model=list[RespuestaPendienteResponse],
)
async def listar_pendientes(
    carrera_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
):
    service = RevisionService(conn)
    return await service.obtener_pendientes(carrera_id)


@router.patch("/pendientes/{respuesta_id}/aprobar")
async def aprobar_revision(
    respuesta_id: int,
    body: AprobarRevisionRequest,
    background_tasks: BackgroundTasks,
    conn: asyncpg.Connection = Depends(get_conn),
    pool: asyncpg.Pool = Depends(get_pool),
):
    service = RevisionService(conn)
    resultado = await service.aprobor_revision(
        respuesta_id, body.riesgo_calculado
    )

    asignacion_id = resultado.get("asignacion_id")
    if asignacion_id:
        row = await conn.fetchrow(
            "SELECT estudiante_id FROM asignacion_encuesta WHERE id = $1",
            asignacion_id,
        )
        if row:
            background_tasks.add_task(
                RiesgoService.tarea_background_calcular_riesgo,
                pool=pool,
                estudiante_id=row["estudiante_id"],
            )

    return {"mensaje": "Revisión aprobada. Recalculando riesgo en segundo plano."}


@router.post("/backfill", status_code=202)
async def iniciar_backfill(
    background_tasks: BackgroundTasks,
    pool: asyncpg.Pool = Depends(get_pool),
):
    background_tasks.add_task(
        RevisionService.backfill_analizar_pendientes,
        pool=pool,
    )
    return {"mensaje": "Backfill iniciado en segundo plano."}
