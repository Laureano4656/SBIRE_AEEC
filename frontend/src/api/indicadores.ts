import { axiosInstance } from '../libs/axios';
import type { DimensionResponse } from '../types/indicadores';

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

export const calcularAhp = async (payload: {
    nodo_raiz: number;
    jerarquia: Record<number, number[]>;
    comparaciones_por_nodo: Record<
        number,
        { criterio_i: number; criterio_j: number; valor: number }[]
    >;
    configuracion: {
        carrera_id: number;
        etapa: string;
        umbral_amarillo: number;
        umbral_rojo: number;
        factor_extension: number;
        descripcion: string;
        actualizado_por: number;
    };
}) => {
    const response = await axiosInstance.post('/calcular_ahp/', payload);
    return response.data;
}