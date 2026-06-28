import { axiosInstance } from "../libs/axios.ts";
import type { EstudianteDashboardResponse, AlertaTutorResponse, IntervencionTutorResponse, EntrevistaTutorResponse, IntervencionCreatePayload, EntrevistaCreatePayload } from "../types/admin_dep.ts";

const PREFIX = "/dashboard-tutor";

export const getTutorEstudiantes = async (
  tutor_id: number,
): Promise<EstudianteDashboardResponse[]> => {
  const response = await axiosInstance.get<EstudianteDashboardResponse[]>(
    `${PREFIX}/tutor/estudiantes`,
    { params: { tutor_id } },
  );
  return response.data;
};

export const getTutorAlertasSinAtender = async (
  carrera_id: number,
): Promise<AlertaTutorResponse[]> => {
  const response = await axiosInstance.get<AlertaTutorResponse[]>(
    `${PREFIX}/tutor/alertas/sin-atender`,
    { params: { carrera_id } },
  );
  return response.data;
};

export const getTutorIntervenciones = async (
  tutor_id: number,
): Promise<IntervencionTutorResponse[]> => {
  const response = await axiosInstance.get<IntervencionTutorResponse[]>(
    `${PREFIX}/tutor/intervenciones`,
    { params: { tutor_id } },
  );
  return response.data;
};

export const getTutorEntrevistas = async (
  tutor_id: number,
): Promise<EntrevistaTutorResponse[]> => {
  const response = await axiosInstance.get<EntrevistaTutorResponse[]>(
    `${PREFIX}/tutor/entrevistas`,
    { params: { tutor_id } },
  );
  return response.data;
};

export const crearTutorIntervencion = async (
  data: IntervencionCreatePayload,
) => {
  const response = await axiosInstance.post(
    `${PREFIX}/tutor/intervenciones`,
    data,
  );
  return response.data;
};

export const crearTutorEntrevista = async (
  data: EntrevistaCreatePayload,
) => {
  const response = await axiosInstance.post(
    `${PREFIX}/tutor/entrevistas`,
    data,
  );
  return response.data;
};

export const completarTutorEntrevista = async (entrevista_id: number) => {
  const response = await axiosInstance.patch(
    `${PREFIX}/tutor/entrevistas/${entrevista_id}/completar`,
  );
  return response.data;
};

export const cancelarTutorEntrevista = async (entrevista_id: number) => {
  const response = await axiosInstance.patch(
    `${PREFIX}/tutor/entrevistas/${entrevista_id}/cancelar`,
  );
  return response.data;
};

export const actualizarEstadoAlerta = async (
  alerta_id: number,
  nuevo_estado: string,
) => {
  const response = await axiosInstance.patch(
    `${PREFIX}/tutor/alertas/${alerta_id}/estado`,
    null,
    { params: { nuevo_estado } },
  );
  return response.data;
};
