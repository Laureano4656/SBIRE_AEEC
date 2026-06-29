from fastapi import APIRouter, Depends, status, BackgroundTasks
import asyncpg
from app.api.deps import get_conn
from app.models.configuracion import AHPRequest, AHPResponse, PreguntaResponse, IndicadorResponse, DimensionResponse
from app.services.peso_criterios_services import PesoCriteriosServices
from app.services.riesgo_service import RiesgoService
from app.core.database import get_pool
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/calcular_ahp", tags=["calcular_ahp"])

@router.post("/", response_model=AHPResponse, status_code=status.HTTP_201_CREATED)
async def calcular_ahp(
    datos: AHPRequest, 
    background_tasks: BackgroundTasks,
    conn: asyncpg.Connection = Depends(get_conn),
    pool: asyncpg.Pool = Depends(get_pool)
):

    service = PesoCriteriosServices(conn)

    # 1. Ejecutar el cálculo matemático
    pesos_finales, consistencias = await service.calcular_ahp_jerarquico(
        nodo_actual=datos.nodo_raiz,
        jerarquia=datos.jerarquia,
        comparaciones_por_nodo=datos.comparaciones_por_nodo
    )

    # 2. Persistir en la base de datos
    id_configuracion = await service.guardar_resultados_ahp(
        config_data=datos.configuracion, 
        pesos_globales=pesos_finales,
        raw_json=datos
    )

    # Recálculo de los semáforos para todos los estudiantes de esa carrera
    background_tasks.add_task(
        RiesgoService.tarea_background_recalcular_por_configuracion,
        pool=pool,
        carrera_id=datos.configuracion.carrera_id,
        etapa=datos.configuracion.etapa
    )

    # 3. Retornar el diccionario (FastAPI se encarga de validarlo contra AHPResponse)
    return {
        "id_configuracion": id_configuracion,
        "pesos_globales": pesos_finales,
        "consistencia_matrices": consistencias
    }

@router.get("/indicadores/{carrera_id}", response_model=list[DimensionResponse] ,status_code=status.HTTP_201_CREATED)
async def obtener_indicadores_con_preguntas(
    carrera_id: int, 
    conn: asyncpg.Connection = Depends(get_conn)
) -> list[DimensionResponse]:

    service = PesoCriteriosServices(conn)

    resultado = await service.obtener_listado_indicadores_preguntas(carrera_id)

    return await service.obtener_listado_indicadores_preguntas(carrera_id)

@router.get("/carreras/{carrera_id}/etapas/{etapa}/saaty-inputs")
async def obtener_inputs_saaty(
    carrera_id: int, 
    etapa: str,
    conn: asyncpg.Connection = Depends(get_conn)
):
    service = PesoCriteriosServices(conn)
    datos_crudos = await service.obtener_valores_iniciales_saaty(carrera_id, etapa)
    
    return JSONResponse(content=datos_crudos)