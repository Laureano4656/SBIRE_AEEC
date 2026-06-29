import asyncpg
from fastapi import HTTPException

from app.repositories.riesgo_repository import RiesgoRepository
from app.schemas.revision import RespuestaPendienteResponse
from app.services.riesgo_service import RiesgoService
from app.services.ia_service import analizar_comentario


class RevisionService:
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.conn = conn
        self.repo = RiesgoRepository(conn)

    async def obtener_pendientes(
        self, carrera_id: int
    ) -> list[RespuestaPendienteResponse]:
        rows = await self.repo.obtener_pendientes_revision(carrera_id)
        return [RespuestaPendienteResponse(**dict(row)) for row in rows]

    async def aprobor_revision(
        self, respuesta_id: int, riesgo: float
    ) -> dict:
        resultado = await self.repo.aprobar_revision(respuesta_id, riesgo)
        if not resultado:
            raise HTTPException(
                status_code=404,
                detail=f"Respuesta con ID {respuesta_id} no encontrada.",
            )
        return resultado

    @staticmethod
    async def backfill_analizar_pendientes(pool: asyncpg.Pool) -> None:
        async with pool.acquire() as conn:
            repo = RiesgoRepository(conn)
            pendientes = await repo.obtener_respuestas_texto_sin_analizar()

        if not pendientes:
            raise HTTPException(
                status_code=500,
                detail="No hay respuestas de texto pendientes de análisis."
            )
            return

        total = len(pendientes)
        raise HTTPException(
            status_code=500,
            detail=f"Iniciando backfill de {total} respuestas de texto libre..."
        )

        for i, row in enumerate(pendientes, 1):
            try:
                async with pool.acquire() as conn:
                    repo = RiesgoRepository(conn)
                    resultado = await analizar_comentario(
                        row["texto_pregunta"], row["valor_texto"]
                    )
                    if resultado.confianza >= 60:
                        await repo.actualizar_riesgo_calculado(
                            row["respuesta_id"], resultado.nivel_riesgo
                        )
                    else:
                        await repo.marcar_para_revision(row["respuesta_id"])

                    if i % 10 == 0 or i == total:
                        raise HTTPException(
                            status_code=500,
                            detail=f"  Procesadas {i}/{total}"
                        )
            except Exception as e:
                raise HTTPException(
                    status_code=500,
                    detail=f"Error en respuesta {row['respuesta_id']}: {e}"
                )

        raise HTTPException(
            status_code=500,
            detail="Backfill finalizado."
        )
