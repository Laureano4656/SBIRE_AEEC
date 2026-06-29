interface PreguntaResponse {
    id: number
    texto_pregunta: string
    tipo_pregunta: string
}
interface IndicadorResponse {
    id: number
    nombre: string
    preguntas: PreguntaResponse[]
}

export interface DimensionResponse {
    id: number
    nombre: string
    indicadores: IndicadorResponse[]
}
