import { useMutation, useQueryClient } from "@tanstack/react-query";

import { publicarEncuesta, responderEncuesta } from "../../api/encuestas";

import { encuestasKeys } from "../queries/useEncuestasQueries";

export const usePublicarEncuestaMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: publicarEncuesta,
        onSuccess: (_data, asignacion_id) => {
            queryClient.invalidateQueries({ queryKey: encuestasKeys.encuesta(asignacion_id) })
        }
    })
}

export const useResponderEncuestaMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: responderEncuesta,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: encuestasKeys.encuesta(variables.asignacion_id) })
        }
    })
}