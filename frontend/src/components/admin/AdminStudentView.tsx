import { useState } from "react";
import type { Student, SubjectProgress } from "../../types/types.ts";
import { getRiskLevel } from "../../utils/studentMapping.ts";
import { useRiskConfig } from "../../hooks/useRiskConfig.ts";
import { SUBJECTS_SOFIA, SUBJECTS_MATEO } from "../../data.ts";

interface AdminStudentViewProps {
  student: Student;
  onBack: () => void;
}

const getAlertPill = (status: string | null) => {
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
  const { umbralRojo, umbralAmarillo } = useRiskConfig();
  const [activeTab, setActiveTab] = useState<"trayectoria" | "timeline">(
    "trayectoria",
  );
  const riskLevel = getRiskLevel(student.indice_riesgo, umbralRojo, umbralAmarillo);

  const subjects: SubjectProgress[] =
    student.dni === "42.190.455"
      ? SUBJECTS_SOFIA
      : student.dni === "43.100.229"
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
          <div
            className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-white text-lg font-bold shrink-0 ${
              riskLevel === "CRÍTICO"
                ? "bg-[#ba1a1a] border-[#ba1a1a]"
                : riskLevel === "MEDIO"
                  ? "bg-amber-500 border-amber-500"
                  : "bg-[#006a6a] border-[#006a6a]"
            }`}
          >
            {student.nombre.charAt(0)}{student.apellido.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-black text-brand-primary">
              {student.apellido}, {student.nombre}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
              <span className="text-[11px] text-[#43474f] font-semibold">
                DNI: {student.dni}
              </span>
              <span className="bg-[#edeeef] text-[#43474f] px-2 py-0.5 rounded text-[10px] font-bold">
                {student.etapa}
              </span>
            </div>
            <p className="text-xs text-brand-outline font-semibold mt-1.5">
              {student.carrera}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-start md:items-end shrink-0">
          <div className="flex flex-wrap gap-2">
            {riskBadge(riskLevel)}
            {getAlertPill(student.estado_alerta)}
          </div>
          <span className="text-xs font-medium text-[#43474f]">
            Último recálculo: {student.ultima_fecha_recalculo ?? "-"}
          </span>
          <span className="text-xs font-medium text-[#43474f]">
            % Carrera: {student.porcentaje_carrera?.toFixed(1) ?? "-"}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white border border-brand-outline-variant rounded p-4 shadow-xs">
          <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
            ÍNDICE DE RIESGO
          </span>
          <span className="text-2xl font-black text-brand-primary mt-1 block">
            {student.indice_riesgo?.toFixed(2) ?? "-"}
          </span>
          <p className="text-[10px] text-brand-outline mt-0.5 font-medium">
            Score de riesgo calculado
          </p>
        </div>
        <div className="bg-white border border-brand-outline-variant rounded p-4 shadow-xs">
          <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
            % CARRERA
          </span>
          <span className="text-2xl font-black text-brand-primary mt-1 block">
            {student.porcentaje_carrera?.toFixed(1) ?? "-"}%
          </span>
          <p className="text-[10px] text-brand-outline mt-0.5 font-medium">
            Porcentaje de carrera aprobado
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 bg-[#f3f4f5] border border-brand-outline-variant rounded p-1 flex gap-1 w-fit">
        <button
          onClick={() => setActiveTab("trayectoria")}
          className={`px-4 py-2 text-xs font-bold rounded transition-all cursor-pointer ${
            activeTab === "trayectoria"
              ? "bg-white text-brand-primary shadow-xs border-b-2 border-brand-primary"
              : "text-[#43474f] hover:text-brand-primary"
          }`}
        >
          Trayectoria Académica
        </button>
        <button
          onClick={() => setActiveTab("timeline")}
          className={`px-4 py-2 text-xs font-bold rounded transition-all cursor-pointer ${
            activeTab === "timeline"
              ? "bg-white text-brand-primary shadow-xs border-b-2 border-brand-primary"
              : "text-[#43474f] hover:text-brand-primary"
          }`}
        >
          Línea de Tiempo
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "trayectoria" ? (
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
        ) : (
          <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
            <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1.5 mb-4">
              <span className="material-symbols-outlined text-lg">
                timeline
              </span>
              Línea de Tiempo
            </h4>
            <div className="text-center py-8 text-brand-outline font-medium text-xs">
              No hay eventos registrados para este estudiante.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
