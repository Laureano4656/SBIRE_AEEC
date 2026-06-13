from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import numpy as np

app = FastAPI(title="Motor AHP - Summit Labs")

# Habilitar CORS para que el frontend local pueda comunicarse con la API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELOS DE DATOS (PYDANTIC) ---
class Comparacion(BaseModel):
    criterio_i: str
    valor: float
    criterio_j: str

class AHPRequest(BaseModel):
    nodo_raiz: str
    jerarquia: Dict[str, List[str]]
    comparaciones_por_nodo: Dict[str, List[Comparacion]]

# --- LÓGICA MATEMÁTICA AHP ---
def resolver_matriz_ahp(criterios: List[str], comparaciones: List[Comparacion]):
    n = len(criterios)
    if n == 1:
        return {criterios[0]: 1.0}, 0.0

    idx_criterios = {criterio: i for i, criterio in enumerate(criterios)}
    matriz = np.ones((n, n))
    
    for comp in comparaciones:
        i, j = idx_criterios[comp.criterio_i], idx_criterios[comp.criterio_j]
        matriz[i, j] = comp.valor
        matriz[j, i] = 1.0 / comp.valor

    suma_columnas = matriz.sum(axis=0)
    matriz_normalizada = matriz / suma_columnas
    pesos = matriz_normalizada.mean(axis=1)

    vector_suma = np.dot(matriz, pesos)
    lambda_max = (vector_suma / pesos).mean()
    ci = (lambda_max - n) / (n - 1)
    
    ri_estandar = {1: 0.0, 2: 0.0, 3: 0.58, 4: 0.90, 5: 1.12, 6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45}
    ri = ri_estandar.get(n, 1.49)
    cr = ci / ri if ri > 0 else 0

    return {criterios[i]: round(pesos[i], 4) for i in range(n)}, round(cr, 4)

def calcular_ahp_jerarquico(nodo_actual: str, jerarquia: Dict[str, List[str]], comparaciones_por_nodo: Dict[str, List[Comparacion]], peso_global_padre=1.0, resultados=None, reportes_cr=None):
    if resultados is None:
        resultados = {}
        reportes_cr = {}

    if nodo_actual in jerarquia:
        hijos = jerarquia[nodo_actual]
        comparaciones_hijos = comparaciones_por_nodo.get(nodo_actual, [])
        
        pesos_locales, cr = resolver_matriz_ahp(hijos, comparaciones_hijos)
        reportes_cr[nodo_actual] = cr
        
        for hijo in hijos:
            peso_global_hijo = pesos_locales[hijo] * peso_global_padre
            calcular_ahp_jerarquico(hijo, jerarquia, comparaciones_por_nodo, peso_global_hijo, resultados, reportes_cr)
    else:
        resultados[nodo_actual] = round(peso_global_padre, 4)

    return resultados, reportes_cr

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