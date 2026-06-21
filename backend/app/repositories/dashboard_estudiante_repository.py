import asyncpg

from app.schemas.asignacion_encuesta import AsignacionEncuestaResponse
from app.schemas.encuesta import EncuestaResponse
from app.schemas.materia import MateriaListResponse
from app.schemas.pregunta import PreguntaResponse
from app.schemas.respuesta import RespuestaItem, RespuestaResponse
from app.schemas.usuario import UsuarioResponse


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
    
    async def total_materias_aprobadas(self, estudiante_id: int) -> int:
        row = await self.conn.fetchrow(
           
        )
        return row["total"] if row else 0
    
    async def get_datos_tutor(self, estudiante_id: int) -> UsuarioResponse | None:
        row = await self.conn.fetchrow(
            """
            SELECT DISTINCT ON (u.id)
                u.id,
                u.nombre,
                u.apellido,
                u.email,
                u.rol
            FROM alertas a
            INNER JOIN intervenciones i ON i.alerta_id = a.id
            INNER JOIN usuarios u ON u.id = i.tutor_id
            WHERE a.estudiante_id = $1
            AND a.estado IN ('en_revision', 'intervenida')
            """
        )
        return UsuarioResponse(**row) if row else None
    
    async def get_preguntas_respuestas(self, estudiante_id: int) -> list[PreguntaResponse,RespuestaResponse]:
        pass
        
    async def materias_aprobadas(self, estudiante_id: int) -> int:
        row = await self.conn.fetchrow(
            """
            SELECT COUNT(DISTINCT materia_id) AS total
            FROM cursadas
            WHERE estudiante_id = $1
            AND estado = 'aprobada'
            """,
            estudiante_id,
        )
        return row["total"] if row else 0
    
    async def materias_totales(self, estudiante_id: int) -> int:
        row = await self.conn.fetchrow(
            """
            SELECT COUNT(DISTINCT m.id) AS total
            FROM plan_estudios pe
            INNER JOIN materias m ON m.plan_id = pe.id
            INNER JOIN estudiantes e ON e.carrera_id = pe.carrera_id
            WHERE pe.activo = TRUE
            AND e.id = $1
            AND pe.anio_vigencia = (
                SELECT MAX(anio_vigencia)
                FROM plan_estudios
                WHERE carrera_id = e.carrera_id
                AND anio_vigencia <= e.anio_ingreso
                AND activo = TRUE
            )
            """,
            estudiante_id,
        )
        return row["total"] if row else 0

    async def listado_materias_cursadas(self, estudiante_id: int) -> list[MateriaListResponse]:
        rows = await self.conn.fetch(
            """
            SELECT
                m.id,
                m.nombre,
                m.codigo,
                m.cuatrimestre_sugerido,
                m.es_basica_critica,
                c.estado
            FROM cursadas c
            INNER JOIN materias m ON m.id = c.materia_id
            WHERE c.estudiante_id = $1
            ORDER BY m.cuatrimestre_sugerido, m.nombre
            """,
            estudiante_id,
        )
        return [MateriaListResponse(**dict(row)) for row in rows]

    async def encuestas_sin_responder(self, estudiante_id: int) -> int:
        row = await self.conn.fetchrow(
            """
            SELECT COUNT(*) AS total
            FROM asignacion_encuestas a
            WHERE a.estudiante_id = $1
            AND a.completada = FALSE
            """,
            estudiante_id,
        )
        return row["total"] if row else 0