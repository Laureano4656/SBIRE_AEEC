import { axiosInstance } from '../libs/axios';
import type { AlertaResponse, AlertaCreate, AlertaUpdate } from '../types/alertas';

const PREFIX = '/alertas';

export const crearAlerta = async (data: AlertaCreate): Promise<AlertaResponse> => {
    const res = await axiosInstance.post<AlertaResponse>(PREFIX, data);
    return res.data;
};

export const actualizarEstadoAlerta = async (id: number, data: AlertaUpdate): Promise<AlertaResponse> => {
    const res = await axiosInstance.patch<AlertaResponse>(`${PREFIX}/${id}/estado`, data);
    return res.data;
};

export const obtenerAlertas = async (carrera_id: number): Promise<AlertaResponse[]> => {
    const res = await axiosInstance.get<AlertaResponse[]>(`${PREFIX}/carreras/${carrera_id}`);
    return res.data;
}

export const obtenerAlertasPendientes = async (carrera_id: number): Promise<AlertaResponse[]> => {
    const res = await axiosInstance.get<AlertaResponse[]>(`${PREFIX}/carreras/${carrera_id}/pendientes`);
    return res.data;
}

export const obtenerAlertasPorEstudiante = async (estudiante_id: number): Promise<AlertaResponse[]> => {   
    const res = await axiosInstance.get<AlertaResponse[]>(`${PREFIX}/estudiante/${estudiante_id}`);
    return res.data;
}

export const obtenerAlertasPendientesPorEstudiante = async (estudiante_id: number): Promise<AlertaResponse[]> => {
    const res = await axiosInstance.get<AlertaResponse[]>(`${PREFIX}/estudiante/${estudiante_id}/pendientes`);
    return res.data;
}

