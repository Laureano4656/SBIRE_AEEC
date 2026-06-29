import { axiosInstance } from "../libs/axios.ts";
import type { ReporteResponse } from "../types/reportes.ts";

const PREFIX = "/reportes";

export const getReporte = async (carrera_id: number) => {
    const response = await axiosInstance.get<ReporteResponse[]>( 
        `${PREFIX}/estudiantes/carrera`, { params: { carrera_id } }
    );
    return response.data;
}
