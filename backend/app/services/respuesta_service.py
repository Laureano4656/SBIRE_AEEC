import asyncpg
from fastapi import HTTPException, status
from app.models.respuesta import RespuestaEstudiante
from app.services.crud_service import CrudService
from app.repositories.respuestas_repository import RespuestasRepository
from app.schemas.respuesta import EncuestaSubmit

class RespuestaService(CrudService[RespuestaEstudiante]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        repo_custom = RespuestasRepository(conn)
        super().__init__(repo_custom, "RespuestaEstudiante")

    async def procesar_envio_encuesta(self, asignacion_id: int, data: EncuestaSubmit) -> dict[str, str]:
        # 1. Verificamos el estado actual
        estado_actual = await self.repo.get_estado_asignacion(asignacion_id)
        
        if not estado_actual:
            raise HTTPException(status_code=404, detail="Asignación no encontrada.")

        # 2. Lógica de seguridad
        if estado_actual == 'Completada' and not data.es_actualizacion:
            raise HTTPException(
                status_code=400, 
                detail="La encuesta ya fue completada. Si deseas corregir un error, activa el modo actualización."
            )

        # 3. Determinación del nuevo estado
        nuevo_estado = None
        if data.es_envio_final:
            nuevo_estado = 'Completada'
        elif data.es_actualizacion and not data.es_envio_final:
            nuevo_estado = 'Pendiente_Actualizacion'

        # 4. Transformar los esquemas a diccionarios y enviar al repo
        respuestas_dicts = [r.model_dump(exclude_unset=True) for r in data.respuestas]
        
        await self.repo.guardar_transaccion_encuesta(asignacion_id, respuestas_dicts, nuevo_estado)

        # 5. Respuesta semántica al frontend
        if data.es_envio_final:
            if data.es_actualizacion:
                return {"mensaje": "Encuesta actualizada y cerrada con éxito."}
            return {"mensaje": "Encuesta completada con éxito."}
        else:
            return {"mensaje": "Borrador guardado exitosamente."}
