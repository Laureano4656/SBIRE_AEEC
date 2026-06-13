from pydantic import BaseModel


class InscripcionCuatrimestre(BaseModel):
    id: int
    estudiante_id: int | None
    anio: int
    cuatrimestre: int
    materilas_anotadas: int
    activo: bool

    class Config:
        from_attributes = True
