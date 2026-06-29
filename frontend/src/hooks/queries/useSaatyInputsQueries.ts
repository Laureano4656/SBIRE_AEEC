import { useQuery } from "@tanstack/react-query";
import { getSaatyInputs } from "../../api/indicadores";

export const saatyInputsKeys = {
    saatyInputs: (carrera_id: number, etapa: string) =>
        ["saaty_inputs", carrera_id, etapa] as const,
};

export const useSaatyInputs = (
    carrera_id: number | null | undefined,
    etapa: string | null,
) => {
    return useQuery({
        enabled: !!carrera_id && !!etapa,
        queryKey: saatyInputsKeys.saatyInputs(carrera_id!, etapa!),
        queryFn: () => getSaatyInputs(carrera_id!, etapa!),
        retry: false,
    });
};
