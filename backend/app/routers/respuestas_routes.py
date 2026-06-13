import asyncpg
from fastapi import APIRouter, Depends, status, HTTPException

from app.api.deps import get_conn
from app.schemas.respuesta import RespuestaCreate, RespuestaResponse, RespuestaUpdate
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
    # 1. Buscamos el texto original de la pregunta para el contexto de la IA
    # (Asegurate de que la columna se llame 'texto' o 'enunciado' en tu tabla pregunta)
    query_pregunta = "SELECT texto FROM pregunta WHERE id = $1"
    texto_pregunta = await conn.fetchval(query_pregunta, body.pregunta_id)

    if not texto_pregunta:
        raise HTTPException(status_code=404, detail="Pregunta no encontrada en la base de datos")

    # 2. Instanciamos el servicio
    service = RespuestaService(conn)
    
    # 3. Pasamos el body y el texto de la pregunta a nuestro nuevo método
    # Nota: Tu método guardar_respuesta_analizada en RespuestaService tiene que 
    # estar preparado para recibir 'body' (que es de tipo RespuestaCreate)
    item = await service.guardar_respuesta_analizada(body, texto_pregunta)
    
    return RespuestaResponse.model_validate(item)


@router.patch("/{respuesta_id}", response_model=RespuestaResponse)
async def actualizar_respuesta(
    respuesta_id: int,
    body: RespuestaUpdate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> RespuestaResponse:
    service = RespuestaService(conn)
    item = await service.actualizar(respuesta_id, **body.model_dump(exclude_unset=True))
    return RespuestaResponse.model_validate(item)


@router.delete("/{respuesta_id}", response_model=dict[str, str])
async def eliminar_respuesta(
    respuesta_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, str]:
    service = RespuestaService(conn)
    return await service.eliminar(respuesta_id)
