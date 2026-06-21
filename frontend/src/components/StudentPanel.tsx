/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
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
  /** Solo aplica a encuestas pendientes; las completadas usan completedAt. */
  dueDate?: string;
  status: "PENDIENTE" | "COMPLETADA";
  completedAt?: string;
  questions: Question[];
}

interface ChatMessage {
  id: number;
  sender: "user" | "tutor";
  text: string;
  time: string;
}

interface ToastMessage {
  text: string;
  variant: "success" | "error" | "info";
}

export default function StudentPanel({ onLogout }: StudentPanelProps) {
  const [activeMenu, setActiveMenu] = useState<
    "trayectoria" | "encuestas" | "soporte"
  >("trayectoria");
  const [showTutorChat, setShowTutorChat] = useState(false);

  // Dynamic surveys state list.
  // FIX: las preguntas "select" de encuestas PENDIENTES ahora arrancan sin
  // valor (""). Antes venían precargadas con una opción ya elegida, lo que
  // permitía "enviar" la encuesta sin que el estudiante eligiera nada.
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
          value: "",
        },
        {
          id: "infra_q2",
          question:
            "¿Cuentas con conflictos horarios con tu empleo actual para rendir exámenes prácticos?",
          type: "select",
          options: ["si", "no", "no_aplica"],
          value: "",
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
          value: "",
        },
        {
          id: "lab_q2",
          question:
            "¿Tu empleador respeta el otorgamiento de licencias por examen oficial?",
          type: "select",
          options: ["Siempre", "A veces", "Nunca", "No Aplica"],
          value: "",
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

  // Active survey being completed or inspected in modal.
  const [selectedSurveyToFill, setSelectedSurveyToFill] =
    useState<StudentSurvey | null>(null);
  const [selectedSurveyToInspect, setSelectedSurveyToInspect] =
    useState<StudentSurvey | null>(null);

  // Active survey tab ('pendientes' | 'completadas').
  const [activeSurveyTab, setActiveSurveyTab] = useState<
    "pendientes" | "completadas"
  >("pendientes");

  // Chat simulator state.
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      sender: "tutor",
      text: "¡Hola Mateo! Soy tu Tutor Académico asignado (Dr. Juan Pérez). Veo que vienes con un excelente progreso. ¿En qué te puedo asesorar hoy?",
      time: "12:00",
    },
  ]);
  const [userMsg, setUserMsg] = useState("");

  // FIX: in-app toast en lugar de alert() bloqueante del navegador.
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Ids incrementales para mensajes de chat (en vez de usar el index como key).
  const nextMessageId = useRef(1);
  // Referencia al timeout de la respuesta simulada del tutor, para poder
  // cancelarlo si el componente se desmonta o si el usuario envía otro
  // mensaje antes de que llegue la respuesta anterior.
  const chatTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (
    text: string,
    variant: ToastMessage["variant"] = "info",
  ) => {
    setToast({ text, variant });
  };

  // Auto-ocultar el toast.
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // FIX: limpiar el timeout pendiente del chat al desmontar el componente,
  // para evitar el warning "no se puede actualizar un componente desmontado".
  useEffect(() => {
    return () => {
      if (chatTimeoutRef.current) clearTimeout(chatTimeoutRef.current);
    };
  }, []);

  // Cerrar cualquier modal/drawer abierto con la tecla Escape.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (selectedSurveyToFill) setSelectedSurveyToFill(null);
      else if (selectedSurveyToInspect) setSelectedSurveyToInspect(null);
      else if (showTutorChat) setShowTutorChat(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedSurveyToFill, selectedSurveyToInspect, showTutorChat]);

  // Handle saving the dynamic answers of a survey.
  const handleSurveyOptionChange = (questionId: string, newValue: string) => {
    if (!selectedSurveyToFill) return;
    const updatedQuestions = selectedSurveyToFill.questions.map((q) =>
      q.id === questionId ? { ...q, value: newValue } : q,
    );
    setSelectedSurveyToFill({
      ...selectedSurveyToFill,
      questions: updatedQuestions,
    });
  };

  // Submit survey responses.
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSurveyToFill) return;

    // FIX: validar que todas las preguntas de selección tengan una
    // respuesta antes de permitir el envío. Las preguntas de texto libre
    // ("Observaciones") quedan opcionales a propósito.
    const missingAnswer = selectedSurveyToFill.questions.find(
      (q) => q.type === "select" && !q.value,
    );
    if (missingAnswer) {
      showToast(
        "Faltan preguntas por responder. Revisá el formulario antes de enviarlo.",
        "error",
      );
      return;
    }

    setSurveys((prev) =>
      prev.map((s) =>
        s.id === selectedSurveyToFill.id
          ? {
              ...s,
              status: "COMPLETADA",
              completedAt: new Date().toLocaleDateString("es-AR"),
              questions: selectedSurveyToFill.questions,
            }
          : s,
      ),
    );

    setSelectedSurveyToFill(null);
    showToast(
      "¡Encuesta enviada exitosamente! Tu aporte ayuda a perfeccionar las trayectorias de la Facultad de Ingeniería.",
      "success",
    );
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = userMsg.trim();
    if (!trimmed) return;

    const userMessageId = nextMessageId.current++;
    setChatMessages((prev) => [
      ...prev,
      { id: userMessageId, sender: "user", text: trimmed, time: "Ahora" },
    ]);
    setUserMsg("");

    // Si había una respuesta simulada pendiente, la cancelamos para no
    // duplicar mensajes del tutor.
    if (chatTimeoutRef.current) clearTimeout(chatTimeoutRef.current);

    // Simulated tutor response based on keywords.
    chatTimeoutRef.current = setTimeout(() => {
      const lower = trimmed.toLowerCase();
      let responseText =
        "Comprendo tu inquietud. Registré tu consulta académica. Nos vemos el próximo lunes en el horario de tutoría para repasar las opciones de becas y correlatividades.";

      if (lower.includes("hola") || lower.includes("saludo")) {
        responseText =
          "¡Hola Mateo! Espero que estés muy bien. ¿Tienes alguna duda sobre tus cursos actuales?";
      } else if (
        lower.includes("dificultad") ||
        lower.includes("complicado") ||
        lower.includes("rendimiento")
      ) {
        responseText =
          "Entiendo, Mateo. No te preocupes. Recuerda que contamos con clases de apoyo los jueves del Departamento de Ciencias Básicas para Física II y Análisis Matemático II.";
      } else if (
        lower.includes("entrevista") ||
        lower.includes("reunion") ||
        lower.includes("hablar")
      ) {
        responseText =
          "Excelente. Te propongo agendar una entrevista de manera presencial. ¿Te queda cómodo el jueves a las 11:00 hs?";
      }

      const tutorMessageId = nextMessageId.current++;
      setChatMessages((prev) => [
        ...prev,
        {
          id: tutorMessageId,
          sender: "tutor",
          text: responseText,
          time: "Ahora",
        },
      ]);
    }, 1000);
  };

  const pendingSurveys = surveys.filter((s) => s.status === "PENDIENTE");
  const completedSurveys = surveys.filter((s) => s.status === "COMPLETADA");

  return (
    <div className="min-h-screen flex text-slate-800 bg-slate-50 font-sans">
      {/* Toast de notificaciones (reemplaza a los alert() bloqueantes) */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-5 right-5 z-[60] max-w-sm rounded-xl px-4 py-3 text-xs font-bold shadow-lg flex items-start gap-2 animate-fade-in ${
            toast.variant === "success"
              ? "bg-emerald-600 text-white"
              : toast.variant === "error"
                ? "bg-red-600 text-white"
                : "bg-slate-800 text-white"
          }`}
        >
          <span className="material-symbols-outlined text-base">
            {toast.variant === "success"
              ? "check_circle"
              : toast.variant === "error"
                ? "error"
                : "info"}
          </span>
          <span className="leading-relaxed">{toast.text}</span>
          <button
            onClick={() => setToast(null)}
            aria-label="Cerrar notificación"
            className="ml-auto -mr-1 -mt-0.5 opacity-80 hover:opacity-100 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

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
            aria-pressed={activeMenu === "trayectoria"}
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
            aria-pressed={activeMenu === "encuestas"}
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
            aria-pressed={activeMenu === "soporte"}
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
              aria-label="Cerrar sesión"
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
                  : "Soporte y Tutoría"}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <nav className="flex gap-4 text-xs font-semibold text-slate-500">
              <a
                href="#docs"
                onClick={(e) => {
                  e.preventDefault();
                  showToast("Conexión con SIU Guaraní activa.", "info");
                }}
                className="hover:text-brand-primary transition-colors"
              >
                Documentación
              </a>
            </nav>

            <div className="w-[1px] h-6 bg-slate-200"></div>
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
              </div>

              {/* Three Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 relative shadow-xs">
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
                </div>
              </div>

              {/* Grid: Subjects and Widgets */}
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
              <div className="flex border-b border-slate-200" role="tablist">
                <button
                  role="tab"
                  aria-selected={activeSurveyTab === "pendientes"}
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
                  role="tab"
                  aria-selected={activeSurveyTab === "completadas"}
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
                  apoyo personalizado, o abre el canal de chat con tu tutor.
                </p>
              </div>

              {/* Two Column details: Contacts and Online chat activation */}

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
                      <p className="text-xs text-slate-500 font-semibold">
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
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: Active survey completion form (Dynamically rendered for each question) */}
      {selectedSurveyToFill && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="survey-fill-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full p-8 space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-brand-primary uppercase bg-[#eef2ff] px-2.5 py-1 rounded-lg">
                  {selectedSurveyToFill.category}
                </span>
                <h2
                  id="survey-fill-title"
                  className="text-lg font-black text-slate-800 flex items-center gap-2 mt-2 leading-tight"
                >
                  <span className="material-symbols-outlined text-2xl text-brand-secondary">
                    ballot
                  </span>
                  {selectedSurveyToFill.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedSurveyToFill(null)}
                aria-label="Cerrar formulario"
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
                    {q.type === "text" ? (
                      <label
                        htmlFor={q.id}
                        className="text-slate-800 font-bold block leading-relaxed"
                      >
                        {index + 1}. {q.question}
                      </label>
                    ) : (
                      <p
                        id={`${q.id}-label`}
                        className="text-slate-800 font-bold block leading-relaxed"
                      >
                        {index + 1}. {q.question}
                        {!q.value && (
                          <span
                            className="text-red-500 ml-1"
                            aria-label="obligatorio"
                          >
                            *
                          </span>
                        )}
                      </p>
                    )}

                    {q.type === "select" && q.options && (
                      <div
                        role="group"
                        aria-labelledby={`${q.id}-label`}
                        className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1"
                      >
                        {q.options.map((opt) => (
                          <button
                            type="button"
                            key={opt}
                            aria-pressed={q.value === opt}
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
                        id={q.id}
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
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="survey-inspect-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
        >
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
                <h2
                  id="survey-inspect-title"
                  className="text-lg font-black text-slate-800 flex items-center gap-2 mt-2 leading-tight"
                >
                  <span className="material-symbols-outlined text-2xl text-emerald-600">
                    assignment_turned_in
                  </span>
                  {selectedSurveyToInspect.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedSurveyToInspect(null)}
                aria-label="Cerrar detalle de respuestas"
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
        <div
          role="dialog"
          aria-label="Chat con tu tutor"
          className="fixed bottom-6 right-6 z-50 w-80 bg-white border border-[#e2e8f0] rounded-2xl shadow-2xl flex flex-col h-[400px] animate-fade-in overflow-hidden"
        >
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
              onClick={() => setShowTutorChat(false)}
              aria-label="Cerrar chat"
              className="text-white hover:text-red-200 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-[11px] font-semibold leading-relaxed">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
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
              aria-label="Escribe tu mensaje académico"
              className="flex-1 border border-[#e2e8f0] rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none text-slate-800 placeholder-slate-400 font-semibold"
            />
            <button
              type="submit"
              aria-label="Enviar mensaje"
              disabled={!userMsg.trim()}
              className="bg-brand-primary text-white rounded-xl p-2.5 hover:opacity-90 flex items-center justify-center cursor-pointer active:scale-95 transition-all text-xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-base">send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
