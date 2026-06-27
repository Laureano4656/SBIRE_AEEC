import type { FormEvent } from "react";
import type { Student } from "../../types/types";
import type { Entrevista, Intervencion } from "./types";
import { estadoBadge } from "./helpers";

interface EntrevistaFormState {
  studentId: string;
  fecha: string;
  tipo: "Presencial" | "Virtual";
  notas: string;
}

interface IntervencionFormState {
  entrevistaId: string;
  tipo: Intervencion["tipo"];
  descripcion: string;
  resultado: Intervencion["resultado"];
}

interface EntrevistasViewProps {
  entrevistas: Entrevista[];
  intervenciones: Intervencion[];
  students: Student[];
  showModal: boolean;
  showIntervencionModal: boolean;
  entrevistaForm: EntrevistaFormState;
  intervencionForm: IntervencionFormState;
  onEntrevistaFormChange: (form: EntrevistaFormState) => void;
  onIntervencionFormChange: (form: IntervencionFormState) => void;
  onCrearEntrevista: (e: FormEvent) => void;
  onCrearIntervencion: (e: FormEvent) => void;
  onCerrarEntrevistaModal: () => void;
  onCerrarIntervencionModal: () => void;
  onAbrirIntervencionModal: (entrevistaId: string) => void;
  onMarcarRealizada: (id: string) => void;
  onMarcarCancelada: (id: string) => void;
}

export default function EntrevistasView({
  entrevistas,
  intervenciones,
  students,
  showModal,
  showIntervencionModal,
  entrevistaForm,
  intervencionForm,
  onEntrevistaFormChange,
  onIntervencionFormChange,
  onCrearEntrevista,
  onCrearIntervencion,
  onCerrarEntrevistaModal,
  onCerrarIntervencionModal,
  onAbrirIntervencionModal,
  onMarcarRealizada,
  onMarcarCancelada,
}: EntrevistasViewProps) {
  const pendientes = entrevistas.filter((e) => e.estado === "Pendiente").length;
  const realizadas = entrevistas.filter((e) => e.estado === "Realizada").length;

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
                    {e.studentName}
                  </span>
                  {estadoBadge(e.estado)}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${e.tipo === "Virtual" ? "bg-[#eef2ff] text-brand-primary" : "bg-[#f3f4f5] text-[#43474f]"}`}
                  >
                    {e.tipo}
                  </span>
                </div>
                <p className="text-[11px] text-brand-outline font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    calendar_today
                  </span>
                  {e.fecha}
                </p>
                {e.notas && (
                  <p className="text-xs text-[#43474f] leading-relaxed max-w-lg italic">
                    &quot;{e.notas}&quot;
                  </p>
                )}
                {(() => {
                  const interv = intervenciones.find(
                    (i) => i.entrevistaId === e.id,
                  );
                  if (!interv) return null;
                  return (
                    <div className="mt-2 p-2.5 bg-[#eef2ff] border border-brand-primary/20 rounded">
                      <p className="text-[10px] font-bold text-brand-primary uppercase tracking-wider mb-1">
                        Intervención registrada
                      </p>
                      <p className="text-[10px] text-[#43474f] font-semibold">
                        Tipo:{" "}
                        {interv.tipo === "tutoria_academica"
                          ? "Tutoría Académica"
                          : interv.tipo === "derivacion"
                            ? "Derivación"
                            : interv.tipo === "seguimiento_virtual"
                              ? "Seguimiento Virtual"
                              : interv.tipo === "asesoria_par"
                                ? "Asesoría Par"
                                : "Otro"}
                      </p>
                      {interv.descripcion && (
                        <p className="text-[10px] text-[#43474f] mt-0.5">
                          &quot;{interv.descripcion}&quot;
                        </p>
                      )}
                      <p className="text-[10px] text-[#43474f] font-semibold mt-0.5">
                        Resultado:{" "}
                        {interv.resultado === "positivo"
                          ? "Positivo"
                          : interv.resultado === "neutro"
                            ? "Neutro"
                            : interv.resultado === "negativo"
                              ? "Negativo"
                              : "Sin Contacto"}
                      </p>
                    </div>
                  );
                })()}
              </div>
              {e.estado === "Pendiente" && (
                <div className="flex gap-2 self-start">
                  <button
                    onClick={() => onMarcarRealizada(e.id)}
                    className="text-[10px] font-bold text-[#006a6a] border border-[#006a6a]/30 bg-[#e2f3f5] hover:bg-[#c8eeee] px-3 py-1.5 rounded transition-all whitespace-nowrap"
                  >
                    Marcar como realizada
                  </button>
                  <button
                    onClick={() => onMarcarCancelada(e.id)}
                    className="text-[10px] font-bold text-[#43474f] border border-brand-outline-variant bg-[#f3f4f5] hover:bg-[#edeeef] px-3 py-1.5 rounded transition-all whitespace-nowrap"
                  >
                    Cancelar
                  </button>
                </div>
              )}
              {e.estado === "Realizada" &&
                !intervenciones.find((i) => i.entrevistaId === e.id) && (
                  <div className="flex gap-2 self-start">
                    <button
                      onClick={() => onAbrirIntervencionModal(e.id)}
                      className="text-[10px] font-bold text-brand-primary border border-brand-primary/30 bg-[#eef2ff] hover:bg-[#dde3fb] px-3 py-1.5 rounded transition-all whitespace-nowrap"
                    >
                      Vincular a intervención
                    </button>
                  </div>
                )}
            </div>
          ))}

          {entrevistas.length === 0 && (
            <div className="p-12 text-center text-brand-outline font-medium text-xs">
              No hay entrevistas registradas. Agendá la primera con el botón de
              arriba.
            </div>
          )}
        </div>
      </div>

      {/* Modal nueva entrevista */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191c1d]/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="bg-white border border-brand-outline-variant rounded shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-brand-outline-variant pb-3">
              <h2 className="text-base font-bold text-brand-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xl">
                  event_note
                </span>
                Nueva Entrevista
              </h2>
              <button
                onClick={onCerrarEntrevistaModal}
                aria-label="Cerrar"
                className="text-brand-outline hover:text-brand-error cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={onCrearEntrevista} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                  Estudiante
                </label>
                <select
                  required
                  value={entrevistaForm.studentId}
                  onChange={(e) =>
                    onEntrevistaFormChange({
                      ...entrevistaForm,
                      studentId: e.target.value,
                    })
                  }
                  className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                >
                  <option value="">Seleccioná un estudiante...</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.lastNames}, {s.firstNames} — {s.riskLevel}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    required
                    value={entrevistaForm.fecha}
                    onChange={(e) =>
                      onEntrevistaFormChange({
                        ...entrevistaForm,
                        fecha: e.target.value,
                      })
                    }
                    className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                    Modalidad
                  </label>
                  <select
                    value={entrevistaForm.tipo}
                    onChange={(e) =>
                      onEntrevistaFormChange({
                        ...entrevistaForm,
                        tipo: e.target.value as "Presencial" | "Virtual",
                      })
                    }
                    className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                  >
                    <option value="Presencial">Presencial</option>
                    <option value="Virtual">Virtual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                  Notas previas (opcional)
                </label>
                <textarea
                  rows={3}
                  value={entrevistaForm.notas}
                  onChange={(e) =>
                    onEntrevistaFormChange({
                      ...entrevistaForm,
                      notas: e.target.value,
                    })
                  }
                  placeholder="Motivo de la entrevista, puntos a tratar..."
                  className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onCerrarEntrevistaModal}
                  className="px-4 py-2 border border-brand-outline-variant text-[#43474f] rounded text-xs font-semibold hover:bg-[#edeeef] transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-primary text-white rounded text-xs font-bold hover:opacity-90 transition-all"
                >
                  Agendar Entrevista
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal registrar intervención */}
      {showIntervencionModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191c1d]/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="bg-white border border-brand-outline-variant rounded shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-brand-outline-variant pb-3">
              <h2 className="text-base font-bold text-brand-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xl">
                  assignment
                </span>
                Registrar Intervención
              </h2>
              <button
                onClick={onCerrarIntervencionModal}
                aria-label="Cerrar"
                className="text-brand-outline hover:text-brand-error cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={onCrearIntervencion} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                  Tipo de intervención
                </label>
                <select
                  required
                  value={intervencionForm.tipo}
                  onChange={(e) =>
                    onIntervencionFormChange({
                      ...intervencionForm,
                      tipo: e.target.value as Intervencion["tipo"],
                    })
                  }
                  className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                >
                  <option value="tutoria_academica">Tutoría Académica</option>
                  <option value="derivacion">Derivación</option>
                  <option value="seguimiento_virtual">
                    Seguimiento Virtual
                  </option>
                  <option value="asesoria_par">Asesoría Par</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                  Descripción
                </label>
                <textarea
                  required
                  rows={4}
                  value={intervencionForm.descripcion}
                  onChange={(e) =>
                    onIntervencionFormChange({
                      ...intervencionForm,
                      descripcion: e.target.value,
                    })
                  }
                  placeholder="Describí lo ocurrido durante la intervención..."
                  className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                  Resultado observado
                </label>
                <select
                  required
                  value={intervencionForm.resultado}
                  onChange={(e) =>
                    onIntervencionFormChange({
                      ...intervencionForm,
                      resultado: e.target.value as Intervencion["resultado"],
                    })
                  }
                  className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                >
                  <option value="positivo">Positivo</option>
                  <option value="neutro">Neutro</option>
                  <option value="negativo">Negativo</option>
                  <option value="sin_contacto">Sin Contacto</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onCerrarIntervencionModal}
                  className="px-4 py-2 border border-brand-outline-variant text-[#43474f] rounded text-xs font-semibold hover:bg-[#edeeef] transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-primary text-white rounded text-xs font-bold hover:opacity-90 transition-all"
                >
                  Registrar Intervención
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
