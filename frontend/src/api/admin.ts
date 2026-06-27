import { axiosInstance } from "../libs/axios";
import type { UsuarioAdminResponse, RolUpdateResponse } from "../types/admin";

const PREFIX = "/admin-supremo";

export const getUsuarios = async () => {
  const response = await axiosInstance.get<UsuarioAdminResponse[]>(
    `${PREFIX}/usuarios`
  );
  return response.data;
};

export const changeUserRole = async ({ userId, nuevoRol }: { userId: number; nuevoRol: string }) => {
  const response = await axiosInstance.patch<RolUpdateResponse>(
    `${PREFIX}/usuarios/${userId}/rol`,
    { nuevo_rol: nuevoRol }
  );
  return response.data;
};