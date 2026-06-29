import { useState, useMemo } from "react";
import type { IntervencionTutorResponse } from "../../types/admin_dep.ts";
import HistorialIntervencionesModal from "./HistorialIntervencionesModal.tsx";

interface IntervencionesViewProps {
  intervenciones: IntervencionTutorResponse[];
  isLoading?: boolean;
  isError?: boolean;
  onAgendarEntrevista?: (intervencion: IntervencionTutorResponse) => void;
  onIntervenir?: (alerta_id: number, estudiante_id: number) => void;
  onSelectStudent?: (dni: string, estudiante_id: number) => void;
}

function initials(nombre: string, apellido: string) {
  return `${(nombre ?? "")[0] ?? ""}${(apellido ?? "")[0] ?? ""}`.toUpperCase();
}

export default function IntervencionesView({
  intervenciones,
  isLoading,
  isError,
  onAgendarEntrevista,
  onIntervenir,
  onSelectStudent,
}: IntervencionesViewProps) {
  const [busqueda, setBusqueda] = useState("");
  const [modalEstudiante, setModalEstudiante] = useState<{ id: number; nombre: string; apellido: string } | null>(null);

  const estudiantes = useMemo(() => {
    const map = new Map<
      number,
      { id: number; nombre: string; apellido: string; dni: string; total: number; ultima: IntervencionTutorResponse | null }
    >();
    for (const iv of intervenciones) {
      const existente = map.get(iv.estudiante_id);
      if (existente) {
        existente.total += 1;
        if (!existente.ultima || new Date(iv.fecha) > new Date(existente.ultima.fecha)) {
          existente.ultima = iv;
        }
      } else {
        map.set(iv.estudiante_id, {
          id: iv.estudiante_id,
          nombre: iv.estudiante_nombre ?? "",
          apellido: iv.estudiante_apellido ?? "",
          dni: iv.estudiante_dni ?? "",
          total: 1,
          ultima: iv,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      `${a.apellido} ${a.nombre}`.localeCompare(`${b.apellido} ${b.nombre}`)
    );
  }, [intervenciones]);

  const filtrados = useMemo(() => {
    if (!busqueda) return estudiantes;
    const q = busqueda.toLowerCase();
    return estudiantes.filter(
      (e) => e.apellido.toLowerCase().includes(q) || e.nombre.toLowerCase().includes(q)
    );
  }, [estudiantes, busqueda]);

  const resultadoIcon: Record<string, { icon: string; color: string }> = {
    positivo: { icon: "check_circle", color: "text-[#006e6e]" },
    neutro: { icon: "remove_circle_outline", color: "text-amber-600" },
    negativo: { icon: "cancel", color: "text-[#ba1a1a]" },
    sin_contacto: { icon: "person_off", color: "text-[#43474f]" },
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
            ESTUDIANTES CON INTERVENCIONES
          </span>
          <span className="text-3xl font-black text-brand-primary mt-1 block">
            {estudiantes.length}
          </span>
          <p className="text-[10px] text-brand-outline mt-1 font-medium">
            {intervenciones.length} intervenciones registradas
          </p>
        </div>
        <div className="relative w-56">
          <span className="material-symbols-outlined text-sm text-brand-outline absolute left-2.5 top-1/2 -translate-y-1/2">
            search
          </span>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar estudiante..."
            className="w-full border border-brand-outline-variant rounded pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-outline hover:text-brand-error transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
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
            Error al cargar las intervenciones.
          </p>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="space-y-3">
          {filtrados.length === 0 ? (
            <div className="bg-white border border-brand-outline-variant rounded shadow-xs p-12 text-center text-brand-outline font-medium text-xs">
              {busqueda ? "No se encontraron estudiantes." : "No hay intervenciones registradas."}
            </div>
          ) : (
            filtrados.map((e) => {
              const avatar = initials(e.nombre, e.apellido) || "?";
              const ultimoRes = e.ultima?.resultado ? resultadoIcon[e.ultima.resultado] : null;

              return (
                <div
                  key={e.id}
                  className="bg-white border border-brand-outline-variant rounded shadow-xs hover:shadow-md transition-all"
                >
                  <div
                    onClick={() => onSelectStudent?.(e.dni, e.id)}
                    className="p-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#eef2ff] text-brand-primary flex items-center justify-center text-sm font-bold shrink-0">
                        {avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-brand-primary">
                          {e.apellido}, {e.nombre}
                        </p>
                        <p className="text-[11px] text-brand-outline font-semibold mt-0.5">
                          {e.total} intervención{e.total !== 1 ? "es" : ""}
                          {e.ultima && ` · Última: ${new Date(e.ultima.fecha).toLocaleDateString("es-AR")}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setModalEstudiante({ id: e.id, nombre: e.nombre, apellido: e.apellido });
                          }}
                          title="Ver historial de intervenciones"
                          className="text-brand-outline hover:text-brand-primary transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-lg">history</span>
                        </button>
                        {ultimoRes && (
                          <span className={`text-[10px] flex items-center gap-0.5 font-bold ${ultimoRes.color}`}>
                            <span className="material-symbols-outlined text-sm">{ultimoRes.icon}</span>
                          </span>
                        )}
                        <span className="material-symbols-outlined text-brand-outline text-lg">
                          chevron_right
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 pb-4 flex gap-2 justify-end border-t border-brand-outline-variant pt-3">
                    {onIntervenir && e.ultima && (
                      <button
                        onClick={(ev) => { ev.stopPropagation(); onIntervenir(e.ultima!.alerta_id, e.id); }}
                        className="text-[10px] font-bold text-brand-primary border border-brand-primary/30 bg-[#eef2ff] hover:bg-[#dde3fb] px-2.5 py-1.5 rounded transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xs">handyman</span>
                        Intervenir
                      </button>
                    )}
                    {onAgendarEntrevista && e.ultima && (
                      <button
                        onClick={(ev) => { ev.stopPropagation(); onAgendarEntrevista(e.ultima!); }}
                        className="text-[10px] font-bold text-[#006a6a] border border-[#006a6a]/30 bg-[#e2f3f5] hover:bg-[#c8eeee] px-2.5 py-1.5 rounded transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xs">event_note</span>
                        Agendar Entrevista
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {modalEstudiante && (
        <HistorialIntervencionesModal
          estudiante={modalEstudiante}
          intervenciones={intervenciones.filter((iv) => iv.estudiante_id === modalEstudiante.id)}
          onClose={() => setModalEstudiante(null)}
        />
      )}
    </div>
  );
}
