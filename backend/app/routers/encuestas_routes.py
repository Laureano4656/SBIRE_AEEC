import asyncpg
from fastapi import APIRouter, Depends, status, BackgroundTasks, Request

from app.api.deps import get_conn
from app.schemas.encuesta import FormularioEncuestaResponse, EncuestaSubmit
from app.services.encuesta_service import EncuestaService
from app.services.riesgo_service import RiesgoService

router = APIRouter(prefix="/encuestas", tags=["encuestas"])



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
    request: Request, # <-- Para sacar el pool de conexiones global
    asignacion_id: int,
    body: EncuestaSubmit,
    background_tasks: BackgroundTasks,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, str]:
    
    encuesta_service = EncuestaService(conn)
    
    # 1. Guardamos la encuesta de forma síncrona
    await encuesta_service.guardar_respuestas(asignacion_id, body.respuestas)
    
    # 2. Encolamos el motor AHP llamando al método estático del servicio
    # Le pasamos el pool global de la app en lugar de la conexión del request
    pool = request.app.state.pool 
    
    background_tasks.add_task(
        RiesgoService.tarea_background_calcular_riesgo,
        pool,
        body.estudiante_id,
        asignacion_id
    )
    
    return {"mensaje": "Encuesta guardada con éxito. Analizando riesgo en segundo plano."}

@router.patch("/asignacion/{asignacion_id}/publicar", status_code=status.HTTP_200_OK)
async def publicar_encuesta(
    asignacion_id: int,
    conn: asyncpg.Connection = Depends(get_conn)
) -> dict[str, str]:
    """
    Endpoint para que el administrador departamental confirme la encuesta.
    Pasa el campo 'borrador' de true a false.
    """
    service = EncuestaService(conn)
    return await service.publicar_encuesta(asignacion_id)
