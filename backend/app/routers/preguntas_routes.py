import asyncpg
from fastapi import APIRouter, Depends, status

from app.api.deps import get_conn
from app.schemas.pregunta import PreguntaCreate, PreguntaResponse, PreguntaUpdate
from app.services.pregunta_service import PreguntaService

router = APIRouter(prefix="/preguntas", tags=["preguntas"])


@router.get("/", response_model=list[PreguntaResponse])
async def listar_preguntas(
    solo_activos: bool = True,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[PreguntaResponse]:
    service = PreguntaService(conn)
    items = await service.listar(solo_activos=solo_activos)
    return [PreguntaResponse.model_validate(item) for item in items]


@router.get("/{pregunta_id}", response_model=PreguntaResponse)
async def obtener_pregunta(
    pregunta_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> PreguntaResponse:
    service = PreguntaService(conn)
    item = await service.obtener_por_id(pregunta_id)
    return PreguntaResponse.model_validate(item)


@router.put("/", response_model=PreguntaResponse, status_code=status.HTTP_201_CREATED)
async def crear_pregunta(
    body: PreguntaCreate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> PreguntaResponse:
    service = PreguntaService(conn)
    # Cambiamos "crear_pregunta" por "crear"
    # y desempaquetamos el schema usando **body.model_dump()
    item = await service.crear(**body.model_dump(exclude_unset=True))
    return PreguntaResponse.model_validate(item)


@router.patch("/{pregunta_id}", response_model=PreguntaResponse)
async def actualizar_pregunta(
    pregunta_id: int,
    body: PreguntaUpdate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> PreguntaResponse:
    service = PreguntaService(conn)
    # Cambiamos "actualizar_pregunta" por "actualizar"
    item = await service.actualizar(pregunta_id, **body.model_dump(exclude_unset=True))
    return PreguntaResponse.model_validate(item)


@router.delete("/{pregunta_id}", response_model=dict[str, str])
async def eliminar_pregunta(
    pregunta_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, str]:
    service = PreguntaService(conn)
    return await service.eliminar(pregunta_id)
