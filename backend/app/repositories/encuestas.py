from app.models import RespuestaItem
from app.models import EncuestaResponse
from app.models import SubmitEncuestaRequest
from app.models import AsignacionEncuestaResponse
from app.models import AsignacionEncuestaCreate
import asyncpg

async def get_survey_with_questions(self, encuesta_id: int) -> EncuestaResponse | None:
        # Trae la encuesta con todas sus preguntas y opciones
        rows = await self.conn.fetch(
            """
            SELECT 
                e.id AS encuesta_id,
                e.titulo,
                e.modalidad,
                p.id AS pregunta_id,
                p.texto,
                p.tipo,
                p.orden,
                p.obligatoria,
                p.condicion_pregunta_id,
                o.id AS opcion_id,
                o.texto AS opcion_texto,
                o.orden AS opcion_orden
            FROM encuestas e
            INNER JOIN preguntas p ON p.encuesta_id = e.id
            LEFT JOIN opcion_respuesta o ON o.pregunta_id = p.id
            WHERE e.id = $1
            ORDER BY p.orden, o.orden
            """,
            encuesta_id
        )

        if not rows:
            return None

        # Armar el objeto encuesta agrupando las opciones por pregunta
        encuesta = {
            "id": rows[0]["encuesta_id"],
            "titulo": rows[0]["titulo"],
            "modalidad": rows[0]["modalidad"],
            "preguntas": {}
        }

        for row in rows:
            pregunta_id = row["pregunta_id"]

            if pregunta_id not in encuesta["preguntas"]:
                encuesta["preguntas"][pregunta_id] = {
                    "id": pregunta_id,
                    "texto": row["texto"],
                    "tipo": row["tipo"],
                    "orden": row["orden"],
                    "obligatoria": row["obligatoria"],
                    "condicion_pregunta_id": row["condicion_pregunta_id"],
                    "opciones": []
                }

            # Solo agrega opciones si la pregunta no es texto libre
            if row["opcion_id"] is not None:
                encuesta["preguntas"][pregunta_id]["opciones"].append({
                    "id": row["opcion_id"],
                    "texto": row["opcion_texto"],
                    "orden": row["opcion_orden"]
                })

        # Convertir el dict de preguntas a lista ordenada
        encuesta["preguntas"] = sorted(
            encuesta["preguntas"].values(),
            key=lambda p: p["orden"]
        )

        return EncuestaResponse(**encuesta)

async def submit_survey_answers(self, asignacion_id: int, respuestas: list[RespuestaItem]) -> None:
    async with self.conn.transaction():
        for respuesta in respuestas:
            await self.conn.execute(
                """
                INSERT INTO respuesta (asignacion_id, pregunta_id, opcion_id, texto_libre, fecha_respuesta)
                VALUES ($1, $2, $3, $4, NOW())
                """,
                asignacion_id,
                respuesta.pregunta_id,
                respuesta.opcion_id,
                respuesta.texto_libre
            )

        await self.conn.execute(
            """
            UPDATE asignacion_encuestas
            SET completada = true, fecha_completada = NOW()
            WHERE id = $1
            """,
            asignacion_id
        )

async def get_assigned_surveys(self, estudiante_id: int) -> list[AsignacionEncuestaResponse]:
    rows = await self.conn.fetch(
        """
        SELECT 
            a.id AS asignacion_id,
            e.id AS encuesta_id,
            e.titulo,
            e.modalidad,
            a.fecha_asignacion,
            a.completada,
            a.fecha_completada
        FROM asignacion_encuestas a
        INNER JOIN encuestas e ON a.encuesta_id = e.id
        WHERE a.estudiante_id = $1
        ORDER BY a.fecha_asignacion DESC
        """,
        estudiante_id
    )
    return [AsignacionEncuestaResponse(**dict(row)) for row in rows]

async def assign_survey(self, data: AsignacionEncuestaCreate) -> AsignacionEncuestaResponse:
    row = await self.conn.fetchrow(
        """
        INSERT INTO asignacion_encuestas (encuesta_id, estudiante_id, fecha_asignacion, completada)
        VALUES ($1, $2, NOW(), false)
        RETURNING 
            id AS asignacion_id,
            encuesta_id,
            (SELECT titulo FROM encuestas WHERE id = $1) AS titulo,
            (SELECT modalidad FROM encuestas WHERE id = $1) AS modalidad,
            fecha_asignacion,
            completada,
            fecha_completada
        """,
        data.encuesta_id, data.estudiante_id
    )
    return AsignacionEncuestaResponse(**dict(row))