# services/carrera_service.py
# ─────────────────────────────────────────────────────────────────────────────
# Service de Carrera — contiene toda la lógica de negocio de esta entidad.
#
# Responsabilidades de esta capa:
#   ✓ Validar reglas de negocio ("no puede haber dos carreras con el mismo código")
#   ✓ Orquestar uno o más repositories
#   ✓ Lanzar excepciones HTTP con mensajes claros cuando algo falla
#   ✓ Decidir qué se puede y qué no se puede hacer
#
# Lo que NUNCA hace esta capa:
#   ✗ Ejecutar SQL directamente
#   ✗ Conocer detalles de HTTP (status codes, headers) — solo lanza excepciones
#   ✗ Leer request bodies o query params directamente
#
# El service recibe tipos simples o modelos internos, nunca schemas de la API.
# ─────────────────────────────────────────────────────────────────────────────



import asyncpg
from fastapi import HTTPException, status

from app.models.carrera import Carrera
from app.repositories.carrera_repository import CarreraRepository


class CarreraService:
    """
    Se instancia con una conexión asyncpg.
    La conexión viene inyectada desde el router vía FastAPI Depends —
    esto permite que el service sea testeable pasando una conexión mock.
    """

    def __init__(self, conn: asyncpg.Connection) -> None:
        # El service crea el repository internamente.
        # Si en el futuro necesitara más de un repository, los instanciaría aquí.
        self.repo = CarreraRepository(conn)

    async def listar(self, solo_activas: bool = True) -> list[Carrera]:
        """
        Devuelve la lista de carreras. No hay lógica de negocio compleja aquí
        pero el service es el punto de entrada — si en el futuro necesitamos
        filtrar por permisos del usuario, se agrega aquí sin tocar el router.
        """
        return await self.repo.get_all(solo_activas=solo_activas)

    
    async def obtener_por_id(self, id: int) -> Carrera:
        """
        Busca una carrera por id. Lanza 404 si no existe.
        El router no necesita saber cómo se busca — solo llama a este método.
        """
        carrera = await self.repo.get_by_id(id)
        if not carrera:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Carrera con id '{id}' no encontrada.",
            )
        return carrera

    async def crear(
        self,
        nombre: str,
        codigo: str,
        duracion_cuatrimestres: int,
    ) -> Carrera:
        """
        Crea una nueva carrera aplicando las reglas de negocio:
          1. El código debe ser único en el sistema.
        """
        # Regla de negocio: código único
        existente = await self.repo.get_by_codigo(codigo)
        if existente:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya existe una carrera con el código '{codigo.upper()}'.",
            )

        return await self.repo.create(
            nombre=nombre,
            codigo=codigo,
            duracion_cuatrimestres=duracion_cuatrimestres,
        )

    async def actualizar(
        self,
        id: int,
        nombre: str | None = None,
        duracion_cuatrimestres: int | None = None,
        activo: bool | None = None,
    ) -> Carrera:
        """
        Actualización parcial de una carrera.
        Verifica que exista antes de intentar actualizarla.
        """
        # Verificar existencia (lanza 404 si no existe)
        await self.obtener_por_id(id)

        carrera = await self.repo.update(
            id=id,
            nombre=nombre,
            duracion_cuatrimestres=duracion_cuatrimestres,
            activo=activo,
        )
        return carrera  # type: ignore[return-value]

    async def desactivar(self, id: int) -> dict[str,str]:
        """
        Desactiva una carrera (soft delete).
        Regla de negocio: no se puede desactivar si tiene estudiantes activos.
        """
        # Verificar existencia
        await self.obtener_por_id(id)

        # Regla de negocio: no desactivar con estudiantes activos
        if await self.repo.tiene_estudiantes_activos(id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "No se puede desactivar la carrera porque tiene estudiantes activos. "
                    "Primero reasignar o desactivar los estudiantes."
                ),
            )

        desactivada = await self.repo.soft_delete(id)
        if not desactivada:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Carrera no encontrada o ya estaba desactivada.",
            )

        return {"mensaje": "Carrera desactivada correctamente."}
    