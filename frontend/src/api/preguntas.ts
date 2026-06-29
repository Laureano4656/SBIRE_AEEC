import { axiosInstance } from '../libs/axios';

const PREFIX = '/preguntas';

export const createPregunta = async (preguntaData: any) => {
    const response = await axiosInstance.put(PREFIX, preguntaData);
    return response.data;
};