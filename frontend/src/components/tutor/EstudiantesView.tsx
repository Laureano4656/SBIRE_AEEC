import { useState, useMemo } from "react";
import type { Student } from "../../types/types";
import type { Alerta } from "./types";
import StudentProfileView from "../student/StudentProfileView";
import { riskBadge, getFilteredStudents } from "./helpers";
import { useTutorEstudiantes } from "../../hooks/queries/useTutorQueries.ts";
import { getRiskLevel } from "../../utils/studentMapping.ts";

interface EstudiantesViewProps {
  tutorId?: number;
  students: Student[];
  alertas: Alerta[];
  selectedStudentId: string | null;
  onSelectStudent: (id: string | null) => void;
  onUpdateStudent: (updated: Student) => void;
  onAbrirEntrevista: (studentId: string) => void;
  onVerAlertas: () => void;
}

export default function EstudiantesView({
  tutorId,
  students: mockStudents,
  alertas,
  selectedStudentId,
  onSelectStudent,
  onUpdateStudent,
  onAbrirEntrevista,
  onVerAlertas,
}: EstudiantesViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState<
    "TODOS" | "CRÍTICO" | "MEDIO" | "BAJO"
  >("TODOS");

  const { data: apiEstudiantes, isLoading, isError } = useTutorEstudiantes(tutorId);

  const students: Student[] = useMemo(() => {
    if (apiEstudiantes && apiEstudiantes.length > 0) {
      return apiEstudiantes.map((api) => ({
        id: api.dni,
        dni: api.dni,
        firstNames: api.nombre,
        lastNames: api.apellido,
        fullName: `${api.nombre} ${api.apellido}`,
        email: "",
        avatarUrl: "",
        career: api.carrera,
        year: 0,
        legajo: "",
        riskLevel: getRiskLevel(api.indice_riesgo),
        riskValue: api.indice_riesgo ?? 0,
        tramo: "INICIAL" as const,
        lastRecalculation:
          api.ultima_fecha_recalculo === null
            ? "-"
            : typeof api.ultima_fecha_recalculo === "string"
              ? api.ultima_fecha_recalculo
              : api.ultima_fecha_recalculo.toISOString(),
        statusAlerta: api.estado_alerta ?? "SIN ALERTA",
        gpa: 0,
        subjectsApproved: 0,
        subjectsTotal: 0,
        engagement: "Medio" as const,
        phone: "",
      }));
    }
    return mockStudents;
  }, [apiEstudiantes, mockStudents]);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);
  const filteredStudents = useMemo(
    () => getFilteredStudents(students, searchQuery, filterRisk),
    [students, searchQuery, filterRisk],
  );

  const criticos = students.filter((s) => s.riskLevel === "CRÍTICO").length;

  if (selectedStudent) {
    return (
      <StudentProfileView
        student={selectedStudent}
        onBack={() => onSelectStudent(null)}
        onUpdateStudent={onUpdateStudent}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
          <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
            ASIGNADOS
          </span>
          <span className="text-3xl font-black text-brand-primary mt-1 block">
            {students.length}
          </span>
          <p className="text-[10px] text-brand-outline mt-1 font-medium">
            estudiantes a cargo
          </p>
        </div>
        <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
          <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
            RIESGO CRÍTICO
          </span>
          <span className="text-3xl font-black text-brand-error mt-1 block">
            {criticos}
          </span>
          <p className="text-[10px] text-brand-outline mt-1 font-medium">
            requieren atención inmediata
          </p>
        </div>
        <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
          <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
            ENTREVISTAS PENDIENTES
          </span>
          <span className="text-3xl font-black text-amber-600 mt-1 block">
            0
          </span>
          <p className="text-[10px] text-brand-outline mt-1 font-medium">
            sin concretar aún
          </p>
        </div>
      </div>

      <div className="bg-white border border-brand-outline-variant rounded p-4 flex flex-wrap gap-4 items-center shadow-xs text-xs font-semibold">
        <div className="relative flex-1 min-w-48">
          <span className="material-symbols-outlined absolute left-2.5 top-2 text-brand-outline text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre, DNI o legajo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-brand-outline-variant rounded bg-[#f3f4f5] text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
          />
        </div>
        <div className="flex border border-brand-outline-variant rounded overflow-hidden">
          {(["TODOS", "CRÍTICO", "MEDIO", "BAJO"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRisk(r)}
              className={`px-3 py-1.5 font-bold cursor-pointer border-l first:border-l-0 border-brand-outline-variant transition-colors ${
                filterRisk === r
                  ? r === "CRÍTICO"
                    ? "bg-[#ffdad6] text-[#ba1a1a]"
                    : r === "MEDIO"
                      ? "bg-amber-100 text-amber-800"
                      : r === "BAJO"
                        ? "bg-[#e2f3f5] text-[#006e6e]"
                        : "bg-brand-primary text-white"
                  : "bg-white text-brand-primary"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-brand-outline-variant rounded shadow-xs overflow-hidden">
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
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#edeeef] text-[#43474f] font-bold uppercase tracking-wider">
                  <th className="p-3 pl-5 text-left border-b border-brand-outline-variant">Estudiante</th>
                  <th className="p-3 text-center border-b border-brand-outline-variant">Tramo</th>
                  <th className="p-3 text-center border-b border-brand-outline-variant">Índice Riesgo</th>
                  <th className="p-3 text-center border-b border-brand-outline-variant">Nivel</th>
                  <th className="p-3 text-center border-b border-brand-outline-variant">Alertas</th>
                  <th className="p-3 text-center border-b border-brand-outline-variant">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-outline-variant">
                {[1, 2, 3, 4].map((i) => (
                  <tr key={i}>
                    <td className="p-3 pl-5">
                      <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-1" />
                      <div className="h-3 w-52 bg-gray-200 rounded animate-pulse" />
                    </td>
                    <td className="p-3 text-center">
                      <div className="h-4 w-14 bg-gray-200 rounded animate-pulse mx-auto" />
                    </td>
                    <td className="p-3 text-center">
                      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse mx-auto" />
                    </td>
                    <td className="p-3 text-center">
                      <div className="h-5 w-16 bg-gray-200 rounded animate-pulse mx-auto" />
                    </td>
                    <td className="p-3 text-center">
                      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse mx-auto" />
                    </td>
                    <td className="p-3 text-center">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#edeeef] text-[#43474f] font-bold uppercase tracking-wider">
                  <th className="p-3 pl-5 text-left border-b border-brand-outline-variant">
                    Estudiante
                  </th>
                  <th className="p-3 text-center border-b border-brand-outline-variant">
                    Tramo
                  </th>
                  <th className="p-3 text-center border-b border-brand-outline-variant">
                    Índice Riesgo
                  </th>
                  <th className="p-3 text-center border-b border-brand-outline-variant">
                    Nivel
                  </th>
                  <th className="p-3 text-center border-b border-brand-outline-variant">
                    Alertas
                  </th>
                  <th className="p-3 text-center border-b border-brand-outline-variant">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-outline-variant">
                {filteredStudents.map((s) => {
                  const alertasDelEstudiante = alertas.filter(
                    (a) => a.studentId === s.id && a.estado !== "RESUELTA",
                  ).length;
                  return (
                    <tr
                      key={s.id}
                      className="hover:bg-[#f8f9fa] transition-colors"
                    >
                      <td className="p-3 pl-5">
                        <button
                          onClick={() => onSelectStudent(s.id)}
                          className="font-bold text-brand-primary hover:underline text-left cursor-pointer"
                        >
                          {s.lastNames}, {s.firstNames}
                        </button>
                        <div className="text-[10px] text-brand-outline font-semibold">
                          DNI: {s.dni} | {s.career}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span className="bg-[#edeeef] text-[#43474f] px-2 py-0.5 rounded text-[10px] font-bold">
                          TRAMO {s.tramo}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`font-black text-xs ${s.riskValue >= 7.5 ? "text-[#ba1a1a]" : s.riskValue >= 4 ? "text-amber-600" : "text-[#006e6e]"}`}
                        >
                          {s.riskValue.toFixed(2)}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {riskBadge(s.riskLevel)}
                      </td>
                      <td className="p-3 text-center">
                        {alertasDelEstudiante > 0 ? (
                          <button
                            onClick={onVerAlertas}
                            title="Ver alertas activas"
                            className="bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded text-[10px] font-bold hover:bg-[#ffc6c1] transition-colors cursor-pointer"
                          >
                            {alertasDelEstudiante} activa
                            {alertasDelEstudiante > 1 ? "s" : ""}
                          </button>
                        ) : (
                          <span className="text-[10px] text-brand-outline font-semibold">
                            —
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onSelectStudent(s.id)}
                            title="Ver perfil completo"
                            className="p-1 text-brand-primary hover:bg-brand-primary-container/10 rounded transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-base">
                              visibility
                            </span>
                          </button>
                          <button
                            onClick={() => onAbrirEntrevista(s.id)}
                            className="text-brand-primary hover:underline font-bold text-[10px] flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm">
                              event_note
                            </span>
                            Agendar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-brand-outline font-medium"
                    >
                      No se encontraron estudiantes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="p-3 bg-[#f8f9fa] border-t border-brand-outline-variant text-[10px] text-[#43474f] font-semibold">
          {isLoading
            ? "Cargando estudiantes..."
            : `Mostrando ${filteredStudents.length} de ${students.length} estudiantes`
          }
        </div>
      </div>
    </div>
  );
}
