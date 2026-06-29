import { useState } from "react";

interface ElegirIntervencionModalProps {
  alerta_id: number;
  estudiante_id: number;
  onClose: () => void;
  onSubmit: (data: {
    alerta_id: number;
    tutor_id: number;
    tipo: string;
    resultado: string;
    fecha: string;
    descripcion?: string;
    estudiante_id: number;
  }) => void;
  tutorId: number;
}

const TIPOS: { value: string; label: string; icon: string }[] = [
  { value: "tutoria_academica", label: "Tutoría Académica", icon: "school" },
  { value: "derivacion", label: "Derivación", icon: "arrow_forward" },
  {
    value: "seguimiento_virtual",
    label: "Seguimiento Virtual",
    icon: "videocam",
  },
  {
    value: "contacto_familiar",
    label: "Contacto Familiar",
    icon: "family_history",
  },
  { value: "asesoria_par", label: "Asesoría Par", icon: "group" },
  { value: "otro", label: "Otro", icon: "more_horiz" },
];

const RESULTADOS: { value: string; label: string }[] = [
  { value: "positivo", label: "Positivo" },
  { value: "neutro", label: "Neutro" },
  { value: "negativo", label: "Negativo" },
  { value: "sin_contacto", label: "Sin Contacto" },
];

export default function ElegirIntervencionModal({
  alerta_id,
  estudiante_id,
  onClose,
  onSubmit,
  tutorId,
}: ElegirIntervencionModalProps) {
  const [tipo, setTipo] = useState("");
  const [resultado, setResultado] = useState("positivo");
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipo) return;
    onSubmit({
      alerta_id,
      tutor_id: tutorId,
      tipo,
      resultado,
      fecha: new Date().toISOString().split("T")[0],
      descripcion: descripcion || undefined,
      estudiante_id,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191c1d]/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-brand-outline-variant rounded shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-outline-variant shrink-0">
          <h3 className="text-base font-bold text-brand-primary flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xl">handyman</span>
            Nueva Intervención
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-brand-outline hover:text-brand-error transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          <div>
            <label className="text-[11px] font-bold text-brand-outline uppercase tracking-wider block mb-2">
              Tipo de intervención
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TIPOS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTipo(t.value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded border text-xs font-bold transition-all cursor-pointer ${
                    tipo === t.value
                      ? "border-brand-primary bg-[#eef2ff] text-brand-primary"
                      : "border-brand-outline-variant bg-white text-[#43474f] hover:bg-[#f8f9fa]"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {t.icon}
                  </span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-brand-outline uppercase tracking-wider block mb-2">
              Resultado
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
              Descripción (opcional)
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              placeholder="Detalles de la intervención..."
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
              disabled={!tipo}
              className="bg-brand-primary text-white py-2 px-5 rounded text-xs font-bold hover:bg-[#002f5e] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">check</span>
              Crear Intervención
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
