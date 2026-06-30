import { axiosInstance } from "../libs/axios";

export interface Carrera {
  id: number;
  nombre: string;
  codigo: string;
  duracion_cuatrimestre: number;
  activo: boolean;
}

export const getCarreras = async (): Promise<Carrera[]> => {
  const response = await axiosInstance.get<Carrera[]>("/carreras/");
  return response.data;
};

export const updateCarrera = async (carreraId: number): Promise<void> => {
  await axiosInstance.put("/auth/carrera", { carrera_id: carreraId });
};
