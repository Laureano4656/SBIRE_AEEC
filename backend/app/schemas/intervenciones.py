from datetime import date

from pydantic import BaseModel

class IntervencionCreate(BaseModel):
    alerta_id: int
    tutor_id: int
    tipo: str
    resultado: str
    fecha: date
    descripcion: str | None = None
    
    class Config:
        from_attributes = True

class IntervencionResponse(BaseModel):
    id: int
    alerta_id: int
    tutor_id: int
    tipo: str
    resultado: str
    fecha: date
    descripcion: str | None = None
    
    class Config:
        from_attributes = True
    
class IntervencionUpdate(BaseModel):
    resultado: str
    descripcion: str | None = None