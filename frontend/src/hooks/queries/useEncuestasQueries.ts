import { useQuery } from '@tanstack/react-query'

import { getEncuesta } from '../../api/encuestas'

export const encuestasKeys = {
    all: ['encuestas'] as const,
    encuesta: (asignacion_id: number) => ['encuestas', asignacion_id] as const,
}

export const useEncuesta = (asignacion_id: number) => {
    return useQuery({
        queryKey: encuestasKeys.encuesta(asignacion_id),
        queryFn: () => getEncuesta(asignacion_id)
    })
}
