interface PreguntaResponse {
    id: number
    texto_pregunta: string
    tipo_pregunta: string
}
interface IndicadorResponse {
    id: number
    nombre: string
    preguntas: PreguntaResponse[]
}

export interface DimensionResponse {
    id: number
    nombre: string
    indicadores: IndicadorResponse[]
}

export type comparacion = {
    criterio_i: number;
    criterio_j: number;
    valor: number;
};

export type datosConfiguracion = {
    carrera_id: number;
    etapa: string;
    umbral_amarillo: number;
    umbral_rojo: number;
    factor_extension: number;
    descripcion: string;
    actualizado_por: number;
};

export type AHPRequest = {
    nodo_raiz: number;
    jerarquia: Record<number, number[]>;
    comparaciones_por_nodo: Record<number, comparacion[]>;
    configuracion: datosConfiguracion;
};

export interface ConfiguracionAhpResponse {
    id_configuracion: number;
    configuracion: datosConfiguracion;
    pesos_globales: Record<number, number>;
    consistencia_matrices: Record<number, number>;
}
