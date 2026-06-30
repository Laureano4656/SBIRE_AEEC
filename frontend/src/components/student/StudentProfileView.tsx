import type { Student } from "../../types/types.ts";
import { getRiskLevel } from "../../utils/studentMapping.ts";
import { useRiskConfig } from "../../hooks/useRiskConfig.ts";

interface StudentProfileViewProps {
  student: Student;
  onBack: () => void;
  onUpdateStudent: (updated: Student) => void;
}

export default function StudentProfileView({
  student,
  onBack,
}: StudentProfileViewProps) {
  const { umbralRojo, umbralAmarillo } = useRiskConfig();
  const riskLevel = getRiskLevel(student.indice_riesgo, umbralRojo, umbralAmarillo);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-brand-primary hover:text-[#002f5e] font-semibold transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Volver al Listado de Estudiantes
        </button>
      </div>

      <div className="bg-white border border-brand-outline-variant rounded p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-primary">
              {student.apellido}, {student.nombre}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#43474f] mt-1">
              <span className="flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-base">
                  badge
                </span>
                DNI: {student.dni}
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-base">
                  school
                </span>
                {student.carrera}
              </span>
              <span className="flex items-center gap-1 font-medium text-brand-secondary font-bold">
                <span className="material-symbols-outlined text-base">
                  calendar_today
                </span>
                {student.etapa}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-brand-error/30 rounded px-6 py-3 flex flex-col items-center justify-center min-w-[150px] self-stretch md:self-auto text-center">
          <span className="text-xs font-bold text-brand-error tracking-wider uppercase">
            Nivel de Riesgo
          </span>
          <span className="text-sm font-semibold text-brand-outline-variant">
            {riskLevel}
          </span>
          <span className="text-2xl font-black text-brand-error tracking-tight mt-1">
            {student.indice_riesgo?.toFixed(1) ?? "-"}/10
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-brand-outline-variant rounded p-4 text-center shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider">
              % CARRERA
            </span>
            <p className="text-2xl font-black text-brand-primary mt-1">
              {student.porcentaje_carrera?.toFixed(1) ?? "-"}%
            </p>
          </div>
          {student.porcentaje_carrera !== null && (
            <div className="w-full bg-[#edeeef] h-2 rounded mt-2 overflow-hidden">
              <div
                className="bg-brand-primary h-full rounded"
                style={{
                  width: `${Math.min(student.porcentaje_carrera, 100)}%`,
                }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
