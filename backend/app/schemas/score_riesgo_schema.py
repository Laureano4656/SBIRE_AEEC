
from typing import Literal

from pydantic import BaseModel, Field, field_validator

class ScoreCreate(BaseModel):
    """Body esperado en POST /indicadores."""

    estudiante_id: int = Field(
        ...,   
        ge=1,
        description="ID del estudiante",    
        examples=[1],
    )
    configuracion_id: int = Field(
        ...,   
        ge=1,
        description="ID de la configuración del indicador",    
        examples=[1],
    )
    score: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Valor del score (entre 0.0 y 1.0)",
        examples=[0.75],
    )
    nivel: str = Field(
        ...,
        description="Nivel de riesgo asociado al score (verde, amarillo o rojo)",
        examples=["amarillo"], 
    )
    calculado_en: datetime | None = Field(
        None,
        description="Fecha y hora de cálculo del score",   
        examples=["2024-01-01T12:00:00Z"],
    )
    score_total_id: int | None = Field(
        None,   
        ge=1,
        description="ID del score total asociado",    
        examples=[1],
    )
    factor_aplicado: float | None = Field(
        None,
        ge=0.0,
        le=1.0,
        description="Valor del factor aplicado a este score (entre 0.0 y 1.0)",
        examples=[0.5],
    )

class ScoreResponse(BaseModel):
    id: int
    estudiante_id: int
    configuracion_id: int
    score: float
    nivel: str
    calculado_en: datetime | None
    score_total_id: int | None
    factor_aplicado: float | None

    class Config:
        from_attributes = True

class ScoreUpdate(BaseModel):
    """Body esperado en PATCH /scores/{id}.
    Todos los campos son opcionales — solo se actualiza lo que se envía.
    """

    estudiante_id: int | None = Field(
        None,   
        ge=1,
        description="ID del estudiante",    
        examples=[1],
    )
    configuracion_id: int | None = Field(
        None,   
        ge=1,
        description="ID de la configuración del indicador",    
        examples=[1],
    )
    score: float | None = Field(
        None,
        ge=0.0,
        le=1.0,
        description="Valor del score (entre 0.0 y 1.0)",
        examples=[0.75],
    )
    nivel: str | None = Field(
        None,
        description="Nivel de riesgo asociado al score (verde, amarillo o rojo)",
        examples=["amarillo"], 
    )
    calculado_en: datetime | None = Field(
        None,
        description="Fecha y hora de cálculo del score",   
        examples=["2024-01-01T12:00:00Z"],
    )
    score_total_id: int | None = Field(
        None,   
        ge=1,
        description="ID del score total asociado",    
        examples=[1],
    )
    factor_aplicado: float | None = Field(
        None,
        ge=0.0,
        le=1.0,
        description="Valor del factor aplicado a este score (entre 0.0 y 1.0)",
        examples=[0.5],
    )