import { useQuery } from '@tanstack/react-query'

import { getEncuesta, getMetricasEncuestas, getMetricasEncuestasCicloActual } from '../../api/encuestas'

export const encuestasKeys = {
    all: ['encuestas'] as const,
    encuesta: (asignacion_id: number) => ['encuestas', asignacion_id] as const,
    metricas: (carrera_id: number) => ['metricas-encuestas', carrera_id] as const,
    metricasCicloActual: (carrera_id: number) => ['metricas-encuestas-ciclo-actual', carrera_id] as const,
}

export const useEncuesta = (asignacion_id: number) => {
    return useQuery({
        queryKey: encuestasKeys.encuesta(asignacion_id),
        queryFn: () => getEncuesta(asignacion_id)
    })
}

export const useMetricasEncuestas = (carrera_id: number) => {
    return useQuery({
        enabled: !!carrera_id,
        queryKey: encuestasKeys.metricas(carrera_id),
        queryFn: () => getMetricasEncuestas(carrera_id)
    })
}

export const useMetricasEncuestasCicloActual = (carrera_id: number | null | undefined) => {
    return useQuery({
        enabled: !!carrera_id,
        queryKey: encuestasKeys.metricasCicloActual(carrera_id!),
        queryFn: () => getMetricasEncuestasCicloActual(carrera_id!)
    })
}