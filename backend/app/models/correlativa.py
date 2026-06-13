from pydantic import BaseModel


class Correlativa(BaseModel):
    id: int
    materia_id: int | None
    requiere_materia_id: int | None

    class Config:
        from_attributes = True
