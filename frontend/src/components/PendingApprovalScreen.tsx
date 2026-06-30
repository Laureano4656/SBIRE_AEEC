import { useEffect, useState, useCallback } from "react";
import { axiosInstance } from "../libs/axios";
import type { Usuario } from "../contexts/AuthContext";

interface PendingApprovalScreenProps {
  onValidated: () => void;
}

const VALID_ROLES = ["estudiante", "administrador", "admin_departamental", "docente_carga", "docente_tutor", "asesor_par"];

export default function PendingApprovalScreen({
  onValidated,
}: PendingApprovalScreenProps) {
  const [message, setMessage] = useState(
    "Tu cuenta está pendiente de aprobación por un administrador."
  );

  const checkStatus = useCallback(async () => {
    try {
      const res = await axiosInstance.get<Usuario>("/auth/me");
      const user = res.data;
      const hasRole = VALID_ROLES.includes(user.rol);
      if (user.activo && hasRole && user.carrera_id !== null) {
        onValidated();
        return;
      }
    } catch {
      // ignore
    }
  }, [onValidated]);

  useEffect(() => {
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  return (
    <div className="fixed inset-0 bg-[#001e40] text-white flex flex-col items-center justify-center font-sans select-none z-50">
      <div className="absolute inset-0 bg-radial from-[#022c5e]/30 to-transparent pointer-events-none" />

      <div className="relative flex flex-col items-center justify-between h-full py-16 px-6 max-w-md w-full">
        <div />

        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative w-20 h-20 text-white flex items-center justify-center">
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
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
            </div>

            <h1 className="font-bold text-2xl tracking-[0.25em] text-white mt-2">
              SBIRE
            </h1>
            <p className="text-sky-300/40 text-xs tracking-widest uppercase -mt-2 font-mono">
              SISTEMA TRAVESÍA
            </p>
          </div>

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

            <p className="text-xs text-gray-400 text-center max-w-[280px]">
              Un administrador debe asignarte un rol y una carrera para que puedas acceder al sistema.
              Te notificaremos automáticamente cuando esto ocurra.
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs text-white/50 uppercase tracking-[0.2em] font-medium text-center">
            Facultad de Ingeniería UNMdP
          </p>
        </div>
      </div>
    </div>
  );
}
