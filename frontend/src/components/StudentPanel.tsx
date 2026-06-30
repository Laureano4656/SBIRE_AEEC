import { useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import StudentSidebar from "./student/Sidebar.tsx";
import StudentTopBar from "./student/TopBar.tsx";
import TrayectoriaView from "./student/TrayectoriaView.tsx";
import EncuestasView from "./student/EncuestasView.tsx";
import type { StudentSurvey } from "./student/EncuestasView.tsx";
import SoporteView from "./student/SoporteView.tsx";
import { useEncuestasPendientes } from "../hooks/queries/useEstudianteQueries.ts";
import { useAuth } from "../hooks/useAuth.ts";

interface StudentPanelProps {
  onLogout: () => void;
}

interface ToastMessage {
  text: string;
  variant: "success" | "error" | "info";
}

interface ChatMessage {
  id: number;
  sender: "user" | "tutor";
  text: string;
  time: string;
}

export default function StudentPanel({ onLogout }: StudentPanelProps) {
  const { pathname } = useLocation();

  //const { user } = useAuth();

  const [estudianteId] = useState(1);

  const { data: encuestasPendientes } = useEncuestasPendientes(estudianteId);

  const [surveys, setSurveys] = useState<StudentSurvey[]>([]);

  useEffect(() => {
    if (!encuestasPendientes) return;
    const mapped: StudentSurvey[] = encuestasPendientes.map((e) => ({
      id: String(e.asignacion_id),
      title: e.nombre_evento,
      description: `Período lectivo ${e.periodo_lectivo}. Completá esta encuesta para ayudar a mejorar tu trayectoria académica.`,
      category: "Encuesta",
      status: "PENDIENTE" as const,
      questions: [],
    }));
    setSurveys(mapped);
  }, [encuestasPendientes]);

  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [showTutorChat, setShowTutorChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 0, sender: "tutor", text: "¡Hola Mateo! Soy tu Tutor Académico asignado (Dr. Juan Pérez). Veo que vienes con un excelente progreso. ¿En qué te puedo asesorar hoy?", time: "12:00" },
  ]);
  const [userMsg, setUserMsg] = useState("");
  const nextMessageId = useRef(1);
  const chatTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (text: string, variant: ToastMessage["variant"] = "info") => {
    setToast({ text, variant });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    return () => {
      if (chatTimeoutRef.current) clearTimeout(chatTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setShowTutorChat(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

    if (chatTimeoutRef.current) clearTimeout(chatTimeoutRef.current);

    chatTimeoutRef.current = setTimeout(() => {
      const lower = trimmed.toLowerCase();
      let responseText =
        "Comprendo tu inquietud. Registré tu consulta académica. Nos vemos el próximo lunes en el horario de tutoría para repasar las opciones de becas y correlatividades.";

      if (lower.includes("hola") || lower.includes("saludo")) {
        responseText = "¡Hola Mateo! Espero que estés muy bien. ¿Tienes alguna duda sobre tus cursos actuales?";
      } else if (lower.includes("dificultad") || lower.includes("complicado") || lower.includes("rendimiento")) {
        responseText = "Entiendo, Mateo. No te preocupes. Recuerda que contamos con clases de apoyo los jueves del Departamento de Ciencias Básicas para Física II y Análisis Matemático II.";
      } else if (lower.includes("entrevista") || lower.includes("reunion") || lower.includes("hablar")) {
        responseText = "Excelente. Te propongo agendar una entrevista de manera presencial. ¿Te queda cómodo el jueves a las 11:00 hs?";
      }

      const tutorMessageId = nextMessageId.current++;
      setChatMessages((prev) => [
        ...prev,
        { id: tutorMessageId, sender: "tutor", text: responseText, time: "Ahora" },
      ]);
    }, 1000);
  };

  const pendingSurveysCount = surveys.filter((s) => s.status === "PENDIENTE").length;

  const title = pathname === "/student" || pathname.startsWith("/student/trayectoria")
    ? "Mi Trayectoria Académica"
    : pathname.startsWith("/student/encuestas")
      ? "Encuestas y Relevamientos"
      : "Soporte y Tutoría";

  return (
    <div className="min-h-screen flex text-slate-800 bg-slate-50 font-sans">
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-5 right-5 z-[60] max-w-sm rounded-xl px-4 py-3 text-xs font-bold shadow-lg flex items-start gap-2 animate-fade-in ${toast.variant === "success"
            ? "bg-emerald-600 text-white"
            : toast.variant === "error"
              ? "bg-red-600 text-white"
              : "bg-slate-800 text-white"
            }`}
        >
          <span className="material-symbols-outlined text-base">
            {toast.variant === "success" ? "check_circle" : toast.variant === "error" ? "error" : "info"}
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

      <StudentSidebar pendingSurveysCount={pendingSurveysCount} studentName="Mateo García" studentCareer="Ing. Industrial" onLogout={onLogout} />

      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        <StudentTopBar title={title} onShowToast={showToast} />

        <main className="p-8 flex-1 space-y-8 overflow-y-auto max-w-7xl w-full mx-auto animate-fade-in">
          <Routes>
            <Route index element={<TrayectoriaView estudianteId={estudianteId} />} />
            <Route path="trayectoria" element={<TrayectoriaView estudianteId={estudianteId} />} />
            <Route
              path="encuestas"
              element={
                <EncuestasView
                  estudianteId={estudianteId}
                  surveys={surveys}
                  onSurveysChange={setSurveys}
                  onShowToast={showToast}
                />
              }
            />
            <Route
              path="soporte"
              element={<SoporteView estudianteId={estudianteId} onOpenChat={() => setShowTutorChat(true)} />}
            />
          </Routes>
        </main>
      </div>

      {showTutorChat && (
        <div
          role="dialog"
          aria-label="Chat con tu tutor"
          className="fixed bottom-6 right-6 z-50 w-80 bg-white border border-[#e2e8f0] rounded-2xl shadow-2xl flex flex-col h-[400px] animate-fade-in overflow-hidden"
        >
          <div className="bg-brand-primary text-white p-4 flex justify-between items-center shadow-xs">
            <div className="flex items-center gap-2">
              <div className="relative">
                <img
                  alt="Dr Juan Perez thumbnail"
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border border-indigo-400"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white" />
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

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-[11px] font-semibold leading-relaxed">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[85%] p-3 rounded-2xl ${msg.sender === "user"
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
