/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, type FormEvent } from "react";
import type { Student, SubjectProgress } from "../types/types.ts";
import { SUBJECTS_SOFIA, SUBJECTS_MATEO } from "../data.ts";

interface StudentProfileViewProps {
  student: Student;
  onBack: () => void;
  onUpdateStudent: (updated: Student) => void;
}

export default function StudentProfileView({
  student,
  onBack,
  onUpdateStudent,
}: StudentProfileViewProps) {
  const [activeTab, setActiveTab] = useState<"trayectoria" | "encuestas">(
    "trayectoria",
  );
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [showCloseAlertModal, setShowCloseAlertModal] = useState(false);

  // Form states
  const [interviewDate, setInterviewDate] = useState("2026-06-15");
  const [interviewTime, setInterviewTime] = useState("11:00");
  const [interviewModality, setInterviewModality] = useState<
    "Presencial" | "Virtual"
  >("Presencial");
  const [interviewLoc, setInterviewLoc] = useState(
    "Aula 402 - Departamento de Ingeniería",
  );

  const [interventionTitle, setInterventionTitle] = useState(
    "Tutoría de Apoyo Metodológico",
  );
  const [interventionDesc, setInterventionDesc] = useState("");

  const [closeReason, setCloseReason] = useState(
    "Se constató avance académico y reincorporación.",
  );

  // Academic tray data for this student
  const subjects: SubjectProgress[] =
    student.id === "sofia_martinez" ? SUBJECTS_SOFIA : SUBJECTS_MATEO;

  const handlePlanInterview = (e: FormEvent) => {
    e.preventDefault();

    if (student.statusAlerta === "NUEVA") {
      onUpdateStudent({
        ...student,
        statusAlerta: "EN REVISIÓN",
      });
    }

    setShowInterviewModal(false);
  };

  const handleRegisterIntervention = (e: FormEvent) => {
    e.preventDefault();
    if (!interventionDesc.trim()) return;

    onUpdateStudent({
      ...student,
      statusAlerta: "INTERVENIDA",
    });

    setShowInterventionModal(false);
    setInterventionDesc("");
  };

  const handleCloseAlert = (e: FormEvent) => {
    e.preventDefault();

    onUpdateStudent({
      ...student,
      riskLevel: "SEGURO",
      riskValue: 1.5,
      statusAlerta: "SIN ALERTA",
    });

    setShowCloseAlertModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-brand-primary hover:text-[#002f5e] font-semibold transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Volver al Listado de Estudiantes
        </button>
        <span className="text-xs text-brand-outline bg-[#edeeef] px-3 py-1 rounded font-medium">
          SBIRE / Legajo {student.legajo}
        </span>
      </div>

      {/* Main Student Header Card */}
      <div className="bg-white border border-brand-outline-variant rounded p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <img
            src={student.avatarUrl}
            alt={student.fullName}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-full object-cover border-2 border-brand-outline-variant shadow-sm"
          />
          <div>
            <h1 className="text-2xl font-bold text-brand-primary">
              {student.fullName}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#43474f] mt-1">
              <span className="flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-base">
                  badge
                </span>
                Legajo: {student.legajo}
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-base">
                  school
                </span>
                {student.career}
              </span>
              <span className="flex items-center gap-1 font-medium text-brand-secondary font-bold">
                <span className="material-symbols-outlined text-base">
                  calendar_today
                </span>
                {student.year}° Año
              </span>
            </div>
          </div>
        </div>

        {/* Risk Level Banner styled after screenshot */}
        <div className="bg-red-50 border border-brand-error/30 rounded px-6 py-3 flex flex-col items-center justify-center min-w-[150px] self-stretch md:self-auto text-center">
          <span className="text-xs font-bold text-brand-error tracking-wider uppercase">
            Nivel de Riesgo
          </span>
          <span className="text-sm font-semibold text-brand-outline-variant">
            {student.statusAlerta === "SIN ALERTA"
              ? "SEGURO"
              : student.riskLevel}
          </span>
          <span className="text-2xl font-black text-brand-error tracking-tight mt-1">
            {student.riskValue.toFixed(1)}/10
          </span>
        </div>
      </div>

      {/* Action Buttons Hub */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setShowInterviewModal(true)}
          className="flex items-center gap-1.5 bg-brand-primary text-white py-2 px-4 rounded text-sm font-bold shadow-sm hover:bg-[#002f5e] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">
            calendar_month
          </span>
          PLANIFICAR ENTREVISTA
        </button>

        <button
          onClick={() => setShowInterventionModal(true)}
          className="flex items-center gap-1.5 border border-brand-secondary text-brand-secondary py-2 px-4 rounded text-sm font-bold bg-white hover:bg-brand-secondary/5 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">
            settings_suggest
          </span>
          REGISTRAR INTERVENCIÓN
        </button>

        {student.statusAlerta !== "SIN ALERTA" && (
          <button
            onClick={() => setShowCloseAlertModal(true)}
            className="flex items-center gap-1.5 text-[#43474f] hover:text-[#ba1a1a] py-2 px-4 rounded text-sm font-semibold transition-all cursor-pointer border border-brand-outline-variant hover:border-brand-error bg-[#f3f4f5] hover:bg-white ml-auto"
          >
            <span className="material-symbols-outlined text-lg">
              cancel_schedule_send
            </span>
            CERRAR ALERTA (MANUAL)
          </button>
        )}
      </div>

      {/* Content Layout: 2 Columns */}
      <div className="space-y-6">
        {/* Custom Tabs */}
        <div className="bg-white border border-brand-outline-variant rounded">
          <div className="flex border-b border-brand-outline-variant bg-[#f3f4f5]">
            <button
              onClick={() => setActiveTab("trayectoria")}
              className={`px-6 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "trayectoria"
                  ? "border-brand-primary text-brand-primary bg-white"
                  : "border-transparent text-[#43474f] hover:text-brand-primary hover:bg-[#e7e8e9]"
              }`}
            >
              Trayectoria Académica
            </button>
            <button
              onClick={() => setActiveTab("encuestas")}
              className={`px-6 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "encuestas"
                  ? "border-brand-primary text-brand-primary bg-white"
                  : "border-transparent text-[#43474f] hover:text-brand-primary hover:bg-[#e7e8e9]"
              }`}
            >
              Encuestas & Sentimiento
            </button>
          </div>

          <div className="p-4">
            {activeTab === "trayectoria" ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#edeeef] text-[#43474f] uppercase tracking-wider font-bold">
                      <th className="p-3 border-b border-brand-outline-variant">
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
                    {subjects.map((sub, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-[#f8f9fa] transition-colors"
                      >
                        <td className="p-3">
                          <div className="font-bold text-brand-primary">
                            {sub.name}
                          </div>
                          <div className="text-[10px] text-brand-outline">
                            {sub.teacher}
                          </div>
                        </td>
                        <td className="p-3 text-center text-[#43474f] font-medium">
                          {sub.midtermGrades}
                        </td>
                        <td className="p-3 text-center font-bold text-rose-900">
                          {sub.finalGrade}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              sub.status === "EN RIESGO"
                                ? "bg-[#ffdad6] text-[#ba1a1a]"
                                : sub.status === "APROBADA"
                                  ? "bg-[#e2f3f5] text-[#006e6e]"
                                  : sub.status === "PROMOCIONADA"
                                    ? "bg-[#90efef] text-[#004f4f]"
                                    : "bg-[#edeeef] text-[#43474f]"
                            }`}
                          >
                            {sub.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 border border-amber-500/10 rounded">
                  <h3 className="font-bold text-amber-700 text-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">
                      warning
                    </span>
                    Indicador de Alerta de Deserción Tardía Q2
                  </h3>
                  <p className="text-xs text-amber-950 mt-1 leading-relaxed">
                    El sistema detectó correlación significativa entre el
                    ausentismo y conflictos de horarios laborales. En la
                    encuesta de ingreso constaba:{" "}
                    <strong>"Trabaja más de 20hs semanales"</strong>.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-brand-outline-variant rounded p-4">
                    <h4 className="text-xs font-bold text-brand-primary mb-2">
                      SATISFACCIÓN CON LA CARRERA
                    </h4>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#edeeef] h-3 rounded overflow-hidden">
                        <div
                          className="bg-[#006a6a] h-full rounded"
                          style={{ width: "85%" }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-brand-secondary">
                        8.5/10
                      </span>
                    </div>
                  </div>

                  <div className="border border-brand-outline-variant rounded p-4">
                    <h4 className="text-xs font-bold text-brand-primary mb-2">
                      APOYO FAMILIAR E INFRAESTRUCTURA
                    </h4>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#edeeef] h-3 rounded overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded"
                          style={{ width: "45%" }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-amber-600">
                        4.5/10 (Moderado)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Metrics Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-brand-outline-variant rounded p-4 text-center shadow-sm">
            <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider">
              PROMEDIO GENERAL
            </span>
            <p className="text-2xl font-black text-brand-primary mt-1">
              {student.gpa.toFixed(2)}
            </p>
            <div className="text-xs text-[#006a6a] font-semibold mt-1 flex items-center justify-center gap-0.5">
              <span className="material-symbols-outlined text-sm font-bold">
                trending_up
              </span>
              +0.4 vs año anterior
            </div>
          </div>

          <div className="bg-white border border-brand-outline-variant rounded p-4 text-center shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider">
                MATERIAS APROBADAS
              </span>
              <p className="text-2xl font-black text-brand-primary mt-1">
                {student.subjectsApproved} / {student.subjectsTotal}
              </p>
            </div>
            <div className="w-full bg-[#edeeef] h-2 rounded mt-2 overflow-hidden">
              <div
                className="bg-brand-primary h-full rounded"
                style={{
                  width: `${(student.subjectsApproved / student.subjectsTotal) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-white border border-brand-outline-variant rounded p-4 text-center shadow-sm">
            <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider">
              ENGAGEMENT CAMPUS
            </span>
            <p
              className={`text-2xl font-black mt-1 ${
                student.engagement === "Bajo"
                  ? "text-brand-error"
                  : student.engagement === "Medio"
                    ? "text-amber-500"
                    : "text-[#006a6a]"
              }`}
            >
              {student.engagement}
            </p>
            {student.engagement === "Bajo" && (
              <div className="text-[10px] text-[#ba1a1a] font-bold mt-1 inline-flex items-center gap-0.5 bg-red-50 px-2 py-0.5 rounded">
                <span className="material-symbols-outlined text-xs">info</span>
                Alerta de Inactividad
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Plan Interview Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191c1d]/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-brand-outline-variant rounded shadow-2xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-lg font-bold text-brand-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xl">
                calendar_month
              </span>
              Planificar Nueva Entrevista
            </h2>
            <form onSubmit={handlePlanInterview} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                    Horario
                  </label>
                  <input
                    type="time"
                    required
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                  Modalidad
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setInterviewModality("Presencial")}
                    className={`p-2 border rounded text-xs font-bold transition-all ${
                      interviewModality === "Presencial"
                        ? "bg-brand-primary text-white border-brand-primary"
                        : "bg-white text-brand-primary border-brand-outline-variant"
                    }`}
                  >
                    Presencial
                  </button>
                  <button
                    type="button"
                    onClick={() => setInterviewModality("Virtual")}
                    className={`p-2 border rounded text-xs font-bold transition-all ${
                      interviewModality === "Virtual"
                        ? "bg-brand-primary text-white border-brand-primary"
                        : "bg-white text-brand-primary border-brand-outline-variant"
                    }`}
                  >
                    Virtual
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                  Ubicación / Plataforma
                </label>
                <input
                  type="text"
                  required
                  value={interviewLoc}
                  onChange={(e) => setInterviewLoc(e.target.value)}
                  placeholder="ej: Aula 402, Meet Link, Gabinete"
                  className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInterviewModal(false)}
                  className="px-3 py-2 border border-brand-outline-variant text-[#43474f] rounded text-xs font-semibold hover:bg-[#e7e8e9] transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-primary text-white rounded text-xs font-bold hover:bg-[#002f5e] transition-all"
                >
                  Confirmar Programación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Intervention Modal */}
      {showInterventionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191c1d]/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-brand-outline-variant rounded shadow-2xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-lg font-bold text-brand-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xl text-brand-secondary">
                handyman
              </span>
              Registrar Acción / Intervención Directa
            </h2>
            <form onSubmit={handleRegisterIntervention} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                  Título de la Acción
                </label>
                <input
                  type="text"
                  required
                  value={interventionTitle}
                  onChange={(e) => setInterventionTitle(e.target.value)}
                  placeholder="ej: Derivación a Tutoría Especializada"
                  className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                  Descripción Detallada del Plan / Diagnóstico
                </label>
                <textarea
                  required
                  value={interventionDesc}
                  onChange={(e) => setInterventionDesc(e.target.value)}
                  rows={4}
                  placeholder="Describa el plan de acompañamiento o las observaciones surgidas del diálogo..."
                  className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary"
                ></textarea>
              </div>

              <div className="p-2.5 bg-brand-secondary/5 rounded border border-brand-secondary/20 flex gap-2">
                <span className="material-symbols-outlined text-brand-secondary text-lg">
                  info
                </span>
                <span className="text-[10px] text-brand-on-secondary-container leading-relaxed">
                  Al registrar esta intervención, el estado de la alerta del
                  estudiante cambiará automáticamente a{" "}
                  <strong>INTERVENIDA</strong>.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInterventionModal(false)}
                  className="px-3 py-2 border border-brand-outline-variant text-[#43474f] rounded text-xs font-semibold hover:bg-[#e7e8e9] transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-secondary text-white rounded text-xs font-bold hover:bg-[#004e4e] transition-all"
                >
                  Registrar Intervención
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Close Alert Modal */}
      {showCloseAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191c1d]/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-brand-outline-variant rounded shadow-2xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-lg font-bold text-brand-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xl text-brand-error">
                cancel_schedule_send
              </span>
              Cerrar Alerta Crítica (Manual)
            </h2>
            <form onSubmit={handleCloseAlert} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                  Justificación de Cierre de Alerta
                </label>
                <textarea
                  required
                  value={closeReason}
                  onChange={(e) => setCloseReason(e.target.value)}
                  rows={4}
                  placeholder="Justifique el motivo por el cual considera oportuno cerrar el expediente de riesgo..."
                  className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary"
                ></textarea>
              </div>

              <div className="p-3 bg-[#e2f3f5] rounded border border-[#006a6a]/25 flex gap-2">
                <span className="material-symbols-outlined text-[#006e6e] text-lg">
                  verified_user
                </span>
                <span className="text-[10px] text-[#004f4f] leading-relaxed">
                  Esta acción desactivará la etiqueta de riesgo crítico{" "}
                  {student.fullName}. El estudiante volverá a una situación de
                  regularidad estable en los listados generales.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCloseAlertModal(false)}
                  className="px-3 py-2 border border-brand-outline-variant text-[#43474f] rounded text-xs font-semibold hover:bg-[#e7e8e9] transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#006a6a] text-white rounded text-xs font-bold hover:bg-[#004f4f] transition-all"
                >
                  Desactivar Alerta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
