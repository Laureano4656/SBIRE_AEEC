import { axiosInstance } from '../libs/axios';
import type { DimensionResponse, AHPRequest } from '../types/indicadores';

const PREFIX = '/indicadores';

export const createIndicador = async ({ nombre, dimension, carrera_id, preguntas_id }: { nombre: string, dimension: number | null, carrera_id: number, preguntas_id: number[] | null }) => {
    const response = await axiosInstance.put(`${PREFIX}/`, { nombre, dimension, carrera_id, preguntas_id });
    return response.data;
}

export const getIndicadoresPreguntas = async (carrera_id: number) => {
    const response = await axiosInstance.get<DimensionResponse[]>(`/calcular_ahp/indicadores/${carrera_id}`);
    return response.data;
}

export const saveConfiguracionAhp = async (payload: {
    carrera_id: number;
    dimensiones: Array<{
        id: number | null;
        nombre: string;
        indicadores: Array<{
            id: number | null;
            nombre: string;
            activo: boolean;
            preguntas_ids: (number | null)[];
        }>;
    }>;
}) => {
    const response = await axiosInstance.put('/calcular_ahp/configuracion', payload);
    return response.data;
}

export const getSaatyInputs = async (carrera_id: number, etapa: string) => {
    const response = await axiosInstance.get<AHPRequest>(
        `/calcular_ahp/carreras/${carrera_id}/etapas/${etapa}/saaty-inputs`,
    );
    return response.data;
};

export const calcularAhp = async (payload: AHPRequest) => {
    const response = await axiosInstance.post('/calcular_ahp/', payload);
    return response.data;
}