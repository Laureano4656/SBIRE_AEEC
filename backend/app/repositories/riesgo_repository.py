import asyncpg
from typing import Any


class RiesgoRepository:
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.conn = conn

    # ==========================================
    # LECTURAS DE CONFIGURACIÓN Y CONTEXTO
    # ==========================================
    async def obtener_contexto_estudiante(
        self, estudiante_id: int
    ) -> asyncpg.Record | None:
        """Obtiene la carrera y la etapa actual del estudiante para aplicar la configuración correcta."""
        return await self.conn.fetchrow(
            """
            SELECT carrera_id, etapa::text 
            FROM estudiantes 
            WHERE id = $1
        """,
            estudiante_id,
        )

    async def obtener_configuracion_activa(
        self, carrera_id: int, etapa: str
    ) -> asyncpg.Record | None:
        """Busca los umbrales del semáforo específicos para esa carrera y etapa."""
        return await self.conn.fetchrow(
            """
            SELECT id, umbral_amarillo, umbral_rojo, factor_extension
            FROM configuracion_indicador
            WHERE carrera_id = $1 AND etapa = $2 AND activo = TRUE
            ORDER BY actualizado_en DESC
            LIMIT 1
        """,
            carrera_id,
            etapa,
        )

    async def obtener_pesos_ahp(self, configuracion_id: int) -> dict[int, float]:
        """
        Busca los pesos de cada indicador en la base de datos (Ej: tabla peso_indicadores).
        Retorna un diccionario {indicador_id: peso_float}.
        """
        # Si los pesos son globales (no por carrera), podés quitar la cláusula WHERE.
        rows = await self.conn.fetch(
            """
            SELECT id_indicador, peso_global
            FROM peso_indicadores 
            WHERE id_configuracion = $1
        """,
            configuracion_id,
        )
        return {row["id_indicador"]: float(row["peso_global"]) for row in rows}

    async def obtener_estudiantes_por_importacion(
        self, importacion_id: int
    ) -> list[dict]:
        """
        Busca las asignaciones (notas cargadas) que nacieron a partir de un archivo Excel específico.
        """
        # Nota: Ajustá el nombre de la tabla si no se llama 'asignaciones'
        # o si la relación con la importación está en otra tabla (ej: 'notas').
        query = """
            SELECT estudiante_id, id as asignacion_id
            FROM asignacion_encuesta
            WHERE importacion_id = $1;
        """
        registros = await self.conn.fetch(query, importacion_id)

        return [dict(row) for row in registros]

    async def obtener_ultimas_asignaciones_por_carrera(
        self, carrera_id: int, etapa: str
    ) -> list[dict]:
        """Busca el evento (encuesta o nota) más reciente de cada alumno de una carrera."""
        query = """
            SELECT estudiante_id, MAX(id) as asignacion_id
            FROM asignaciones
            WHERE carrera_id = $1 AND etapa = $2
            GROUP BY estudiante_id;
        """
        registros = await self.conn.fetch(query, carrera_id, etapa)
        return [dict(row) for row in registros]

    # ==========================================
    # LECTURAS PARA EL CÁLCULO
    # ==========================================
    async def obtener_respuestas_para_calculo(
        self, asignacion_id: int
    ) -> list[asyncpg.Record]:
        return await self.conn.fetch(
            """
            SELECT 
                r.pregunta_id, r.valor_numerico, r.opcion_seleccionada_id,
                p.indicador_id, p.tipo_pregunta::text, p.configuracion_riesgo::text,
                op.valor_riesgo_manual
            FROM respuesta_estudiante r
            JOIN pregunta p ON r.pregunta_id = p.id
            LEFT JOIN opcion_pregunta op ON r.opcion_seleccionada_id = op.id
            WHERE r.asignacion_id = $1
        """,
            asignacion_id,
        )

    # ==========================================
    # ESCRITURAS TRANSACCIONALES
    # ==========================================
    async def guardar_scores_ahp(
        self, estudiante_id: int, score_total: float, detalles: list[dict[str, Any]]
    ) -> tuple[int, list[dict[str, Any]]]:
        async with self.conn.transaction():
            id_score_total = await self.conn.fetchval(
                """
                INSERT INTO score_total (estudiante_id, valor, creado_en)
                VALUES ($1, $2, CURRENT_TIMESTAMP)
                RETURNING id
            """,
                estudiante_id,
                score_total,
            )

            query_detalle = """
                INSERT INTO score_riesgo 
                (estudiante_id, score, nivel, calculado_en, score_total_id, factor_aplicado, score_ponderado, id_indicador)
                VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5, $6, $7)
                RETURNING id
            """

            # Cambiamos executemany por un loop con fetchval para capturar los IDs
            for d in detalles:
                id_riesgo = await self.conn.fetchval(
                    query_detalle,
                    estudiante_id,
                    d["score"],
                    d["nivel"],
                    id_score_total,
                    d["factor_aplicado"],
                    d["score_ponderado"],
                    d["id_indicador"],
                )
                # Le inyectamos el ID recién creado al diccionario del detalle
                d["id_score_riesgo"] = id_riesgo

            # Retornamos ambas cosas
            return id_score_total, detalles

    # ==========================================
    # LECTURAS PARA EL GET DEL FRONTEND
    # ==========================================
    async def obtener_ultimo_score_total(
        self, estudiante_id: int
    ) -> asyncpg.Record | None:
        return await self.conn.fetchrow(
            """
            SELECT id, valor, creado_en 
            FROM score_total 
            WHERE estudiante_id = $1 
            ORDER BY creado_en DESC LIMIT 1
        """,
            estudiante_id,
        )

    async def obtener_desglose_semaforo(
        self, score_total_id: int
    ) -> list[asyncpg.Record]:
        return await self.conn.fetch(
            """
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
        """,
            score_total_id,
        )

    async def obtener_ultimas_asignaciones_por_estudiante(
        self, estudiante_id: int
    ) -> list[asyncpg.Record]:
        """
        Busca todos los eventos que existan para un estudiante en particular
        y se queda únicamente con la asignación más reciente de cada uno.
        """
        query = """
            SELECT DISTINCT ON (evento_id)
                id as asignacion_id,
                evento_id,
                estudiante_id
            FROM asignacion_encuesta
            WHERE estudiante_id = $1
              AND completado = TRUE
            ORDER BY evento_id, fecha_asignacion DESC;
        """

        return await self.conn.fetch(query, estudiante_id)

    async def obtener_respuestas_para_calculo_bulk(
        self, asignacion_ids: list[int]
    ) -> list[asyncpg.Record]:
        """
        Trae de un solo golpe todas las respuestas asociadas a un lote de asignaciones,
        incluyendo la configuración de riesgo de las preguntas y los valores manuales de las opciones.
        """
        query = """
            SELECT 
                p.indicador_id,
                p.tipo_pregunta,
                p.configuracion_riesgo,
                op.valor_riesgo_manual,
                re.valor_numerico,
                re.valor_texto,
                p.texto_pregunta,
                re.riesgo_calculado,
                re.requiere_revision,
                re.id as respuesta_id
            FROM respuesta_estudiante re
            JOIN pregunta p ON re.pregunta_id = p.id
            LEFT JOIN opcion_pregunta op ON re.opcion_seleccionada_id = op.id
            WHERE re.asignacion_id = ANY($1::int[])
        """
        return await self.conn.fetch(query, asignacion_ids)

    async def actualizar_riesgo_calculado(
        self, respuesta_id: int, riesgo: float
    ) -> None:
        await self.conn.execute(
            "UPDATE respuesta_estudiante SET riesgo_calculado = $1, requiere_revision = false WHERE id = $2",
            riesgo,
            respuesta_id,
        )

    async def marcar_para_revision(self, respuesta_id: int) -> None:
        await self.conn.execute(
            "UPDATE respuesta_estudiante SET requiere_revision = true WHERE id = $1",
            respuesta_id,
        )

    async def obtener_pendientes_revision(
        self, carrera_id: int
    ) -> list[asyncpg.Record]:
        query = """
            SELECT
                re.id as respuesta_id,
                re.asignacion_id,
                e.id as estudiante_id,
                e.legajo,
                CONCAT(e.apellido, ', ', e.nombre) as nombre_completo,
                p.texto_pregunta,
                re.valor_texto,
                ae.fecha_asignacion
            FROM respuesta_estudiante re
            JOIN pregunta p ON re.pregunta_id = p.id
            JOIN asignacion_encuesta ae ON re.asignacion_id = ae.id
            JOIN estudiantes e ON ae.estudiante_id = e.id
            WHERE re.requiere_revision = true
              AND e.carrera_id = $1
            ORDER BY ae.fecha_asignacion DESC
        """
        return await self.conn.fetch(query, carrera_id)

    async def aprobar_revision(self, respuesta_id: int, riesgo: float) -> dict | None:
        row = await self.conn.fetchrow(
            """
            UPDATE respuesta_estudiante
            SET riesgo_calculado = $1, requiere_revision = false
            WHERE id = $2
            RETURNING asignacion_id
            """,
            riesgo,
            respuesta_id,
        )
        if row:
            return dict(row)
        return None

    async def obtener_respuestas_texto_sin_analizar(self) -> list[asyncpg.Record]:
        query = """
            SELECT re.id as respuesta_id, re.valor_texto, p.texto_pregunta
            FROM respuesta_estudiante re
            JOIN pregunta p ON re.pregunta_id = p.id
            WHERE p.tipo_pregunta = 'texto_libre'
              AND re.valor_texto IS NOT NULL
              AND re.riesgo_calculado IS NULL
              AND re.requiere_revision = false
        """
        return await self.conn.fetch(query)

    async def obtener_estudiantes_por_carrera(
        self, carrera_id: int
    ) -> list[asyncpg.Record]:
        """
        Trae únicamente los IDs de todos los estudiantes inscritos en una carrera.
        """
        query = """
            SELECT id as estudiante_id
            FROM estudiantes
            WHERE carrera_id = $1;
        """
        return await self.conn.fetch(query, carrera_id)
