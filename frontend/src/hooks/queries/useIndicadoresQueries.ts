import { useQuery } from "@tanstack/react-query";
import { getIndicadoresPreguntas, getUltimaConfiguracion } from "../../api/indicadores";


export const indicadoresKeys = {
    indicadores: (carrera_id: number) => ["indicadores", carrera_id] as const,
    ultimaConfiguracion: (carrera_id: number, etapa: string) => ["configuracion_ahp", carrera_id, etapa] as const,
};

export const useIndicadoresPreguntas = (carrera_id: number | null | undefined) => {
    return useQuery({
        enabled: !!carrera_id,
        queryKey: indicadoresKeys.indicadores(carrera_id!),
        queryFn: () => getIndicadoresPreguntas(carrera_id!)
    })
}

export const useUltimaConfiguracion = (carrera_id: number | null | undefined, etapa: string | null | undefined) => {
    return useQuery({
        enabled: !!carrera_id && !!etapa,
        queryKey: indicadoresKeys.ultimaConfiguracion(carrera_id!, etapa!),
        queryFn: () => getUltimaConfiguracion(carrera_id!, etapa!),
    })
}