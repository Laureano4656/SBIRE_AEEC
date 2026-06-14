from pydantic import BaseModel

class IntervencionCreate(BaseModel):
    alerta_id: int
    tutor_id: int
    tipo: str
    resultado: str
    fecha: str
    descripcion: str | None = None
    
class EntrevistaCreate(BaseModel):
    alerta_id: int
    estudiante_id: int
    tutor_id: int
    fecha_propuesta: str
    modalidad: str
    notas_previas: str | None = None
    estado: str 
    intervencion_id : int