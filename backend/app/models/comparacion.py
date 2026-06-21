
from pydantic import BaseModel

class Comparacion(BaseModel):
    criterio_i: str
    valor: float
    criterio_j: str