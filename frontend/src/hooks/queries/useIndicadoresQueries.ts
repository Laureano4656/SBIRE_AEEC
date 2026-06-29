import { useQuery } from "@tanstack/react-query";
import { getIndicadoresPreguntas } from "../../api/indicadores";


export const indicadoresKeys = {
    indicadores: (carrera_id: number) => ["indicadores", carrera_id] as const,

};

export const useIndicadoresPreguntas = (carrera_id: number | null | undefined) => {
    return useQuery({
        enabled: !!carrera_id,
        queryKey: indicadoresKeys.indicadores(carrera_id!),
        queryFn: () => getIndicadoresPreguntas(carrera_id!)
    })
}