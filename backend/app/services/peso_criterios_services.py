
import asyncpg
from fastapi import HTTPException, status
from typing import List, Dict
import numpy as np

from app.models.comparacion import Comparacion
from app.repositories.peso_criterios_repository import PesoCriteriosRepository


class PesoCriteriosServices:
    """
    Service de Peso de Criterios.
    """

    def __init__(self, conn: asyncpg.Connection) -> None:
        self.repo = PesoCriteriosRepository(conn)

    async def resolver_matriz_ahp(self,criterios: List[str], comparaciones: List[Comparacion]):
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

    async def calcular_ahp_jerarquico(self, nodo_actual: str, jerarquia: Dict[str, List[str]], comparaciones_por_nodo: Dict[str, List[Comparacion]], peso_global_padre=1.0, resultados=None, reportes_cr=None):
        if resultados is None:
            resultados = {}
            reportes_cr = {}

        if nodo_actual in jerarquia:
            hijos = jerarquia[nodo_actual]
            comparaciones_hijos = comparaciones_por_nodo.get(nodo_actual, [])
            
            pesos_locales, cr = await self.resolver_matriz_ahp(hijos, comparaciones_hijos)
            reportes_cr[nodo_actual] = cr
            
            for hijo in hijos:
                peso_global_hijo = pesos_locales[hijo] * peso_global_padre
                await self.calcular_ahp_jerarquico(hijo, jerarquia, comparaciones_por_nodo, peso_global_hijo, resultados, reportes_cr)
        else:
            resultados[nodo_actual] = round(peso_global_padre, 4)

        return resultados, reportes_cr
    