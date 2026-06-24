from pydantic import BaseModel, Field


class ParcialCreate(BaseModel):
    cursada_id: int | None = Field(None, ge=1)
    numero_parcial: int = Field(..., ge=1, le=4)
    nota: float = Field(..., ge=0, le=10) 
    recuperatorio: bool = False


class ParcialUpdate(BaseModel):
    cursada_id: int | None = Field(None, ge=1)
    numero_parcial: int | None = Field(None, ge=1, le=4)
    nota: float | None = Field(None, ge=0, le=10)
    recuperatorio: bool | None = None


class ParcialResponse(BaseModel):
    id: int
    cursada_id: int | None
    numero_parcial: int
    nota: float
    recuperatorio: bool

    class Config:
        from_attributes = True
