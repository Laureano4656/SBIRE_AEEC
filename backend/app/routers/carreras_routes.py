from fastapi import APIRouter, Depends
import asyncpg

from app.schemas.carrera import CarreraCreate, CarreraResponse
from app.services.carreras_service import CarreraService
from app.api.deps import get_conn
# from app.api.deps import get_db, get_current_user
# from app.services.alerta_service import AlertaService
# from app.api.v1.schemas.alerta import AlertaResponse, AlertaFiltros, AlertaCierreRequest

router = APIRouter(prefix="/carreras", tags=["carreras"])

@router.get("/")
async def get_carreras(conn: asyncpg.Connection = Depends(get_conn), solo_activas: bool = True) -> list[CarreraResponse]:
   service = CarreraService(conn)
   carreras = await service.listar(solo_activos=solo_activas)
   # FastAPI convierte automáticamente list[Carrera] → list[CarreraResponse]
   return [CarreraResponse.model_validate(c) for c in carreras]

@router.post("/")
async def create_carrera(
    data: CarreraCreate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> CarreraResponse:
    service = CarreraService(conn)
    carrera = await service.crear(**data.model_dump())
    return CarreraResponse.model_validate(carrera)