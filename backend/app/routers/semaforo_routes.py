import asyncpg
from fastapi import APIRouter, Depends, status, HTTPException
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
