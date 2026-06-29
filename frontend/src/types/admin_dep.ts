export interface EstudianteDashboardResponse {
    nombre: string
    apellido: string
    dni: string
    carrera: string
    porcentaje_carrera: number
    indice_riesgo: number | null
    estado_alerta: string | null
    ultima_fecha_recalculo: Date | null
}

export interface EstudianteDashboardAdminResponse {
    nombre: string
    apellido: string
    dni: string
    carrera: string
    etapa: string
    porcentaje_carrera: number
    indice_riesgo: number | null
    estado_alerta: string | null
    ultima_fecha_recalculo: Date | null
}
export interface GeneralEstudianteDashboardAdminResponse {
    nombre: string
    apellido: string
    anio: number
    carrera: string
    materias_aprobadas: number
    materias_totales: number
    score_riesgo: number
}
export interface EventoCronologicoResponse {
    tipo: string
    descripcion: string
    fecha: Date
}

export interface AlertaTutorResponse {
    id: number
    estudiante_id: number
    tipo_desercion: string
    nivel_riesgo: string
    origen: string
    estado: string
    anio_cursada: number
    generada_en: string
    fecha_cierre: string | null
    estudiante_nombre: string | null
    estudiante_apellido: string | null
}

export interface IntervencionTutorResponse {
    id: number
    alerta_id: number
    tutor_id: number
    tipo: string
    resultado: string | null
    fecha: string
    descripcion: string | null
    creado_en: string
    estudiante_id: number
    estudiante_nombre: string
    estudiante_apellido: string
    estudiante_dni: string
}

export interface EntrevistaTutorResponse {
    id: number
    alerta_id: number
    tutor_id: number
    estudiante_id: number
    fecha_propuesta: string
    modalidad: string
    notas_previas: string | null
    estado: string
    intervencion_id: number
    creado_en: string
    estudiante_nombre: string | null
    estudiante_apellido: string | null
    comentario: string | null
}

export interface IntervencionCreatePayload {
    alerta_id: number
    tutor_id: number
    tipo: string
    resultado: string
    fecha: string
    descripcion?: string
}

export interface EntrevistaCreatePayload {
    alerta_id: number
    tutor_id: number
    estudiante_id: number
    fecha_propuesta: string
    modalidad: string
    notas_previas?: string
    intervencion_id: number
}