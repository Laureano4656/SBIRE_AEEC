import { axiosInstance } from '../libs/axios';

const PREFIX = '/eventos-disparadores';

export const getEventosDisparadores = async () => {
    const response = await axiosInstance.get(`${PREFIX}/`);
    return response.data;
}