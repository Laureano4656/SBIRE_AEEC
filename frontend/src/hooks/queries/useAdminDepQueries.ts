import { useQuery } from '@tanstack/react-query'

import {
    getConteoEstudiantes,
    getConteoPorRiesgo,
    getEstudiantePorAnio,
    getEstudiantePorDni,
    getEstudiantePorRiesgo,
    getEstudiantesPorCarrera,
    getEvolucionScore,
    getHistorialAlertas,
    getHistorialAlertasGenerales,
    getTotalAlertasNuevas,
    getTotalCriticos,
    getTotalIntervenciones
} from '../../api/admin_dep.ts'

export const adminDepKeys = {
    cantEstudiantes: (anio: number, carrera_id: number) => ['cantEstudiantes', anio, carrera_id] as const,
    conteoPorRiesgo: (anio: number, carrera_id: number) => ['conteoPorRiesgo', anio, carrera_id] as const,
    totalCriticos: ['totalCriticos'] as const,
    totalAlertasNuevas: ['totalAlertasNuevas'] as const,
    totalIntervenciones: ['totalIntervenciones'] as const,
    evolucionScore: (anio: number, carrera_id: number) => ['evolucionScore', anio, carrera_id] as const,
    estudiantesPorCarrera: (carrera: string) => ['estudiantesPorCarrera', carrera] as const,
    estudiantePorDni: (dni: string) => ['estudiantePorDni', dni] as const,
    estudiantePorAnio: (anio: number) => ['estudiantePorAnio', anio] as const,
    estudiantePorRiesgo: (riesgo: string) => ['estudiantePorRiesgo', riesgo] as const,
    historialAlertas: (student_id: string) => ['historialAlertas', student_id] as const,
    historialAlertasGenerales: (carrera_id: string) => ['historialAlertasGenerales', carrera_id] as const
}

export const useConteoEstudiantes = (anio: number, carrera_id: number) => {
    return useQuery({
        queryKey: adminDepKeys.cantEstudiantes(anio, carrera_id),
        queryFn: () => getConteoEstudiantes({ anio, carrera_id })
    })
}

export const useConteoPorRiesgo = (anio: number, carrera_id: number) => {
    return useQuery({
        queryKey: adminDepKeys.conteoPorRiesgo(anio, carrera_id),
        queryFn: () => getConteoPorRiesgo({ anio, carrera_id })
    })
}

export const useTotalCriticos = (carrera_id: number) => {
    return useQuery({
        queryKey: adminDepKeys.totalCriticos,
        queryFn: () => getTotalCriticos({ carrera_id })
    })
}

export const useTotalAlertasNuevas = (carrera_id: number) => {
    return useQuery({
        queryKey: adminDepKeys.totalAlertasNuevas,
        queryFn: () => getTotalAlertasNuevas({ carrera_id })
    })
}

export const useTotalIntervenciones = (carrera_id: number) => {
    return useQuery({
        queryKey: adminDepKeys.totalIntervenciones,
        queryFn: () => getTotalIntervenciones({ carrera_id })
    })
}

export const useEvolucionScore = (anio: number, carrera_id?: number) => {
    return useQuery({
        queryKey: adminDepKeys.evolucionScore(anio, carrera_id ?? 0),
        queryFn: () => getEvolucionScore(anio, carrera_id)
    })
}

export const useEstudiantesPorCarrera = (carrera: string) => {
    return useQuery({
        queryKey: adminDepKeys.estudiantesPorCarrera(carrera),
        queryFn: () => getEstudiantesPorCarrera(carrera)
    })
}

export const useEstudiantePorDni = (dni: string) => {
    return useQuery({
        queryKey: adminDepKeys.estudiantePorDni(dni),
        queryFn: () => getEstudiantePorDni(dni)
    })
}

export const useEstudiantePorAnio = (anio: number) => {
    return useQuery({
        queryKey: adminDepKeys.estudiantePorAnio(anio),
        queryFn: () => getEstudiantePorAnio(anio)
    })
}

export const useEstudiantePorRiesgo = (riesgo: string) => {
    return useQuery({
        queryKey: adminDepKeys.estudiantePorRiesgo(riesgo),
        queryFn: () => getEstudiantePorRiesgo(riesgo)
    })
}

export const useHistorialAlertas = (student_id: string) => {
    return useQuery({
        queryKey: adminDepKeys.historialAlertas(student_id),
        queryFn: () => getHistorialAlertas(student_id)
    })
}

export const useHistorialAlertasGenerales = (carrera_id: string) => {
    return useQuery({
        queryKey: adminDepKeys.historialAlertasGenerales(carrera_id),
        queryFn: () => getHistorialAlertasGenerales(carrera_id)
    })
}