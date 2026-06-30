import asyncpg

from app.models.peso_criterios import PesoCriterios
from app.repositories.base import BaseRepository


class PesoCriteriosRepository(BaseRepository[PesoCriterios]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(model=PesoCriterios, conn=conn)

    async def crear_configuracion(self, config_data, json_data) -> int:
        """
        Inserta la nueva configuración del jefe departamental y devuelve el ID generado.
        """
        query = """
            INSERT INTO configuracion_indicador (
                carrera_id, etapa, umbral_amarillo, umbral_rojo, 
                factor_extension, descripcion, activo, actualizado_en, actualizado_por,
                valores_saaty_crudos
            )
            VALUES (
                $1, $2::public.etapa_desercion_enum, $3, $4, 
                $5, $6, true, NOW(), $7, $8::jsonb
            )
            RETURNING id;
        """
        nuevo_id = await self.conn.fetchval(
            query,
            config_data.carrera_id,
            config_data.etapa,
            config_data.umbral_amarillo,
            config_data.umbral_rojo,
            config_data.factor_extension,
            config_data.descripcion,
            config_data.actualizado_por,
            json_data
        )
        return nuevo_id

    async def obtener_mapa_indicadores(self) -> dict[str, int]:
        query = """
            SELECT id, nombre 
            FROM indicador 
            WHERE activo = true AND dimension IS NOT NULL;
        """
        filas = await self.conn.fetch(query)
        return {fila["nombre"]: fila["id"] for fila in filas}

    async def guardar_peso_indicador(self, id_configuracion: int, id_indicador: int, peso_global: float) -> None:
        query = """
            INSERT INTO peso_indicadores (id_configuracion, id_indicador, peso_global)
            VALUES ($1, $2, $3);
        """
        await self.conn.execute(query, id_configuracion, id_indicador, peso_global)

    async def get_arbol_dimensiones_preguntas(self, carrera_id: int) -> list[dict]:
        """
        Trae la estructura completa de Dimensiones -> Indicadores -> Preguntas
        para una carrera específica en una sola consulta a la base de datos.
        """
        
        # Usamos LEFT JOIN para que si una dimensión no tiene indicadores, 
        # o un indicador no tiene preguntas, igual se devuelvan en la lista vacíos.
        query = """
            SELECT 
                d.id AS dimension_id,
                d.nombre AS dimension_nombre,
                
                i.id AS indicador_id,
                i.nombre AS indicador_nombre,
                
                p.id AS pregunta_id,
                p.texto_pregunta AS texto_pregunta,
                p.tipo_pregunta AS tipo_pregunta
                
            FROM indicador d
            -- Unimos los subcriterios (indicadores) a su criterio padre (dimensión)
            LEFT JOIN indicador i ON i.dimension = d.id AND i.carrera_id = $1
            -- Unimos las preguntas a su indicador correspondiente
            LEFT JOIN pregunta p ON p.indicador_id = i.id
            
            -- Filtramos para traer solo las Dimensiones (padres) de esta carrera
            WHERE d.dimension IS NULL 
              AND d.carrera_id = $1
              
            ORDER BY d.id, i.id, p.id;
        """
        
        filas = await self.conn.fetch(query, carrera_id)
        
        # 2. Agrupación rápida en memoria usando Diccionarios
        dicc_dimensiones = {}
        
        for r in filas:
            dim_id = r["dimension_id"]
            ind_id = r["indicador_id"]
            preg_id = r["pregunta_id"]
            
            # A. Armamos la Dimensión si no existe en el diccionario
            if dim_id not in dicc_dimensiones:
                dicc_dimensiones[dim_id] = {
                    "id": dim_id,
                    "nombre": r["dimension_nombre"],
                    "indicadores": {}
                }
                
            # B. Si la fila trajo un Indicador válido, lo metemos en su Dimensión
            if ind_id is not None:
                if ind_id not in dicc_dimensiones[dim_id]["indicadores"]:
                    dicc_dimensiones[dim_id]["indicadores"][ind_id] = {
                        "id": ind_id,
                        "nombre": r["indicador_nombre"],
                        "preguntas": []
                    }
                    
                # C. Si la fila trajo una Pregunta válida, la metemos en la lista de su Indicador
                if preg_id is not None:
                    dicc_dimensiones[dim_id]["indicadores"][ind_id]["preguntas"].append({
                        "id": preg_id,
                        "texto_pregunta": r["texto_pregunta"],
                        "tipo_pregunta": r["tipo_pregunta"]
                    })
                    
        # 3. Limpieza final: convertimos los diccionarios de indicadores en listas limpias
        resultado = []
        for dim in dicc_dimensiones.values():
            # Pasamos los indicadores de diccionario a una lista clásica de JSON
            dim["indicadores"] = list(dim["indicadores"].values())
            resultado.append(dim)
            
        return resultado

    async def get_ultimo_saaty_crudo(self, carrera_id: int, etapa: str) -> str | None:
        """
        Trae únicamente la columna de valores crudos de la última 
        configuración guardada para una carrera y etapa.
        """
        query = """
            SELECT valores_saaty_crudos
            FROM configuracion_indicador
            WHERE carrera_id = $1 AND etapa = $2
            ORDER BY actualizado_en DESC
            LIMIT 1;
        """
        return await self.conn.fetchval(query, carrera_id, etapa)

    async def get_ultima_configuracion(self, carrera_id: int, etapa: str) -> dict | None:
        query = """
            SELECT id, carrera_id, etapa, umbral_amarillo, umbral_rojo,
                   factor_extension, descripcion, activo, actualizado_en,
                   actualizado_por, valores_saaty_crudos
            FROM configuracion_indicador
            WHERE carrera_id = $1 AND etapa = $2::public.etapa_desercion_enum
            ORDER BY actualizado_en DESC
            LIMIT 1;
        """
        row = await self.conn.fetchrow(query, carrera_id, etapa)
        return dict(row) if row else None

    async def get_indicadores_por_carrera(self, carrera_id: int) -> list[dict]:
        """
        Trae la lista de indicadores (subcriterios) actuales para una carrera.
        Excluye las dimensiones raíz (las que tienen indicador_id en NULL).
        """
        query = """
            SELECT id
            FROM indicador
            WHERE carrera_id = $1 
        """
        filas = await self.conn.fetch(query, carrera_id)
        
        return [dict(f) for f in filas]