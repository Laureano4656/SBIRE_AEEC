from fastapi import APIRouter, Depends
import asyncpg

from app.schemas.carrera import CarreraResponse
from app.services.carreras_service import CarreraService
from app.api.deps import get_conn
# from app.api.deps import get_db, get_current_user
# from app.services.alerta_service import AlertaService
# from app.api.v1.schemas.alerta import AlertaResponse, AlertaFiltros, AlertaCierreRequest

router = APIRouter(prefix="/carreras", tags=["carreras"])

@router.get("/")
async def get_carreras(conn: asyncpg.Connection = Depends(get_conn), solo_activas: bool = True) -> list[CarreraResponse]:
   service = CarreraService(conn)
   carreras = await service.listar(solo_activas=solo_activas)
   # FastAPI convierte automáticamente list[Carrera] → list[CarreraResponse]
   return [CarreraResponse.model_validate(c) for c in carreras]

@router.post("/")
async def create_carrera():
    return {"message": "Career created"}
# @router.get("/", response_model=list[AlertaResponse])
# async def listar_alertas(
#   filtros: AlertaFiltros = Depends(),
#   db: AsyncSession = Depends(get_db),
#   usuario_actual = Depends(get_current_user),
# ) -> list[AlertaResponse]:
#   # El router solo valida, delega y devuelve
#   service = AlertaService(db)
#   return await service.listar_para_usuario(usuario_actual, filtros)

# @router.patch("/{alerta_id}/cerrar")
# async def cerrar_alerta(
#   alerta_id: str,
#   body: AlertaCierreRequest,
#   db: AsyncSession = Depends(get_db),
#   usuario_actual = Depends(get_current_user),
# ) -> AlertaResponse:
#   service = AlertaService(db)
#   return await service.cerrar(alerta_id, body.estado, usuario_actual)