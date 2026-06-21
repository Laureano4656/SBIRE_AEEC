/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import type { Student } from "../types.ts";
import { SUBJECTS_MATEO } from "../data.ts";

interface StudentPanelProps {
  onLogout: () => void;
}

interface Question {
  id: string;
  question: string;
  type: "select" | "text";
  options?: string[];
  value: string;
}

interface StudentSurvey {
  id: string;
  title: string;
  description: string;
  category: string;
  dueDate: string;
  status: "PENDIENTE" | "COMPLETADA";
  completedAt?: string;
  questions: Question[];
}

export default function StudentPanel({ onLogout }: StudentPanelProps) {
  const [activeMenu, setActiveMenu] = useState<
    "trayectoria" | "encuestas" | "soporte"
  >("trayectoria");
  const [showTutorChat, setShowTutorChat] = useState(false);

  // Dynamic surveys state list
  const [surveys, setSurveys] = useState<StudentSurvey[]>([
    {
      id: "enc_infra_2026",
      title: "Encuesta de Satisfacción de Cursadas e Infraestructura",
      description:
        "Evalúa la calidad del equipamiento híbrido, las aulas presenciales y la velocidad de la red WiFi institucional para priorizar la asignación presupuestaria.",
      category: "Infraestructura",
      dueDate: "30/06/2026",
      status: "PENDIENTE",
      questions: [
        {
          id: "infra_q1",
          question:
            "¿Cómo calificarías la infraestructura (aulas híbridas y wifi) de la Facultad de Ingeniería?",
          type: "select",
          options: ["excelente", "buena", "regular", "insuficiente"],
          value: "excelente",
        },
        {
          id: "infra_q2",
          question:
            "¿Cuentas con conflictos horarios con tu empleo actual para rendir exámenes prácticos?",
          type: "select",
          options: ["si", "no", "no_aplica"],
          value: "no",
        },
        {
          id: "infra_q3",
          question: "Observaciones / Comentarios adicionales:",
          type: "text",
          value: "",
        },
      ],
    },
    {
      id: "enc_laboral_2026",
      title: "Relevamiento de Situación Laboral y Correlatividades",
      description:
        "Análisis institucional de la situación laboral del estudiantado para ajustar los laboratorios obligatorios de tarde/noche y becas de apuntes.",
      category: "Inclusión Laboral",
      dueDate: "15/07/2026",
      status: "PENDIENTE",
      questions: [
        {
          id: "lab_q1",
          question: "¿Cuál es tu carga horaria laboral semanal?",
          type: "select",
          options: [
            "Menos de 20 horas",
            "Entre 20 y 40 horas",
            "Más de 40 horas",
            "No trabajo actualmente",
          ],
          value: "No trabajo actualmente",
        },
        {
          id: "lab_q2",
          question:
            "¿Tu empleador respeta el otorgamiento de licencias por examen oficial?",
          type: "select",
          options: ["Siempre", "A veces", "Nunca", "No Aplica"],
          value: "No Aplica",
        },
        {
          id: "lab_q3",
          question:
            "Comenta brevemente si requieres adecuaciones curriculares o tutorías por motivos de trabajo:",
          type: "text",
          value: "",
        },
      ],
    },
    {
      id: "enc_tutoria_2026",
      title: "Evaluación del Programa de Acompañamiento y Tutorías Tempranas",
      description:
        "Evaluación directa de la calidad del asesoramiento tutorial recibido durante tu trayecto por materias críticas del primer tramo.",
      category: "Acompañamiento",
      dueDate: "Completada",
      status: "COMPLETADA",
      completedAt: "12/06/2026",
      questions: [
        {
          id: "tut_q1",
          question:
            "¿Cómo consideras el nivel de respuesta y seguimiento de tu tutor asignado?",
          type: "select",
          options: ["excelente", "bueno", "regular", "deficiente"],
          value: "excelente",
        },
        {
          id: "tut_q2",
          question:
            "¿Asistió a los talleres de apoyo de Ciencias Básicas (Física II / Análisis II)?",
          type: "select",
          options: ["si", "no"],
          value: "si",
        },
        {
          id: "tut_q3",
          question:
            "¿En qué aspectos consideras clave reforzar de cara al siguiente tramo?",
          type: "text",
          value:
            "Considero de gran ayuda las tutorías de acompañamiento los jueves en Ciencias Básicas. Me permitieron destrabar dudas fundamentales de Análisis Matemático II antes de rendir el integrador.",
        },
      ],
    },
  ]);

  // Active survey being completed or inspected in modal
  const [selectedSurveyToFill, setSelectedSurveyToFill] =
    useState<StudentSurvey | null>(null);
  const [selectedSurveyToInspect, setSelectedSurveyToInspect] =
    useState<StudentSurvey | null>(null);

  // Active survey tab ('pendientes' | 'completadas')
  const [activeSurveyTab, setActiveSurveyTab] = useState<
    "pendientes" | "completadas"
  >("pendientes");

  // Chat simulator states
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: "user" | "tutor"; text: string; time: string }>
  >([
    {
      sender: "tutor",
      text: "¡Hola Mateo! Soy tu Tutor Académico asignado (Dr. Juan Pérez). Veo que vienes con un excelente progreso. ¿En qué te puedo asesorar hoy?",
      time: "12:00",
    },
  ]);
  const [userMsg, setUserMsg] = useState("");

  // Handle saving the dynamic answers of a survey
  const handleSurveyOptionChange = (questionId: string, newValue: string) => {
    if (!selectedSurveyToFill) return;
    const updatedQuestions = selectedSurveyToFill.questions.map((q) => {
      if (q.id === questionId) {
        return { ...q, value: newValue };
      }
      return q;
    });
    setSelectedSurveyToFill({
      ...selectedSurveyToFill,
      questions: updatedQuestions,
    });
  };

  // Submit survey responses
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSurveyToFill) return;

    // Update global state with the completed survey data
    setSurveys((prev) =>
      prev.map((s) => {
        if (s.id === selectedSurveyToFill.id) {
          return {
            ...s,
            status: "COMPLETADA",
            completedAt: new Date().toLocaleDateString("es-AR"),
            questions: selectedSurveyToFill.questions,
          };
        }
        return s;
      }),
    );

    setSelectedSurveyToFill(null);
    alert(
      "¡Encuesta enviada exitosamente! Tu aporte ayuda a perfeccionar las trayectorias de la Facultad de Ingeniería.",
    );
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMsg.trim()) return;

    const newMsgs = [
      ...chatMessages,
      { sender: "user" as const, text: userMsg, time: "Ahora" },
    ];
    setChatMessages(newMsgs);
    const typed = userMsg;
    setUserMsg("");

    // Simulated tutor response based on keywords
    setTimeout(() => {
      let responseText =
        "Comprendo tu inquietud. Registré tu consulta académica. Nos vemos el próximo lunes en el horario de tutoría para repasar las opciones de becas y correlatividades.";
      if (
        typed.toLowerCase().includes("hola") ||
        typed.toLowerCase().includes("saludo")
      ) {
        responseText =
          "¡Hola Mateo! Espero que estés muy bien. ¿Tienes alguna duda sobre tus cursos actuales?";
      } else if (
        typed.toLowerCase().includes("dificultad") ||
        typed.toLowerCase().includes("complicado") ||
        typed.toLowerCase().includes("rendimiento")
      ) {
        responseText =
          "Entiendo, Mateo. No te preocupes. Recuerda que contamos con clases de apoyo los jueves del Departamento de Ciencias Básicas para Física II y Análisis Matemático II.";
      } else if (
        typed.toLowerCase().includes("entrevista") ||
        typed.toLowerCase().includes("reunion") ||
        typed.toLowerCase().includes("hablar")
      ) {
        responseText =
          "Excelente. Te propongo agendar una entrevista de manera presencial. ¿Te queda cómodo el jueves a las 11:00 hs?";
      }

      setChatMessages((prev) => [
        ...prev,
        { sender: "tutor" as const, text: responseText, time: "Ahora" },
      ]);
    }, 1000);
  };

  const pendingSurveys = surveys.filter((s) => s.status === "PENDIENTE");
  const completedSurveys = surveys.filter((s) => s.status === "COMPLETADA");

  return (
    <div className="min-h-screen flex text-slate-800 bg-slate-50 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-[#e2e8f0] flex flex-col fixed left-0 top-0 h-screen z-20">
        <div className="px-6 py-8 border-b border-[#e2e8f0] bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">
                account_balance
              </span>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">
                SBIRE
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">
                Sistema Travesía
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1">
          <button
            onClick={() => setActiveMenu("trayectoria")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all rounded-xl cursor-pointer ${
              activeMenu === "trayectoria"
                ? "text-brand-primary bg-[#eef2ff]"
                : "text-slate-500 hover:text-brand-primary hover:bg-slate-50"
            }`}
          >
            <span className="material-symbols-outlined text-lg">route</span>
            Mi Trayectoria
          </button>

          <button
            onClick={() => setActiveMenu("encuestas")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all rounded-xl cursor-pointer ${
              activeMenu === "encuestas"
                ? "text-brand-primary bg-[#eef2ff]"
                : "text-slate-500 hover:text-brand-primary hover:bg-slate-50"
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              edit_document
            </span>
            <span className="flex-1 text-left">Mis Encuestas</span>
            {pendingSurveys.length > 0 && (
              <span className="bg-brand-primary text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                {pendingSurveys.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveMenu("soporte")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all rounded-xl cursor-pointer ${
              activeMenu === "soporte"
                ? "text-brand-primary bg-[#eef2ff]"
                : "text-slate-500 hover:text-brand-primary hover:bg-slate-50"
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              support_agent
            </span>
            Soporte Académico
          </button>
        </nav>

        {/* Student identity footer */}
        <div className="p-4 border-t border-[#e2e8f0] bg-slate-50 mt-auto">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                alt="Mateo García Avatar"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full border border-slate-200 object-cover shadow-sm"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10b981] rounded-full border-2 border-white"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-xs truncate text-slate-800 block">
                Mateo García
              </p>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">
                Ing. Industrial
              </p>
            </div>
            <button
              onClick={onLogout}
              title="Cerrar sesión"
              className="p-1 hover:text-red-500 text-slate-400 rounded-lg transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white border-b border-[#e2e8f0] h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center">
            <h2 className="text-sm font-black text-brand-primary uppercase tracking-widest">
              {activeMenu === "trayectoria"
                ? "Mi Trayectoria Académica"
                : activeMenu === "encuestas"
                  ? "Encuestas y Relevamientos"
                  : "Asistencia y Soporte"}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <nav className="flex gap-4 text-xs font-semibold text-slate-500">
              <a
                href="#help"
                onClick={(e) => {
                  e.preventDefault();
                  alert(
                    "Ayuda del Sistema Travesía: contacte a su tutor o use la pestaña de soporte.",
                  );
                }}
                className="hover:text-brand-primary transition-colors"
              >
                Ayuda
              </a>
              <a
                href="#docs"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Conexión con SIU Guaraní activa.");
                }}
                className="hover:text-brand-primary transition-colors"
              >
                Documentación SIU
              </a>
            </nav>

            <div className="w-[1px] h-6 bg-slate-200"></div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-bold text-slate-600 tracking-tight">
                Estudiante Regular
              </span>
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <main className="p-8 flex-1 space-y-8 overflow-y-auto max-w-7xl w-full mx-auto animate-fade-in">
          {/* Trayectoria View */}
          {activeMenu === "trayectoria" && (
            <>
              {/* Welcome clean modern card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-sm">
                <div className="space-y-2 max-w-2xl">
                  <h3 className="text-3xl font-bold tracking-tight text-slate-800">
                    Hola Mateo,
                  </h3>
                  <p className="text-xl font-medium text-slate-500">
                    este es tu resumen de trayectoria y materias.
                  </p>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    Mantienes un excelente progreso académico de cara al tramo
                    final de la carrera. Responde los relevamientos
                    correspondientes para recibir atención y agendar tutorías.
                  </p>
                </div>
                <button
                  onClick={() =>
                    alert(
                      "Generando archivo oficial analítico de Kardex / SIU Guaraní...",
                    )
                  }
                  className="bg-brand-primary text-white hover:opacity-90 font-bold text-xs px-6 py-3 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap self-stretch md:self-auto text-center"
                >
                  Ver Kardex Completo
                </button>
              </div>

              {/* Three Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 relative shadow-xs">
                  <div className="absolute top-6 right-6 text-emerald-600 text-xs font-extrabold flex items-center">
                    <span className="material-symbols-outlined text-[14px]">
                      trending_up
                    </span>
                    +2.4% este mes
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    AVANCE EN LA CARRERA
                  </span>
                  <span className="text-3xl font-black text-slate-800 mt-2 block">
                    64%
                  </span>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                    <div
                      className="bg-brand-primary h-full rounded-full"
                      style={{ width: "64%" }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 relative shadow-xs">
                  <div className="absolute top-6 right-6 text-brand-primary text-xs font-extrabold flex items-center bg-[#eef2ff] px-2.5 py-1 rounded-lg">
                    Top 15% Max
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    PROMEDIO GENERAL
                  </span>
                  <span className="text-3xl font-black text-slate-800 mt-2 block">
                    8.42
                  </span>
                  <p className="text-[10px] text-slate-400 mt-4 font-semibold leading-none">
                    Basado en 22 materias aprobadas
                  </p>
                </div>

                <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 relative shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      MATERIAS APROBADAS
                    </span>
                    <span className="text-3xl font-black text-slate-800 mt-2 block">
                      18 / 32
                    </span>
                  </div>
                  <div className="flex gap-1.5 mt-4">
                    <span
                      className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]"
                      title="Análisis Matemático I"
                    >
                      AMI
                    </span>
                    <span
                      className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-[10px]"
                      title="Física I"
                    >
                      FI
                    </span>
                    <span
                      className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-[10px]"
                      title="Química General"
                    >
                      QG
                    </span>
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px]">
                      +15
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid: Subjects and Widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-xs">
                  <div className="px-6 py-5 border-b border-[#e2e8f0] flex justify-between items-center bg-slate-50">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-lg text-brand-primary">
                        menu_book
                      </span>
                      Mis Materias Actuales
                    </h4>
                    <span className="text-xs text-brand-primary font-bold">
                      Plan de Estudios 2020
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                          <th className="p-4 pl-6">Materia</th>
                          <th className="p-4 text-center">Estado</th>
                          <th className="p-4 text-center">
                            Calificación Parcial
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e2e8f0]">
                        {SUBJECTS_MATEO.map((sm, index) => (
                          <tr
                            key={index}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="p-4 pl-6">
                              <div className="font-bold text-slate-800">
                                {sm.name}
                              </div>
                              <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                {sm.teacher}
                              </div>
                            </td>
                            <td className="p-4 text-center animate-fade-in">
                              <span className="bg-[#e0f1fe] text-[#0369a1] px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                {sm.status}
                              </span>
                            </td>
                            <td className="p-4 text-center font-bold text-slate-800 text-sm">
                              {sm.finalGrade !== "-"
                                ? sm.finalGrade
                                : "Pendiente de Examen"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right widgets */}
                <div className="space-y-6">
                  {/* Highlight Survey card */}
                  {pendingSurveys.length > 0 ? (
                    <div className="bg-gradient-to-tr from-brand-primary to-brand-secondary text-white rounded-2xl p-6 relative overflow-hidden shadow-xs space-y-4">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-white text-3xl font-light">
                          campaign
                        </span>
                        <div>
                          <h4 className="font-bold text-[10px] uppercase tracking-wider opacity-80 animate-pulse">
                            Relevamiento Activo
                          </h4>
                          <h5 className="font-black text-sm tracking-tight mt-0.5">
                            {pendingSurveys[0].title}
                          </h5>
                        </div>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        Tu opinión es vital para modelar el soporte académico y
                        compatibilidad laboral en nuestra cohorte.
                      </p>

                      <button
                        onClick={() => {
                          setSelectedSurveyToFill(pendingSurveys[0]);
                        }}
                        className="w-full bg-white text-brand-primary hover:bg-slate-50 py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        Completar Encuesta Ahora
                      </button>
                    </div>
                  ) : (
                    <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-xs space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-400">
                          check_circle
                        </span>
                        <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400">
                          Al día con SBIRE
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        ¡Felicitaciones! Has completado todas tus encuestas
                        cargadas por tutoría para este ciclo escolar.
                      </p>
                      <button
                        onClick={() => setActiveMenu("encuestas")}
                        className="w-full bg-slate-800 text-slate-200 hover:text-white py-2.5 px-4 rounded-xl text-xs font-semibold hover:bg-slate-700 transition-all cursor-pointer"
                      >
                        Consultar Mi Historial
                      </button>
                    </div>
                  )}

                  {/* Tutor Help Widget */}
                  <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs space-y-4">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
                      ¿Necesitas asistencia?
                    </h4>
                    <p className="text-xs text-slate-500 leading-normal font-medium">
                      Si posees inconvenientes de salud, laborales, o académicos
                      para cursar con regularidad, comunícate con el cuerpo
                      docente de tutorías del Sistema Travesía.
                    </p>

                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setShowTutorChat(true);
                          setActiveMenu("soporte");
                        }}
                        className="w-full flex items-center justify-between border border-slate-200 hover:bg-slate-50 p-3.5 rounded-xl text-xs font-bold text-brand-primary transition-all cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-brand-secondary text-lg">
                            chat_bubble
                          </span>
                          Iniciar consulta virtual
                        </span>
                        <span className="material-symbols-outlined text-sm">
                          arrow_forward
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          alert(
                            "Solicitud enviada exitosamente. Recibirás un mail institucional en tu correo oficial con opciones horarios sugeridos.",
                          );
                        }}
                        className="w-full flex items-center justify-between border border-slate-200 hover:bg-slate-50 p-3.5 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-rose-500 text-lg">
                            calendar_month
                          </span>
                          Agendar entrevista de apoyo
                        </span>
                        <span className="material-symbols-outlined text-sm">
                          arrow_forward
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Dedicated Surveys View / Page (Requested by User) */}
          {activeMenu === "encuestas" && (
            <div className="space-y-8 animate-fade-in">
              {/* Header Title block */}
              <div>
                <span className="text-xs font-bold text-brand-primary uppercase tracking-wider bg-[#eef2ff] px-3 py-1 rounded-lg">
                  Estudiante Mateo García
                </span>
                <h3 className="text-3xl font-bold tracking-tight text-slate-800 mt-2">
                  Mis Encuestas y Relevamientos
                </h3>
                <p className="text-slate-500 font-medium text-sm mt-1 leading-normal">
                  Responde las encuestas planificadas por el cuerpo de tutores.
                  Tus respuestas nos permiten modelar de forma proactiva tu
                  trayecto formativo, evitar la inactividad y brindarte apoyo
                  continuo.
                </p>
              </div>

              {/* Statistics Grid for Surveys */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                    <span className="material-symbols-outlined text-2xl">
                      pending_actions
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                      ENCUESTAS PENDIENTES
                    </span>
                    <span className="text-2xl font-extrabold text-slate-800 mt-0.5 block">
                      {pendingSurveys.length} para completar
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <span className="material-symbols-outlined text-2xl">
                      check_circle
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                      ENCUESTAS COMPLETADAS
                    </span>
                    <span className="text-2xl font-extrabold text-slate-800 mt-0.5 block">
                      {completedSurveys.length} registradas
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <span className="material-symbols-outlined text-2xl">
                      insights
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                      RETROALIMENTACIÓN ACTIVA
                    </span>
                    <span className="text-2xl font-extrabold text-slate-800 mt-0.5 block">
                      100% Confidencial
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabs selector */}
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setActiveSurveyTab("pendientes")}
                  className={`py-3.5 px-6 text-sm font-bold tracking-tight border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                    activeSurveyTab === "pendientes"
                      ? "border-brand-primary text-brand-primary"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    pending
                  </span>
                  Pendientes de Respuesta
                  {pendingSurveys.length > 0 && (
                    <span className="bg-brand-primary text-white text-[10px] px-1.5 py-0.5 rounded-full font-black ml-1">
                      {pendingSurveys.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveSurveyTab("completadas")}
                  className={`py-3.5 px-6 text-sm font-bold tracking-tight border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                    activeSurveyTab === "completadas"
                      ? "border-brand-primary text-brand-primary"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    task_alt
                  </span>
                  Historial y Respuestas Enviadas
                  <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1">
                    {completedSurveys.length}
                  </span>
                </button>
              </div>

              {/* Survey Content Grid showing surveys array */}
              {activeSurveyTab === "pendientes" ? (
                <div className="space-y-6">
                  {pendingSurveys.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {pendingSurveys.map((ps) => (
                        <div
                          key={ps.id}
                          className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-200 transition-all duration-300 shadow-xs relative"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold uppercase bg-indigo-50 text-brand-primary px-3 py-1 rounded-lg">
                                {ps.category}
                              </span>
                              <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">
                                  calendar_today
                                </span>
                                Vence: {ps.dueDate}
                              </span>
                            </div>
                            <h4 className="font-bold text-slate-800 text-base leading-snug">
                              {ps.title}
                            </h4>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                              {ps.description}
                            </p>
                          </div>

                          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              {ps.questions.length} Cuestionamientos
                            </span>
                            <button
                              onClick={() => setSelectedSurveyToFill(ps)}
                              className="bg-brand-primary text-white hover:opacity-90 font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-base">
                                rate_review
                              </span>
                              Completar Formulario
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto">
                        <span className="material-symbols-outlined text-4xl">
                          emoji_events
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-lg">
                        ¡Excelente trabajo académico!
                      </h4>
                      <p className="text-sm text-slate-500 max-w-md mx-auto">
                        No posees encuestas de trayectorias pendientes por este
                        ciclo estudiantil. Haz completado el 100% de los
                        cuestionarios requeridos por tus tutores.
                      </p>
                      <button
                        onClick={() => setActiveSurveyTab("completadas")}
                        className="text-brand-primary font-bold text-xs hover:underline mt-2 inline-block bg-slate-50 px-4 py-2 rounded-lg"
                      >
                        Revisar Respuestas Históricas
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {completedSurveys.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {completedSurveys.map((cs) => (
                        <div
                          key={cs.id}
                          className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-300 transition-all duration-300 shadow-xs"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg flex items-center gap-1">
                                <span className="material-symbols-outlined text-[10px] font-black">
                                  done
                                </span>
                                completada
                              </span>
                              <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">
                                  schedule
                                </span>
                                Enviado: {cs.completedAt}
                              </span>
                            </div>
                            <h4 className="font-bold text-slate-800 text-base leading-snug">
                              {cs.title}
                            </h4>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                              {cs.description}
                            </p>
                          </div>

                          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              Categoría: {cs.category}
                            </span>
                            <button
                              onClick={() => setSelectedSurveyToInspect(cs)}
                              className="border border-slate-200 hover:bg-slate-50 text-brand-primary font-bold text-xs py-2 px-4 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-base">
                                visibility
                              </span>
                              Ver Mis Respuestas
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
                      No hay registros archivados. Complete los cuestionarios
                      activos para visualizar su historial.
                    </div>
                  )}
                </div>
              )}

              {/* Informative Dashboard Segment - Institutional Impact */}
              <div className="bg-slate-900 text-white rounded-2xl p-8 relative overflow-hidden shadow-xs space-y-6">
                <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-brand-primary opacity-20 rounded-full blur-3xl"></div>
                <div className="absolute -left-16 -top-16 w-64 h-64 bg-brand-secondary opacity-15 rounded-full blur-3xl"></div>

                <div className="space-y-2 relative z-10">
                  <h4 className="text-emerald-400 font-bold uppercase text-[11px] tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      gavel
                    </span>
                    Voz Estudiantil e Incidencia Real en Ingeniería
                  </h4>
                  <h3 className="text-xl font-bold tracking-tight text-white">
                    ¿Cómo impactan tus respuestas en la facultad?
                  </h3>
                  <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                    Las encuestas del Sistema Travesía no son solo estadísticas:
                    activan de forma confidencial alarmas tempranas para el
                    cuerpo de tutores y modifican políticas institucionales.
                    Aquí algunos de tus logros colectivos recientes:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 pt-2 border-t border-slate-800">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <span className="material-symbols-outlined text-lg">
                        wifi_tethering
                      </span>
                      <h5 className="font-bold text-xs uppercase tracking-wider">
                        Fibra Óptica en Aula Lab C
                      </h5>
                    </div>
                    <p className="text-xs text-slate-400 leading-normal">
                      Tras las quejas recibidas en la encuesta de
                      infraestructura anterior, se duplicó la potencia y bocas
                      de red en laboratorios de informática del Departamento de
                      Computación.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <span className="material-symbols-outlined text-lg">
                        clinical_notes
                      </span>
                      <h5 className="font-bold text-xs uppercase tracking-wider">
                        Tutoría AMII los Jueves
                      </h5>
                    </div>
                    <p className="text-xs text-slate-400 leading-normal">
                      El 82% de los alumnos manifestó dificultad en el tramo de
                      correlatividades de Análisis Matemático II. Asignamos
                      clases de consulta adicionales dedicadas exclusivas los
                      jueves tarde.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <span className="material-symbols-outlined text-lg">
                        hourglass_bottom
                      </span>
                      <h5 className="font-bold text-xs uppercase tracking-wider">
                        Flexibilidad Laboral
                      </h5>
                    </div>
                    <p className="text-xs text-slate-400 leading-normal">
                      Se habilitó el canal de mensajería para alumnos integrados
                      al régimen laboral, permitiendo justificar inasistencias a
                      laboratorios obligatorios con comprobantes de trabajo
                      oficiales.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Support and tutoría section */}
          {activeMenu === "soporte" && (
            <div className="space-y-8 animate-fade-in text-slate-800">
              <div>
                <span className="text-xs font-bold text-[#0369a1] uppercase tracking-wider bg-[#e0f1fe] px-3 py-1 rounded-lg">
                  Cuerpo de Tutores Asignados
                </span>
                <h3 className="text-3xl font-bold tracking-tight text-slate-800 mt-2">
                  Soporte Académico y Tutoría
                </h3>
                <p className="text-slate-500 font-medium text-sm mt-1 leading-normal">
                  Aquí puedes acceder a las herramientas de apoyo académico del
                  Sistema Travesía. Revisa horarios de consulta, solicita
                  asistencia especial, o abre el canal de chat con tu tutor.
                </p>
              </div>

              {/* Two Column details: Contacts and Online chat activation */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 space-y-6">
                  {/* Tutor information card */}
                  <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs space-y-6">
                    <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-brand-primary">
                        person_search
                      </span>
                      Tu Tutor Académico Oficial
                    </h4>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <img
                        alt="Tutor de Mateo"
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                      />
                      <div className="space-y-1">
                        <h5 className="font-bold text-base text-slate-800">
                          Dr. Juan Pérez
                        </h5>
                        <p className="text-xs text-slate-500 font-medium font-semibold">
                          Tutor Senior - Departamento de Orientación al Alumno
                        </p>
                        <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 pt-1">
                          <span className="material-symbols-outlined text-sm">
                            mail
                          </span>
                          jperez@fi.mdp.edu.ar
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
                      <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">
                          CONSULTAS PRESENCIALES
                        </span>
                        <p className="font-bold text-slate-700">
                          Lunes y Jueves, 14:00s a 17:00 hs
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Oficina de Coordinación de Alumnos (Planta Alta)
                        </p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">
                          CONSULTAS VIRTUALES
                        </span>
                        <p className="font-bold text-slate-700">
                          Martes y Jueves, 10:00 a 12:00 hs
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Vía Zoom / Sala de Tutorías asignada en SIU
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Program of tutoring schedule */}
                  <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs space-y-4">
                    <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-brand-primary">
                        group_work
                      </span>
                      Talleres de Nivelación e Intensivos Activos
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold">
                      Participa libremente de las clases de apoyo de Ciencias
                      Básicas para resolver dudas prácticas:
                    </p>

                    <div className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                      <div className="py-3 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-800">
                            Física II - Apoyo Práctico
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Docente responsable: Ing. Carlos Rossi
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-600">
                            Miércoles, 16:30 hs
                          </p>
                          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-bold uppercase">
                            AULA 12 - PRESENCIAL
                          </span>
                        </div>
                      </div>

                      <div className="py-3 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-800">
                            Análisis Matemático II - Apoyo Teórico/Práctico
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Docente responsable: Dra. Laura Martínez
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-600">
                            Jueves, 14:00 hs
                          </p>
                          <span className="text-[10px] text-brand-primary bg-[#eef2ff] px-2 py-0.5 rounded-md font-bold uppercase">
                            SALA ZOOM - VIRTUAL
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live simulation section */}
                <div className="space-y-6">
                  <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs space-y-4 text-center">
                    <span className="material-symbols-outlined text-4xl text-brand-secondary bg-sky-50 p-4 rounded-full">
                      forum
                    </span>
                    <h5 className="font-bold text-base text-slate-800">
                      Chat con tu Tutor en Vivo
                    </h5>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      Comunícate directamente con el Dr. Juan Pérez por
                      consultas académicas rápidas, sugerencias, o coordinación
                      de entrevistas personales.
                    </p>
                    <button
                      onClick={() => setShowTutorChat(true)}
                      className="w-full bg-brand-primary text-white hover:opacity-90 py-3.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">
                        chat_bubble
                      </span>
                      Abrir Canal de Mensajería
                    </button>
                  </div>

                  <div className="p-6 border border-amber-200 bg-amber-50/50 rounded-2xl space-y-3">
                    <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-amber-600 text-lg">
                        info
                      </span>
                      Atención Diferenciada por Trabajo
                    </h5>
                    <p className="text-xs text-slate-600 leading-normal font-semibold">
                      Recuerda que si cargas cambios en tu situación laboral
                      contractual en la pestaña <strong>"Mis Encuestas"</strong>
                      , se reevaluará de forma automática tu trayecto para
                      evitar inasistencias injustificadas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: Active survey completion form (Dynamically rendered for each question) */}
      {selectedSurveyToFill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full p-8 space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-brand-primary uppercase bg-[#eef2ff] px-2.5 py-1 rounded-lg">
                  {selectedSurveyToFill.category}
                </span>
                <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 mt-2 leading-tight">
                  <span className="material-symbols-outlined text-2xl text-brand-secondary">
                    ballot
                  </span>
                  {selectedSurveyToFill.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedSurveyToFill(null)}
                className="text-slate-400 hover:text-red-500 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="space-y-6 text-xs text-slate-600 font-semibold"
            >
              <div className="max-h-[380px] overflow-y-auto pr-2 space-y-5">
                {selectedSurveyToFill.questions.map((q, index) => (
                  <div key={q.id} className="space-y-2.5 pt-1">
                    <p className="text-slate-800 font-bold block leading-relaxed">
                      {index + 1}. {q.question}
                    </p>

                    {q.type === "select" && q.options && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                        {q.options.map((opt) => (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => handleSurveyOptionChange(q.id, opt)}
                            className={`p-2.5 border rounded-xl font-bold capitalize transition-all text-center ${
                              q.value === opt
                                ? "bg-brand-primary text-white border-brand-primary"
                                : "bg-white text-brand-primary border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            {opt === "no_aplica" ? "No Aplica" : opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {q.type === "text" && (
                      <textarea
                        value={q.value}
                        onChange={(e) =>
                          handleSurveyOptionChange(q.id, e.target.value)
                        }
                        rows={3}
                        placeholder="Por favor, relate cualquier otra consideración para tu tutor aquí..."
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-slate-800 bg-slate-50 focus:outline-none transition-all"
                      ></textarea>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedSurveyToFill(null)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:opacity-95 transition-all shadow-xs"
                >
                  Enviar Respuestas Oficiales
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Inspect Answers (Read-Only) */}
      {selectedSurveyToInspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full p-8 space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-700 uppercase bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1.5 w-max">
                  <span className="material-symbols-outlined text-[10px] font-black">
                    done
                  </span>
                  Respuestas Archivadas • Enviada el{" "}
                  {selectedSurveyToInspect.completedAt}
                </span>
                <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 mt-2 leading-tight">
                  <span className="material-symbols-outlined text-2xl text-emerald-600">
                    assignment_turned_in
                  </span>
                  {selectedSurveyToInspect.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedSurveyToInspect(null)}
                className="text-slate-400 hover:text-red-500 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-6 text-xs text-slate-600 font-semibold max-h-[380px] overflow-y-auto pr-2">
              {selectedSurveyToInspect.questions.map((q, index) => (
                <div
                  key={q.id}
                  className="space-y-2 border-b border-dashed border-slate-100 pb-4 last:border-none last:pb-0"
                >
                  <p className="text-slate-800 font-bold block leading-relaxed">
                    {index + 1}. {q.question}
                  </p>

                  {q.type === "select" ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {q.options?.map((opt) => {
                        const isValueChosen = q.value === opt;
                        return (
                          <span
                            key={opt}
                            className={`px-3 py-1.5 rounded-lg font-bold capitalize text-[10px] ${
                              isValueChosen
                                ? "bg-emerald-500 text-white shadow-xs"
                                : "bg-slate-100 text-slate-400 opacity-60"
                            }`}
                          >
                            {opt === "no_aplica" ? "No Aplica" : opt}
                            {isValueChosen && " ✓"}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium leading-relaxed italic">
                      "
                      {q.value ||
                        "No se ingresaron comentarios adicionales para esta pregunta."}
                      "
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">
                  shield
                </span>
                Registro Oficial Cifrado
              </span>
              <button
                onClick={() => setSelectedSurveyToInspect(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
              >
                Cerrar Expediente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tutor Online Chat Drawer/Widget Simulation */}
      {showTutorChat && (
        <div className="fixed bottom-6 right-6 z-50 w-80 bg-white border border-[#e2e8f0] rounded-2xl shadow-2xl flex flex-col h-[400px] animate-fade-in overflow-hidden">
          {/* Chat Header */}
          <div className="bg-brand-primary text-white p-4 flex justify-between items-center shadow-xs">
            <div className="flex items-center gap-2">
              <div className="relative">
                <img
                  alt="Dr Juan Perez thumbnail"
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border border-indigo-400"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white"></span>
              </div>
              <div>
                <span className="font-bold text-xs uppercase tracking-wider block">
                  Dr. Juan Pérez
                </span>
                <span className="text-[9px] text-slate-200 block font-medium">
                  Tutor En Línea
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setShowTutorChat(false);
              }}
              className="text-white hover:text-red-200 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-[11px] font-semibold leading-relaxed">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[85%] p-3 rounded-2xl ${
                  msg.sender === "user"
                    ? "ml-auto bg-brand-primary text-white rounded-br-none text-right"
                    : "mr-auto bg-white border border-slate-200 text-slate-800 rounded-bl-none"
                }`}
              >
                <p className="whitespace-pre-line text-left">{msg.text}</p>
                <span className="text-[9px] text-slate-400 block mt-1.5 text-right font-bold">
                  {msg.time}
                </span>
              </div>
            ))}
          </div>

          {/* Chat Form */}
          <form
            onSubmit={handleSendChat}
            className="border-t border-[#e2e8f0] p-3 flex gap-2 bg-white"
          >
            <input
              type="text"
              value={userMsg}
              onChange={(e) => setUserMsg(e.target.value)}
              placeholder="Escribe tu mensaje académico..."
              className="flex-1 border border-[#e2e8f0] rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none text-slate-800 placeholder-slate-400 font-semibold"
            />
            <button
              type="submit"
              className="bg-brand-primary text-white rounded-xl p-2.5 hover:opacity-90 flex items-center justify-center cursor-pointer active:scale-95 transition-all text-xs"
            >
              <span className="material-symbols-outlined text-base">send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
