import { useState } from "react";
import type { RevisionPendienteResponse } from "../../types/admin_dep.ts";

interface RevisarRespuestaModalProps {
  item: RevisionPendienteResponse;
  onClose: () => void;
  onAprobar: (respuesta_id: number, riesgo_calculado: number) => Promise<void>;
}

export default function RevisarRespuestaModal({
  item,
  onClose,
  onAprobar,
}: RevisarRespuestaModalProps) {
  const [riesgo, setRiesgo] = useState<string>("0.5");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onAprobar(item.respuesta_id, parseFloat(riesgo));
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191c1d]/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-brand-outline-variant rounded shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black text-brand-primary uppercase tracking-widest">
            Revisar Respuesta
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:text-brand-error text-[#43474f] rounded transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-[10px] font-bold text-brand-outline uppercase tracking-wider mb-1">
              Estudiante
            </p>
            <p className="text-sm font-bold text-brand-primary">
              {item.nombre_completo}
            </p>
            <p className="text-[10px] text-[#43474f] font-semibold">
              Legajo: {item.legajo}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-brand-outline uppercase tracking-wider mb-1">
              Pregunta
            </p>
            <p className="text-sm text-[#191c1d] bg-[#f8f9fa] p-3 rounded border border-brand-outline-variant">
              {item.texto_pregunta}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-brand-outline uppercase tracking-wider mb-1">
              Respuesta del estudiante
            </p>
            <p className="text-sm text-[#191c1d] bg-[#f8f9fa] p-3 rounded border border-brand-outline-variant whitespace-pre-wrap">
              {item.valor_texto}
            </p>
          </div>

          {item.fecha_asignacion && (
            <p className="text-[10px] text-brand-outline font-semibold">
              Fecha: {new Date(item.fecha_asignacion).toLocaleDateString("es-AR")}
            </p>
          )}

          <div>
            <p className="text-[10px] font-bold text-brand-outline uppercase tracking-wider mb-1">
              Riesgo asignado (0.0 — 1.0)
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={riesgo}
                onChange={(e) => setRiesgo(e.target.value)}
                className="flex-1 accent-brand-primary"
              />
              <input
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={riesgo}
                onChange={(e) => setRiesgo(e.target.value)}
                className="w-20 px-2 py-1 border border-brand-outline-variant rounded text-xs font-bold text-center"
              />
            </div>
            <div className="flex justify-between text-[10px] text-brand-outline font-semibold mt-1">
              <span>Sin riesgo</span>
              <span>Riesgo crítico</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-[#43474f] border border-brand-outline-variant rounded hover:bg-[#f3f4f5] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 text-xs font-bold text-white bg-brand-primary rounded hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Guardando..." : "Aprobar"}
          </button>
        </div>
      </div>
    </div>
  );
}
