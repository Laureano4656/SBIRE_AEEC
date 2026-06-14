from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from app.models.comparacion import Comparacion
from app.services.peso_criterios_services import PesoCriteriosServices
from app.models.configuracion import AHPRequest
from fastapi import APIRouter, Depends, status
from app.api.deps import get_conn
import asyncpg

router = APIRouter(prefix="/calcular_ahp", tags=["calcular_ahp"])

# --- ENDPOINT ---
@router.post("/")
async def calcular_ahp(datos: AHPRequest, conn: asyncpg.Connection = Depends(get_conn)):

    service = PesoCriteriosServices(conn)

    pesos_finales, consistencias = await service.calcular_ahp_jerarquico(
        nodo_actual=datos.nodo_raiz,
        jerarquia=datos.jerarquia,
        comparaciones_por_nodo=datos.comparaciones_por_nodo
    )

    return {
        "pesos_globales": pesos_finales,
        "consistencia_matrices": consistencias
    }