from fastapi import APIRouter, Depends, status
import asyncpg
from app.api.deps import get_conn
from app.models.configuracion import AHPRequest, AHPResponse
from app.services.peso_criterios_services import PesoCriteriosServices

router = APIRouter(prefix="/calcular_ahp", tags=["calcular_ahp"])

@router.post("/", response_model=AHPResponse, status_code=status.HTTP_201_CREATED)
async def calcular_ahp(datos: AHPRequest, conn: asyncpg.Connection = Depends(get_conn)):

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
        pesos_globales=pesos_finales
    )

    # 3. Retornar el diccionario (FastAPI se encarga de validarlo contra AHPResponse)
    return {
        "id_configuracion": id_configuracion,
        "pesos_globales": pesos_finales,
        "consistencia_matrices": consistencias
    }