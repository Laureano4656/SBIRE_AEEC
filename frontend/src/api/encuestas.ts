import { axiosInstance } from '../libs/axios';

const PREFIX = '/encuestas';

export const getEncuesta = async (asignacion_id: number) => {
    const response = await axiosInstance.get(
        `${PREFIX}/pendientes/${asignacion_id}/formulario`
    );
    return response.data;
};

export const publicarEncuesta = async (asignacion_id: number) => {
    const response = await axiosInstance.patch(
        `${PREFIX}/asignacion/${asignacion_id}/publicar`
    );
    return response.data;
}

export const responderEncuesta = async ({
    asignacion_id,
    respuestas
}: {
    asignacion_id: number;
    respuestas: {
        pregunta_id: number;
        materia_id: number;
        opcion_seleccionada_id: number;
    }[];
}) => {
    const response = await axiosInstance.post(
        `${PREFIX}/pendientes/${asignacion_id}/submit`,
        { respuestas }
    );
    return response.data;
};

export const getMetricasEncuestas = async (carrera_id: number) => {
    const response = await axiosInstance.get(
        `${PREFIX}/dashboard/carreras/${carrera_id}/metricas-eventos`
    );
    return response.data;
}
export const getMetricasEncuestasCicloActual = async (carrera_id: number) => {
    const response = await axiosInstance.get(
        `${PREFIX}/dashboard/carreras/${carrera_id}/metricas-eventos/ciclo-actual`
    );
    return response.data;
}