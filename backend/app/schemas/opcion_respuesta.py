from pydantic import BaseModel, Field


class OpcionRespuestaCreate(BaseModel):
    pregunta_id: int = Field(ge=1)
    texto: str
    orden: int = Field(ge=1)


class OpcionRespuestaUpdate(BaseModel):
    texto: str | None = None
    orden: int | None = Field(None, ge=1)


class OpcionRespuestaResponse(BaseModel):
    id: int
    pregunta_id: int
    texto: str
    orden: int

    class Config:
        from_attributes = True
