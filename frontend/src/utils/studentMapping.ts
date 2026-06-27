import type { Student } from "../types/types.ts";
import type { EstudianteDashboardAdminResponse } from "../types/admin_dep.ts";

export function getRiskLevel(ir: number | null): "CRÍTICO" | "MEDIO" | "BAJO" {
  if (ir === null) return "BAJO";
  return ir >= 7.5 ? "CRÍTICO" : ir >= 4.0 ? "MEDIO" : "BAJO";
}

export function mapToStudent(
  api: EstudianteDashboardAdminResponse,
): Student {
  return {
    id: api.dni,
    dni: api.dni,
    firstNames: api.nombre,
    lastNames: api.apellido,
    fullName: `${api.nombre} ${api.apellido}`,
    email: "",
    avatarUrl: "",
    career: api.carrera,
    year: parseInt(api.etapa) || 0,
    legajo: "",
    riskLevel: getRiskLevel(api.indice_riesgo),
    riskValue: api.indice_riesgo ?? 0,
    tramo: "INICIAL" as const,
    lastRecalculation:
      api.ultima_fecha_recalculo === null
        ? "-"
        : typeof api.ultima_fecha_recalculo === "string"
          ? api.ultima_fecha_recalculo
          : api.ultima_fecha_recalculo.toISOString(),
    statusAlerta: (api.estado_alerta ?? "SIN ALERTA") as
      | "NUEVA"
      | "EN REVISIÓN"
      | "INTERVENIDA"
      | "SIN ALERTA",
    gpa: 0,
    subjectsApproved: 0,
    subjectsTotal: 0,
    engagement: "Medio" as const,
    phone: "",
  };
}
