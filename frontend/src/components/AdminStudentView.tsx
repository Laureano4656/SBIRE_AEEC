import type { Student, SubjectProgress } from "../types.ts";
import { SUBJECTS_SOFIA, SUBJECTS_MATEO } from "../data.ts";

interface AdminStudentViewProps {
  student: Student;
  onBack: () => void;
}

const getAlertPill = (status: Student["statusAlerta"]) => {
  switch (status) {
    case "NUEVA":
      return (
        <span className="bg-[#ffdad6] text-[#93000a] px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[#ba1a1a] rounded-full animate-pulse" />
          NUEVA
        </span>
      );
    case "EN REVISIÓN":
      return (
        <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
          EN REVISIÓN
        </span>
      );
    case "INTERVENIDA":
      return (
        <span className="bg-[#e2f3f5] text-[#006e6e] px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[#006a6a] rounded-full" />
          INTERVENIDA
        </span>
      );
    default:
      return (
        <span className="bg-[#f3f4f5] text-[#43474f] px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-0.5">
          SIN ALERTA
        </span>
      );
  }
};

const riskBadge = (level: string) => {
  switch (level) {
    case "CRÍTICO":
      return (
        <span className="bg-[#ffdad6] text-[#93000a] px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[#ba1a1a] rounded-full animate-pulse" />
          CRÍTICO
        </span>
      );
    case "MEDIO":
      return (
        <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
          MEDIO
        </span>
      );
    case "BAJO":
      return (
        <span className="bg-[#e2f3f5] text-[#006e6e] px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[#006a6a] rounded-full" />
          BAJO
        </span>
      );
    default:
      return (
        <span className="bg-[#f3f4f5] text-[#43474f] px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-0.5">
          SEGURO
        </span>
      );
  }
};

const statusSubjectBadge = (status: SubjectProgress["status"]) => {
  switch (status) {
    case "EN RIESGO":
      return (
        <span className="bg-[#ffdad6] text-[#93000a] text-[10px] font-bold px-2 py-0.5 rounded">
          EN RIESGO
        </span>
      );
    case "APROBADA":
      return (
        <span className="bg-[#e2f3f5] text-[#006e6e] text-[10px] font-bold px-2 py-0.5 rounded">
          APROBADA
        </span>
      );
    case "PROMOCIONADA":
      return (
        <span className="bg-[#d1f0f0] text-[#006a6a] text-[10px] font-bold px-2 py-0.5 rounded">
          PROMOCIONADA
        </span>
      );
    default:
      return (
        <span className="bg-[#f3f4f5] text-[#43474f] text-[10px] font-bold px-2 py-0.5 rounded">
          {status}
        </span>
      );
  }
};

export default function AdminStudentView({
  student,
  onBack,
}: AdminStudentViewProps) {
  const subjects: SubjectProgress[] =
    student.id === "sofia_martinez"
      ? SUBJECTS_SOFIA
      : student.id === "mateo_garcia"
        ? SUBJECTS_MATEO
        : [];

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline mb-4 cursor-pointer"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Volver al listado de estudiantes
      </button>

      <div className="bg-white border border-brand-outline-variant rounded p-6 shadow-xs flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <img
              alt={`${student.firstNames} ${student.lastNames}`}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full border border-brand-outline-variant object-cover shadow-sm"
              src={student.avatarUrl}
            />
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                student.riskLevel === "CRÍTICO"
                  ? "bg-[#ba1a1a]"
                  : student.riskLevel === "MEDIO"
                    ? "bg-amber-500"
                    : "bg-[#006a6a]"
              }`}
            />
          </div>
          <div>
            <h3 className="text-xl font-black text-brand-primary">
              {student.lastNames}, {student.firstNames}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
              <span className="text-[11px] text-[#43474f] font-semibold">
                DNI: {student.dni}
              </span>
              <span className="text-[11px] text-[#43474f] font-semibold">
                Legajo: {student.legajo}
              </span>
              <span className="bg-[#edeeef] text-[#43474f] px-2 py-0.5 rounded text-[10px] font-bold">
                TRAMO {student.tramo}
              </span>
            </div>
            <p className="text-xs text-brand-outline font-semibold mt-1.5">
              {student.career} — {student.year}° Año
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-start md:items-end shrink-0">
          <div className="flex flex-wrap gap-2">
            {riskBadge(student.riskLevel)}
            {getAlertPill(student.statusAlerta)}
          </div>
          <span className="text-xs font-medium text-[#43474f]">
            Último recálculo: {student.lastRecalculation}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white border border-brand-outline-variant rounded p-4 shadow-xs">
          <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
            PROMEDIO GENERAL
          </span>
          <span className="text-2xl font-black text-brand-primary mt-1 block">
            {student.gpa.toFixed(2)}
          </span>
          <p className="text-[10px] text-brand-outline mt-0.5 font-medium">
            Rendimiento acumulado
          </p>
        </div>
        <div className="bg-white border border-brand-outline-variant rounded p-4 shadow-xs">
          <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
            MATERIAS APROBADAS
          </span>
          <span className="text-2xl font-black text-brand-primary mt-1 block">
            {student.subjectsApproved}/{student.subjectsTotal}
          </span>
          <div className="w-full bg-[#edeeef] rounded-full h-1.5 mt-1">
            <div
              className="bg-brand-primary h-1.5 rounded-full transition-all"
              style={{
                width: `${(student.subjectsApproved / student.subjectsTotal) * 100}%`,
              }}
            />
          </div>
        </div>
        <div className="bg-white border border-brand-outline-variant rounded p-4 shadow-xs">
          <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
            ENGAGEMENT CAMPUS
          </span>
          <span
            className={`text-2xl font-black mt-1 block ${
              student.engagement === "Bajo"
                ? "text-brand-error"
                : student.engagement === "Medio"
                  ? "text-amber-600"
                  : "text-[#006a6a]"
            }`}
          >
            {student.engagement}
          </span>
          {student.engagement === "Bajo" && (
            <span className="bg-[#ffdad6] text-[#93000a] text-[10px] font-bold px-1.5 py-0.5 rounded inline-block mt-1">
              Alerta de Inactividad
            </span>
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="bg-white border border-brand-outline-variant rounded shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#edeeef] text-[#43474f] font-bold uppercase tracking-wider">
                  <th className="p-3 pl-5 border-b border-brand-outline-variant">
                    Asignatura
                  </th>
                  <th className="p-3 border-b border-brand-outline-variant text-center">
                    Parciales
                  </th>
                  <th className="p-3 border-b border-brand-outline-variant text-center">
                    Final
                  </th>
                  <th className="p-3 border-b border-brand-outline-variant text-center">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-outline-variant">
                {subjects.map((subj) => (
                  <tr
                    key={subj.code}
                    className="hover:bg-[#f8f9fa] transition-colors"
                  >
                    <td className="p-3 pl-5">
                      <span className="font-bold text-brand-primary">
                        {subj.name}
                      </span>
                      <span className="text-[10px] text-brand-outline block font-medium">
                        {subj.teacher}
                      </span>
                    </td>
                    <td className="p-3 text-center font-medium">
                      {subj.midtermGrades}
                    </td>
                    <td className="p-3 text-center font-bold">
                      {subj.finalGrade}
                    </td>
                    <td className="p-3 text-center">
                      {statusSubjectBadge(subj.status)}
                    </td>
                  </tr>
                ))}
                {subjects.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-8 text-center text-brand-outline font-medium"
                    >
                      No hay datos de trayectoria académica disponibles para
                      este estudiante.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
