import { axiosInstance } from '../libs/axios'
import type { EstudianteDashboardAdminResponse, EventoCronologicoResponse } from '../types/admin_dep'

const PREFIX = '/dashboard-admin-dep'

export const getConteoEstudiantes = async ({ anio, carrera_id }: { anio: number, carrera_id: number }) => {
    const response = await axiosInstance.get<{ cantidad: number }>(`${PREFIX}/estadisticas/estudiantes`, { params: { anio, carrera_id } })
    return response.data
}

export const getConteoPorRiesgo = async ({ anio, carrera_id }: { anio: number, carrera_id: number }) => {
    const response = await axiosInstance.get<{ rojo: number; amarillo: number; verde: number }>(`${PREFIX}/estadisticas/riesgo`, { params: { anio, carrera_id } })
    return response.data
}

export const getTotalCriticos = async ({ carrera_id }: { carrera_id: number }) => {
    const response = await axiosInstance.get<{ total: number }>(`${PREFIX}/estadisticas/totales/criticos`, { params: { carrera_id } })
    return response.data
}

export const getTotalAlertasNuevas = async ({ carrera_id }: { carrera_id: number }) => {
    const response = await axiosInstance.get<{ total: number }>(`${PREFIX}/estadisticas/totales/alertas-nuevas`, { params: { carrera_id } })
    return response.data
}

export const getTotalIntervenciones = async ({ carrera_id }: { carrera_id: number }) => {
    const response = await axiosInstance.get<{ total: number }>(`${PREFIX}/estadisticas/totales/intervenciones`, { params: { carrera_id } })
    return response.data
}

export const getEvolucionScore = async (anio: number, carrera_id?: number) => {
    const params = carrera_id ? { carrera_id, anio } : { anio };

    const response = await axiosInstance.get<Record<string, number>>(
        `${PREFIX}/estadisticas/evolucion-score`,
        { params }
    );
    return response.data
}

export const getHistorialAlertas = async (student_id: string) => {
    const response = await axiosInstance.get<EventoCronologicoResponse[]>(`${PREFIX}/estudiantes/${student_id}/historial`)
    return response.data
}

export const getHistorialAlertasGenerales = async (carrera_id: string) => {
    const response = await axiosInstance.get<EventoCronologicoResponse[]>(`${PREFIX}/carrera/historial`, { params: { carrera_id } })
    return response.data
}

export const getEstudiantesPorCarrera = async (carrera: string) => {
    const response = await axiosInstance.get<EstudianteDashboardAdminResponse[]>(`${PREFIX}/estudiantes/carrera/`,
        { params: { carrera } }
    );
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