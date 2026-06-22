import asyncpg
from fastapi import APIRouter, Depends, status, HTTPException

from app.api.deps import get_conn
from app.schemas.respuesta import EncuestaSubmit
from app.services.respuesta_service import RespuestaService

router = APIRouter(prefix="/respuestas", tags=["respuestas"])

@router.post("/asignacion/{asignacion_id}/submit", status_code=status.HTTP_200_OK)
async def procesar_respuestas_encuesta(
    asignacion_id: int,
    body: EncuestaSubmit,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, str]:
    """
    Recibe el array completo de respuestas. 
    Maneja guardado de borradores, envíos finales y actualizaciones de encuestas.
    """
    service = RespuestaService(conn)
    return await service.procesar_envio_encuesta(asignacion_id, body)