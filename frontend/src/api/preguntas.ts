import type { CreatePreguntaPayload } from '../components/config/AHPBoard';
import { axiosInstance } from '../libs/axios';

const PREFIX = '/preguntas';

export const createPregunta = async (preguntaData: CreatePreguntaPayload) => {
    const response = await axiosInstance.post(PREFIX + '/', preguntaData);
    return response.data;
};