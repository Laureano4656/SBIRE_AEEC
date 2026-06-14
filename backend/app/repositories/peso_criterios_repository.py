# repositories/carrera_repository.py
# ─────────────────────────────────────────────────────────────────────────────
# Repository de Carrera — único responsable de las queries SQL de esta entidad.
#
# este archivo solo contiene SQL y conversión de tipos.
# NUNCA toma decisiones de negocio. Si necesita decidir algo
# (ej. "¿puedo eliminar esta carrera?"), esa lógica va en CarreraService.
#
# Todas las queries usan parámetros posicionales ($1, $2...) — nunca
# interpolación de strings con valores del usuario (prevención de SQL injection).
# ─────────────────────────────────────────────────────────────────────────────

import asyncpg

from app.models.peso_criterios import PesoCriterios
from app.repositories.base import BaseRepository


class PesoCriteriosRepository(BaseRepository[PesoCriterios]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(model=PesoCriterios, conn=conn)