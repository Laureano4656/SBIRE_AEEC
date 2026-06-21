from dataclasses import fields

from app.models import RespuestaItem
from app.models import SubmitEncuestaRequest
from app.models import AsignacionEncuestaResponse
from app.models import AsignacionEncuestaCreate
from app.repositories.crud_repository import CrudRepository, CrudTableConfig
import asyncpg

from app.schemas.encuesta import EncuestaCreate, EncuestaListResponse, EncuestaResponse, EncuestaUpdate


class EncuestasRepository(CrudRepository[EncuestaResponse]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            conn,
            EncuestaResponse,
            CrudTableConfig(
                table_name="encuestas",
                columns=(
                    "id", "titulo", "estado", "modalidad", "fecha_desde", "fecha_hasta",
                    "periodica", "frecuencia_dias"
                ),
                order_by="id DESC"
            )
        )
    
    async def create_encuesta(self, encuesta: EncuestaCreate) -> EncuestaResponse:
        return await self.create(
            titulo=encuesta.titulo,
            estado=encuesta.estado,
            modalidad=encuesta.modalidad,
            fecha_desde=encuesta.fecha_desde,
            fecha_hasta=encuesta.fecha_hasta,
            periodica=encuesta.periodica,
            frecuencia_dias=encuesta.frecuencia_dias
        )
        
    async def update_encuesta(self, encuesta_id: int, encuesta: EncuestaUpdate) -> EncuestaResponse:
        fields = encuesta.model_dump(exclude_none=True)
        return await self.update(encuesta_id, **fields)
    

async def get_survey_with_questions(self, encuesta_id: int) -> EncuestaListResponse | None:
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

        return EncuestaListResponse(**encuesta)