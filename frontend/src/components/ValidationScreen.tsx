import { useEffect, useState } from "react";
import { motion } from "motion/react";
import type { Usuario } from "../contexts/AuthContext";
import CareerSelectionScreen from "./CareerSelectionScreen";
import PendingApprovalScreen from "./PendingApprovalScreen";
import StudentQuestionScreen from "./StudentQuestionScreen";

interface ValidationScreenProps {
  user: Usuario | null;
  onValidated: () => void;
}

const steps = [
  "Estableciendo conexión segura con SIU Guaraní...",
  "Verificando credenciales institucionales...",
  "Validando tipo de usuario...",
  "Cargando datos del sistema...",
  "Accediendo al Sistema Travesía...",
];

function LoadingAnimation({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState(steps[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev < steps.length - 1) {
          setMessage(steps[prev + 1]);
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(onDone, 600);
          return prev;
        }
      });
    }, 800);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div className="fixed inset-0 bg-[#001e40] text-white flex flex-col items-center justify-center font-sans select-none z-50">
      <div className="absolute inset-0 bg-radial from-[#022c5e]/30 to-transparent pointer-events-none" />
      <div className="relative flex flex-col items-center justify-between h-full py-16 px-6 max-w-md w-full">
        <div />
        <div className="flex flex-col items-center gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <div className="relative w-20 h-20 text-white flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-white/5 rounded-full blur-xl"
              />
              <svg
                className="w-16 h-16 relative"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>
            <h1 className="font-bold text-2xl tracking-[0.25em] text-white mt-2">
              SBIRE
            </h1>
            <p className="text-sky-300/40 text-xs tracking-widest uppercase -mt-2 font-mono">
              SISTEMA TRAVESÍA
            </p>
          </motion.div>
          <div className="flex flex-col items-center gap-6 mt-4">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute w-8 h-8 rounded-full border-2 border-white/20" />
              <div className="absolute w-8 h-8 rounded-full border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin duration-1000" />
            </div>
            <div className="h-16 flex items-center justify-center">
              <p className="text-base text-gray-200 font-normal max-w-[320px] text-center tracking-wide leading-relaxed animate-pulse">
                {message}
              </p>
            </div>
          </div>
        </div>
        <p className="text-xs text-white/50 uppercase tracking-[0.2em] font-medium text-center">
          Facultad de Ingeniería UNMdP
        </p>
      </div>
    </div>
  );
}

export default function ValidationScreen({
  user,
  onValidated,
}: ValidationScreenProps) {
  const [phase, setPhase] = useState<"loading" | "question" | "action">(
    "loading",
  );
  const [isStudent, setIsStudent] = useState(false);

  if (!user) {
    onValidated();
    return null;
  }

  const hasCarrera = user.carrera_id !== null;

  if (phase === "loading") {
    return (
      <LoadingAnimation
        onDone={() => {
          if (hasCarrera) {
            onValidated();
          } else {
            setPhase("question");
          }
        }}
      />
    );
  }

  if (phase === "question") {
    return (
      <StudentQuestionScreen
        onAnswer={(answer) => {
          setIsStudent(answer);
          setPhase("action");
        }}
      />
    );
  }

  if (isStudent) {
    return <CareerSelectionScreen onValidated={onValidated} />;
  }

  return <PendingApprovalScreen onValidated={onValidated} />;
}
