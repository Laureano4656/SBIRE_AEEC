import { useState, useMemo } from "react";
import type { AlertaTutorResponse } from "../../types/admin_dep.ts";

interface AlertasViewProps {
  alertas: AlertaTutorResponse[];
  isLoading?: boolean;
  isError?: boolean;
  onAtender: (alerta_id: number, estudiante_id: number) => void;
  onCambiarEstado: (alerta_id: number, estado: string) => void;
}

const nivelRiesgoLabel: Record<string, string> = {
  bajo: "BAJA",
  medio: "MEDIA",
  alto: "ALTA",
  critico: "CRÍTICO",
};

type Severidad = "TODAS" | "ALTA" | "MEDIA" | "BAJA" | "CRÍTICO";

const severityBadge = (severidad: string) => {
  switch (severidad) {
    case "ALTA":
    case "CRÍTICO":
      return (
        <span className="bg-[#ffdad6] text-[#93000a] px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[#ba1a1a] rounded-full animate-pulse" />
          {severidad}
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
};

const estadoAlertaBadge = (estado: string) => {
  switch (estado) {
    case "nueva":
      return (
        <span className="bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded text-[10px] font-bold">
          Nueva
        </span>
      );
    case "en_revision":
      return (
        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">
          En Revisión
        </span>
      );
    case "intervenida":
      return (
        <span className="bg-[#eef2ff] text-brand-primary px-2 py-0.5 rounded text-[10px] font-bold">
          Intervenida
        </span>
      );
    case "resuelta":
      return (
        <span className="bg-[#e2f3f5] text-[#006e6e] px-2 py-0.5 rounded text-[10px] font-bold">
          Resuelta
        </span>
      );
    default:
      return (
        <span className="bg-[#f3f4f5] text-[#43474f] px-2 py-0.5 rounded text-[10px] font-bold">
          {estado}
        </span>
      );
  }
};

export default function AlertasView({
  alertas,
  isLoading,
  isError,
  onAtender,
  onCambiarEstado,
}: AlertasViewProps) {
  const [filterSeveridad, setFilterSeveridad] = useState<Severidad>("TODAS");

  const filteredAlertas = useMemo(
    () => alertas.filter(
      (a) => filterSeveridad === "TODAS" || nivelRiesgoLabel[a.nivel_riesgo] === filterSeveridad,
    ),
    [alertas, filterSeveridad],
  );

  const alertasNuevas = alertas.filter((a) => a.estado === "nueva").length;
  const alertasEnRevision = alertas.filter((a) => a.estado === "en_revision").length;
  const alertasResueltas = alertas.filter((a) => a.estado === "resuelta").length;

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
            INTERVENIDAS / RESUELTAS
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
          {(["TODAS", "CRÍTICO", "ALTA", "MEDIA", "BAJA"] as Severidad[]).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeveridad(sev)}
              className={`px-3 py-1.5 font-bold cursor-pointer border-l first:border-l-0 border-brand-outline-variant transition-colors ${
                filterSeveridad === sev
                  ? sev === "CRÍTICO" || sev === "ALTA"
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

      {isLoading && (
        <div className="bg-white border border-brand-outline-variant rounded shadow-xs p-12 text-center">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto" />
            <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
          </div>
        </div>
      )}

      {isError && (
        <div className="bg-white border border-brand-outline-variant rounded shadow-xs p-12 text-center">
          <p className="text-xs text-brand-error font-semibold">
            Error al cargar las alertas.
          </p>
        </div>
      )}

      {!isLoading && !isError && (
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
                    {a.estudiante_apellido}, {a.estudiante_nombre}
                  </span>
                  {severityBadge(nivelRiesgoLabel[a.nivel_riesgo] ?? a.nivel_riesgo)}
                  {estadoAlertaBadge(a.estado)}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f3f4f5] text-[#43474f]">
                    {a.tipo_desercion}
                  </span>
                </div>
                <p className="text-[11px] text-brand-outline font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    calendar_today
                  </span>
                  {new Date(a.generada_en).toLocaleDateString("es-AR")}
                </p>
                <p className="text-xs text-[#43474f] leading-relaxed max-w-lg">
                  {a.origen === "score_riesgo"
                    ? "Alerta generada por cálculo de score de riesgo."
                    : a.origen === "omision_encuesta"
                      ? "Alerta generada por omisión de encuesta."
                      : a.origen === "carrera_extendida"
                        ? "Alerta generada por carrera extendida."
                        : `Origen: ${a.origen}`}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 self-start">
                {a.estado === "nueva" && (
                  <button
                    onClick={() => onCambiarEstado(a.id, "en_revision")}
                    className="text-[10px] font-bold text-amber-800 border border-amber-300 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded transition-all whitespace-nowrap"
                  >
                    Marcar en Revisión
                  </button>
                )}
                {a.estado === "en_revision" && (
                  <button
                    onClick={() => onAtender(a.id, a.estudiante_id)}
                    className="text-[10px] font-bold text-[#006a6a] border border-[#006a6a]/30 bg-[#e2f3f5] hover:bg-[#c8eeee] px-3 py-1.5 rounded transition-all whitespace-nowrap"
                  >
                    Intervenir
                  </button>
                )}
              </div>
            </div>
          ))}

            {filteredAlertas.length === 0 && (
              <div className="p-12 text-center text-brand-outline font-medium text-xs">
                No hay alertas sin atender.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
