from pydantic import BaseModel, Field


class CorrelativaCreate(BaseModel):
    materia_id: int | None = Field(None, ge=1)
    requiere_materia_id: int | None = Field(None, ge=1)


class CorrelativaUpdate(BaseModel):
    materia_id: int | None = Field(None, ge=1)
    requiere_materia_id: int | None = Field(None, ge=1)


class CorrelativaResponse(BaseModel):
    id: int
    materia_id: int | None
    requiere_materia_id: int | None

    class Config:
        from_attributes = True
