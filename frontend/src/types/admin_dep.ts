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