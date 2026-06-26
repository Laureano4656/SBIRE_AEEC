import { useLocation, useNavigate } from "react-router-dom";

interface SidebarProps {
  pendingSurveysCount: number;
  onLogout: () => void;
}

const menuItems = [
  { key: "trayectoria", icon: "route", label: "Mi Trayectoria" },
  { key: "encuestas", icon: "edit_document", label: "Mis Encuestas" },
  { key: "soporte", icon: "support_agent", label: "Soporte Académico" },
];

export default function Sidebar({ pendingSurveysCount, onLogout }: SidebarProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const activeKey = pathname === "/student" || pathname.startsWith("/student/trayectoria")
    ? "trayectoria"
    : pathname.startsWith("/student/encuestas")
      ? "encuestas"
      : pathname.startsWith("/student/soporte")
        ? "soporte"
        : "trayectoria";

  return (
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
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => navigate(`/student/${item.key}`)}
            aria-pressed={activeKey === item.key}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all rounded-xl cursor-pointer ${
              activeKey === item.key
                ? "text-brand-primary bg-[#eef2ff]"
                : "text-slate-500 hover:text-brand-primary hover:bg-slate-50"
            }`}
          >
            <span className="material-symbols-outlined text-lg">{item.icon}</span>
            <span className="flex-1 text-left">{item.label}</span>
            {item.key === "encuestas" && pendingSurveysCount > 0 && (
              <span className="bg-brand-primary text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                {pendingSurveysCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-[#e2e8f0] bg-slate-50 mt-auto">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              alt="Mateo García Avatar"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full border border-slate-200 object-cover shadow-sm"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10b981] rounded-full border-2 border-white" />
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
  );
}
