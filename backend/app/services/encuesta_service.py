import asyncpg
import json
from fastapi import HTTPException, status
from app.repositories.encuestas_repository import EncuestasRepository
from app.schemas.encuesta import FormularioEncuestaResponse, BloqueAcademico, MateriaResponse, RespuestaItemSubmit, RespuestaPrevia, OpcionEncuestaResponse, PreguntaParaEncuesta


class EncuestaService:
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.conn = conn


    async def obtener_formulario(self, asignacion_id: int) -> FormularioEncuestaResponse:
        # 1. Validar asignación
        asignacion = await self.repo.get_asignacion(asignacion_id)
        if not asignacion:
            raise HTTPException(status_code=404, detail="Asignación no encontrada o completada.")

        evento = asignacion.evento_disparador
        estudiante_id = asignacion.estudiante_id

        # 2. Traer preguntas
        carrera_id = await self.repo.get_carrera_estudiante(estudiante_id)
        preguntas_crudas = await self.repo.get_preguntas(evento, carrera_id)

        formulario = FormularioEncuestaResponse(
            asignacion_id=asignacion_id,
            evento_disparador=evento,
            periodo_lectivo=asignacion.periodo_lectivo
        )

        if not preguntas_crudas:
            return formulario

        # 3. Parsear JSONB
        for p in preguntas_crudas:
            if p.get('configuracion_riesgo'):
                p['configuracion_riesgo'] = json.loads(p['configuracion_riesgo'])

        # 4. Traer opciones y respuestas previas
        pregunta_ids = [p['id'] for p in preguntas_crudas]
        dicc_opciones = self._agrupar_opciones(
            await self.repo.get_opciones(pregunta_ids), pregunta_ids
        )
        dicc_respuestas = self._agrupar_respuestas(
            await self.repo.get_respuestas_previas(asignacion_id)
        )

        # 5. Distribuir según evento
        EVENTOS_GENERALES = {'unica_vez', 'cuatrimestral', 'anual'}

        if evento in EVENTOS_GENERALES:
            for p in preguntas_crudas:
                formulario.preguntas_generales.append(
                    self._ensamblar_pregunta(p, None, dicc_opciones, dicc_respuestas)
                )

        elif evento == 'fin_cuatrimestre_acad':
            materias = await self.repo.get_materias_cursando(estudiante_id)
            formulario.bloques_academicos = self._armar_bloques(
                materias, preguntas_crudas, dicc_opciones, dicc_respuestas
            )

        elif evento == 'llamado_final_acad':
            materias = await self.repo.get_materias_con_final(estudiante_id)
            formulario.bloques_academicos = self._armar_bloques(
                materias, preguntas_crudas, dicc_opciones, dicc_respuestas
            )

        elif evento == 'inicio_cuatrimestre_acad':
            materias = await self.repo.get_materias_disponibles(estudiante_id)
            formulario.bloques_academicos = self._armar_bloques(
                materias, preguntas_crudas, dicc_opciones, dicc_respuestas
            )

        return formulario

    async def guardar_respuestas(self, asignacion_id: int, respuestas: list[RespuestaItemSubmit]) -> None:
        asignacion = await self.repo.get_asignacion(asignacion_id)
        if not asignacion:
            raise HTTPException(status_code=404, detail="Asignación no encontrada o completada.")
        
        await self.repo.guardar_respuestas(asignacion_id, [r.model_dump() for r in respuestas])
        # await self._calcular_riesgo(asignacion_id)  ← viene después

    # --- Helpers privados ---

    def _agrupar_opciones(self, opciones: list[OpcionEncuestaResponse], pregunta_ids: list[int]) -> dict:
        dicc = {pid: [] for pid in pregunta_ids}
        for opt in opciones:
            dicc[opt.pregunta_id].append(opt)
        return dicc

    def _agrupar_respuestas(self, respuestas: list[RespuestaPrevia]) -> dict:
        return {
            (r.pregunta_id, r.materia_id): r
            for r in respuestas
        }

    def _ensamblar_pregunta(self, p: dict, materia_id: int | None, dicc_opciones: dict, dicc_respuestas: dict) -> PreguntaParaEncuesta:
        return PreguntaParaEncuesta(
            **p,
            opciones=dicc_opciones.get(p['id'], []),
            respuesta_previa=dicc_respuestas.get((p['id'], materia_id))
        )

    def _armar_bloques(self, materias: list[MateriaResponse], preguntas: list[dict], dicc_opciones: dict, dicc_respuestas: dict) -> list[BloqueAcademico]:
        return [
            BloqueAcademico(
                materia_id=mat.materia_id,
                materia_nombre=mat.materia_nombre,
                preguntas=[
                    self._ensamblar_pregunta(p, mat.materia_id, dicc_opciones, dicc_respuestas)
                    for p in preguntas
                ]
            )
            for mat in materias
        ]
