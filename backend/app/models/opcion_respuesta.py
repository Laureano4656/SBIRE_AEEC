from pydantic import BaseModel


class OpcionRespuesta(BaseModel):
    id: int
    pregunta_id: int | None
    texto: str | None
    orden: int | None

    class Config:
        from_attributes = True
