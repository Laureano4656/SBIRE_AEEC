export interface AlertaResponse {
    id: number,
    estudiante_id: number,
    score_id: number,
    asignacion_id: number,
    tipo_desercion: string,
    nivel_riesgo: string,
    origen: string,
    estado: string,
    anio_cursada: number,
    generada_en: Date,
    fecha_cierre: Date | null,
}

export interface AlertaCreate {
    estudiante_id: number,
    score_id: number,
    asignacion_id: number,
    tipo_desercion: string,
    nivel_riesgo: string,
    origen: string,
    estado: string,
    anio_cursada: number,
    generada_en: Date,
    fecha_cierre: Date | null,
}

export interface AlertaUpdate {
    estado: string,
}
