import type { ActiveMenu } from "./types";

interface SidebarProps {
  activeMenu: ActiveMenu;
  pendientes: number;
  alertasActivas: number;
  onMenuChange: (menu: ActiveMenu) => void;
  onLogout: () => void;
}

export default function Sidebar({
  activeMenu,
  pendientes,
  alertasActivas,
  onMenuChange,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-brand-outline-variant flex flex-col fixed left-0 top-0 h-screen z-20">
      <div className="px-6 py-8 border-b border-brand-outline-variant bg-[#f8f9fa]">
        <h1 className="text-2xl font-black text-brand-primary tracking-tight">
          SBIRE
        </h1>
        <p className="text-[10px] text-[#43474f] font-bold uppercase tracking-widest mt-1">
          Panel Tutor
        </p>
      </div>

      <nav className="flex-1 py-6 space-y-1">
        <button
          onClick={() => onMenuChange("intervenciones")}
          className={`w-full flex items-center gap-3 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeMenu === "intervenciones"
              ? "text-brand-primary bg-[#edeeef] border-r-4 border-brand-primary"
              : "text-[#43474f] hover:text-brand-primary hover:bg-[#f3f4f5]"
          }`}
        >
          <span className="material-symbols-outlined text-lg">assignment</span>
          Intervenciones
        </button>

        <button
          onClick={() => onMenuChange("entrevistas")}
          className={`w-full flex items-center gap-3 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeMenu === "entrevistas"
              ? "text-brand-primary bg-[#edeeef] border-r-4 border-brand-primary"
              : "text-[#43474f] hover:text-brand-primary hover:bg-[#f3f4f5]"
          }`}
        >
          <span className="material-symbols-outlined text-lg">event_note</span>
          <span className="flex-1 text-left">Entrevistas</span>
          {pendientes > 0 && (
            <span className="bg-brand-primary text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
              {pendientes}
            </span>
          )}
        </button>

        <button
          onClick={() => onMenuChange("alertas")}
          className={`w-full flex items-center gap-3 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeMenu === "alertas"
              ? "text-brand-primary bg-[#edeeef] border-r-4 border-brand-primary"
              : "text-[#43474f] hover:text-brand-primary hover:bg-[#f3f4f5]"
          }`}
        >
          <span className="material-symbols-outlined text-lg">notifications_active</span>
          <span className="flex-1 text-left">Alertas</span>
          {alertasActivas > 0 && (
            <span className="bg-brand-error text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
              {alertasActivas}
            </span>
          )}
        </button>
      </nav>

      <div className="p-4 border-t border-brand-outline-variant bg-[#f8f9fa] mt-auto">
        <div className="flex items-center gap-3">
          <img
            alt="Tutor avatar"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
            className="w-10 h-10 rounded-full border border-brand-outline-variant object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-xs truncate text-brand-primary">
              Dr. Juan Pérez
            </p>
            <p className="text-[10px] text-[#43474f] font-semibold uppercase tracking-wide">
              Tutor Académico
            </p>
          </div>
          <button
            onClick={onLogout}
            aria-label="Cerrar sesión"
            className="p-1 hover:text-brand-error text-[#43474f] rounded transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
