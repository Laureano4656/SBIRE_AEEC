from pydantic import BaseModel, Field


class OpcionPreguntaCrearOpcion(BaseModel):
    texto_opcion: str = Field(min_length=1, max_length=255)
    valor_riesgo_manual: float | None = Field(None, ge=0, le=1)
    orden_visual: int = Field(default=0, ge=0)


class OpcionPreguntaBulkCreate(BaseModel):
    pregunta_id: int = Field(ge=1)
    opciones: list[OpcionPreguntaCrearOpcion] = Field(min_length=1)
    texto_opcion: str = Field(min_length=1, max_length=255)
    valor_riesgo_manual: float | None = Field(None, ge=0, le=1)
    orden_visual: int = Field(default=0, ge=0)


class OpcionPreguntaCreate(BaseModel):
    pregunta_id: int = Field(ge=1)
    texto_opcion: str = Field(min_length=1, max_length=255)
    valor_riesgo_manual: float | None = Field(None, ge=0, le=1)
    orden_visual: int = Field(default=0, ge=0)


class OpcionPreguntaUpdate(BaseModel):
    texto_opcion: str | None = Field(None, min_length=1, max_length=255)
    valor_riesgo_manual: float | None = None
    orden_visual: int | None = Field(None, ge=0)


class OpcionPreguntaResponse(BaseModel):
    id: int
    pregunta_id: int | None
    texto_opcion: str
    valor_riesgo_manual: float | None = None
    orden_visual: int = 0

    class Config:
        from_attributes = True
