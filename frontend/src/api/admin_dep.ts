import { axiosInstance } from '../libs/axios'
import type { EstudianteDashboardAdminResponse, EventoCronologicoResponse } from '../types/admin_dep'

const PREFIX = '/dashboard-admin-dep'

export const getConteoEstudiantes = async ({ anio, carrera_id }: { anio: number, carrera_id: number }) => {
    const response = await axiosInstance.post(`${PREFIX}/estadisticas/estudiantes`, { anio, carrera_id })
    return response.data
}

export const getConteoPorRiesgo = async ({ anio, carrera_id }: { anio: number, carrera_id: number }) => {
    const response = await axiosInstance.post(`${PREFIX}/estadisticas/riesgo`, { anio, carrera_id })
    return response.data
}

export const getTotalCriticos = async () => {
    const response = await axiosInstance.get(`${PREFIX}/estadisticas/total/criticos`)
    return response.data
}

export const getTotalAlertasNuevas = async () => {
    const response = await axiosInstance.get(`${PREFIX}/estadisticas/total/alertas-nuevas`)
    return response.data
}

export const getTotalIntervencionesMes = async () => {
    const response = await axiosInstance.get(`${PREFIX}/estadisticas/total/intervenciones-mes`)
    return response.data
}
// TODO : 
export const getEvolucionScore = async ({ anio, carrera_id }: { anio: number, carrera_id: number }) => {
    const response = await axiosInstance.post(`${PREFIX}/estadisticas/evolucion-score`, { anio, carrera_id })
    return response.data
}

export const getHistorialAlertas = async (student_id: string) => {
    const response = await axiosInstance.get<EventoCronologicoResponse[]>(`${PREFIX}/estudiantes/${student_id}/historial`)
    return response.data
}

export const getEstudiantesPorCarrera = async (carrera: string) => {
    const response = await axiosInstance.get<EstudianteDashboardAdminResponse[]>(`${PREFIX}/estadisticas/carrera/${carrera}`)
    return response.data
}

export const getEstudiantePorDni = async (dni: string) => {
    const response = await axiosInstance.get<EstudianteDashboardAdminResponse>(`${PREFIX}/estudiantes/dni/${dni}`)
    return response.data
}
export const getEstudiantePorAnio = async (anio: number) => {
    const response = await axiosInstance.get<EstudianteDashboardAdminResponse[]>(`${PREFIX}/estudiantes/anio/${anio}`)
    return response.data
}
export const getEstudiantePorRiesgo = async (riesgo: string) => {
    const response = await axiosInstance.get<EstudianteDashboardAdminResponse[]>(`${PREFIX}/estudiantes/riesgo/${riesgo}`)
    return response.data
}