from datetime import datetime
from pydantic import BaseModel


class ImportacionArchivo(BaseModel):
    id: int
    usuario_id: int
    nombre_archivo: str
    fecha_importacion: datetime
    filas_importadas: int
    filas_errores: int

    class Config:
        from_attributes = True
