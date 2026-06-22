import asyncpg
from fastapi import APIRouter, Depends, status, HTTPException

from app.api.deps import get_conn
from app.schemas.respuesta import RespuestaCreate, RespuestaResponse, RespuestaUpdate
from app.services.respuesta_service import RespuestaService
from app.schemas.respuesta import EncuestaSubmit
from app.services.respuesta_service import RespuestaService

router = APIRouter(prefix="/respuestas", tags=["respuestas"])

@router.get("/", response_model=list[RespuestaResponse])
async def listar_respuestas(
    solo_activos: bool = True,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[RespuestaResponse]:
    service = RespuestaService(conn)
    items = await service.listar(solo_activos=solo_activos)
    return [RespuestaResponse.model_validate(item) for item in items]

@router.get("/{respuesta_id}", response_model=RespuestaResponse)
async def obtener_respuesta(
    respuesta_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> RespuestaResponse:
    service = RespuestaService(conn)
    item = await service.obtener_por_id(respuesta_id)
    return RespuestaResponse.model_validate(item)

@router.post("/", response_model=RespuestaResponse, status_code=status.HTTP_201_CREATED)
async def crear_respuesta(
    body: RespuestaCreate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> RespuestaResponse:
    
    query_pregunta = "SELECT texto FROM preguntas WHERE id = $1"
    texto_pregunta = await conn.fetchval(query_pregunta, body.pregunta_id)

    if not texto_pregunta:
        raise HTTPException(status_code=404, detail="Pregunta no encontrada en la base de datos")

    service = RespuestaService(conn)
    
    item = await service.crear_respuesta(body)
    
    return RespuestaResponse.model_validate(item)

@router.patch("/{respuesta_id}", response_model=RespuestaResponse)
async def actualizar_respuesta(
    respuesta_id: int,
    body: RespuestaUpdate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> RespuestaResponse:
    service = RespuestaService(conn)
    item = await service.actualizar_respuesta(respuesta_id, body)
    return RespuestaResponse.model_validate(item)

@router.delete("/{respuesta_id}", response_model=dict[str, str])
async def eliminar_respuesta(
    respuesta_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, str]:
    service = RespuestaService(conn)
    return await service.eliminar(respuesta_id)

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