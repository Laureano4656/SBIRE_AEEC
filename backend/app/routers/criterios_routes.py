from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from comparacion import Comparacion
import numpy as np
from app.services.peso_criterios_services import calcular_ahp_jerarquico
from app.models.comparacion import AHPRequest

app = FastAPI(title="Motor AHP - Summit Labs")

# Habilitar CORS para que el frontend local pueda comunicarse con la API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- LÓGICA MATEMÁTICA AHP ---


# --- ENDPOINT ---
@app.post("/calcular-ahp")
async def calcular_ahp(datos: AHPRequest):
    pesos_finales, consistencias = calcular_ahp_jerarquico(
        nodo_actual=datos.nodo_raiz,
        jerarquia=datos.jerarquia,
        comparaciones_por_nodo=datos.comparaciones_por_nodo
    )
    return {
        "pesos_globales": pesos_finales,
        "consistencia_matrices": consistencias
    }