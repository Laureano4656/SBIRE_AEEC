import asyncpg
from typing import Any

class RiesgoRepository:
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.conn = conn

    # ==========================================
    # LECTURAS DE CONFIGURACIÓN Y CONTEXTO
    # ==========================================
    async def obtener_contexto_estudiante(self, estudiante_id: int) -> asyncpg.Record | None:
        """Obtiene la carrera y la etapa actual del estudiante para aplicar la configuración correcta."""
        return await self.conn.fetchrow("""
            SELECT carrera_id, etapa::text 
            FROM estudiantes 
            WHERE id = $1
        """, estudiante_id)

    async def obtener_configuracion_activa(self, carrera_id: int, etapa: str) -> asyncpg.Record | None:
        """Busca los umbrales del semáforo específicos para esa carrera y etapa."""
        return await self.conn.fetchrow("""
            SELECT umbral_amarillo, umbral_rojo, factor_extension
            FROM configuracion_indicador
            WHERE carrera_id = $1 AND etapa = $2 AND activo = TRUE
            ORDER BY actualizado_en DESC
            LIMIT 1
        """, carrera_id, etapa)

    async def obtener_pesos_ahp(self, carrera_id: int) -> dict[int, float]:
        """
        Busca los pesos de cada indicador en la base de datos (Ej: tabla pesos_indicadores).
        Retorna un diccionario {indicador_id: peso_float}.
        """
        # Nota: Asumiendo que tenés una tabla 'pesos_indicadores' relacional para no hardcodear.
        # Si los pesos son globales (no por carrera), podés quitar la cláusula WHERE.
        rows = await self.conn.fetch("""
            SELECT indicador_id, peso 
            FROM pesos_indicadores 
            WHERE carrera_id = $1 AND activo = TRUE
        """, carrera_id)
        return {row['indicador_id']: float(row['peso']) for row in rows}

    # ==========================================
    # LECTURAS PARA EL CÁLCULO
    # ==========================================
    async def obtener_respuestas_para_calculo(self, asignacion_id: int) -> list[asyncpg.Record]:
        return await self.conn.fetch("""
            SELECT 
                r.pregunta_id, r.valor_numerico, r.opcion_seleccionada_id,
                p.indicador_id, p.tipo_pregunta::text, p.configuracion_riesgo::text,
                op.valor_riesgo_manual
            FROM respuesta_estudiante r
            JOIN pregunta p ON r.pregunta_id = p.id
            LEFT JOIN opcion_pregunta op ON r.opcion_seleccionada_id = op.id
            WHERE r.asignacion_id = $1
        """, asignacion_id)

    # ==========================================
    # ESCRITURAS TRANSACCIONALES
    # ==========================================
    async def guardar_scores_ahp(self, estudiante_id: int, score_total: float, detalles: list[dict[str, Any]]) -> int:
        async with self.conn.transaction():
            id_score_total = await self.conn.fetchval("""
                INSERT INTO score_total (estudiante_id, valor, creado_en)
                VALUES ($1, $2, CURRENT_TIMESTAMP)
                RETURNING id
            """, estudiante_id, score_total)

            query_detalle = """
                INSERT INTO score_riesgo 
                (estudiante_id, score, nivel, calculado_en, score_total_id, factor_aplicado, score_ponderado, id_indicador)
                VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5, $6, $7)
            """
            valores_detalle = [
                (
                    estudiante_id, 
                    d["score"], 
                    d["nivel"], 
                    id_score_total, 
                    d["factor_aplicado"], 
                    d["score_ponderado"], 
                    d["id_indicador"]
                )
                for d in detalles
            ]
            await self.conn.executemany(query_detalle, valores_detalle)
            
            return id_score_total

    # ==========================================
    # LECTURAS PARA EL GET DEL FRONTEND
    # ==========================================
    async def obtener_ultimo_score_total(self, estudiante_id: int) -> asyncpg.Record | None:
        return await self.conn.fetchrow("""
            SELECT id, valor, creado_en 
            FROM score_total 
            WHERE estudiante_id = $1 
            ORDER BY creado_en DESC LIMIT 1
        """, estudiante_id)

    async def obtener_desglose_semaforo(self, score_total_id: int) -> list[asyncpg.Record]:
        return await self.conn.fetch("""
            SELECT 
                sr.id_indicador,
                sr.score,
                sr.nivel,
                sr.factor_aplicado,
                sr.score_ponderado,
                ind.nombre as nombre_indicador,
                dim.nombre as nombre_dimension
            FROM score_riesgo sr
            JOIN indicador ind ON sr.id_indicador = ind.id
            LEFT JOIN indicador dim ON ind.dimension = dim.id
            WHERE sr.score_total_id = $1
        """, score_total_id)