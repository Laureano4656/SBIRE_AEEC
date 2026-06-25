from pydantic import BaseModel

class Comparacion(BaseModel):
    criterio_i: int
    criterio_j: int
    valor: float