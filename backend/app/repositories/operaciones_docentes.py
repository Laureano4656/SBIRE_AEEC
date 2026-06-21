import asyncpg

class operacionesDocentesRepository:
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(conn, operacionesDocentesRepository)
        
        
    def carga_parciales_XLS(self, data: dict) -> None:
        # Implementar la lógica para cargar parciales desde un archivo XLS
        pass