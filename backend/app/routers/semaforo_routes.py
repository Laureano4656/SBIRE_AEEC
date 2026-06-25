import asyncpg
from fastapi import APIRouter, Depends, status, Request, BackgroundTasks, HTTPException
from app.api.deps import get_conn
from app.schemas.semaforo_schemas import SemaforoResponse
from app.services.riesgo_service import RiesgoService

router = APIRouter(prefix="/semaforo", tags=["semaforo"])

@router.get("/{estudiante_id}", response_model=SemaforoResponse)
async def obtener_semaforo(
    estudiante_id: int,
    conn: asyncpg.Connection = Depends(get_conn)
) -> SemaforoResponse:
    service = RiesgoService(conn)
    return await service.armar_semaforo_estudiante(estudiante_id)

# ==========================================
# 1. LECTURA (Lo consume el frontend para ver resultados)
# ==========================================
@router.get("/estudiantes/{estudiante_id}", status_code=status.HTTP_200_OK)
async def obtener_semaforo_estudiante(
    estudiante_id: int,
    conn: asyncpg.Connection = Depends(get_conn)
):
    """Devuelve el semáforo y los indicadores calculados de un estudiante."""
    service = RiesgoService(conn)
    try:
        resultado = await service.armar_semaforo_estudiante(estudiante_id)
        return resultado
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==========================================
# 2. CONFIGURACIÓN (Lo consume el admin/directivo)
# ==========================================
@router.post("/configuracion", status_code=status.HTTP_201_CREATED)
async def crear_configuracion_riesgo(
    request: Request,
    body: ConfiguracionSemaforoCreate, 
    background_tasks: BackgroundTasks,
    conn: asyncpg.Connection = Depends(get_conn)
    # ACÁ ES CLAVE UNA DEPENDENCIA DE SEGURIDAD:
    # usuario = Depends(verificar_rol_admin) 
):
    """Guarda nuevos pesos AHP/Umbrales y recalcula masivamente la carrera en background."""
    config_service = ConfiguracionService(conn)
    
    try:
        # 1. Guardar síncrono
        nueva_config = await config_service.guardar_configuracion(body)
        
        # 2. Recalcular asíncrono
        pool = request.app.state.pool
        background_tasks.add_task(
            RiesgoService.tarea_background_recalcular_por_configuracion,
            pool,
            nueva_config.carrera_id,
            nueva_config.etapa
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error guardando config: {str(e)}")

    return {
        "mensaje": "Configuración aplicada correctamente.",
        "detalle": f"Recalculando alumnos de la carrera {nueva_config.carrera_id} en segundo plano."
    }