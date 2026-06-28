import { useQuery } from "@tanstack/react-query";

import {
    getReporte
} from "../../api/reportes.ts";

export const reportesKeys = {
    reporte: (carrera_id: number) => ["reporte", carrera_id] as const,
};

export const useReporte = (carrera_id: number) => {
    return useQuery({
        queryKey: reportesKeys.reporte(carrera_id),
        queryFn: () => getReporte(carrera_id),
        enabled: !!carrera_id
    });
};