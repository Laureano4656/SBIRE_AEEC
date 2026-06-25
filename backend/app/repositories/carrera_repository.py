import asyncpg
from app.models.carrera import Carrera
from app.repositories.crud_repository import CrudRepository, CrudTableConfig

class CarreraRepository(CrudRepository[Carrera]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(
            conn,
            Carrera,
            CrudTableConfig(
                table_name="carreras",
                columns=("id", "nombre", "codigo", "duracion_cuatrimestre", "activo"),
                active_column="activo"
            )
        )

    async def get_by_codigo(self, codigo: str) -> Carrera | None:
        row = await self.conn.fetchrow(
            f"""
            SELECT {self._select_clause()}
            FROM {self.config.table_name}
            WHERE codigo = $1
            """,
            codigo.upper(),
        )
        return self._map(row)

    async def tiene_estudiantes_activos(self, id: int) -> bool:
        count = await self.conn.fetchval(
            """
            SELECT COUNT(*)
            FROM estudiantes
            WHERE carrera_id = $1 AND activo = TRUE
            """,
            id,
        )
        return count > 0

    async def insertar_paquete_defecto(self, nueva_carrera_id: int) -> None:
        """
        Inserta la estructura completa de dimensiones, indicadores, preguntas 
        y opciones predefinidas asociadas a la nueva carrera recién creada.
        """
        
        # 1. Definición de Dimensiones Padre (id_viejo, nombre)
        dimensiones_data = [
            (1, 'Dimensión Sociodemográfica y de Origen'),
            (2, 'Dimensión de Infraestructura y Logística'),
            (3, 'Dimensión Vocacional y Psicológica'),
            (4, 'Dimensión Económica y Laboral'),
            (5, 'Dimensión Académica e Institucional Perceptiva')
        ]

        # 2. Definición de Indicadores Hijo (id_viejo, nombre, id_padre_viejo)
        sub_indicadores_data = [
            (101, 'Capital Cultural Familiar', 1),
            (102, 'Arraigo Local y Red de Apoyo', 1),
            (103, 'Trayectoria Educativa Previa', 1),
            (104, 'Estabilidad Habitacional', 2),
            (105, 'Entorno de Estudio Físico', 2),
            (106, 'Fricción de Movilidad', 2),
            (107, 'Certeza Vocacional y Motivación', 3),
            (108, 'Salud Mental y Nivel de Estrés', 3),
            (109, 'Riesgo de Abandono Declarado', 3),
            (110, 'Carga Laboral', 4),
            (111, 'Vulnerabilidad Económica', 4),
            (112, 'Autopercepción de Rendimiento', 5),
            (113, 'Vinculación Institucional', 5),
            (114, 'Rendimiento Académico', 5)
        ]

        # 3. Definición de Preguntas (id_vieja, id_indicador_viejo, texto, evento_id, tipo, config_riesgo_json)
        preguntas_data = [
            (1, 101, '¿Nivel educativo de tu madre?', 'unica_vez', 'opcion_multiple', None),
            (2, 101, '¿Nivel educativo de tu padre?', 'unica_vez', 'opcion_multiple', None),
            (3, 102, '¿Tu familia vive en Mar del Plata?', 'unica_vez', 'si_no', '{"valor_riesgo_maximo": "no"}'),
            (4, 102, '¿Tu familia es oriunda de Mar del Plata?', 'unica_vez', 'si_no', '{"valor_riesgo_maximo": "no"}'),
            (5, 102, '¿Cuántas horas de viaje tenés que hacer para visitar a tu familia?', 'unica_vez', 'numero', '{"intervalo_min": 0, "intervalo_max": 48, "extremo_riesgoso": "max"}'),
            (6, 102, '¿Te comunicas con ellos con asiduidad?', 'unica_vez', 'si_no', '{"valor_riesgo_maximo": "no"}'),
            (7, 103, '¿En qué tipo de institución cursaste el secundario?', 'unica_vez', 'opcion_multiple', None),
            (8, 103, '¿Terminaste el secundario en tiempo y forma (sin adeudar materias al recibirte)?', 'unica_vez', 'si_no', '{"valor_riesgo_maximo": "no"}'),
            (9, 104, '¿En qué localidad vivís actualmente?', 'anual', 'texto_libre', None),
            (10, 104, '¿Cómo es tu situation de vivienda?', 'anual', 'opcion_multiple', None),
            (11, 104, '¿Cuántas personas viven en tu hogar incluyéndote?', 'anual', 'numero', '{"intervalo_min": 1, "intervalo_max": 10, "extremo_riesgoso": "max"}'),
            (12, 105, '¿Contás con un espacio en tu casa adecuado para estudiar?', 'anual', 'opcion_multiple', None),
            (13, 106, '¿A cuanto tiempo aproximado de la facultad vivís?', 'anual', 'opcion_multiple', None),
            (14, 106, '¿El costo o el tiempo de traslado representa un obstáculo para asistir a clases?', 'anual', 'escala', '{"intervalo_min": 1, "intervalo_max": 5, "extremo_riesgoso": "max"}'),
            (15, 106, '¿Hubo días que no pudiste asistir a la facultad por problemas relacionados con el traslado?', 'cuatrimestral', 'si_no', '{"valor_riesgo_maximo": "si"}'),
            (16, 107, '¿La carrera que te encontras cursando fue tu primera opción como carrera a estudiar?', 'unica_vez', 'si_no', '{"valor_riesgo_maximo": "no"}'),
            (17, 107, '¿Qué tan seguro te sentis de haber elegido esta carrera?', 'unica_vez', 'escala', '{"intervalo_min": 1, "intervalo_max": 5, "extremo_riesgoso": "min"}'),
            (18, 107, '¿Cuán importante considerás que es la formación académica en la vida de una persona / para tu futuro económico?', 'unica_vez', 'escala', '{"intervalo_min": 1, "intervalo_max": 5, "extremo_riesgoso": "min"}'),
            (19, 107, '¿Sentís que tu entorno familiar apoya tu decisión de estudiar esta carrera?', 'unica_vez', 'escala', '{"intervalo_min": 1, "intervalo_max": 5, "extremo_riesgoso": "min"}'),
            (20, 107, '¿Los contenidos vistos este año te dieron más o menos ganas de continuar la carrera?', 'anual', 'opcion_multiple', None),
            (21, 107, '¿Cuán interesado te sentiste en dichos contenidos?', 'anual', 'escala', '{"intervalo_min": 1, "intervalo_max": 5, "extremo_riesgoso": "min"}'),
            (22, 108, '¿Sentiste altos niveles de estrés en relación a la carrera?', 'cuatrimestral', 'escala', '{"intervalo_min": 1, "intervalo_max": 5, "extremo_riesgoso": "max"}'),
            (23, 108, '¿Buscaste o recibiste algún tipo de apoyo o contención?', 'cuatrimestral', 'si_no', '{"valor_riesgo_maximo": "no"}'),
            (24, 109, '¿Qué tan motivado te sentís con la carrera?', 'cuatrimestral', 'escala', '{"intervalo_min": 1, "intervalo_max": 5, "extremo_riesgoso": "min"}'),
            (25, 109, '¿En este cuatrimestre pensaste en abandonar la carrera?', 'cuatrimestral', 'opcion_multiple', None),
            (26, 109, '¿Estás considerando dejar de cursar el próximo cuatrimestre?', 'cuatrimestral', 'opcion_multiple', None),
            (27, 110, '¿Estás trabajando actualmente?', 'cuatrimestral', 'si_no', '{"valor_riesgo_maximo": "si"}'),
            (28, 110, '¿Tu carga laboral cambió respecto al cuatrimestre anterior?', 'cuatrimestral', 'opcion_multiple', None),
            (29, 110, '¿Sentís que el trabajo interfiere con tu rendimiento académico?', 'cuatrimestral', 'escala', '{"intervalo_min": 1, "intervalo_max": 5, "extremo_riesgoso": "max"}'),
            (30, 111, '¿Tu situación económica representó un obstáculo para estudiar en este cuatrimestre?', 'cuatrimestral', 'opcion_multiple', None),
            (31, 112, '¿Cómo calificarías tu rendimiento académico en este último cuatrimestre?', 'cuatrimestral', 'escala', '{"intervalo_min": 1, "intervalo_max": 5, "extremo_riesgoso": "min"}'),
            (32, 112, '¿Pudiste cumplir tus objetivos académicos de este cuatrimestre?', 'cuatrimestral', 'si_no', '{"valor_riesgo_maximo": "no"}'),
            (33, 112, '¿Hubo alguna materia en que tuviste especiales dificultades?', 'cuatrimestral', 'si_no', '{"valor_riesgo_maximo": "si"}'),
            (34, 113, '¿Conoces los espacios que la facultad brinda para estudiar?', 'anual', 'si_no', '{"valor_riesgo_maximo": "no"}'),
            (35, 113, '¿Sentís que la facultad te brinda los recursos necesarios para avanzar en la carrera?', 'cuatrimestral', 'escala', '{"intervalo_min": 1, "intervalo_max": 5, "extremo_riesgoso": "min"}'),
            (36, 113, '¿Conocías los recursos de apoyo disponibles (tutorías, asesorías, becas, etc...)?', 'cuatrimestral', 'opcion_multiple', None),
            (37, 113, '¿Te gustaría ser contactado por alguien del equipo de la facultad a fin de conversar tu situación en profundidad?', 'cuatrimestral', 'si_no', '{"valor_riesgo_maximo": "si"}'),
            (38, 114, '¿Cuál fue tu nota en {MATERIA}?', 'fin_cuatrimestre_acad', 'numero', '{"intervalo_min": 1, "intervalo_max": 10, "extremo_riesgoso": "min"}'),
            (39, 114, '¿Cuál fue tu situación final en {MATERIA}?', 'fin_cuatrimestre_acad', 'opcion_multiple', None),
            (40, 114, '¿Cuál fue tu nota en el final de {MATERIA}?', 'llamado_final_acad', 'numero', '{"intervalo_min": 1, "intervalo_max": 10, "extremo_riesgoso": "min"}'),
            (41, 110, '¿Cuántas horas trabajas por semana?', 'cuatrimestral', 'numero', '{"intervalo_min": 0, "intervalo_max": 80, "extremo_riesgoso": "max"}'),
            
            # NUEVA PREGUNTA SOLICITADA:
            (42, 114, '¿Aprobaste el final de {MATERIA}?', 'llamado_final_acad', 'opcion_multiple', None)
        ]

        # 4. Definición de Opciones (id_pregunta_vieja, texto, valor_riesgo, orden)
        opciones_data = [
            (1, 'Inicial', 1.0, 1), (1, 'Secundario', 0.6, 2), (1, 'Terciario', 0.3, 3), (1, 'Universitario', 0.0, 4),
            (2, 'Inicial', 1.0, 1), (2, 'Secundario', 0.6, 2), (2, 'Terciario', 0.3, 3), (2, 'Universitario', 0.0, 4),
            (7, 'Escuela Publica', 0.5, 1), (7, 'Escuela Privada', 0.0, 2), (7, 'Escuela religiosa', 0.0, 3), (7, 'Instituto Tecnico', 0.0, 4), (7, 'Otro', 0.5, 5),
            (10, 'Pensión', 1.0, 1), (10, 'Vivo en casa de familiares que no son mis padres', 0.5, 2), (10, 'Casa/Departamento (Alquilado)', 0.3, 3), (10, 'Casa/Departamento (Propio)', 0.0, 4), (10, 'Otro', 0.5, 5),
            (12, 'No', 1.0, 1), (12, 'No siempre está disponible', 0.6, 2), (12, 'Si, pero comparto', 0.3, 3), (12, 'Si, uno propio', 0.0, 4),
            (13, '> 1h', 1.0, 1), (13, "31'-1 h", 0.6, 2), (13, "15'-30'", 0.3, 3), (13, '< 15\'', 0.0, 4),
            (20, 'Menos', 1.0, 1), (20, 'Igual', 0.5, 2), (20, 'Más', 0.0, 3),
            (25, 'Si', 1.0, 1), (25, 'Lo pensé pero lo descarte', 0.5, 2), (25, 'No', 0.0, 3),
            (26, 'Si', 1.0, 1), (26, 'No lo sé', 0.5, 2), (26, 'No', 0.0, 3),
            (28, 'Empecé a trabajar este cuatrimestre', 1.0, 1), (28, 'Aumentó', 0.8, 2), (28, 'Se mantuvo igual', 0.4, 3), (28, 'Disminuyó', 0.0, 4),
            (30, 'Si', 1.0, 1), (30, 'Parcialmente', 0.5, 2), (30, 'No', 0.0, 3),
            (36, 'No', 1.0, 1), (36, 'Los conocí este cuatrimestre', 0.5, 2), (36, 'Si', 0.0, 3),
            (39, 'Recursa', 1.0, 1), (39, 'Habilita', 0.5, 2), (39, 'Promociona', 0.0, 3),
            
            # NUEVAS OPCIONES PARA LA PREGUNTA 42:
            (42, 'Si', 0.0, 1), (42, 'No', 1.0, 2), (42, 'No me presenté', 0.5, 3)
        ]

        # Diccionarios para mapear IDs viejos a nuevos IDs autogenerados
        mapa_dimensiones = {}
        mapa_indicadores = {}
        mapa_preguntas = {}

        # PASO A: Insertar Dimensiones Padre
        query_dim = """
            INSERT INTO indicador (nombre, dimension_id, activo, carrera_id) 
            VALUES ($1, NULL, TRUE, $2) RETURNING id
        """
        for id_viejo, nombre in dimensiones_data:
            nuevo_id = await self.conn.fetchval(query_dim, nombre, nueva_carrera_id)
            mapa_dimensiones[id_viejo] = nuevo_id

        # PASO B: Insertar Indicadores Hijo (Subcriterios)
        query_hijo = """
            INSERT INTO indicador (nombre, dimension_id, activo, carrera_id) 
            VALUES ($1, $2, TRUE, $3) RETURNING id
        """
        for id_viejo, nombre, id_padre_viejo in sub_indicadores_data:
            nuevo_padre_id = mapa_dimensiones[id_padre_viejo]
            nuevo_id = await self.conn.fetchval(query_hijo, nombre, nuevo_padre_id, nueva_carrera_id)
            mapa_indicadores[id_viejo] = nuevo_id

        # PASO C: Insertar Preguntas
        query_preg = """
            INSERT INTO pregunta (indicador_id, carrera_id, texto_pregunta, evento_id, tipo_pregunta, configuracion_riesgo, activa) 
            VALUES (
                $1, 
                $2, 
                $3, 
                (SELECT id FROM evento_disparador WHERE nombre = $4),
                $5, 
                $6, 
                TRUE
            ) RETURNING id
        """
        for id_viejo, id_indicador_viejo, texto, evento, tipo, config_riesgo in preguntas_data:
            nuevo_indicador_id = mapa_indicadores[id_indicador_viejo]
            nuevo_id = await self.conn.fetchval(
                query_preg, 
                nuevo_indicador_id, 
                nueva_carrera_id, 
                texto, 
                evento, 
                tipo, 
                config_riesgo
            )
            mapa_preguntas[id_viejo] = nuevo_id

        # PASO D: Insertar Opciones de Preguntas Múltiples
        query_opc = """
            INSERT INTO opcion_pregunta (pregunta_id, texto_opcion, valor_riesgo_manual, orden_visual) 
            VALUES ($1, $2, $3, $4)
        """
        for id_preg_viejo, texto, valor_riesgo, orden in opciones_data:
            if id_preg_viejo in mapa_preguntas:  # Verificación por seguridad
                nuevo_pregunta_id = mapa_preguntas[id_preg_viejo]
                await self.conn.execute(query_opc, nuevo_pregunta_id, texto, valor_riesgo, orden)
