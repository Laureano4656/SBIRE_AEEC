from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status, BackgroundTasks, Request
import asyncpg
from app.models.usuario import Usuario
from app.schemas.importacion_archivo import (
    ImportacionArchivoResponse,
    ImportacionArchivoUpdate,
)
from app.services.importacion_archivo_service import ImportacionArchivoService
from app.api.deps import get_conn, get_current_user
from app.services.riesgo_service import RiesgoService
from app.core.database import get_pool

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
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    materia_id: int = Form(...),
    usuario: Usuario = Depends(get_current_user),
    conn: asyncpg.Connection = Depends(get_conn),
    pool: asyncpg.Pool = Depends(get_pool)
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
        # 1. Guardado síncrona en la BD (tu código original intacto)
        importacion = await service.importar(
            file_content=content,
            filename=file.filename or "archivo",
            materia_id=materia_id,
            usuario_id=usuario.id,
        )

        estudiantes_afectados = [1] ####### Hardcodeado para que no tire error
        
        background_tasks.add_task(
            RiesgoService.tarea_background_recalcular_masivo,
            pool=pool,
            estudiante_ids=estudiantes_afectados
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    # Devuelve el 201 de inmediato al usuario avisando cuántas filas leyó
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
