import asyncpg
import json
from fastapi import HTTPException, status
from app.repositories.encuestas_repository import EncuestasRepository
from app.schemas.encuesta import (
    EncuestaHistoricoResponse,
    EstadisticaEventoResponse,
    EncuestaEstudianteDetalle,
    RespuestaDetalle,
    FormularioEncuestaResponse,
    BloqueAcademico,
    MateriaResponse,
    RespuestaItemSubmit,
    RespuestaPrevia,
    OpcionEncuestaResponse,
    PreguntaParaEncuesta,
)
from datetime import datetime


class EncuestaService:
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.conn = conn
        self.repo = EncuestasRepository(conn)

    async def obtener_formulario(
        self, asignacion_id: int
    ) -> FormularioEncuestaResponse:
        # 1. Validar asignación
        asignacion = await self.repo.get_asignacion(asignacion_id)
        if not asignacion:
            raise HTTPException(
                status_code=404, detail="Asignación no encontrada o completada."
            )

        evento = asignacion.evento_disparador
        estudiante_id = asignacion.estudiante_id

        # 2. Traer preguntas
        carrera_id = await self.repo.get_carrera_estudiante(estudiante_id)
        preguntas_crudas = await self.repo.get_preguntas(evento, carrera_id)

        formulario = FormularioEncuestaResponse(
            asignacion_id=asignacion_id,
            evento_disparador=evento,
            periodo_lectivo=asignacion.periodo_lectivo,
        )

        if not preguntas_crudas:
            return formulario

        # 3. Parsear JSONB
        for p in preguntas_crudas:
            if isinstance(p.configuracion_riesgo, str):
                p.configuracion_riesgo = json.loads(p.configuracion_riesgo)

        # 4. Traer opciones y respuestas previas
        pregunta_ids = [p.id for p in preguntas_crudas]
        dicc_opciones = self._agrupar_opciones(
            await self.repo.get_opciones(pregunta_ids), pregunta_ids
        )
        dicc_respuestas = self._agrupar_respuestas(
            await self.repo.get_respuestas_previas(asignacion_id)
        )

        nombre_evento = await self.repo.get_evento_disparador(evento)

        # 5. Distribuir según evento
        EVENTOS_GENERALES = {"unica_vez", "cuatrimestral", "anual"}

        if nombre_evento in EVENTOS_GENERALES:
            for p in preguntas_crudas:
                formulario.preguntas_generales.append(
                    self._ensamblar_pregunta(p, None, dicc_opciones, dicc_respuestas)
                )

        elif nombre_evento == "fin_cuatrimestre_acad":
            materias = await self.repo.get_materias_cursando(estudiante_id)
            formulario.bloques_academicos = self._armar_bloques(
                materias, preguntas_crudas, dicc_opciones, dicc_respuestas
            )

        elif nombre_evento == "llamado_final_acad":
            materias = await self.repo.get_materias_con_final(estudiante_id)
            formulario.bloques_academicos = self._armar_bloques(
                materias, preguntas_crudas, dicc_opciones, dicc_respuestas
            )

        elif nombre_evento == "inicio_cuatrimestre_acad":
            materias = await self.repo.get_materias_disponibles(estudiante_id)
            formulario.bloques_academicos = self._armar_bloques(
                materias, preguntas_crudas, dicc_opciones, dicc_respuestas
            )

        return formulario

    async def guardar_respuestas(
        self, asignacion_id: int, respuestas: list[RespuestaItemSubmit]
    ) -> None:
        asignacion = await self.repo.get_asignacion(asignacion_id)
        if not asignacion:
            raise HTTPException(
                status_code=404, detail="Asignación no encontrada o completada."
            )

        await self.repo.guardar_respuestas(
            asignacion_id, [r.model_dump() for r in respuestas]
        )
        # await self._calcular_riesgo(asignacion_id)  ← viene después

    # --- Helpers privados ---

    def _agrupar_opciones(
        self, opciones: list[OpcionEncuestaResponse], pregunta_ids: list[int]
    ) -> dict:
        dicc = {pid: [] for pid in pregunta_ids}
        for opt in opciones:
            dicc[opt.pregunta_id].append(opt)
        return dicc

    def _agrupar_respuestas(self, respuestas: list[RespuestaPrevia]) -> dict:
        return {(r.pregunta_id, r.materia_id): r for r in respuestas}

    def _ensamblar_pregunta(
        self,
        p: dict,
        materia_id: int | None,
        dicc_opciones: dict,
        dicc_respuestas: dict,
    ) -> PreguntaParaEncuesta:
        return PreguntaParaEncuesta(
            **p.model_dump(),
            opciones=dicc_opciones.get(p.id, []),
            respuesta_previa=dicc_respuestas.get((p.id, materia_id)),
        )

    def _armar_bloques(
        self,
        materias: list[MateriaResponse],
        preguntas: list[dict],
        dicc_opciones: dict,
        dicc_respuestas: dict,
    ) -> list[BloqueAcademico]:
        return [
            BloqueAcademico(
                materia_id=mat.materia_id,
                materia_nombre=mat.materia_nombre,
                preguntas=[
                    self._ensamblar_pregunta(
                        p, mat.materia_id, dicc_opciones, dicc_respuestas
                    )
                    for p in preguntas
                ],
            )
            for mat in materias
        ]

    async def publicar_encuesta(self, asignacion_id: int) -> dict[str, str]:
        """
        Lógica de negocio para confirmar la encuesta y sacarla del modo borrador.
        """

        exito = await self.repo.publicar_asignacion(asignacion_id)

        if not exito:
            raise HTTPException(
                status_code=404,
                detail=f"No se encontró la asignación de encuesta con ID {asignacion_id}.",
            )

        return {"mensaje": "La encuesta ha sido confirmada."}

    async def obtener_metricas_por_evento(self) -> list[EstadisticaEventoResponse]:
        """Retorna el listado de eventos con sus estadísticas de completitud."""
        filas = await self.repo.get_encuestas_agrupadas_por_evento()
        return [EstadisticaEventoResponse(**dict(row)) for row in filas]

    async def obtener_metricas_por_evento_y_carrera(
        self, carrera_id: int
    ) -> list[EstadisticaEventoResponse]:
        """
        Retorna las estadísticas de completitud de los eventos
        filtradas para una carrera en particular.
        """
        filas = await self.repo.get_encuestas_agrupadas_por_evento_y_carrera(carrera_id)
        return [EstadisticaEventoResponse(**dict(row)) for row in filas]

    async def obtener_metricas_por_evento_y_carrera_cicloLectivoActual(
        self, carrera_id: int
    ) -> list[EstadisticaEventoResponse]:
        """
        Retorna las estadísticas de completitud de los eventos
        filtradas para una carrera en particular y para el ciclo lectivo actual.
        """
        filas = await self.repo.get_encuestas_agrupadas_por_evento_y_carrera_cicloLectivoActual(
            carrera_id
        )
        return [EstadisticaEventoResponse(**dict(row)) for row in filas]

    async def obtener_historico_respuestas_ultimo_anio(
        self, carrera_id: int, evento_id: int
    ) -> list[EncuestaHistoricoResponse]:
        anio_actual = str(datetime.now().year)

        # 1. Traer asignaciones completadas
        asignaciones = await self.repo.get_asignaciones_completadas_detalles(
            carrera_id, evento_id, anio_actual
        )
        if not asignaciones:
            return []

        # 2. Cargar estructura base de preguntas y opciones
        nombre_evento = await self.repo.get_evento_disparador(evento_id)
        preguntas_crudas = await self.repo.get_preguntas(evento_id, carrera_id)

        for p in preguntas_crudas:
            if isinstance(p.configuracion_riesgo, str):
                p.configuracion_riesgo = json.loads(p.configuracion_riesgo)

        pregunta_ids = [p.id for p in preguntas_crudas]
        dicc_opciones = self._agrupar_opciones(
            await self.repo.get_opciones(pregunta_ids), pregunta_ids
        )

        # 3. Traer respuestas en bloque y agruparlas por asignación
        asignacion_ids = [a["asignacion_id"] for a in asignaciones]
        respuestas_bulk = await self.repo.get_respuestas_previas_bulk(asignacion_ids)

        # Estructura: {asignacion_id: {(pregunta_id, materia_id): RespuestaPrevia}}
        dicc_respuestas_por_asignacion = {asig_id: {} for asig_id in asignacion_ids}
        for r in respuestas_bulk:
            dicc_respuestas_por_asignacion[r["asignacion_id"]][
                (r["pregunta_id"], r["materia_id"])
            ] = RespuestaPrevia(**dict(r))

        EVENTOS_GENERALES = {"unica_vez", "cuatrimestral", "anual"}
        resultado = []

        # 4. Replicar la lógica de obtener_formulario para CADA estudiante
        for asig in asignaciones:
            estudiante_id = asig["estudiante_id"]
            dicc_resp = dicc_respuestas_por_asignacion[asig["asignacion_id"]]

            formulario = EncuestaHistoricoResponse(
                asignacion_id=asig["asignacion_id"],
                evento_disparador=evento_id,
                periodo_lectivo=asig["periodo_lectivo"],
                estudiante_id=estudiante_id,
                legajo=asig["legajo"],
                nombre_completo=asig["nombre_completo"],
                preguntas_generales=[],
                bloques_academicos=[],
            )

            # A. Preguntas Generales
            if nombre_evento in EVENTOS_GENERALES:
                for p in preguntas_crudas:
                    formulario.preguntas_generales.append(
                        self._ensamblar_pregunta(p, None, dicc_opciones, dicc_resp)
                    )

            # B. Preguntas Académicas (El cruce por materia que pediste)
            else:
                materias = []
                if nombre_evento == "fin_cuatrimestre_acad":
                    materias = await self.repo.get_materias_cursando(estudiante_id)
                elif nombre_evento == "llamado_final_acad":
                    materias = await self.repo.get_materias_con_final(estudiante_id)
                elif nombre_evento == "inicio_cuatrimestre_acad":
                    materias = await self.repo.get_materias_disponibles(estudiante_id)

                # Reutilizamos tu armador de bloques intacto
                formulario.bloques_academicos = self._armar_bloques(
                    materias, preguntas_crudas, dicc_opciones, dicc_resp
                )

            resultado.append(formulario)

        return resultado
