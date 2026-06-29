from datetime import datetime, timezone

from app.core.database import get_pool

DIAS_PLAZO = 7

async def verificar_omisiones() -> None:
    pool = get_pool()
    async with pool.acquire() as conn:
        asignaciones_vencidas = await conn.fetch("""
            SELECT a.id, a.estudiante_id, a.fecha_asignacion
            FROM asignacion_encuesta a
            WHERE a.completado = false
              AND a.borrador = false
              AND a.fecha_asignacion + make_interval(days => $1) < CURRENT_TIMESTAMP
              AND NOT EXISTS (
                  SELECT 1 FROM alertas al
                  WHERE al.asignacion_id = a.id
                    AND al.origen = 'omision_encuesta'::public.origen_alerta_enum
              )
        """, DIAS_PLAZO)

        if not asignaciones_vencidas:
            return

        anio_actual = datetime.now(timezone.utc).year

        for asig in asignaciones_vencidas:
            await conn.execute("""
                INSERT INTO alertas
                    (estudiante_id, score_id, asignacion_id, tipo_desercion,
                     nivel_riesgo, origen, anio_cursada)
                VALUES (
                    $1, NULL, $2,
                    (SELECT etapa::text::etapa_desercion_enum FROM estudiantes WHERE id = $1),
                    'alto'::public.nivel_riesgo_enum,
                    'omision_encuesta'::public.origen_alerta_enum,
                    $3
                )
            """, asig['estudiante_id'], asig['id'], anio_actual)
