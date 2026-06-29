import { axiosInstance } from '../libs/axios';

const PREFIX = '/indicadores';

export const createIndicador = async ({ nombre, dimension, carrera_id, preguntas_id }: { nombre: string, dimension: number | null, carrera_id: number, preguntas_id: number[] | null }) => {
    const response = await axiosInstance.put(`${PREFIX}/`, { nombre, dimension, carrera_id, preguntas_id });
    return response.data;
}

