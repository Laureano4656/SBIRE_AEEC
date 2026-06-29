import { useMutation, useQueryClient } from "@tanstack/react-query";

import { saveConfiguracionAhp } from "../../api/indicadores";

import { indicadoresKeys } from "../queries/useIndicadoresQueries";

export const useSaveConfiguracionAhpMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: saveConfiguracionAhp,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: indicadoresKeys.indicadores(data.carrera_id),
            });
        },
    });
}
