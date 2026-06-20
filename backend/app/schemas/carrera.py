

from pydantic import BaseModel, Field, field_validator


class CarreraCreate(BaseModel):
    """Body esperado en POST /carreras."""

    nombre: str = Field(
        ...,
        min_length=3,
        max_length=200,
        description="Nombre completo de la carrera",
        examples=["Ingeniería Industrial"],
    )
    codigo: str = Field(
        ...,
        min_length=2,
        max_length=20,
        description="Código único de la carrera",
        examples=["II"],
    )
    duracion_cuatrimestre: int = Field(
        ...,
        ge=1,
        le=20,
        description="Duración teórica en cuatrimestres",
        examples=[10],
    )

    @field_validator("codigo")
    @classmethod
    def codigo_uppercase(cls, v: str) -> str:
        """El código siempre se guarda en mayúsculas."""
        return v.upper().strip()


class CarreraUpdate(BaseModel):
    """
    Body esperado en PATCH /carreras/{id}.
    Todos los campos son opcionales — solo se actualiza lo que se envía.
    """

    nombre: str | None = Field(None, min_length=3, max_length=200)
    duracion_cuatrimestre: int | None = Field(None, ge=1, le=20)
    activo: bool | None = None


class CarreraResponse(BaseModel):
    """
    Lo que devuelve la API en cualquier endpoint de Carrera.
    Campos deliberadamente omitidos: ninguno en este caso (Carrera no tiene
    campos sensibles), pero el patrón está establecido para otras entidades.
    """

    id: int
    nombre: str
    codigo: str
    duracion_cuatrimestre: int
    activo: bool

    class Config:
        from_attributes = True
