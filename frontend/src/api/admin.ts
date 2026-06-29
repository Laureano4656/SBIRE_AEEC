import { axiosInstance } from "../libs/axios";
import type {
  UsuarioAdminResponse,
  RolUpdateResponse,
  UsuarioCreatePayload,
  UsuarioUpdatePayload,
  CarreraResponse,
} from "../types/admin";

const PREFIX = "/admin";

export const getUsuarios = async () => {
  const response = await axiosInstance.get<UsuarioAdminResponse[]>(
    `${PREFIX}/usuarios`
  );
  return response.data;
};

export const changeUserRole = async ({
  userId,
  nuevoRol,
}: {
  userId: number;
  nuevoRol: string;
}) => {
  const response = await axiosInstance.patch<RolUpdateResponse>(
    `${PREFIX}/usuarios/${userId}/rol`,
    { nuevo_rol: nuevoRol }
  );
  return response.data;
};

export const createUsuario = async (data: UsuarioCreatePayload) => {
  const response = await axiosInstance.post<UsuarioAdminResponse>(
    `${PREFIX}/usuarios`,
    data
  );
  return response.data;
};

export const updateUsuario = async ({
  userId,
  data,
}: {
  userId: number;
  data: UsuarioUpdatePayload;
}) => {
  const response = await axiosInstance.put<UsuarioAdminResponse>(
    `${PREFIX}/usuarios/${userId}`,
    data
  );
  return response.data;
};

export const getCarreras = async () => {
  const response = await axiosInstance.get<CarreraResponse[]>(
    `/carreras/`
  );
  return response.data;
};

export const toggleUsuarioActivo = async ({
  userId,
  activo,
}: {
  userId: number;
  activo: boolean;
}) => {
  const response = await axiosInstance.patch<UsuarioAdminResponse>(
    `${PREFIX}/usuarios/${userId}/toggle-activo`,
    { activo }
  );
  return response.data;
};