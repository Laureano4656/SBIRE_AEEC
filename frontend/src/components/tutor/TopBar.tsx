import type { ActiveMenu } from "./types";

interface TopBarProps {
  activeMenu: ActiveMenu;
  onNuevaEntrevista: () => void;
}

export default function TopBar({ activeMenu, onNuevaEntrevista }: TopBarProps) {
  const title =
    activeMenu === "estudiantes"
      ? "Mis Estudiantes Asignados"
      : activeMenu === "entrevistas"
        ? "Entrevistas y Seguimientos"
        : "Alertas de Riesgo Académico";

  return (
    <header className="bg-white border-b border-brand-outline-variant h-16 flex items-center justify-between px-8 sticky top-0 z-10 shadow-xs">
      <h2 className="text-sm font-black text-brand-primary uppercase tracking-widest">
        {title}
      </h2>
      {activeMenu === "entrevistas" && (
        <button
          onClick={onNuevaEntrevista}
          className="flex items-center gap-1.5 bg-brand-primary text-white py-2 px-4 rounded text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Nueva Entrevista
        </button>
      )}
    </header>
  );
}
