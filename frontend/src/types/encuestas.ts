export interface EstadisticasEventos {
    evento_id: number;
    nombre_evento: string;
    total_asignadas: number;
    total_completadas: number;
    periodicidad_evento: string;
}
interface Pregunta {
    id: number
    indicador_id: number | null
    carrera_id: number | null
    texto_pregunta: string
    evento_id: number
    tipo_pregunta: string
    configuracion_riesgo: Record<string, unknown> | null
    activa: boolean
}
interface RespuestaPrevia {
    pregunta_id: number
    materia_id: number | null = null
    opcion_seleccionada_id: number | null = null
    valor_numerico: number | null = null
    valor_texto: string | null = null
}
interface OpcionPregunta {
    id: number
    pregunta_id: number
    texto_opcion: string

}

interface PreguntaEncuesta extends Pregunta {
    opciones: OpcionPregunta[]
    respuesta_previa: RespuestaPrevia
}
interface BloqueAcademnico {
    materia_id: number
    materia_nombre: string,
    preguntas: PreguntaEncuesta[]
}

interface FormularioEncuestaResponse {
    asignacion_id: number
    evento_disparador: number,
    periodo_lectivo: string,
    preguntas_generales: PreguntaEncuesta[],
    bloques_academicos: BloqueAcademnico[]
}


export interface RespuestasHistoricas extends FormularioEncuestaResponse {
    estudiante_id: number
    legajo: string
    nombre_completo: string
}