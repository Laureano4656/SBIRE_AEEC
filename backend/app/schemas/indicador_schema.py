
from typing import Literal

from pydantic import BaseModel, Field, field_validator

class IndicadorCreate(BaseModel):
    """Body esperado en POST /indicadores."""

    nombre: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Nombre del indicador",
        examples=["Promedio General"],
    )
    id : int = Field(
        ...,
        ge=1,
        description="ID del indicador",
        examples=[1],
    )
    activo: bool = Field(
        default=True,
        description="Indica si el indicador está activo o no",
        examples=[True],
    )   

class IndicadorResponse(BaseModel):
    id: int
    nombre: str
    activo: bool

    class Config:
        from_attributes = True

class IndicadorUpdate(BaseModel):
    """Body esperado en PATCH /indicadores/{id}.
    Todos los campos son opcionales — solo se actualiza lo que se envía.
    """

    nombre: str | None = Field(
        None,
        min_length=1,
        max_length=255,
        description="Nombre del indicador",
        examples=["Promedio General"],
    )
    activo: bool | None = Field(
        None,
        description="Indica si el indicador está activo o no",
        examples=[True],
    )  
    