
from pydantic import BaseModel, Field, field_validator

class PesoIndicadorCreate(BaseModel):
    indicador_id: int | None = Field(None, ge=1)
    peso: float = Field(..., ge=0.0, le=1.0)

    @field_validator('peso')
    def validate_peso(cls, value):
        if not (0.0 <= value <= 1.0):
            raise ValueError('El peso debe estar entre 0.0 y 1.0')
        return value

class PesoIndicadorUpdate(BaseModel):
    indicador_id: int | None = Field(None, ge=1)
    peso: float | None = Field(None, ge=0.0, le=1.0)

    @field_validator('peso')
    def validate_peso(cls, value):
        if value is not None and not (0.0 <= value <= 1.0):
            raise ValueError('El peso debe estar entre 0.0 y 1.0')
        return value

class PesoIndicadorResponse(BaseModel):
    id: int
    indicador_id: int | None
    peso: float

    class Config:
        from_attributes = True