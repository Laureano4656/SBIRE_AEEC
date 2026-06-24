
from typing import Literal
from datetime import datetime
from pydantic import BaseModel, Field, field_validator


class EstudianteCreate(BaseModel):
    """Body esperado en POST /estudiantes."""

    carrera_id: int = Field(
        ...,
        ge=1,
        description="ID de la carrera asociada",
        examples=[1],
    )
    nombre: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Nombre del estudiante",
        examples=["María"],
    )
    apellido: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Apellido del estudiante",
        examples=["Pérez"],
    )
    email: str | None = Field(
        None,
        max_length=100,
        description="Correo electrónico institucional o personal",
        examples=["maria.perez@example.edu"],
    )
    legajo: str = Field(
        ...,
        min_length=1,
        max_length=10,
        description="Legajo del estudiante",
        examples=["12345"],
    )
    dni: str = Field(
        ...,
        min_length=1,
        max_length=16,
        description="Documento del estudiante",
        examples=["40123456"],
    )
    anio_ingreso: int = Field(
        ...,
        ge=1900,
        description="Año de ingreso a la carrera",
        examples=[2023],
    )
    etapa: Literal["temprana", "media", "tardia"] = Field(
        default="temprana",
        description="Etapa de deserción (enum_etapa_estudiante)",
        examples=["temprana"],
    )
    porcentaje_carrera: float = Field(
        default=0.0,
        ge=0.0,
        le=100.0,
        description="Porcentaje de avance en la carrera",
        examples=[0.0],
    )
    activo: bool = Field(
        default=True,
        description="Indica si el estudiante está activo",
        examples=[True],
    )
    moodle_id: str | None = Field(
        None,
        max_length=255,
        description="Identificador del estudiante en Moodle",
        examples=["987654"],
    )

    @field_validator("nombre", "apellido", "legajo", "dni")
    @classmethod
    def strip_fields(cls, value: str) -> str:
        return value.strip()

    @field_validator("email", "moodle_id")
    @classmethod
    def strip_optional_fields(cls, value: str | None) -> str | None:
        return value.strip() if value else value

    @field_validator('anio_ingreso')
    @classmethod
    def validar_anio_maximo(cls, v: int) -> int:
        anio_actual = datetime.now().year
        
        if v > anio_actual:
            raise ValueError(f"El año de ingreso no puede ser mayor al año actual ({anio_actual}).")
        
        if v < 1950:
            raise ValueError("El año de ingreso no es válido.")
            
        return v


class EstudianteUpdate(BaseModel):
    """
    Body esperado en PATCH /estudiantes/{id}.
    Todos los campos son opcionales — solo se actualiza lo que se envía.
    """

    carrera_id: int | None = Field(None, ge=1)
    nombre: str | None = Field(None, min_length=1, max_length=255)
    apellido: str | None = Field(None, min_length=1, max_length=255)
    email: str | None = Field(None, max_length=100)
    legajo: str | None = Field(None, min_length=1, max_length=10)
    dni: str | None = Field(None, min_length=1, max_length=16)
    anio_ingreso: int | None = Field(None, ge=1900)
    etapa: Literal["temprana", "media", "tardia"] | None = None
    porcentaje_carrera: float | None = Field(None, ge=0.0, le=100.0)
    activo: bool | None = None
    moodle_id: str | None = Field(None, max_length=255)

    @field_validator('anio_ingreso')
    @classmethod
    def validar_anio_maximo(cls, v: int) -> int:
        anio_actual = datetime.now().year
        
        if v > anio_actual:
            raise ValueError(f"El año de ingreso no puede ser mayor al año actual ({anio_actual}).")
        
        if v < 1950:
            raise ValueError("El año de ingreso no es válido.")
            
        return v


class EstudianteResponse(BaseModel):
    """Respuesta estándar de Estudiante."""

    id: int
    carrera_id: int | None
    nombre: str
    apellido: str
    email: str | None
    legajo: str
    dni: str
    anio_ingreso: int
    etapa: Literal["temprana", "media", "tardia"]
    porcentaje_carrera: float
    activo: bool
    moodle_id: str | None

    class Config:
        from_attributes = True
