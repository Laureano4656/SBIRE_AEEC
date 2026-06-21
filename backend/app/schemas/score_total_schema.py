
from typing import Literal

from pydantic import BaseModel, Field, field_validator

class ScoreTotalCreate(BaseModel):
    """Body esperado en POST /indicadores."""

    estudiante_id: int = Field(
        ...,   
        ge=1,
        description="ID del estudiante",    
        examples=[1],
    )
    valor: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Valor del score total (entre 0.0 y 1.0)",
        examples=[0.75],
    )
    creado_en: datetime | None = Field(
        None,
        description="Fecha y hora de creación del score total",
        examples=["2024-01-01T12:00:00Z"],
    )

class ScoreTotalResponse(BaseModel):
    id: int
    estudiante_id: int
    valor: float
    creado_en: datetime

    class Config:
        from_attributes = True

class ScoreTotalUpdate(BaseModel):
    """Body esperado en PATCH /score_totales/{id}.
    Todos los campos son opcionales — solo se actualiza lo que se envía.
    """

    estudiante_id: int | None = Field(
        None,   
        ge=1,
        description="ID del estudiante",    
        examples=[1],
    )
    valor: float | None = Field(
        None,
        ge=0.0,
        le=1.0,
        description="Valor del score total (entre 0.0 y 1.0)",
        examples=[0.75],
    )
    creado_en: datetime | None = Field(
        None,
        description="Fecha y hora de creación del score total",
        examples=["2024-01-01T12:00:00Z"],
    )