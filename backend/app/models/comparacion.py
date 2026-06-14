
from pydantic import BaseModel

class Comparacion(BaseModel):
    criterio_i: str
    valor: float
    criterio_j: str

class AHPRequest(BaseModel):
    nodo_raiz: str
    jerarquia: dict[str, list[str]]
    comparaciones_por_nodo: dict[str, list[Comparacion]]