import { useQuery } from "@tanstack/react-query";
import { getEventosDisparadores } from "../../api/eventos";

export const eventosDisparadoresKeys = {
    eventosDisparadores: () => ["eventosDisparadores"] as const,
};

export const useEventosDisparadores = () => {
    return useQuery({
        queryKey: eventosDisparadoresKeys.eventosDisparadores(),
        queryFn: getEventosDisparadores,
    });
}