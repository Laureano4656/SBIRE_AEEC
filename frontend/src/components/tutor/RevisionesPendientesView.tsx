import { useState } from "react";
import type { RevisionPendienteResponse } from "../../types/admin_dep.ts";
import RevisarRespuestaModal from "./RevisarRespuestaModal.tsx";

interface RevisionesPendientesViewProps {
  items: RevisionPendienteResponse[];
  isLoading?: boolean;
  isError?: boolean;
  onAprobar: (respuesta_id: number, riesgo_calculado: number) => Promise<void>;
}

export default function RevisionesPendientesView({
  items,
  isLoading,
  isError,
  onAprobar,
}: RevisionesPendientesViewProps) {
  const [revisionItem, setRevisionItem] =
    useState<RevisionPendienteResponse | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
          <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
            PENDIENTES
          </span>
          <span className="text-3xl font-black text-amber-600 mt-1 block">
            {items.length}
          </span>
          <p className="text-[10px] text-brand-outline mt-1 font-medium">
            respuestas por revisar
          </p>
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
            Error al cargar las revisiones pendientes.
          </p>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="bg-white border border-brand-outline-variant rounded shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-brand-outline-variant bg-[#f8f9fa] flex justify-between items-center">
            <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1.5">
              <span className="material-symbols-outlined text-lg">
                rate_review
              </span>
              Respuestas de texto libre
            </h4>
            <span className="text-[10px] text-brand-outline font-bold">
              {items.length} registros
            </span>
          </div>

          <div className="divide-y divide-brand-outline-variant">
            {items.map((item) => (
              <div
                key={item.respuesta_id}
                className="p-5 hover:bg-[#f8f9fa] transition-colors flex flex-col md:flex-row md:items-start justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-brand-primary">
                      {item.nombre_completo}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f3f4f5] text-[#43474f]">
                      Legajo: {item.legajo}
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-outline font-semibold line-clamp-2">
                    <span className="text-[#43474f]">P: </span>
                    {item.texto_pregunta}
                  </p>
                  <p className="text-xs text-[#43474f] italic line-clamp-2">
                    <span className="not-italic font-semibold">R: </span>
                    &quot;{item.valor_texto}&quot;
                  </p>
                  {item.fecha_asignacion && (
                    <p className="text-[10px] text-brand-outline font-semibold flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-sm">
                        calendar_today
                      </span>
                      {new Date(item.fecha_asignacion).toLocaleDateString("es-AR")}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setRevisionItem(item)}
                  className="text-[10px] font-bold text-brand-primary border border-brand-primary/30 bg-[#eef2ff] hover:bg-[#dde3ff] px-3 py-1.5 rounded transition-all whitespace-nowrap cursor-pointer self-start"
                >
                  Revisar
                </button>
              </div>
            ))}

            {items.length === 0 && (
              <div className="p-12 text-center text-brand-outline font-medium text-xs">
                No hay respuestas pendientes de revisión.
              </div>
            )}
          </div>
        </div>
      )}

      {revisionItem && (
        <RevisarRespuestaModal
          item={revisionItem}
          onClose={() => setRevisionItem(null)}
          onAprobar={onAprobar}
        />
      )}
    </div>
  );
}
