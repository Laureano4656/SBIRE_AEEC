import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createPregunta } from "../../api/preguntas";

import { indicadoresKeys } from "../queries/useIndicadoresQueries";

export const useCreatePreguntaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPregunta,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: indicadoresKeys.indicadores(variables.carrera_id) })
        }
    })
}