import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createIndicador } from "../../api/indicadores";
import { indicadoresKeys } from "../queries/useIndicadoresQueries";


export const useCreateIndicadorMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createIndicador,
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: indicadoresKeys.indicadores(data.carrera_id) });
        }
    });
}