
from pydantic import BaseModel

class Comparacion(BaseModel):
    criterio_i: str
    valor: float
    criterio_j: str

class AHPRequest(BaseModel):
    nodo_raiz: str
    jerarquia: Dict[str, List[str]]
    comparaciones_por_nodo: Dict[str, List[Comparacion]]