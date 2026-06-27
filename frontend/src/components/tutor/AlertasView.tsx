import { useState, useMemo } from "react";
import type { Alerta } from "./types";
import { severityBadge, estadoAlertaBadge, getFilteredAlertas } from "./helpers";

interface AlertasViewProps {
  alertas: Alerta[];
  onMarcarEnRevision: (id: string) => void;
  onResolver: (id: string) => void;
  onAbrirEntrevista: (studentId: string) => void;
  onVerEstudiante: (studentId: string) => void;
}

export default function AlertasView({
  alertas,
  onMarcarEnRevision,
  onResolver,
  onAbrirEntrevista,
  onVerEstudiante,
}: AlertasViewProps) {
  const [filterSeveridad, setFilterSeveridad] = useState<
    "TODAS" | "ALTA" | "MEDIA" | "BAJA"
  >("TODAS");

  const filteredAlertas = useMemo(
    () => getFilteredAlertas(alertas, filterSeveridad),
    [alertas, filterSeveridad],
  );

  const alertasNuevas = alertas.filter((a) => a.estado === "NUEVA").length;
  const alertasEnRevision = alertas.filter(
    (a) => a.estado === "EN_REVISION",
  ).length;
  const alertasResueltas = alertas.filter(
    (a) => a.estado === "RESUELTA",
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
          <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
            ALERTAS NUEVAS
          </span>
          <span className="text-3xl font-black text-brand-error mt-1 block">
            {alertasNuevas}
          </span>
          <p className="text-[10px] text-brand-outline mt-1 font-medium">
            sin revisar todavía
          </p>
        </div>
        <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
          <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
            EN REVISIÓN
          </span>
          <span className="text-3xl font-black text-amber-600 mt-1 block">
            {alertasEnRevision}
          </span>
          <p className="text-[10px] text-brand-outline mt-1 font-medium">
            siendo evaluadas
          </p>
        </div>
        <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
          <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
            RESUELTAS
          </span>
          <span className="text-3xl font-black text-[#006a6a] mt-1 block">
            {alertasResueltas}
          </span>
          <p className="text-[10px] text-brand-outline mt-1 font-medium">
            cerradas con seguimiento
          </p>
        </div>
      </div>

      <div className="bg-white border border-brand-outline-variant rounded p-4 flex flex-wrap gap-4 items-center shadow-xs text-xs font-semibold">
        <span className="text-[11px] font-bold text-[#43474f] uppercase tracking-wider">
          Severidad:
        </span>
        <div className="flex border border-brand-outline-variant rounded overflow-hidden">
          {(["TODAS", "ALTA", "MEDIA", "BAJA"] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeveridad(sev)}
              className={`px-3 py-1.5 font-bold cursor-pointer border-l first:border-l-0 border-brand-outline-variant transition-colors ${
                filterSeveridad === sev
                  ? sev === "ALTA"
                    ? "bg-[#ffdad6] text-[#ba1a1a]"
                    : sev === "MEDIA"
                      ? "bg-amber-100 text-amber-800"
                      : sev === "BAJA"
                        ? "bg-[#e2f3f5] text-[#006e6e]"
                        : "bg-brand-primary text-white"
                  : "bg-white text-brand-primary"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-brand-outline-variant rounded shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-outline-variant bg-[#f8f9fa] flex justify-between items-center">
          <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1.5">
            <span className="material-symbols-outlined text-lg">
              notifications_active
            </span>
            Alertas de Riesgo
          </h4>
          <span className="text-[10px] text-brand-outline font-bold">
            {filteredAlertas.length} de {alertas.length} registros
          </span>
        </div>

        <div className="divide-y divide-brand-outline-variant">
          {filteredAlertas.map((a) => (
            <div
              key={a.id}
              className="p-5 hover:bg-[#f8f9fa] transition-colors flex flex-col md:flex-row md:items-start justify-between gap-3"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-brand-primary">
                    {a.studentName}
                  </span>
                  {severityBadge(a.severidad)}
                  {estadoAlertaBadge(a.estado)}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f3f4f5] text-[#43474f]">
                    {a.tipo}
                  </span>
                </div>
                <p className="text-[11px] text-brand-outline font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    calendar_today
                  </span>
                  {a.fecha}
                </p>
                <p className="text-xs text-[#43474f] leading-relaxed max-w-lg">
                  {a.descripcion}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 self-start">
                {a.estado === "NUEVA" && (
                  <button
                    onClick={() => onMarcarEnRevision(a.id)}
                    className="text-[10px] font-bold text-amber-800 border border-amber-300 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded transition-all whitespace-nowrap"
                  >
                    Marcar en Revisión
                  </button>
                )}
                {a.estado !== "RESUELTA" && (
                  <button
                    onClick={() => onResolver(a.id)}
                    className="text-[10px] font-bold text-[#006a6a] border border-[#006a6a]/30 bg-[#e2f3f5] hover:bg-[#c8eeee] px-3 py-1.5 rounded transition-all whitespace-nowrap"
                  >
                    Resolver
                  </button>
                )}
                <button
                  onClick={() => onAbrirEntrevista(a.studentId)}
                  className="text-[10px] font-bold text-brand-primary border border-brand-primary/30 bg-[#eef2ff] hover:bg-[#dde3fb] px-3 py-1.5 rounded transition-all whitespace-nowrap flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">
                    event_note
                  </span>
                  Agendar Entrevista
                </button>
                <button
                  onClick={() => onVerEstudiante(a.studentId)}
                  className="text-[10px] font-bold text-[#43474f] border border-brand-outline-variant bg-[#f3f4f5] hover:bg-[#edeeef] px-3 py-1.5 rounded transition-all whitespace-nowrap"
                >
                  Ver Estudiante
                </button>
              </div>
            </div>
          ))}

          {filteredAlertas.length === 0 && (
            <div className="p-12 text-center text-brand-outline font-medium text-xs">
              No hay alertas que coincidan con el filtro seleccionado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
