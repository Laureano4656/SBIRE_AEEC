/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RiskLevel = "CRÍTICO" | "MEDIO" | "BAJO" | "SEGURO";

export interface Student {
  id: string;
  dni: string;
  lastNames: string;
  firstNames: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  career: string;
  year: number;
  legajo: string;
  riskLevel: RiskLevel;
  riskValue: number; // 0 to 10
  tramo: "INICIAL" | "MEDIO" | "AVANZADO";
  lastRecalculation: string;
  statusAlerta: "NUEVA" | "EN REVISIÓN" | "INTERVENIDA" | "SIN ALERTA";
  gpa: number;
  subjectsApproved: number;
  subjectsTotal: number;
  engagement: "Alto" | "Medio" | "Bajo";
  assistancePercentage: number;
  phone: string;
}

export interface SubjectProgress {
  code: string;
  name: string;
  teacher: string;
  midtermGrades: string; // e.g., "2, 4 (Recuperatorio)"
  finalGrade: string; // e.g., "8" or "-"
  assistance: number; // percentage
  status: "EN RIESGO" | "APROBADA" | "CURSANDO" | "PROMOCIONADA" | "REPROBADA";
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: "ENTREVISTA" | "ALERTA" | "CORREO" | "CIERRE" | "MANUAL";
  title: string;
  description: string;
  tutor?: string;
  icon: string;
  color: string;
}

export interface Interview {
  id: string;
  studentId: string;
  studentName: string;
  date: string; // e.g. "24 MAY" or standard date
  time: string; // "14:30 hs"
  modality: "Presencial" | "Virtual";
  location: string; // "Aula 402" etc
  status: "PENDIENTE" | "COMPLETADA" | "REPROGRAMADA" | "CANCELADA";
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  type: "Única" | "Periódica";
  status: "Activa" | "Borrador" | "Finalizada";
  creationDate: string;
  responsesCount: number;
  responseRate: number; // percentage
  urgentCasesCount: number;
}
