import type { SurveyQuestion, TipoPreguntaEncuesta } from "../../types/types";

export type Indicador = {
  id: string;
  nombre: string;
  activo: boolean;
  preguntas: SurveyQuestion[];
};

export type Dimension = {
  id: string;
  nombre: string;
  indicadores: Indicador[];
};

export type Par = { padre: string; i: string; j: string };
export type SliderMap = Record<string, number>;
export type DraggedInfo = { dimIdx: number; indIdx: number; qIdx: number } | null;

export const TIPO_LABEL: Record<TipoPreguntaEncuesta, string> = {
  opcion_multiple: "Opción Múltiple",
  texto_libre: "Texto Libre",
  si_no: "Sí / No",
  escala: "Escala",
  numero: "Numérica",
};

export function getPares(arr: string[]): [string, string][] {
  const pares: [string, string][] = [];
  for (let a = 0; a < arr.length; a++)
    for (let b = a + 1; b < arr.length; b++) pares.push([arr[a], arr[b]]);
  return pares;
}

export function sliderToSaaty(v: number): number {
  if (v > 0) return v + 1;
  if (v < 0) return 1 / (Math.abs(v) + 1);
  return 1;
}

export function feedbackLabel(v: number, i: string, j: string): string {
  if (v > 0) return `${i} es ${v + 1}x más importante`;
  if (v < 0) return `${j} es ${Math.abs(v) + 1}x más importante`;
  return "Ambos tienen la misma importancia (1x)";
}

export function sliderKey(p: Par): string {
  return `${p.padre}||${p.i}||${p.j}`;
}

// class Comparacion(BaseModel):
//     criterio_i: int
//     criterio_j: int
//     valor: float
// class DatosConfiguracion(BaseModel):
//     carrera_id: int
//     etapa: str 
//     umbral_amarillo: float
//     umbral_rojo: float
//     factor_extension: float
//     descripcion: str
//     actualizado_por: int

// class AHPRequest(BaseModel):
//     nodo_raiz: int
//     jerarquia: Dict[int, List[int]]
//     comparaciones_por_nodo: Dict[int, List[Comparacion]]
//     configuracion: DatosConfiguracion

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
