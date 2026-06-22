import asyncpg
import json
from fastapi import HTTPException, status
from app.schemas.encuesta_schemas import FormularioEncuestaResponse, BloqueAcademico
from app.schemas.pregunta import PreguntaResponse
from app.models.encuesta import AsignacionEncuesta

class EncuestaService:
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.conn = conn

    async def _obtener_materias_alumno(self, estudiante_id: int, estado: str) -> list[dict]:
        """
        Busca materias en las que el estudiante ya tiene una inscripción activa 
        con un estado específico ('cursando' o 'aprobada falta final').
        """
        query = """
            SELECT m.id as materia_id, m.nombre as materia_nombre
            FROM inscripciones i
            JOIN materias m ON i.materia_id = m.id
            WHERE i.estudiante_id = $1 
              AND i.estado_cursada = $2::public.enum_estado_cursada
        """
        return await self.conn.fetch(query, estudiante_id, estado)

    async def _obtener_materias_disponibles(self, estudiante_id: int) -> list[dict]:
        """
        Cruza al estudiante con su plan de estudios, filtrando las materias
        que ya aprobó/está cursando, y asegurando que cumpla con las CORRELATIVAS.
        """
        query = """
            SELECT m.id as materia_id, m.nombre as materia_nombre
            FROM estudiantes e
            JOIN plan_estudios pe ON e.carrera_id = pe.carrera_id
            JOIN materias m ON m.plan_id = pe.id
            WHERE e.id = $1 
              AND pe.activo = TRUE
              AND NOT EXISTS (
                  SELECT 1 
                  FROM cursadas c 
                  WHERE c.estudiante_id = e.id 
                    AND c.materia_id = m.id 
                    AND c.estado IN ('aprobada', 'aprobada falta final', 'cursando')
              )
              AND NOT EXISTS (
                  SELECT 1
                  FROM correlativas co
                  WHERE c.materia_id = m.id
                    AND NOT EXISTS (
                        SELECT 1
                        FROM cursadas c2
                        WHERE c2.estudiante_id = e.id
                          AND c2.materia_id = co.requiere_materia_id
                          AND c2.estado_cursada IN ('aprobada', 'aprobada falta final')
                    )
              )
        """
        
        return await self.conn.fetch(query, estudiante_id)

    async def obtener_formulario(self, asignacion_id: int) -> FormularioEncuestaResponse:
        # 1. Validar asignación y traer datos básicos (estudiante_id, evento, etc.)
        asig_row = await self.conn.fetchrow(
            "SELECT * FROM asignacion_encuesta WHERE id = $1 AND estado IN ('Pendiente', 'Pendiente_Actualizacion')", 
            asignacion_id
        )
        if not asig_row:
            raise HTTPException(status_code=404, detail="Asignación no encontrada o completada.")
        
        asignacion = dict(asig_row)
        evento = asignacion['evento_disparador']
        estudiante_id = asignacion['estudiante_id']

        # 2. Buscar preguntas (igual que antes)
        estudiante_row = await self.conn.fetchrow("SELECT carrera_id FROM estudiantes WHERE id = $1", estudiante_id)
        carrera_id = estudiante_row['carrera_id'] if estudiante_row else None

        preguntas_rows = await self.conn.fetch(
            """
            SELECT id, indicador_id, carrera_id, texto_pregunta, evento_disparador::text, 
                   tipo_pregunta::text, configuracion_riesgo::text, activa
            FROM pregunta
            WHERE activa = TRUE AND evento_disparador = $1::public.enum_periodicidad
              AND (carrera_id = $2 OR carrera_id IS NULL)
            """,
            evento, carrera_id
        )

        if not preguntas_rows:
            # Si no hay preguntas, devolvemos el formulario vacío directamente
            return FormularioEncuestaResponse(
                asignacion_id=asignacion_id, evento_disparador=evento, 
                periodo_lectivo=asignacion['periodo_lectivo']
            )

        pregunta_ids = [row['id'] for row in preguntas_rows]

        # Buscar TODAS las opciones de estas preguntas de una sola vez
        opciones_rows = await self.conn.fetch(
            "SELECT id, pregunta_id, texto_opcion FROM opcion_pregunta WHERE pregunta_id = ANY($1::int[]) ORDER BY orden_visual ASC",
            pregunta_ids
        )
        
        # Agrupar opciones en un diccionario: { pregunta_id: [OpcionEncuestaResponse, ...] }
        dicc_opciones = {pid: [] for pid in pregunta_ids}
        for opt in opciones_rows:
            dicc_opciones[opt['pregunta_id']].append(
                OpcionEncuestaResponse(id=opt['id'], texto_opcion=opt['texto_opcion'])
            )

        # Buscar TODAS las respuestas previas (borradores) de esta asignación
        resp_previas_rows = await self.conn.fetch(
            "SELECT pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto FROM respuesta_estudiante WHERE asignacion_id = $1",
            asignacion_id
        )
        
        # Agrupar respuestas previas usando una tupla (pregunta_id, materia_id) como clave
        dicc_respuestas = {}
        for r in resp_previas_rows:
            clave = (r['pregunta_id'], r['materia_id'])
            dicc_respuestas[clave] = RespuestaPrevia(
                opcion_seleccionada_id=r['opcion_seleccionada_id'],
                valor_numerico=r['valor_numerico'],
                valor_texto=r['valor_texto']
            )

        formulario = FormularioEncuestaResponse(
            asignacion_id=asignacion_id,
            evento_disparador=evento,
            periodo_lectivo=asignacion['periodo_lectivo']
        )

        # Función auxiliar para armar el objeto pregunta inyectándole opciones y respuestas previas
        def ensamblar_pregunta(p_dict: dict, materia_id: int | None = None) -> PreguntaParaEncuesta:
            clave_respuesta = (p_dict['id'], materia_id)
            return PreguntaParaEncuesta(
                **p_dict,
                opciones=dicc_opciones.get(p_dict['id'], []),
                respuesta_previa=dicc_respuestas.get(clave_respuesta, None)
            )

        # Parsear los diccionarios de la BD (resolviendo el JSONB)
        preguntas_crudas = []
        for row in preguntas_rows:
            p_dict = dict(row)
            if p_dict.get('configuracion_riesgo'):
                p_dict['configuracion_riesgo'] = json.loads(p_dict['configuracion_riesgo'])
            preguntas_crudas.append(p_dict)

        # Distribuir en el formulario según el evento
        if evento in ['unica_vez', 'cuatrimestral_general', 'anual']:
            for p_dict in preguntas_crudas:
                formulario.preguntas_generales.append(ensamblar_pregunta(p_dict, materia_id=None))
            
        elif evento == 'fin_cuatrimestre_acad':
            materias = await self._obtener_materias_alumno(estudiante_id, 'cursando')
            for mat in materias:
                bloque = BloqueAcademico(materia_id=mat['materia_id'], materia_nombre=mat['materia_nombre'], preguntas=[])
                for p_dict in preguntas_crudas:
                    bloque.preguntas.append(ensamblar_pregunta(p_dict, materia_id=mat['materia_id']))
                formulario.bloques_academicos.append(bloque)

        elif evento == 'llamado_final_acad':
            materias = await self._obtener_materias_alumno(estudiante_id, 'aprobada falta final')
            for mat in materias:
                bloque = BloqueAcademico(materia_id=mat['materia_id'], materia_nombre=mat['materia_nombre'], preguntas=[])
                for p_dict in preguntas_crudas:
                    bloque.preguntas.append(ensamblar_pregunta(p_dict, materia_id=mat['materia_id']))
                formulario.bloques_academicos.append(bloque)

        elif evento == 'inicio_cuatrimestre_acad':
            materias_disponibles = await self._obtener_materias_disponibles(estudiante_id)
            for mat in materias_disponibles:
                bloque = BloqueAcademico(materia_id=mat['materia_id'], materia_nombre=mat['materia_nombre'], preguntas=[])
                for p_dict in preguntas_crudas:
                    bloque.preguntas.append(ensamblar_pregunta(p_dict, materia_id=mat['materia_id']))
                formulario.bloques_academicos.append(bloque)

        return formulario

    async def guardar_respuestas(self, asignacion_id: int, respuestas: list[dict]) -> None:
        """Guarda el array de respuestas de forma transaccional."""
        async with self.conn.transaction():
            # 1. Marcar la asignación como completada
            await self.conn.execute(
                "UPDATE asignacion_encuesta SET estado = 'Completada', fecha_completada = CURRENT_TIMESTAMP WHERE id = $1",
                asignacion_id
            )

            # 2. Insertar respuestas (sin calcular riesgo aún)
            query_insert = """
                INSERT INTO respuesta_estudiante 
                (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto)
                VALUES ($1, $2, $3, $4, $5, $6)
            """
            valores = [
                (
                    asignacion_id,
                    r['pregunta_id'],
                    r.get('materia_id'),
                    r.get('opcion_seleccionada_id'),
                    r.get('valor_numerico'),
                    r.get('valor_texto')
                )
                for r in respuestas
            ]
            await self.conn.executemany(query_insert, valores)
