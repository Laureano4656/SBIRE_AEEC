import { axiosInstance } from "../libs/axios.ts";
import type { EstudianteDashboardResponse } from "../types/admin_dep.ts";

const PREFIX = "/dashboard-tutor";

export const getTutorEstudiantes = async (
  tutor_id: number,
): Promise<EstudianteDashboardResponse[]> => {
  const response = await axiosInstance.get<EstudianteDashboardResponse[]>(
    `${PREFIX}/tutor/estudiantes  `,
    { params: { tutor_id } },
  );
  return response.data;
};
