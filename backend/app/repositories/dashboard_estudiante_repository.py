import asyncpg

from app.schemas.asignacion_encuesta import AsignacionEncuestaResponse
from app.schemas.encuesta import EncuestaResponse
from app.schemas.respuesta import RespuestaItem


class dashboardEstudiantesRepository:
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.conn = conn

    async def get_survey_with_questions(self, encuesta_id: int) -> EncuestaResponse | None:
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
            encuesta_id,
        )

        if not rows:
            return None

        encuesta = {
            "id": rows[0]["encuesta_id"],
            "titulo": rows[0]["titulo"],
            "modalidad": rows[0]["modalidad"],
            "preguntas": {},
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
                    "opciones": [],
                }

            if row["opcion_id"] is not None:
                encuesta["preguntas"][pregunta_id]["opciones"].append(
                    {
                        "id": row["opcion_id"],
                        "texto": row["opcion_texto"],
                        "orden": row["opcion_orden"],
                    }
                )

        encuesta["preguntas"] = sorted(
            encuesta["preguntas"].values(),
            key=lambda p: p["orden"],
        )

        return EncuestaResponse(**encuesta)

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
            estudiante_id,
        )
        return [AsignacionEncuestaResponse(**dict(row)) for row in rows]
