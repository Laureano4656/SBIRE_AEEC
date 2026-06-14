import asyncpg
from fastapi import APIRouter, Depends, status

from app.api.deps import get_conn
from app.schemas.materia import MateriaCreate, MateriaResponse, MateriaUpdate
from app.services.materia_service import MateriaService

router = APIRouter(prefix="/materias", tags=["materias"])


@router.get("/", response_model=list[MateriaResponse])
async def listar_materias(
    solo_activos: bool = True,
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[MateriaResponse]:
    service = MateriaService(conn)
    items = await service.listar(solo_activos=solo_activos)
    return [MateriaResponse.model_validate(item) for item in items]


@router.get("/{materia_id}", response_model=MateriaResponse)
async def obtener_materia(
    materia_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> MateriaResponse:
    service = MateriaService(conn)
    item = await service.obtener_por_id(materia_id)
    return MateriaResponse.model_validate(item)


@router.post("/", response_model=MateriaResponse, status_code=status.HTTP_201_CREATED)
async def crear_materia(
    body: MateriaCreate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> MateriaResponse:
    service = MateriaService(conn)
    item = await service.crear(**body.model_dump())
    return MateriaResponse.model_validate(item)


@router.patch("/{materia_id}", response_model=MateriaResponse)
async def actualizar_materia(
    materia_id: int,
    body: MateriaUpdate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> MateriaResponse:
    service = MateriaService(conn)
    item = await service.actualizar(materia_id, **body.model_dump(exclude_unset=True))
    return MateriaResponse.model_validate(item)


@router.delete("/{materia_id}", response_model=dict[str, str])
async def eliminar_materia(
    materia_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, str]:
    service = MateriaService(conn)
    return await service.eliminar(materia_id)
