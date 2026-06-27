import AlertPill from "../ui/AlertPill.tsx";
import type { EstudianteDashboardAdminResponse } from "../../types/admin_dep.ts";

interface MisEstudiantesViewProps {
  onSearchChange: (value: string) => void;
  filterYear: string;
  onFilterYearChange: (value: string) => void;
  filterCareer: string;
  onFilterCareerChange: (value: string) => void;
  filterRisk: "TODOS" | "CRÍTICO" | "MEDIO" | "BAJO";
  onFilterRiskChange: (value: "TODOS" | "CRÍTICO" | "MEDIO" | "BAJO") => void;
  filteredStudents: EstudianteDashboardAdminResponse[] | undefined;
  apiStudents: EstudianteDashboardAdminResponse[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onSelectStudent: (dni: string) => void;
}

export default function MisEstudiantesView({
  onSearchChange,
  filterYear,
  onFilterYearChange,
  filterCareer,
  onFilterCareerChange,
  filterRisk,
  onFilterRiskChange,
  filteredStudents,
  apiStudents,
  isLoading,
  isError,
  onSelectStudent,
}: MisEstudiantesViewProps) {
  const getAlertPillByRisk = (estadoAlerta: string | null) => {
    const status = (estadoAlerta ?? "SIN ALERTA") as
      | "NUEVA"
      | "EN REVISIÓN"
      | "INTERVENIDA"
      | "SIN ALERTA";
    return <AlertPill status={status} />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-brand-primary tracking-tight">
            Listado de Seguimiento
          </h3>
          <p className="text-xs text-[#43474f] mt-1">
            Administración y filtros de alumnos bajo monitoreo del
            Sistema Travesía.
          </p>
        </div>
      </div>

      <div className="bg-white border border-brand-outline-variant rounded p-4 flex flex-col md:flex-row gap-4 items-center justify-between text-xs font-semibold shadow-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <span className="text-[10px] font-extrabold text-[#43474f] uppercase block mb-1">
              Año Académico
            </span>
            <select
              value={filterYear}
              onChange={(e) => onFilterYearChange(e.target.value)}
              className="border border-brand-outline-variant rounded bg-white p-1.5 pr-6 cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs"
            >
              <option value="Todos">Todos</option>
              <option value="1">1er Año</option>
              <option value="2">2do Año</option>
              <option value="3">3er Año</option>
            </select>
          </div>

          <div>
            <span className="text-[10px] font-extrabold text-[#43474f] uppercase block mb-1">
              Carrera
            </span>
            <select
              value={filterCareer}
              onChange={(e) => onFilterCareerChange(e.target.value)}
              className="border border-brand-outline-variant rounded bg-white p-1.5 pr-6 cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs"
            >
              <option value="Todas">Todas</option>
              <option value="Industrial">Ing. Industrial</option>
              <option value="Informática">Ing. Informática</option>
            </select>
          </div>

          <div>
            <span className="text-[10px] font-extrabold text-[#43474f] uppercase block mb-1">
              Riesgo
            </span>
            <div className="flex border border-brand-outline-variant rounded overflow-hidden">
              {(["TODOS", "CRÍTICO", "MEDIO", "BAJO"] as const).map((risk) => (
                <button
                  key={risk}
                  onClick={() => onFilterRiskChange(risk)}
                  className={`px-3 py-1.5 cursor-pointer font-bold border-l border-brand-outline-variant first:border-l-0 ${
                    filterRisk === risk
                      ? risk === "CRÍTICO"
                        ? "bg-[#ffdad6] text-[#ba1a1a]"
                        : risk === "MEDIO"
                          ? "bg-amber-100 text-amber-800"
                          : risk === "BAJO"
                            ? "bg-[#e2f3f5] text-[#006e6e]"
                            : "bg-brand-primary text-white"
                      : "bg-white text-brand-primary"
                  }`}
                >
                  {risk === "TODOS" ? "TODOS" : risk}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-right self-stretch md:self-auto">
          <button
            onClick={() => {
              onFilterYearChange("Todos");
              onFilterCareerChange("Todas");
              onFilterRiskChange("TODOS");
              onSearchChange("");
            }}
            className="text-brand-error uppercase tracking-wider text-[10px] font-bold hover:underline"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      <div className="xl:col-span-3 bg-white border border-brand-outline-variant rounded shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          {isError ? (
            <div className="p-8 text-center">
              <p className="text-brand-error font-bold text-sm">
                Error al cargar los estudiantes.
              </p>
              <p className="text-brand-outline text-xs mt-1">
                Intente nuevamente más tarde.
              </p>
            </div>
          ) : isLoading ? (
            <table className="w-full text-center border-collapse text-xs">
              <thead>
                <tr className="bg-[#edeeef] text-[#43474f] font-bold uppercase tracking-wider">
                  <th className="p-3 pl-5 border-b border-brand-outline-variant">
                    ESTUDIANTE / DNI
                  </th>
                  <th className="p-3 border-b border-brand-outline-variant text-center">
                    ÍNDICE RISK
                  </th>
                  <th className="p-3 border-b border-brand-outline-variant text-center">
                    ESTADO ALERTA
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-outline-variant">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    <td className="p-3 pl-5">
                      <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-1" />
                      <div className="h-3 w-52 bg-gray-200 rounded animate-pulse" />
                    </td>
                    <td className="p-3 text-center">
                      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse mx-auto" />
                    </td>
                    <td className="p-3 text-center">
                      <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-center border-collapse text-xs">
              <thead>
                <tr className="bg-[#edeeef] text-[#43474f] font-bold uppercase tracking-wider">
                  <th className="p-3 pl-5 border-b border-brand-outline-variant">
                    ESTUDIANTE / DNI
                  </th>
                  <th className="p-3 border-b border-brand-outline-variant text-center">
                    ÍNDICE RISK
                  </th>
                  <th className="p-3 border-b border-brand-outline-variant text-center">
                    ESTADO ALERTA
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-outline-variant">
                {filteredStudents?.map((s) => (
                  <tr key={s.dni} className="hover:bg-[#f8f9fa] transition-all">
                    <td className="p-3 pl-5">
                      <div
                        className="font-bold text-brand-primary hover:underline cursor-pointer"
                        onClick={() => onSelectStudent(s.dni)}
                      >
                        {s.apellido}, {s.nombre}
                      </div>
                      <div className="text-[10px] text-brand-outline font-semibold">
                        DNI: {s.dni} | {s.carrera}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      {s.indice_riesgo !== null ? (
                        <span
                          className={`font-black text-xs ${
                            s.indice_riesgo >= 7.5
                              ? "text-[#ba1a1a]"
                              : s.indice_riesgo >= 4.0
                                ? "text-amber-600"
                                : "text-[#006e6e]"
                          }`}
                        >
                          {s.indice_riesgo.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-brand-outline font-medium">—</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {getAlertPillByRisk(s.estado_alerta)}
                    </td>
                  </tr>
                ))}
                {filteredStudents?.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-brand-outline font-medium">
                      No se encontraron estudiantes que coincidan con los filtros de búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 bg-[#f8f9fa] border-t border-brand-outline-variant flex justify-between items-center text-xs text-[#43474f]">
          <span className="font-semibold">
            {isLoading
              ? "Cargando estudiantes..."
              : isError
                ? "—"
                : `Mostrando ${filteredStudents?.length ?? 0} de ${apiStudents?.length ?? 0} estudiantes asignados`
            }
          </span>
          <div className="flex gap-1">
            <button className="px-2.5 py-1 border border-brand-outline-variant rounded bg-white font-bold opacity-50 cursor-not-allowed">
              Anterior
            </button>
            <button className="px-3 py-1 bg-brand-primary text-white rounded font-bold">
              1
            </button>
            <button className="px-3 py-1 border border-brand-outline-variant rounded bg-white hover:bg-[#edeeef] font-bold">
              2
            </button>
            <button className="px-2.5 py-1 border border-brand-outline-variant rounded bg-white hover:bg-[#edeeef] font-bold">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
