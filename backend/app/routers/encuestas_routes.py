import asyncpg
from fastapi import APIRouter, Depends, status

from app.api.deps import get_conn
from app.schemas.encuesta import EncuestaCreate, EncuestaListResponse, EncuestaResponse, EncuestaUpdate
from app.schemas.encuesta_schemas import FormularioEncuestaResponse, EncuestaSubmit
from app.services.encuesta_service import EncuestaService

router = APIRouter(prefix="/encuestas", tags=["encuestas"])


@router.get("/", response_model=list[EncuestaResponse])
async def listar_encuestas(
    solo_activos: bool = True,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[EncuestaResponse]:
    service = EncuestaService(conn)
    items = await service.listar(solo_activos=solo_activos)
    return [EncuestaResponse.model_validate(item) for item in items]


@router.get("/{encuesta_id}", response_model=EncuestaResponse)
async def obtener_encuesta(
    encuesta_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> EncuestaResponse:
    service = EncuestaService(conn)
    item = await service.obtener_por_id(encuesta_id)
    return EncuestaResponse.model_validate(item)

@router.get("/{encuesta_id}/completa", response_model=EncuestaListResponse)
async def obtener_encuesta_completa(
    encuesta_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> EncuestaListResponse:
    service = EncuestaService(conn)
    # llamamos al método exclusivo que le agregaste al servicio
    item = await service.obtener_encuesta_completa(encuesta_id)
    return EncuestaListResponse.model_validate(item)

@router.post("/", response_model=EncuestaResponse, status_code=status.HTTP_201_CREATED)
async def crear_encuesta(
    body: EncuestaCreate,
@router.get("/pendientes/{asignacion_id}/formulario", response_model=FormularioEncuestaResponse)
async def obtener_formulario_dinamico(
    asignacion_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> FormularioEncuestaResponse:
    """
    Devuelve la estructura completa de la encuesta, duplicando las meta-preguntas 
    por cada materia según la situación académica del estudiante.
    """
    service = EncuestaService(conn)
    return await service.obtener_formulario(asignacion_id)

@router.post("/pendientes/{asignacion_id}/submit", status_code=status.HTTP_200_OK)
async def enviar_respuestas(
    asignacion_id: int,
    body: EncuestaSubmit,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, str]:
    """
    Recibe el array de respuestas, las guarda en lote y cierra la asignación.
    """
    service = EncuestaService(conn)
    
    # Convertir los objetos Pydantic a dicts para el guardado en lote
    respuestas_dicts = [r.model_dump(exclude_unset=True) for r in body.respuestas]
    
    await service.guardar_respuestas(asignacion_id, respuestas_dicts)
    
    # Aquí se podría emitir un evento en background para que el motor AHP recalcule el riesgo
    
    return {"mensaje": "Encuesta guardada con éxito y asignación completada."}
