import type { Student } from "../types/types.ts";
import type { EstudianteDashboardAdminResponse } from "../types/admin_dep.ts";

export function getRiskLevel(
  ir: number | null,
  umbralRojo = 7.5,
  umbralAmarillo = 4.0,
): "CRÍTICO" | "MEDIO" | "BAJO" {
  if (ir === null) return "BAJO";
  return ir >= umbralRojo ? "CRÍTICO" : ir >= umbralAmarillo ? "MEDIO" : "BAJO";
}

function formatDate(d: Date | string | null): string | null {
  if (d === null) return null;
  if (typeof d === "string") return d;
  return d.toISOString();
}

export function mapToStudent(
  api: EstudianteDashboardAdminResponse,
): Student {
  return {
    nombre: api.nombre,
    apellido: api.apellido,
    dni: api.dni,
    carrera: api.carrera,
    etapa: api.etapa,
    porcentaje_carrera: api.porcentaje_carrera ?? null,
    indice_riesgo: api.indice_riesgo,
    estado_alerta: api.estado_alerta,
    ultima_fecha_recalculo: formatDate(api.ultima_fecha_recalculo),
  };
}
