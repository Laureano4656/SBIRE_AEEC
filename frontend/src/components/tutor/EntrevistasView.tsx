import type { EntrevistaTutorResponse } from "../../types/admin_dep.ts";

interface EntrevistasViewProps {
  entrevistas: EntrevistaTutorResponse[];
  isLoading?: boolean;
  isError?: boolean;
  onCompletar: (e: EntrevistaTutorResponse) => void;
  onCancelar: (id: number) => void;
}

const estadoBadge = (estado: string) => {
  switch (estado) {
    case "pendiente":
      return (
        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">
          Pendiente
        </span>
      );
    case "realizada":
      return (
        <span className="bg-[#e2f3f5] text-[#006e6e] px-2 py-0.5 rounded text-[10px] font-bold">
          Realizada
        </span>
      );
    case "cancelada":
      return (
        <span className="bg-[#f3f4f5] text-[#43474f] px-2 py-0.5 rounded text-[10px] font-bold">
          Cancelada
        </span>
      );
    default:
      return null;
  }
};

export default function EntrevistasView({
  entrevistas,
  isLoading,
  isError,
  onCompletar,
  onCancelar,
}: EntrevistasViewProps) {
  const pendientes = entrevistas.filter((e) => e.estado === "pendiente").length;
  const realizadas = entrevistas.filter((e) => e.estado === "realizada").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
            <span className="material-symbols-outlined text-2xl">
              pending_actions
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
              PENDIENTES
            </span>
            <span className="text-2xl font-extrabold text-amber-600">
              {pendientes}
            </span>
          </div>
        </div>
        <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#e2f3f5] flex items-center justify-center text-[#006a6a]">
            <span className="material-symbols-outlined text-2xl">
              check_circle
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
              REALIZADAS
            </span>
            <span className="text-2xl font-extrabold text-[#006a6a]">
              {realizadas}
            </span>
          </div>
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
            Error al cargar las entrevistas.
          </p>
        </div>
      )}

      {!isLoading && !isError && (
      <div className="bg-white border border-brand-outline-variant rounded shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-outline-variant bg-[#f8f9fa] flex justify-between items-center">
          <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1.5">
            <span className="material-symbols-outlined text-lg">
              event_note
            </span>
            Historial de Entrevistas
          </h4>
          <span className="text-[10px] text-brand-outline font-bold">
            {entrevistas.length} registros
          </span>
        </div>

        <div className="divide-y divide-brand-outline-variant">
          {entrevistas.map((e) => (
            <div
              key={e.id}
              className="p-5 hover:bg-[#f8f9fa] transition-colors flex flex-col md:flex-row md:items-start justify-between gap-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-brand-primary">
                    {e.estudiante_apellido}, {e.estudiante_nombre}
                  </span>
                  {estadoBadge(e.estado)}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${e.modalidad === "virtual" ? "bg-[#eef2ff] text-brand-primary" : "bg-[#f3f4f5] text-[#43474f]"}`}
                  >
                    {e.modalidad === "virtual" ? "Virtual" : "Presencial"}
                  </span>
                </div>
                <p className="text-[11px] text-brand-outline font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    calendar_today
                  </span>
                  {new Date(e.fecha_propuesta).toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                  {e.notas_previas && (
                    <p className="text-xs text-[#43474f] leading-relaxed max-w-lg italic">
                      &quot;{e.notas_previas}&quot;
                    </p>
                  )}
                  {e.comentario && (
                    <p className="text-xs text-brand-primary leading-relaxed max-w-lg mt-1">
                      <span className="font-semibold">Comentario:</span> {e.comentario}
                    </p>
                  )}
                </div>
                {e.estado === "pendiente" && (
                  <div className="flex gap-2 self-start">
                    <button
                      onClick={() => onCompletar(e)}
                      className="text-[10px] font-bold text-[#006a6a] border border-[#006a6a]/30 bg-[#e2f3f5] hover:bg-[#c8eeee] px-3 py-1.5 rounded transition-all whitespace-nowrap"
                    >
                      Marcar como realizada
                    </button>
                    <button
                      onClick={() => onCancelar(e.id)}
                      className="text-[10px] font-bold text-[#43474f] border border-brand-outline-variant bg-[#f3f4f5] hover:bg-[#edeeef] px-3 py-1.5 rounded transition-all whitespace-nowrap"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
            </div>
          ))}

            {entrevistas.length === 0 && (
              <div className="p-12 text-center text-brand-outline font-medium text-xs">
                No hay entrevistas registradas. Agendá la primera desde la sección Alertas.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
