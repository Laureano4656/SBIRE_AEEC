export interface EstudianteDashboardAdminResponse {
    nombre: string
    apellido: string
    dni: string
    carrera: string
    etapa: string
    porcentaje_carrera: number
    indice_riesgo: number
    estado_alerta: string | null
    ultima_fecha_recalculo: Date
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