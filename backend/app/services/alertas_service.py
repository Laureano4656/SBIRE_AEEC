import asyncpg
from fastapi import HTTPException, status
from app.repositories.alertas_repository import AlertasRepository
from app.schemas.alertas import AlertaCreate, AlertaResponse

class AlertasService:
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.conn = conn
        self.repo = AlertasRepository(conn)

    async def crear_alerta(self, alerta: AlertaCreate) -> AlertaResponse:
        """Crea una nueva alerta en el sistema."""
        return await self.repo.create_alerta(alerta)

    async def actualizar_estado_alerta(self, alerta_id: int, nuevo_estado: str) -> AlertaResponse:
        """Actualiza el estado de una alerta validando que sea una transición permitida."""
        
        estados_validos = ["nueva", "en_revision", "resuelta", "intervenida", "falso_positivo"]
        
        if nuevo_estado not in estados_validos:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail=f"Estado inválido."
            )
            
        alerta_actualizada = await self.repo.update_estado_alerta(alerta_id, nuevo_estado)
        
        if not alerta_actualizada:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail=f"No se encontró la alerta con ID."
            )
            
        return alerta_actualizada

    async def obtener_alertas_por_carrera(self, carrera_id: int) -> list[AlertaResponse]:
        """Obtiene el historial completo de alertas para una carrera."""
        return await self.repo.get_alertas_por_carrera(carrera_id)

    async def obtener_alertas_pendientes_por_carrera(self, carrera_id: int) -> list[AlertaResponse]:
        """Obtiene solo las alertas que requieren atención ('nueva' o 'en_revision')."""
        return await self.repo.get_alertas_sin_atender_por_carrera(carrera_id)

    async def obtener_alertas_por_estudiante(self, estudiante_id: int) -> list[AlertaResponse]:
        """Obtiene las alertas de un único estudiante."""
        return await self.repo.get_alertas_por_estudiante(estudiante_id)
    
    async def obtener_alertas_pendientes_por_estudiante(self, estudiante_id: int) -> list[AlertaResponse]:
        """Obtiene las alertas pendientes de un único estudiante."""
        return await self.repo.get_alertas_pendientes_por_estudiante(estudiante_id)

    