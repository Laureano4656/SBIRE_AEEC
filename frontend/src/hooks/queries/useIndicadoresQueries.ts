import { useQuery } from "@tanstack/react-query";


export const indicadoresKeys = {
    indicadores: (carrera_id: number) => ["indicadores", carrera_id] as const,

};