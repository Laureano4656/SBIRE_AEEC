import type { IntervencionTutorResponse } from "../../types/admin_dep.ts";

interface HistorialIntervencionesModalProps {
  estudiante: { id: number; nombre: string; apellido: string };
  intervenciones: IntervencionTutorResponse[];
  onClose: () => void;
}

const tipoConfig: Record<string, { label: string; icon: string }> = {
  tutoria_academica: { label: "Tutoría Académica", icon: "school" },
  entrevista: { label: "Entrevista", icon: "forum" },
  derivacion: { label: "Derivación", icon: "arrow_forward" },
  seguimiento_virtual: { label: "Seguimiento Virtual", icon: "videocam" },
  contacto_familiar: { label: "Contacto Familiar", icon: "family_history" },
  asesoria_par: { label: "Asesoría Par", icon: "group" },
  otro: { label: "Otro", icon: "more_horiz" },
};

const resultadoConfig: Record<string, { label: string; icon: string; bg: string; text: string }> = {
  positivo: { label: "Positivo", icon: "check_circle", bg: "bg-[#e2f3f5]", text: "text-[#006e6e]" },
  neutro: { label: "Neutro", icon: "remove_circle_outline", bg: "bg-amber-100", text: "text-amber-800" },
  negativo: { label: "Negativo", icon: "cancel", bg: "bg-[#ffdad6]", text: "text-[#93000a]" },
  sin_contacto: { label: "Sin Contacto", icon: "person_off", bg: "bg-[#f3f4f5]", text: "text-[#43474f]" },
};

export default function HistorialIntervencionesModal({
  estudiante,
  intervenciones,
  onClose,
}: HistorialIntervencionesModalProps) {
  const total = intervenciones.length;
  const ultima = intervenciones[0];
  const avatar = `${(estudiante.nombre ?? "")[0] ?? ""}${(estudiante.apellido ?? "")[0] ?? ""}`.toUpperCase() || "?";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191c1d]/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-brand-outline-variant rounded shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-outline-variant shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#eef2ff] text-brand-primary flex items-center justify-center text-sm font-bold">
              {avatar}
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-primary">
                {estudiante.apellido}, {estudiante.nombre}
              </h3>
              <p className="text-[11px] text-brand-outline font-semibold">
                {total} intervención{total !== 1 ? "es" : ""}
                {ultima && ` · Última: ${new Date(ultima.fecha).toLocaleDateString("es-AR")}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-brand-outline hover:text-brand-error transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-3">
          {intervenciones.length === 0 ? (
            <div className="text-center text-brand-outline font-medium text-xs py-8">
              No hay intervenciones registradas para este estudiante.
            </div>
          ) : (
            intervenciones.map((iv) => {
              const tipo = tipoConfig[iv.tipo] ?? tipoConfig.otro;
              const res = iv.resultado ? resultadoConfig[iv.resultado] : null;

              return (
                <div
                  key={iv.id}
                  className="border border-brand-outline-variant rounded shadow-xs"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#f3f4f5] text-[#43474f] flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">{tipo.icon}</span>
                          {tipo.label}
                        </span>
                        {res && (
                          <span className={`text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 ${res.bg} ${res.text}`}>
                            <span className="material-symbols-outlined text-xs">{res.icon}</span>
                            {res.label}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-brand-outline font-semibold shrink-0">
                        {new Date(iv.fecha).toLocaleDateString("es-AR", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </span>
                    </div>

                    {iv.descripcion && (
                      <div className="mt-2 bg-[#f8f9fa] rounded p-2.5 border border-brand-outline-variant">
                        <p className="text-[11px] text-[#43474f] leading-relaxed">{iv.descripcion}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
