import { useMemo } from "react";
import type { IntervencionTutorResponse } from "../../types/admin_dep.ts";

interface IntervencionesViewProps {
  intervenciones: IntervencionTutorResponse[];
  isLoading?: boolean;
  isError?: boolean;
  onAgendarEntrevista?: (intervencion: IntervencionTutorResponse) => void;
}

const tipoLabel: Record<string, string> = {
  tutoria_academica: "Tutoría Académica",
  entrevista: "Entrevista",
  derivacion: "Derivación",
  seguimiento_virtual: "Seguimiento Virtual",
  contacto_familiar: "Contacto Familiar",
  asesoria_par: "Asesoría Par",
  otro: "Otro",
};

const resultadoBadge = (resultado: string | null) => {
  switch (resultado) {
    case "positivo":
      return <span className="bg-[#e2f3f5] text-[#006e6e] px-2 py-0.5 rounded text-[10px] font-bold">Positivo</span>;
    case "neutro":
      return <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">Neutro</span>;
    case "negativo":
      return <span className="bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded text-[10px] font-bold">Negativo</span>;
    case "sin_contacto":
      return <span className="bg-[#f3f4f5] text-[#43474f] px-2 py-0.5 rounded text-[10px] font-bold">Sin Contacto</span>;
    default:
      return null;
  }
};

export default function IntervencionesView({
  intervenciones,
  isLoading,
  isError,
  onAgendarEntrevista,
}: IntervencionesViewProps) {
  const groupedByStudent = useMemo(() => {
    const grouped: Record<string, { nombre: string; apellido: string; items: IntervencionTutorResponse[] }> = {};
    for (const iv of intervenciones) {
      const key = `${iv.estudiante_nombre}_${iv.estudiante_apellido}`;
      if (!grouped[key]) {
        grouped[key] = { nombre: iv.estudiante_nombre, apellido: iv.estudiante_apellido, items: [] };
      }
      grouped[key].items.push(iv);
    }
    return Object.values(grouped);
  }, [intervenciones]);

  const total = intervenciones.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
        <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
          TOTAL INTERVENCIONES
        </span>
        <span className="text-3xl font-black text-brand-primary mt-1 block">
          {total}
        </span>
        <p className="text-[10px] text-brand-outline mt-1 font-medium">
          registros de seguimiento
        </p>
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
      <div className="space-y-4">
        {groupedByStudent.map((group) => (
          <div key={`${group.nombre}_${group.apellido}`} className="bg-white border border-brand-outline-variant rounded shadow-xs overflow-hidden">
            <div className="px-6 py-3 border-b border-brand-outline-variant bg-[#f8f9fa] flex justify-between items-center">
              <h4 className="font-bold text-brand-primary text-sm">
                {group.apellido}, {group.nombre}
              </h4>
              <span className="text-[10px] text-brand-outline font-bold">
                {group.items.length} intervención{group.items.length !== 1 ? "es" : ""}
              </span>
            </div>
            <div className="divide-y divide-brand-outline-variant">
              {group.items.map((iv) => (
                <div key={iv.id} className="p-4 hover:bg-[#f8f9fa] transition-colors">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#eef2ff] text-brand-primary">
                      {tipoLabel[iv.tipo] ?? iv.tipo}
                    </span>
                    {resultadoBadge(iv.resultado)}
                    <span className="text-[10px] text-brand-outline font-semibold ml-auto">
                      {new Date(iv.fecha).toLocaleDateString("es-AR")}
                    </span>
                    {onAgendarEntrevista && (
                      <button
                        onClick={() => onAgendarEntrevista(iv)}
                        className="text-[10px] font-bold text-brand-primary border border-brand-primary/30 bg-[#eef2ff] hover:bg-[#dde3fb] px-2 py-1 rounded transition-all whitespace-nowrap flex items-center gap-0.5"
                      >
                        <span className="material-symbols-outlined text-xs">
                          event_note
                        </span>
                        Agendar Entrevista
                      </button>
                    )}
                  </div>
                  {iv.descripcion && (
                    <p className="text-xs text-[#43474f] leading-relaxed mt-1">
                      {iv.descripcion}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

          {groupedByStudent.length === 0 && (
            <div className="bg-white border border-brand-outline-variant rounded shadow-xs p-12 text-center text-brand-outline font-medium text-xs">
              No hay intervenciones registradas.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
