
import asyncpg
from typing import List, Dict
import numpy as np

from app.models.comparacion import Comparacion
from app.repositories.peso_criterios_repository import PesoCriteriosRepository
from app.models.configuracion import DatosConfiguracion, PreguntaResponse, IndicadorResponse, DimensionResponse


class PesoCriteriosServices:
    """
    Service de Peso de Criterios.
    """

    def __init__(self, conn: asyncpg.Connection) -> None:
        self.repo = PesoCriteriosRepository(conn)

    async def resolver_matriz_ahp(self, criterios: List[int], comparaciones: List[Comparacion]):
        n = len(criterios)
        if n == 1:
            return {criterios[0]: 1.0}, 0.0

        # Mapea los IDs (enteros) a índices posicionales (0, 1, 2...)
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

        # Devuelve el ID del criterio con su peso
        return {criterios[i]: round(pesos[i], 4) for i in range(n)}, round(cr, 4)

    async def calcular_ahp_jerarquico(self, nodo_actual: int, jerarquia: Dict[int, List[int]], comparaciones_por_nodo: Dict[int, List[Comparacion]], peso_global_padre=1.0, resultados=None, reportes_cr=None):
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

    async def guardar_resultados_ahp(self, config_data: DatosConfiguracion, pesos_globales: Dict[int, float]) -> int:
        """
        Guarda la configuración general y los pesos globales mapeados en la BD de forma atómica.
        """
        # Abrimos una transacción para asegurar consistencia total
        async with self.repo.conn.transaction():
            # 1. Insertar la configuración principal y obtener el ID autogenerado
            id_configuracion = await self.repo.crear_configuracion(config_data)
            
            # 2. Guardar los pesos globales calculados (que corresponden a los IDs de tus indicadores hoja)
            for id_indicador, peso_global in pesos_globales.items():
                await self.repo.guardar_peso_indicador(
                    id_configuracion=id_configuracion,
                    id_indicador=id_indicador,
                    peso_global=peso_global
                )
                
            return id_configuracion

    async def obtener_listado_indicadores_preguntas(self, carrera_id: int) -> list[DimensionResponse]:
        return await self.repo.get_arbol_dimensiones_preguntas(carrera_id)
    