import {useMutation, useQueryClient} from "@tanstack/react-query";
import {crearAlerta, actualizarEstadoAlerta} from "../../api/alertas";
import {alertasKeys} from "../queries/useAlertasQueries";
import type { AlertaCreate, AlertaUpdate } from "../../types/alertas";

export const useCrearAlertaMutation = (carrera_id: number, estudiante_id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AlertaCreate) => crearAlerta(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: alertasKeys.alertas(carrera_id) });
            queryClient.invalidateQueries({ queryKey: alertasKeys.alertasPendientes(carrera_id) });
            queryClient.invalidateQueries({ queryKey: alertasKeys.alertasPorEstudiante(estudiante_id) });
            queryClient.invalidateQueries({ queryKey: alertasKeys.alertasPendientesPorEstudiante(estudiante_id) });
        }
    });
};

export const useActualizarEstadoAlertaMutation = (carrera_id: number, estudiante_id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: AlertaUpdate }) => 
            actualizarEstadoAlerta(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: alertasKeys.alertas(carrera_id) });
            queryClient.invalidateQueries({ queryKey: alertasKeys.alertasPendientes(carrera_id) });
            queryClient.invalidateQueries({ queryKey: alertasKeys.alertasPorEstudiante(estudiante_id) });
            queryClient.invalidateQueries({ queryKey: alertasKeys.alertasPendientesPorEstudiante(estudiante_id) });
        }
    });
};