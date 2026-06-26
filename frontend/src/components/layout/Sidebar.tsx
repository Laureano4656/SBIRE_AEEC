import { useLocation, useNavigate } from "react-router-dom";

interface SidebarProps {
  onLogout: () => void;
}

const menuItems: { key: string; icon: string; label: string }[] = [
  { key: "panel", icon: "dashboard", label: "Panel Institucional" },
  { key: "estudiantes", icon: "groups", label: "Mis Estudiantes" },
  { key: "encuestas", icon: "edit_note", label: "Encuestas" },
  { key: "reportes", icon: "query_stats", label: "Reportes" },
  { key: "configuracion", icon: "settings", label: "Configuración" },
];

export default function Sidebar({ onLogout }: SidebarProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const activeKey = pathname === "/admin" || pathname === "/admin/panel"
    ? "panel"
    : pathname.startsWith("/admin/estudiantes")
      ? "estudiantes"
      : pathname.startsWith("/admin/encuestas")
        ? "encuestas"
        : pathname.startsWith("/admin/reportes")
          ? "reportes"
          : pathname.startsWith("/admin/configuracion")
            ? "configuracion"
            : "panel";

  const isEstudiantesActive = pathname.startsWith("/admin/estudiantes");

  return (
    <aside className="w-64 bg-white border-r border-brand-outline-variant flex flex-col fixed left-0 top-0 h-screen z-20">
      <div className="px-6 py-8 border-b border-brand-outline-variant bg-[#f8f9fa]">
        <h1 className="text-2xl font-black text-brand-primary tracking-tight">
          SBIRE
        </h1>
      </div>

      <nav className="flex-1 py-6 space-y-1">
        {menuItems.map((item) => {
          const isActive =
            item.key === activeKey ||
            (item.key === "estudiantes" && isEstudiantesActive);
          return (
            <button
              key={item.key}
              onClick={() => navigate(`/admin/${item.key}`)}
              className={`w-full flex items-center gap-3 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? "text-brand-primary bg-[#edeeef] border-r-4 border-brand-primary"
                  : "text-[#43474f] hover:text-brand-primary hover:bg-[#f3f4f5]"
              }`}
            >
              <span className="material-symbols-outlined text-[#43474f] text-lg">
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-brand-outline-variant bg-[#f8f9fa] mt-auto">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              alt="Dr. Juan Pérez Avatar"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full border border-brand-outline-variant object-cover shadow-sm"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#006a6a] rounded-full border-2 border-white"></span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-xs truncate text-brand-primary block">
              Dr. Juan Pérez
            </p>
            <p className="text-[10px] text-[#43474f] font-semibold tracking-wide uppercase">
              Tutor Académico
            </p>
          </div>
          <button
            onClick={onLogout}
            title="Cerrar sesión"
            className="p-1 hover:text-brand-error text-[#43474f] rounded transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
