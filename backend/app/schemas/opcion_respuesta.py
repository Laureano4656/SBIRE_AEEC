from pydantic import BaseModel, Field


class OpcionRespuestaCreate(BaseModel):
    pregunta_id: int | None = Field(None, ge=1)
    texto: str | None = None
    orden: int | None = Field(None, ge=1)


class OpcionRespuestaUpdate(BaseModel):
    pregunta_id: int | None = Field(None, ge=1)
    texto: str | None = None
    orden: int | None = Field(None, ge=1)


class OpcionRespuestaResponse(BaseModel):
    id: int
    pregunta_id: int | None
    texto: str | None
    orden: int | None

    class Config:
        from_attributes = True
