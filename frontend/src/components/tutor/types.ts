import type { Student } from "../../types/types";

export interface Entrevista {
  id: string;
  studentId: string;
  studentName: string;
  fecha: string;
  tipo: "Presencial" | "Virtual";
  estado: "Pendiente" | "Realizada" | "Cancelada";
  notas: string;
}

export interface Intervencion {
  id: string;
  entrevistaId: string;
  tipo:
    | "tutoria_academica"
    | "derivacion"
    | "seguimiento_virtual"
    | "asesoria_par"
    | "otro";
  descripcion: string;
  resultado: "positivo" | "neutro" | "negativo" | "sin_contacto";
  fecha: string;
}

export interface Alerta {
  id: string;
  studentId: string;
  studentName: string;
  tipo: string;
  severidad: "ALTA" | "MEDIA" | "BAJA";
  descripcion: string;
  fecha: string;
  estado: "NUEVA" | "EN_REVISION" | "RESUELTA";
}

export type ActiveMenu = "intervenciones" | "entrevistas" | "alertas" | "estudiante";
