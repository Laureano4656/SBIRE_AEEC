import { useQuery } from "@tanstack/react-query";

import {
    obtenerAlertas,
    obtenerAlertasPendientes,
    obtenerAlertasPorEstudiante,
    obtenerAlertasPendientesPorEstudiante
} from "../../api/alertas";

export const alertasKeys = {
    alertas: (carrera_id: number) => ["alertas", carrera_id] as const,
    alertasPendientes: (carrera_id: number) => ["alertasPendientes", carrera_id] as const,
    alertasPorEstudiante: (estudiante_id: number) => ["alertasPorEstudiante", estudiante_id] as const,
    alertasPendientesPorEstudiante: (estudiante_id: number) => ["alertasPendientesPorEstudiante", estudiante_id] as const,
};

export const useAlertas = (carrera_id: number) => {
    return useQuery({
        queryKey: alertasKeys.alertas(carrera_id),
        queryFn: () => obtenerAlertas(carrera_id),
    });
}

export const useAlertasPendientes = (carrera_id: number) => {
    return useQuery({
        queryKey: alertasKeys.alertasPendientes(carrera_id),
        queryFn: () => obtenerAlertasPendientes(carrera_id),
    });
}

export const useAlertasPorEstudiante = (estudiante_id: number) => {
    return useQuery({
        queryKey: alertasKeys.alertasPorEstudiante(estudiante_id),
        queryFn: () => obtenerAlertasPorEstudiante(estudiante_id),
    });
}

export const useAlertasPendientesPorEstudiante = (estudiante_id: number) => {
    return useQuery({
        queryKey: alertasKeys.alertasPendientesPorEstudiante(estudiante_id),
        queryFn: () => obtenerAlertasPendientesPorEstudiante(estudiante_id),
    });
}   