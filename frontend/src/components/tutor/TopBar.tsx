import type { ActiveMenu } from "./types";

interface TopBarProps {
  activeMenu: ActiveMenu;
}

export default function TopBar({ activeMenu }: TopBarProps) {
  const title =
    activeMenu === "intervenciones"
      ? "Intervenciones realizadas"
      : activeMenu === "entrevistas"
        ? "Entrevistas y Seguimientos"
        : activeMenu === "alertas"
          ? "Alertas de Riesgo Académico"
          : "Perfil del Estudiante";

  return (
    <header className="bg-white border-b border-brand-outline-variant h-16 flex items-center justify-between px-8 sticky top-0 z-10 shadow-xs">
      <h2 className="text-sm font-black text-brand-primary uppercase tracking-widest">
        {title}
      </h2>

    </header>
  );
}
