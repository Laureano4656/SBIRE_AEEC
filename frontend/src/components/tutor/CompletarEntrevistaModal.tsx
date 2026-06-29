import { useState } from "react";
import type { EntrevistaTutorResponse } from "../../types/admin_dep.ts";

interface CompletarEntrevistaModalProps {
  entrevista: EntrevistaTutorResponse;
  onClose: () => void;
  onSubmit: (data: { entrevista_id: number; comentario: string; resultado: string }) => void;
}

const RESULTADOS = [
  { value: "positivo", label: "Positivo" },
  { value: "neutro", label: "Neutro" },
  { value: "negativo", label: "Negativo" },
  { value: "sin_contacto", label: "Sin Contacto" },
];

export default function CompletarEntrevistaModal({
  entrevista,
  onClose,
  onSubmit,
}: CompletarEntrevistaModalProps) {
  const [comentario, setComentario] = useState("");
  const [resultado, setResultado] = useState("positivo");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ entrevista_id: entrevista.id, comentario, resultado });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191c1d]/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-brand-outline-variant rounded shadow-2xl max-w-lg w-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-outline-variant shrink-0">
          <h3 className="text-base font-bold text-brand-primary flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xl">task_alt</span>
            Completar Entrevista
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-brand-outline hover:text-brand-error transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-[#f8f9fa] rounded p-3 border border-brand-outline-variant">
            <p className="text-[11px] text-brand-outline font-semibold">
              Estudiante
            </p>
            <p className="text-sm font-bold text-brand-primary mt-0.5">
              {entrevista.estudiante_apellido}, {entrevista.estudiante_nombre}
            </p>
            <p className="text-[11px] text-brand-outline mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">calendar_today</span>
              {new Date(entrevista.fecha_propuesta).toLocaleDateString("es-AR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div>
            <label className="text-[11px] font-bold text-brand-outline uppercase tracking-wider block mb-2">
              Resultado de la entrevista
            </label>
            <div className="flex gap-2">
              {RESULTADOS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setResultado(r.value)}
                  className={`flex-1 px-3 py-2 rounded border text-xs font-bold transition-all cursor-pointer ${
                    resultado === r.value
                      ? "border-brand-primary bg-[#eef2ff] text-brand-primary"
                      : "border-brand-outline-variant bg-white text-[#43474f] hover:bg-[#f8f9fa]"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-brand-outline uppercase tracking-wider block mb-1.5">
              Comentario sobre la entrevista
            </label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={4}
              placeholder="Resumen de lo tratado, acuerdos, observaciones..."
              required
              className="w-full border border-brand-outline-variant rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-brand-outline-variant text-[#43474f] rounded text-xs font-semibold hover:bg-[#edeeef] transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-brand-primary text-white py-2 px-5 rounded text-xs font-bold hover:bg-[#002f5e] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">check</span>
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
