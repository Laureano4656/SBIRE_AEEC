from pydantic import BaseModel


class OpcionPregunta(BaseModel):
    id: int
    pregunta_id: int | None
    texto_opcion: str
    valor_riesgo_manual: float | None = None
    orden_visual: int = 0

    class Config:
        from_attributes = True
