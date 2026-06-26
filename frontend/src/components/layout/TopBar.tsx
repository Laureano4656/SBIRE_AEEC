import { useState } from "react";

interface TopBarProps {
  title: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function TopBar({
  title,
  searchQuery,
  onSearchChange,
}: TopBarProps) {
  const [notifications, setNotifications] = useState([
    "Sofía Martínez registró nuevo ausentismo prolongado en Análisis II (14/10/2023)",
    "Mateo Alvarado tiene alertada su inactividad en campus virtual por más de 7 días",
    "Nueva respuesta de encuesta crítica recibida para Ingeniería Industrial",
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white border-b border-brand-outline-variant h-16 flex items-center justify-between px-8 sticky top-0 z-10 shadow-xs">
      <div className="flex items-center">
        <h2 className="text-sm font-black text-brand-primary uppercase tracking-widest">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-64">
          <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-brand-outline text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por DNI, Legajo, Apellido..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-brand-outline rounded bg-[#f3f4f5] text-xs focus:ring-1 focus:ring-brand-primary transition-all"
          />
        </div>

        <nav className="flex gap-4 text-xs font-semibold text-[#43474f]">
          <a
            href="#docs"
            className="hover:text-brand-primary transition-colors"
          >
            Documentación
          </a>
        </nav>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1 overflow-visible hover:text-brand-primary transition-all cursor-pointer text-[#43474f]"
          >
            <span className="material-symbols-outlined text-xl">
              notifications
            </span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-brand-error rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 bg-white border border-brand-outline-variant rounded shadow-xl w-80 p-4 space-y-3 text-xs z-30 animate-fade-in">
              <h4 className="font-bold text-brand-primary border-b border-brand-outline-variant pb-1.5 flex justify-between items-center">
                <span>Notificaciones Sistema</span>
                <button
                  onClick={() => setNotifications([])}
                  className="text-[10px] text-brand-secondary underline hover:opacity-85 font-medium"
                >
                  Limpiar todo
                </button>
              </h4>
              <ul className="space-y-2.5 drop-shadow-xs max-h-60 overflow-y-auto">
                {notifications.map((notif, index) => (
                  <li
                    key={index}
                    className="pb-1.5 border-b border-[#edeeef] last:border-none leading-normal"
                  >
                    • {notif}
                  </li>
                ))}
                {notifications.length === 0 && (
                  <p className="text-center py-4 text-brand-outline">
                    No hay notificaciones sin leer.
                  </p>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
