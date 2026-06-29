import { axiosInstance } from "../libs/axios";
import type { AsignacionPendiente, FormularioEncuesta, MateriaListResponse, UsuarioResponse } from "../types/students.ts";

const PREFIX = "/dashboard-estudiante";

export const getDatosTutor = async (estudiante_id: number) => {
  const response = await axiosInstance.get<UsuarioResponse | null>(
    `${PREFIX}/estudiante/tutor`,
    { params: { estudiante_id } } // Viaja como ?estudiante_id=X
  );
  return response.data;
};

export const getMateriasAprobadas = async (estudiante_id: number) => {
  const response = await axiosInstance.get<number>(
    `${PREFIX}/estudiante/materias/aprobadas`,
    { params: { estudiante_id } }
  );
  return response.data;
};

export const getMateriasTotales = async (estudiante_id: number) => {
  const response = await axiosInstance.get<number>(
    `${PREFIX}/estudiante/materias/totales`,
    { params: { estudiante_id } }
  );
  return response.data;
};

export const getMateriasCursadas = async (estudiante_id: number) => {
  const response = await axiosInstance.get<MateriaListResponse[]>(
    `${PREFIX}/estudiante/materias/cursadas`,
    { params: { estudiante_id } }
  );
  return response.data;
};

export const getEncuestasPendientes = async (estudiante_id: number) => {
  const response = await axiosInstance.get<AsignacionPendiente[]>(
    `${PREFIX}/estudiante/encuestas/pendientes`,
    { params: { estudiante_id } }
  );
  return response.data;
};

export const getEncuestaFormulario = async (asignacion_id: number) => {
  const response = await axiosInstance.get<FormularioEncuesta>(
    `/encuestas/pendientes/${asignacion_id}/formulario`
  );
  return response.data;
};

export interface RespuestaSubmit {
  pregunta_id: number;
  materia_id: number | null;
  opcion_seleccionada_id: number | null;
  valor_numerico: number | null;
  valor_texto: string | null;
}

export const postEncuestaSubmit = async (
  asignacion_id: number,
  respuestas: RespuestaSubmit[]
) => {
  const response = await axiosInstance.post(
    `/encuestas/pendientes/${asignacion_id}/submit`,
    { respuestas }
  );
  return response.data;
};

export const getEncuestasSinResponder = async (estudiante_id: number) => {
  const response = await axiosInstance.get<number>(
    `${PREFIX}/estudiante/encuestas/sin-responder`,
    { params: { estudiante_id } }
  );
  return response.data;
};