from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
import asyncpg
from app.models.usuario import Usuario
from app.schemas.importacion_archivo import (
    ImportacionArchivoResponse,
    ImportacionArchivoUpdate,
)
from app.services.importacion_archivo_service import ImportacionArchivoService
from app.api.deps import get_conn, get_current_user

router = APIRouter(prefix="/importaciones-archivo", tags=["importaciones_archivo"])


@router.get("/", response_model=list[ImportacionArchivoResponse])
async def listar_importaciones(
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[ImportacionArchivoResponse]:
    service = ImportacionArchivoService(conn)
    importaciones = await service.listar(solo_activos=False)
    return [ImportacionArchivoResponse.model_validate(i) for i in importaciones]


@router.get("/{importacion_id}", response_model=ImportacionArchivoResponse)
async def obtener_importacion(
    importacion_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> ImportacionArchivoResponse:
    service = ImportacionArchivoService(conn)
    return ImportacionArchivoResponse.model_validate(
        await service.obtener_por_id(importacion_id)
    )


@router.post("/upload", response_model=ImportacionArchivoResponse, status_code=201)
async def subir_archivo(
    file: UploadFile = File(...),
    materia_id: int = Form(...),
    usuario: Usuario = Depends(get_current_user),
    conn: asyncpg.Connection = Depends(get_conn),
) -> ImportacionArchivoResponse:
    ext = file.filename.rsplit(".", 1)[-1].lower() if file.filename else ""
    if ext not in ("csv", "xlsx", "xls"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Formato de archivo no soportado. Use CSV o XLSX.",
        )

    content = await file.read()
    service = ImportacionArchivoService(conn)
    try:
        importacion = await service.importar(
            file_content=content,
            filename=file.filename or "archivo",
            materia_id=materia_id,
            usuario_id=usuario.id,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    return ImportacionArchivoResponse.model_validate(importacion)


@router.patch("/{importacion_id}", response_model=ImportacionArchivoResponse)
async def actualizar_importacion(
    importacion_id: int,
    body: ImportacionArchivoUpdate,
    conn: asyncpg.Connection = Depends(get_conn),
) -> ImportacionArchivoResponse:
    service = ImportacionArchivoService(conn)
    return ImportacionArchivoResponse.model_validate(
        await service.actualizar(
            importacion_id, **body.model_dump(exclude_unset=True)
        )
    )


@router.patch("/{importacion_id}/desactivar", response_model=dict[str, str])
async def desactivar_importacion(
    importacion_id: int,
    conn: asyncpg.Connection = Depends(get_conn),
) -> dict[str, str]:
    service = ImportacionArchivoService(conn)
    return await service.eliminar(importacion_id)
