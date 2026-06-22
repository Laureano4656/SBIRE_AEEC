import asyncpg

class OpcionRespuestaRepository:
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.conn = conn