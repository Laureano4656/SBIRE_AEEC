import { useState } from "react";
import type { IntervencionTutorResponse } from "../../types/admin_dep.ts";

interface AgendarEntrevistaModalProps {
  intervencion: IntervencionTutorResponse;
  onClose: () => void;
  onSubmit: (data: {
    alerta_id: number;
    tutor_id: number;
    estudiante_id: number;
    fecha_propuesta: string;
    modalidad: string;
    notas_previas: string;
    intervencion_id: number;
  }) => void;
  tutorId: number;
}

export default function AgendarEntrevistaModal({
  intervencion,
  onClose,
  onSubmit,
  tutorId,
}: AgendarEntrevistaModalProps) {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const defaultFecha = now.toISOString().slice(0, 16);

  const [fecha, setFecha] = useState(defaultFecha);
  const [modalidad, setModalidad] = useState("virtual");
  const [notas, setNotas] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      alerta_id: intervencion.alerta_id,
      tutor_id: tutorId,
      estudiante_id: intervencion.estudiante_id,
      fecha_propuesta: new Date(fecha).toISOString(),
      modalidad,
      notas_previas: notas,
      intervencion_id: intervencion.id,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191c1d]/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-brand-outline-variant rounded shadow-2xl max-w-lg w-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-outline-variant shrink-0">
          <h3 className="text-base font-bold text-brand-primary flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xl">event_note</span>
            Agendar Entrevista
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
              {intervencion.estudiante_apellido}, {intervencion.estudiante_nombre}
            </p>
          </div>

          <div>
            <label className="text-[11px] font-bold text-brand-outline uppercase tracking-wider block mb-1.5">
              Fecha y hora
            </label>
            <input
              type="datetime-local"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
              className="w-full border border-brand-outline-variant rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-brand-outline uppercase tracking-wider block mb-1.5">
              Modalidad
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setModalidad("virtual")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded border text-xs font-bold transition-all cursor-pointer ${
                  modalidad === "virtual"
                    ? "border-brand-primary bg-[#eef2ff] text-brand-primary"
                    : "border-brand-outline-variant bg-white text-[#43474f] hover:bg-[#f8f9fa]"
                }`}
              >
                <span className="material-symbols-outlined text-lg">videocam</span>
                Virtual
              </button>
              <button
                type="button"
                onClick={() => setModalidad("presencial")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded border text-xs font-bold transition-all cursor-pointer ${
                  modalidad === "presencial"
                    ? "border-brand-primary bg-[#eef2ff] text-brand-primary"
                    : "border-brand-outline-variant bg-white text-[#43474f] hover:bg-[#f8f9fa]"
                }`}
              >
                <span className="material-symbols-outlined text-lg">person</span>
                Presencial
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-brand-outline uppercase tracking-wider block mb-1.5">
              Notas previas
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              placeholder="Motivo de la entrevista, temas a tratar..."
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
              <span className="material-symbols-outlined text-sm">save</span>
              Agendar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
