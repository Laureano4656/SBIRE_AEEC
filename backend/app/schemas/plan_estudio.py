
from pydantic import BaseModel, Field, field_validator


class PlanEstudioCreate(BaseModel):
    """Body esperado en POST /plan-estudios."""

    nombre: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Nombre del plan de estudios",
        examples=["Plan 2008"],
    )
    anio_vigencia: int = Field(
        ...,
        ge=1,
        description="Año de vigencia del plan",
        examples=[2008],
    )
    activo: bool = Field(
        default=True,
        description="Indica si el plan está activo",
        examples=[True],
    )

    @field_validator("nombre")
    @classmethod
    def nombre_strip(cls, value: str) -> str:
        return value.strip()


class PlanEstudioUpdate(BaseModel):
    """
    Body esperado en PATCH /plan-estudios/{id}.
    Todos los campos son opcionales — solo se actualiza lo que se envía.
    """

    carrera_id: int | None = Field(None, ge=1)
    nombre: str | None = Field(None, min_length=1, max_length=50)
    anio_vigencia: int | None = Field(None, ge=1)
    activo: bool | None = None


class PlanEstudioResponse(BaseModel):
    """Respuesta estándar de Plan de Estudio."""

    id: int
    carrera_id: int
    nombre: str
    anio_vigencia: int
    activo: bool

    class Config:
        from_attributes = True
