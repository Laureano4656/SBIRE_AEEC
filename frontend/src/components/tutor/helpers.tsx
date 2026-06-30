import type { Entrevista, Alerta } from "./types";
import type { Student } from "../../types/types";
import { getRiskLevel } from "../../utils/studentMapping";

export function riskBadge(level: string) {
  switch (level) {
    case "CRÍTICO":
      return (
        <span className="bg-[#ffdad6] text-[#93000a] px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[#ba1a1a] rounded-full animate-pulse" />
          CRÍTICO
        </span>
      );
    case "MEDIO":
      return (
        <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
          MEDIO
        </span>
      );
    default:
      return (
        <span className="bg-[#e2f3f5] text-[#006e6e] px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[#006a6a] rounded-full" />
          BAJO
        </span>
      );
  }
}

export function estadoBadge(estado: Entrevista["estado"]) {
  switch (estado) {
    case "Pendiente":
      return (
        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">
          Pendiente
        </span>
      );
    case "Realizada":
      return (
        <span className="bg-[#e2f3f5] text-[#006e6e] px-2 py-0.5 rounded text-[10px] font-bold">
          Realizada
        </span>
      );
    case "Cancelada":
      return (
        <span className="bg-[#f3f4f5] text-[#43474f] px-2 py-0.5 rounded text-[10px] font-bold">
          Cancelada
        </span>
      );
  }
}

export function severityBadge(severidad: Alerta["severidad"]) {
  switch (severidad) {
    case "ALTA":
      return (
        <span className="bg-[#ffdad6] text-[#93000a] px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[#ba1a1a] rounded-full animate-pulse" />
          ALTA
        </span>
      );
    case "MEDIA":
      return (
        <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
          MEDIA
        </span>
      );
    default:
      return (
        <span className="bg-[#e2f3f5] text-[#006e6e] px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[#006a6a] rounded-full" />
          BAJA
        </span>
      );
  }
}

export function estadoAlertaBadge(estado: Alerta["estado"]) {
  switch (estado) {
    case "NUEVA":
      return (
        <span className="bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded text-[10px] font-bold">
          Nueva
        </span>
      );
    case "EN_REVISION":
      return (
        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">
          En Revisión
        </span>
      );
    case "RESUELTA":
      return (
        <span className="bg-[#e2f3f5] text-[#006e6e] px-2 py-0.5 rounded text-[10px] font-bold">
          Resuelta
        </span>
      );
    default:
      return null;
  }
}

export function getFilteredStudents(
  students: Student[],
  searchQuery: string,
  filterRisk: "TODOS" | "CRÍTICO" | "MEDIO" | "BAJO",
  umbralRojo?: number,
  umbralAmarillo?: number,
) {
  return students.filter((s) => {
    const fullName = `${s.apellido} ${s.nombre}`.toLowerCase();
    const matchSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      s.dni.includes(searchQuery);
    const level = getRiskLevel(s.indice_riesgo, umbralRojo, umbralAmarillo);
    const matchRisk =
      filterRisk === "TODOS" ||
      (filterRisk === "CRÍTICO" && level === "CRÍTICO") ||
      (filterRisk === "MEDIO" && level === "MEDIO") ||
      (filterRisk === "BAJO" && level === "BAJO");
    return matchSearch && matchRisk;
  });
}

export function getFilteredAlertas(
  alertas: Alerta[],
  filterSeveridad: "TODAS" | "ALTA" | "MEDIA" | "BAJA",
) {
  return alertas.filter(
    (a) => filterSeveridad === "TODAS" || a.severidad === filterSeveridad,
  );
}
