from pydantic import BaseModel, Field


class IndicadorCreate(BaseModel):
    """Body esperado en POST /indicadores."""

    carrera_id: int = Field(..., description="Obligatorio")
    nombre: str = Field(
        ..., min_length=3, description="Nombre de la dimensión o indicador"
    )
    dimension: int | None = Field(
        None,
        description="ID del indicador padre. Dejar en null si este registro es una Dimensión principal.",
    )
    activo: bool = True
    preguntas_ids: list[int] | None = Field(
        default=None,
        description="Opcional. Lista de IDs de preguntas para reasignar automáticamente a este indicador al crearlo.",
    )


class IndicadorUpdate(BaseModel):
    """Body esperado en PATCH /indicadores/{id}."""

    nombre: str | None = Field(None, min_length=3)
    dimension: int | None = Field(None)
    activo: bool | None = None
    preguntas_ids: list[int] | None = Field(
        default=None,
        description="Opcional. Lista de IDs de preguntas para reasignar a este indicador. Las preguntas anteriores no incluidas no se borrarán, solo se actualizarán las enviadas.",
    )


class IndicadorResponse(BaseModel):
    """Respuesta estándar de Indicador."""

    id: int
    nombre: str
    dimension: int | None
    activo: bool

    class Config:
        from_attributes = True
