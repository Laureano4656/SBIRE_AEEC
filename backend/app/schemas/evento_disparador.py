from typing import Literal, Any
from pydantic import BaseModel, Field

class EventoDisparadorResponse(BaseModel):
    id: int
    nombre: str

class EventoDisparadorCreate(BaseModel):
    nombre: str

class EventoDisparadorUpdate(BaseModel):
    nombre: str | None = None

