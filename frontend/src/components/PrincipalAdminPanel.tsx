import { useState, type FormEvent } from "react";
import type { Student } from "../types.ts";

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: "SUPER_ADMIN" | "ADMIN_DEPARTAMENTAL" | "TUTOR";
  carrerasAsignadas: string[];
  activo: boolean;
}

interface UmbralSemafaro {
  carrera: string;
  etapa: "INICIAL" | "MEDIO" | "AVANZADO";
  criticoDesde: number;
  medioDesde: number;
  seguroHasta: number;
}

interface LogAuditoria {
  id: string;
  fecha: string;
  usuario: string;
  tipo: "IMPORTACION" | "RECALCULO" | "CONFIGURACION";
  registros: number;
  errores: number;
  detalle: string;
}

interface PrincipalAdminPanelProps {
  students: Student[];
  onLogout: () => void;
}

type ActiveMenu = "panel" | "carreras" | "usuarios" | "reportes" | "configuracion";

const CARRERAS = [
  "Ingeniería en Informática",
  "Ingeniería Industrial",
] as const;

const USUARIOS_MOCK: Usuario[] = [
  {
    id: "u1",
    nombre: "Dr. Juan Pérez",
    email: "j.perez@fi.mdp.edu.ar",
    rol: "SUPER_ADMIN",
    carrerasAsignadas: ["Ingeniería en Informática", "Ingeniería Industrial"],
    activo: true,
  },
  {
    id: "u2",
    nombre: "Lic. María García",
    email: "m.garcia@fi.mdp.edu.ar",
    rol: "ADMIN_DEPARTAMENTAL",
    carrerasAsignadas: ["Ingeniería Industrial"],
    activo: true,
  },
  {
    id: "u3",
    nombre: "Prof. Carlos López",
    email: "c.lopez@fi.mdp.edu.ar",
    rol: "TUTOR",
    carrerasAsignadas: ["Ingeniería en Informática"],
    activo: true,
  },
  {
    id: "u4",
    nombre: "Lic. Ana Martínez",
    email: "a.martinez@fi.mdp.edu.ar",
    rol: "TUTOR",
    carrerasAsignadas: ["Ingeniería Industrial"],
    activo: false,
  },
];

const UMBRALES_MOCK: UmbralSemafaro[] = [
  { carrera: "Ingeniería en Informática", etapa: "INICIAL", criticoDesde: 7, medioDesde: 4, seguroHasta: 2 },
  { carrera: "Ingeniería en Informática", etapa: "MEDIO", criticoDesde: 6.5, medioDesde: 3.5, seguroHasta: 1.5 },
  { carrera: "Ingeniería en Informática", etapa: "AVANZADO", criticoDesde: 6, medioDesde: 3, seguroHasta: 1 },
  { carrera: "Ingeniería Industrial", etapa: "INICIAL", criticoDesde: 7, medioDesde: 4, seguroHasta: 2 },
  { carrera: "Ingeniería Industrial", etapa: "MEDIO", criticoDesde: 6.5, medioDesde: 3.5, seguroHasta: 1.5 },
  { carrera: "Ingeniería Industrial", etapa: "AVANZADO", criticoDesde: 6, medioDesde: 3, seguroHasta: 1 },
];

const LOGS_MOCK: LogAuditoria[] = [
  { id: "l1", fecha: "22/06/2026 10:30", usuario: "Dr. Juan Pérez", tipo: "IMPORTACION", registros: 45, errores: 2, detalle: "Importación de estudiantes - Ing. Informática" },
  { id: "l2", fecha: "21/06/2026 15:15", usuario: "Lic. María García", tipo: "IMPORTACION", registros: 38, errores: 0, detalle: "Importación de estudiantes - Ing. Industrial" },
  { id: "l3", fecha: "20/06/2026 09:00", usuario: "Dr. Juan Pérez", tipo: "RECALCULO", registros: 83, errores: 0, detalle: "Recálculo forzado de indicadores" },
  { id: "l4", fecha: "18/06/2026 14:45", usuario: "Dr. Juan Pérez", tipo: "CONFIGURACION", registros: 0, errores: 0, detalle: "Actualización de umbrales - Ing. Industrial" },
];

const INITIAL_MAX_CASOS = 15;

export default function PrincipalAdminPanel({
  students,
  onLogout,
}: PrincipalAdminPanelProps) {
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>("panel");
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);

  const [usuarios, setUsuarios] = useState<Usuario[]>(USUARIOS_MOCK);
  const [umbrales, setUmbrales] = useState<UmbralSemafaro[]>(UMBRALES_MOCK);
  const [logs, setLogs] = useState<LogAuditoria[]>(LOGS_MOCK);
  const [maxCasosActivos, setMaxCasosActivos] = useState(INITIAL_MAX_CASOS);

  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [userForm, setUserForm] = useState({
    nombre: "",
    email: "",
    rol: "TUTOR" as Usuario["rol"],
    carrerasAsignadas: [] as string[],
    activo: true,
  });

  const [umbralEditando, setUmbralEditando] = useState<{
    carrera: string;
    etapa: UmbralSemafaro["etapa"];
  } | null>(null);
  const [umbralForm, setUmbralForm] = useState({
    criticoDesde: 0,
    medioDesde: 0,
    seguroHasta: 0,
  });

  const [recalculando, setRecalculando] = useState(false);
  const [logFilter, setLogFilter] = useState<"TODOS" | LogAuditoria["tipo"]>("TODOS");

  const [searchQuery, setSearchQuery] = useState("");

  const estudiantesPorCarrera = CARRERAS.map((carrera) => {
    const ests = students.filter((s) => s.career === carrera);
    const criticos = ests.filter((s) => s.riskLevel === "CRÍTICO").length;
    const medios = ests.filter((s) => s.riskLevel === "MEDIO").length;
    const bajos = ests.filter((s) => s.riskLevel === "BAJO" || s.riskLevel === "SEGURO").length;
    const riesgoPromedio =
      ests.length > 0
        ? ests.reduce((sum, s) => sum + s.riskValue, 0) / ests.length
        : 0;
    const engagementPromedio =
      ests.length > 0
        ? ests.reduce((sum, s) => {
            const val = s.engagement === "Alto" ? 3 : s.engagement === "Medio" ? 2 : 1;
            return sum + val;
          }, 0) / ests.length
        : 0;
    const alertasActivas = ests.filter(
      (s) => s.statusAlerta !== "SIN ALERTA",
    ).length;
    return {
      carrera,
      total: ests.length,
      criticos,
      medios,
      bajos,
      riesgoPromedio: Math.round(riesgoPromedio * 100) / 100,
      engagementPromedio: Math.round(engagementPromedio * 100) / 100,
      alertasActivas,
    };
  });

  const totalEstudiantes = students.length;
  const totalCriticos = students.filter((s) => s.riskLevel === "CRÍTICO").length;
  const totalAlertasActivas = students.filter(
    (s) => s.statusAlerta !== "SIN ALERTA",
  ).length;
  const totalAlertasNuevas = students.filter(
    (s) => s.statusAlerta === "NUEVA",
  ).length;
  const usuariosActivos = usuarios.filter((u) => u.activo).length;

  const filteredLogs =
    logFilter === "TODOS"
      ? logs
      : logs.filter((l) => l.tipo === logFilter);

  const filteredUsuarios = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAbrirNuevoUsuario = () => {
    setEditingUser(null);
    setUserForm({
      nombre: "",
      email: "",
      rol: "TUTOR",
      carrerasAsignadas: [],
      activo: true,
    });
    setShowUserModal(true);
  };

  const handleEditarUsuario = (user: Usuario) => {
    setEditingUser(user);
    setUserForm({
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      carrerasAsignadas: [...user.carrerasAsignadas],
      activo: user.activo,
    });
    setShowUserModal(true);
  };

  const handleGuardarUsuario = (e: FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, ...userForm, id: u.id }
            : u,
        ),
      );
    } else {
      const nuevo: Usuario = {
        id: "u_" + Date.now(),
        ...userForm,
      };
      setUsuarios([nuevo, ...usuarios]);
    }
    setShowUserModal(false);
    setEditingUser(null);
  };

  const handleToggleActivo = (id: string) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, activo: !u.activo } : u)),
    );
  };

  const handleAbrirUmbral = (carrera: string, etapa: UmbralSemafaro["etapa"]) => {
    const actual = umbrales.find(
      (u) => u.carrera === carrera && u.etapa === etapa,
    );
    if (actual) {
      setUmbralForm({
        criticoDesde: actual.criticoDesde,
        medioDesde: actual.medioDesde,
        seguroHasta: actual.seguroHasta,
      });
    }
    setUmbralEditando({ carrera, etapa });
  };

  const handleGuardarUmbral = (e: FormEvent) => {
    e.preventDefault();
    if (!umbralEditando) return;
    setUmbrales((prev) =>
      prev.map((u) =>
        u.carrera === umbralEditando.carrera && u.etapa === umbralEditando.etapa
          ? { ...u, ...umbralForm }
          : u,
      ),
    );
    setUmbralEditando(null);
  };

  const handleRecalcular = () => {
    setRecalculando(true);
    setTimeout(() => {
      const ahora = new Date();
      const fecha = ahora.toLocaleDateString("es-AR") + " " + ahora.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
      const nuevoLog: LogAuditoria = {
        id: "l_" + Date.now(),
        fecha,
        usuario: "Dr. Juan Pérez",
        tipo: "RECALCULO",
        registros: students.length,
        errores: 0,
        detalle: "Recálculo forzado de indicadores - todos los estudiantes",
      };
      setLogs([nuevoLog, ...logs]);
      setRecalculando(false);
    }, 1500);
  };

  const toggleCarreraUsuario = (carrera: string) => {
    setUserForm((f) => ({
      ...f,
      carrerasAsignadas: f.carrerasAsignadas.includes(carrera)
        ? f.carrerasAsignadas.filter((c) => c !== carrera)
        : [...f.carrerasAsignadas, carrera],
    }));
  };

  const rolBadge = (rol: Usuario["rol"]) => {
    switch (rol) {
      case "SUPER_ADMIN":
        return (
          <span className="bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded text-[10px] font-bold">
            Super Admin
          </span>
        );
      case "ADMIN_DEPARTAMENTAL":
        return (
          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">
            Admin Dptal.
          </span>
        );
      case "TUTOR":
        return (
          <span className="bg-[#eef2ff] text-brand-primary px-2 py-0.5 rounded text-[10px] font-bold">
            Tutor
          </span>
        );
    }
  };

  const riskBadge = (level: string) => {
    switch (level) {
      case "CRÍTICO":
        return (
          <span className="bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#ba1a1a] rounded-full animate-pulse" />
            CRÍTICO
          </span>
        );
      case "MEDIO":
        return (
          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
            MEDIO
          </span>
        );
      default:
        return (
          <span className="bg-[#e2f3f5] text-[#006e6e] px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#006a6a] rounded-full" />
            BAJO/SEGURO
          </span>
        );
    }
  };

  const logTipoBadge = (tipo: LogAuditoria["tipo"]) => {
    switch (tipo) {
      case "IMPORTACION":
        return (
          <span className="bg-[#eef2ff] text-brand-primary px-2 py-0.5 rounded text-[10px] font-bold">
            IMPORTACIÓN
          </span>
        );
      case "RECALCULO":
        return (
          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">
            RECÁLCULO
          </span>
        );
      case "CONFIGURACION":
        return (
          <span className="bg-[#e2f3f5] text-[#006e6e] px-2 py-0.5 rounded text-[10px] font-bold">
            CONFIGURACIÓN
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex text-[#191c1d] bg-[#f8f9fa]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-brand-outline-variant flex flex-col fixed left-0 top-0 h-screen z-20">
        <div className="px-6 py-8 border-b border-brand-outline-variant bg-[#f8f9fa]">
          <h1 className="text-2xl font-black text-brand-primary tracking-tight">
            SBIRE
          </h1>
          <p className="text-[10px] text-[#43474f] font-bold uppercase tracking-widest mt-1">
            Admin Principal
          </p>
        </div>

        <nav className="flex-1 py-6 space-y-1">
          {([
            { key: "panel" as const, icon: "dashboard", label: "Panel General" },
            { key: "carreras" as const, icon: "school", label: "Carreras" },
            { key: "usuarios" as const, icon: "manage_accounts", label: "Usuarios" },
            { key: "reportes" as const, icon: "query_stats", label: "Reportes" },
            { key: "configuracion" as const, icon: "settings", label: "Configuración" },
          ]).map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveMenu(item.key);
                setSelectedCareer(null);
              }}
              className={`w-full flex items-center gap-3 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeMenu === item.key
                  ? "text-brand-primary bg-[#edeeef] border-r-4 border-brand-primary"
                  : "text-[#43474f] hover:text-brand-primary hover:bg-[#f3f4f5]"
              }`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-brand-outline-variant bg-[#f8f9fa] mt-auto">
          <div className="flex items-center gap-3">
            <img
              alt="Super Admin avatar"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
              className="w-10 h-10 rounded-full border border-brand-outline-variant object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-xs truncate text-brand-primary">
                Dr. Juan Pérez
              </p>
              <p className="text-[10px] text-[#43474f] font-semibold uppercase tracking-wide">
                Super Admin
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

      {/* Main */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        <header className="bg-white border-b border-brand-outline-variant h-16 flex items-center justify-between px-8 sticky top-0 z-10 shadow-xs">
          <h2 className="text-sm font-black text-brand-primary uppercase tracking-widest">
            {activeMenu === "panel"
              ? "Panel General de Control"
              : activeMenu === "carreras"
                ? selectedCareer ? selectedCareer : "Gestión de Carreras"
                : activeMenu === "usuarios"
                  ? "Gestión de Usuarios"
                  : activeMenu === "reportes"
                    ? "Reportes Globales"
                    : "Configuración del Sistema"}
          </h2>
          {activeMenu === "usuarios" && (
            <button
              onClick={handleAbrirNuevoUsuario}
              className="flex items-center gap-1.5 bg-brand-primary text-white py-2 px-4 rounded text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Nuevo Usuario
            </button>
          )}
        </header>

        <main className="p-8 flex-1 space-y-6 max-w-6xl w-full mx-auto">
          {/* ── PANEL GENERAL ── */}
          {activeMenu === "panel" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
                  <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                    TOTAL ESTUDIANTES
                  </span>
                  <span className="text-3xl font-black text-brand-primary mt-1 block">
                    {totalEstudiantes}
                  </span>
                  <p className="text-[10px] text-brand-outline mt-1 font-medium">
                    en {CARRERAS.length} carreras
                  </p>
                </div>
                <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
                  <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                    RIESGO CRÍTICO
                  </span>
                  <span className="text-3xl font-black text-brand-error mt-1 block">
                    {totalCriticos}
                  </span>
                  <p className="text-[10px] text-brand-outline mt-1 font-medium">
                    {totalEstudiantes > 0
                      ? Math.round((totalCriticos / totalEstudiantes) * 100)
                      : 0}% del total
                  </p>
                </div>
                <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
                  <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                    ALERTAS ACTIVAS
                  </span>
                  <span className="text-3xl font-black text-amber-600 mt-1 block">
                    {totalAlertasActivas}
                  </span>
                  <p className="text-[10px] text-brand-outline mt-1 font-medium">
                    {totalAlertasNuevas} nuevas sin revisar
                  </p>
                </div>
                <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
                  <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                    USUARIOS ACTIVOS
                  </span>
                  <span className="text-3xl font-black text-[#006a6a] mt-1 block">
                    {usuariosActivos}
                  </span>
                  <p className="text-[10px] text-brand-outline mt-1 font-medium">
                    de {usuarios.length} registrados
                  </p>
                </div>
              </div>

              <div className="bg-white border border-brand-outline-variant rounded shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-brand-outline-variant bg-[#f8f9fa]">
                  <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-lg">school</span>
                    Distribución por Carrera
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#edeeef] text-[#43474f] font-bold uppercase tracking-wider">
                        <th className="p-3 pl-5 text-left border-b border-brand-outline-variant">Carrera</th>
                        <th className="p-3 text-center border-b border-brand-outline-variant">Total</th>
                        <th className="p-3 text-center border-b border-brand-outline-variant">Crítico</th>
                        <th className="p-3 text-center border-b border-brand-outline-variant">Medio</th>
                        <th className="p-3 text-center border-b border-brand-outline-variant">Bajo/Seguro</th>
                        <th className="p-3 text-center border-b border-brand-outline-variant">Riesgo Prom.</th>
                        <th className="p-3 text-center border-b border-brand-outline-variant">Alertas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-outline-variant">
                      {estudiantesPorCarrera.map((ec) => (
                        <tr key={ec.carrera} className="hover:bg-[#f8f9fa] transition-colors">
                          <td className="p-3 pl-5 font-bold text-brand-primary">{ec.carrera}</td>
                          <td className="p-3 text-center font-bold">{ec.total}</td>
                          <td className="p-3 text-center">
                            <span className="text-[#ba1a1a] font-bold">{ec.criticos}</span>
                          </td>
                          <td className="p-3 text-center">
                            <span className="text-amber-600 font-bold">{ec.medios}</span>
                          </td>
                          <td className="p-3 text-center">
                            <span className="text-[#006e6e] font-bold">{ec.bajos}</span>
                          </td>
                          <td className="p-3 text-center font-bold">{ec.riesgoPromedio.toFixed(2)}</td>
                          <td className="p-3 text-center">
                            {ec.alertasActivas > 0 ? (
                              <span className="bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded text-[10px] font-bold">
                                {ec.alertasActivas}
                              </span>
                            ) : (
                              <span className="text-brand-outline font-semibold">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
                    <span className="material-symbols-outlined text-2xl">notifications_active</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                      NUEVAS
                    </span>
                    <span className="text-2xl font-extrabold text-[#ba1a1a]">{totalAlertasNuevas}</span>
                  </div>
                </div>
                <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                    <span className="material-symbols-outlined text-2xl">pending_actions</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                      EN REVISIÓN
                    </span>
                    <span className="text-2xl font-extrabold text-amber-600">
                      {students.filter((s) => s.statusAlerta === "EN REVISIÓN").length}
                    </span>
                  </div>
                </div>
                <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#e2f3f5] flex items-center justify-center text-[#006a6a]">
                    <span className="material-symbols-outlined text-2xl">check_circle</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                      INTERVENIDAS
                    </span>
                    <span className="text-2xl font-extrabold text-[#006a6a]">
                      {students.filter((s) => s.statusAlerta === "INTERVENIDA").length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── CARRERAS ── */}
          {activeMenu === "carreras" && (
            <div className="space-y-6 animate-fade-in">
              {selectedCareer ? (
                <div>
                  <button
                    onClick={() => setSelectedCareer(null)}
                    className="text-[11px] font-bold text-brand-primary hover:underline mb-4 flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Volver a todas las carreras
                  </button>

                  <div className="bg-white border border-brand-outline-variant rounded shadow-xs overflow-hidden">
                    <div className="px-6 py-4 border-b border-brand-outline-variant bg-[#f8f9fa]">
                      <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-lg">tune</span>
                        Umbrales del Semáforo — {selectedCareer}
                      </h4>
                    </div>
                    <div className="p-6 space-y-4">
                      {(["INICIAL", "MEDIO", "AVANZADO"] as const).map((etapa) => {
                        const umbral = umbrales.find(
                          (u) => u.carrera === selectedCareer && u.etapa === etapa,
                        );
                        return (
                          <div
                            key={etapa}
                            className="flex items-center justify-between p-3 bg-[#f8f9fa] rounded border border-brand-outline-variant"
                          >
                            <div>
                              <span className="font-bold text-xs text-brand-primary">
                                Tramo {etapa}
                              </span>
                              <div className="text-[10px] text-[#43474f] mt-0.5">
                                Crítico desde {umbral?.criticoDesde} | Medio desde {umbral?.medioDesde} | Seguro hasta {umbral?.seguroHasta}
                              </div>
                            </div>
                            <button
                              onClick={() => handleAbrirUmbral(selectedCareer, etapa)}
                              className="text-[10px] font-bold text-brand-primary border border-brand-primary/30 bg-[#eef2ff] hover:bg-[#dde3fb] px-3 py-1.5 rounded transition-all cursor-pointer"
                            >
                              Editar
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white border border-brand-outline-variant rounded shadow-xs overflow-hidden mt-6">
                    <div className="px-6 py-4 border-b border-brand-outline-variant bg-[#f8f9fa]">
                      <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-lg">groups</span>
                        Estudiantes — {selectedCareer}
                      </h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#edeeef] text-[#43474f] font-bold uppercase tracking-wider">
                            <th className="p-3 pl-5 text-left border-b border-brand-outline-variant">Estudiante</th>
                            <th className="p-3 text-center border-b border-brand-outline-variant">Tramo</th>
                            <th className="p-3 text-center border-b border-brand-outline-variant">Riesgo</th>
                            <th className="p-3 text-center border-b border-brand-outline-variant">Nivel</th>
                            <th className="p-3 text-center border-b border-brand-outline-variant">Alerta</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-outline-variant">
                          {students
                            .filter((s) => s.career === selectedCareer)
                            .map((s) => (
                              <tr key={s.id} className="hover:bg-[#f8f9fa] transition-colors">
                                <td className="p-3 pl-5 font-bold text-brand-primary">
                                  {s.lastNames}, {s.firstNames}
                                </td>
                                <td className="p-3 text-center">
                                  <span className="bg-[#edeeef] text-[#43474f] px-2 py-0.5 rounded text-[10px] font-bold">
                                    TRAMO {s.tramo}
                                  </span>
                                </td>
                                <td className="p-3 text-center font-bold">{s.riskValue.toFixed(2)}</td>
                                <td className="p-3 text-center">{riskBadge(s.riskLevel)}</td>
                                <td className="p-3 text-center">{s.statusAlerta}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {estudiantesPorCarrera.map((ec) => (
                    <div
                      key={ec.carrera}
                      className="bg-white border border-brand-outline-variant rounded p-6 shadow-xs hover:shadow-md transition-all cursor-pointer"
                      onClick={() => setSelectedCareer(ec.carrera)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-brand-primary text-sm">{ec.carrera}</h4>
                        <span className="material-symbols-outlined text-brand-outline text-lg">
                          chevron_right
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                            Estudiantes
                          </span>
                          <span className="text-2xl font-black text-brand-primary">{ec.total}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                            Riesgo Prom.
                          </span>
                          <span className="text-2xl font-black text-amber-600">{ec.riesgoPromedio.toFixed(1)}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                            Críticos
                          </span>
                          <span className="text-2xl font-black text-brand-error">{ec.criticos}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                            Alertas
                          </span>
                          <span className="text-2xl font-black text-amber-600">{ec.alertasActivas}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-1.5">
                        <div
                          className="h-2 rounded-full bg-[#ba1a1a]"
                          style={{ width: `${ec.total > 0 ? (ec.criticos / ec.total) * 100 : 0}%` }}
                        />
                        <div
                          className="h-2 rounded-full bg-amber-500"
                          style={{ width: `${ec.total > 0 ? (ec.medios / ec.total) * 100 : 0}%` }}
                        />
                        <div
                          className="h-2 rounded-full bg-[#006a6a]"
                          style={{ width: `${ec.total > 0 ? (ec.bajos / ec.total) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── USUARIOS ── */}
          {activeMenu === "usuarios" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
                  <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                    TOTAL USUARIOS
                  </span>
                  <span className="text-3xl font-black text-brand-primary mt-1 block">
                    {usuarios.length}
                  </span>
                </div>
                <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
                  <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                    ACTIVOS
                  </span>
                  <span className="text-3xl font-black text-[#006a6a] mt-1 block">
                    {usuariosActivos}
                  </span>
                </div>
                <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
                  <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                    TUTORES
                  </span>
                  <span className="text-3xl font-black text-brand-primary mt-1 block">
                    {usuarios.filter((u) => u.rol === "TUTOR").length}
                  </span>
                  <p className="text-[10px] text-brand-outline mt-1 font-medium">
                    Máx. {maxCasosActivos} casos activos c/u
                  </p>
                </div>
              </div>

              <div className="bg-white border border-brand-outline-variant rounded shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-brand-outline-variant bg-[#f8f9fa]">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-lg">manage_accounts</span>
                      Usuarios del Sistema
                    </h4>
                    <div className="relative w-56">
                      <span className="material-symbols-outlined absolute left-2.5 top-1.5 text-brand-outline text-lg">
                        search
                      </span>
                      <input
                        type="text"
                        placeholder="Buscar usuario..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1 border border-brand-outline-variant rounded bg-[#f3f4f5] text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-brand-outline-variant">
                  {filteredUsuarios.map((u) => (
                    <div
                      key={u.id}
                      className="p-5 hover:bg-[#f8f9fa] transition-colors flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-brand-primary">{u.nombre}</span>
                          {rolBadge(u.rol)}
                          {!u.activo && (
                            <span className="bg-[#f3f4f5] text-[#43474f] px-2 py-0.5 rounded text-[10px] font-bold">
                              Inactivo
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-brand-outline font-semibold">{u.email}</p>
                        <p className="text-[10px] text-[#43474f]">
                          Carreras: {u.carrerasAsignadas.join(", ")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleActivo(u.id)}
                          className={`text-[10px] font-bold px-3 py-1.5 rounded transition-all whitespace-nowrap cursor-pointer ${
                            u.activo
                              ? "text-[#93000a] border border-[#ffdad6] bg-[#ffdad6] hover:bg-[#ffc6c1]"
                              : "text-[#006a6a] border border-[#006a6a]/30 bg-[#e2f3f5] hover:bg-[#c8eeee]"
                          }`}
                        >
                          {u.activo ? "Desactivar" : "Activar"}
                        </button>
                        <button
                          onClick={() => handleEditarUsuario(u)}
                          className="text-[10px] font-bold text-brand-primary border border-brand-primary/30 bg-[#eef2ff] hover:bg-[#dde3fb] px-3 py-1.5 rounded transition-all cursor-pointer"
                        >
                          Editar
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredUsuarios.length === 0 && (
                    <div className="p-12 text-center text-brand-outline font-medium text-xs">
                      No se encontraron usuarios.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── REPORTES GLOBALES ── */}
          {activeMenu === "reportes" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
                  <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1.5 mb-4">
                    <span className="material-symbols-outlined text-lg">monitoring</span>
                    Riesgo Promedio por Carrera
                  </h4>
                  <div className="space-y-3">
                    {estudiantesPorCarrera.map((ec) => {
                      const maxRiesgo = 10;
                      const pct = (ec.riesgoPromedio / maxRiesgo) * 100;
                      return (
                        <div key={ec.carrera}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold text-[#43474f]">{ec.carrera}</span>
                            <span className="font-bold">{ec.riesgoPromedio.toFixed(2)} / 10</span>
                          </div>
                          <div className="h-3 bg-[#edeeef] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                ec.riesgoPromedio >= 7
                                  ? "bg-[#ba1a1a]"
                                  : ec.riesgoPromedio >= 4
                                    ? "bg-amber-500"
                                    : "bg-[#006a6a]"
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
                  <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1.5 mb-4">
                    <span className="material-symbols-outlined text-lg">sentiment_satisfied</span>
                    Engagement Promedio por Carrera
                  </h4>
                  <div className="space-y-3">
                    {estudiantesPorCarrera.map((ec) => {
                      const maxEngagement = 3;
                      const pct = (ec.engagementPromedio / maxEngagement) * 100;
                      return (
                        <div key={ec.carrera}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold text-[#43474f]">{ec.carrera}</span>
                            <span className="font-bold">
                              {ec.engagementPromedio <= 1.5
                                ? "Bajo"
                                : ec.engagementPromedio <= 2.5
                                  ? "Medio"
                                  : "Alto"}
                            </span>
                          </div>
                          <div className="h-3 bg-[#edeeef] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-brand-primary transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
                  <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1.5 mb-4">
                    <span className="material-symbols-outlined text-lg">notifications</span>
                    Alertas por Carrera
                  </h4>
                  <div className="space-y-3">
                    {estudiantesPorCarrera.map((ec) => (
                      <div key={ec.carrera} className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#43474f]">{ec.carrera}</span>
                        <div className="flex gap-2">
                          <span className="text-[#ba1a1a] font-bold">
                            {students.filter(
                              (s) => s.career === ec.carrera && s.statusAlerta === "NUEVA",
                            ).length}{" "}
                            nuevas
                          </span>
                          <span className="text-amber-600 font-bold">
                            {students.filter(
                              (s) =>
                                s.career === ec.carrera &&
                                s.statusAlerta === "EN REVISIÓN",
                            ).length}{" "}
                            revisión
                          </span>
                          <span className="text-[#006a6a] font-bold">
                            {students.filter(
                              (s) =>
                                s.career === ec.carrera &&
                                s.statusAlerta === "INTERVENIDA",
                            ).length}{" "}
                            intervenidas
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
                  <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1.5 mb-4">
                    <span className="material-symbols-outlined text-lg">layers</span>
                    Estudiantes por Tramo
                  </h4>
                  <div className="space-y-3">
                    {(["INICIAL", "MEDIO", "AVANZADO"] as const).map((tramo) => {
                      const count = students.filter((s) => s.tramo === tramo).length;
                      const pct = students.length > 0 ? (count / students.length) * 100 : 0;
                      return (
                        <div key={tramo}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold text-[#43474f]">Tramo {tramo}</span>
                            <span className="font-bold">
                              {count} ({Math.round(pct)}%)
                            </span>
                          </div>
                          <div className="h-3 bg-[#edeeef] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-brand-secondary transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── CONFIGURACIÓN ── */}
          {activeMenu === "configuracion" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white border border-brand-outline-variant rounded p-6 shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-lg">refresh</span>
                      Recálculo Manual de Indicadores
                    </h4>
                    <p className="text-[11px] text-[#43474f] mt-1">
                      Forzar el recálculo de todos los indicadores de riesgo para todos los
                      estudiantes del sistema.
                    </p>
                  </div>
                  <button
                    onClick={handleRecalcular}
                    disabled={recalculando}
                    className={`flex items-center gap-1.5 px-5 py-2 rounded text-xs font-bold transition-all cursor-pointer ${
                      recalculando
                        ? "bg-[#edeeef] text-[#43474f] cursor-not-allowed"
                        : "bg-brand-primary text-white hover:opacity-90"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-base ${
                        recalculando ? "animate-spin" : ""
                      }`}
                    >
                      {recalculando ? "progress_activity" : "play_arrow"}
                    </span>
                    {recalculando ? "Recalculando..." : "Recalcular Ahora"}
                  </button>
                </div>
              </div>

              <div className="bg-white border border-brand-outline-variant rounded p-6 shadow-xs">
                <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1.5 mb-3">
                  <span className="material-symbols-outlined text-lg">group_work</span>
                  Límite de Casos por Tutor
                </h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setMaxCasosActivos((v) => Math.max(1, v - 1))
                      }
                      className="w-8 h-8 rounded border border-brand-outline-variant flex items-center justify-center text-sm font-bold hover:bg-[#f3f4f5] cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-2xl font-black text-brand-primary w-12 text-center">
                      {maxCasosActivos}
                    </span>
                    <button
                      onClick={() => setMaxCasosActivos((v) => Math.min(50, v + 1))}
                      className="w-8 h-8 rounded border border-brand-outline-variant flex items-center justify-center text-sm font-bold hover:bg-[#f3f4f5] cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] text-[#43474f] font-medium">
                    casos activos máximos por tutor
                  </span>
                </div>
              </div>

              <div className="bg-white border border-brand-outline-variant rounded shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-brand-outline-variant bg-[#f8f9fa] flex items-center justify-between">
                  <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-lg">history</span>
                    Log de Auditoría
                  </h4>
                  <div className="flex border border-brand-outline-variant rounded overflow-hidden">
                    {(["TODOS", "IMPORTACION", "RECALCULO", "CONFIGURACION"] as const).map(
                      (f) => (
                        <button
                          key={f}
                          onClick={() => setLogFilter(f)}
                          className={`px-2.5 py-1 text-[10px] font-bold cursor-pointer border-l first:border-l-0 border-brand-outline-variant transition-colors ${
                            logFilter === f
                              ? "bg-brand-primary text-white"
                              : "bg-white text-brand-primary hover:bg-[#f3f4f5]"
                          }`}
                        >
                          {f === "TODOS" ? "TODOS" : f === "IMPORTACION" ? "IMPORTACIÓN" : f === "RECALCULO" ? "RECÁLCULO" : "CONFIG."}
                        </button>
                      ),
                    )}
                  </div>
                </div>
                <div className="divide-y divide-brand-outline-variant">
                  {filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 hover:bg-[#f8f9fa] transition-colors flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-brand-primary">
                            {log.usuario}
                          </span>
                          {logTipoBadge(log.tipo)}
                        </div>
                        <p className="text-[11px] text-[#43474f]">{log.detalle}</p>
                        <p className="text-[10px] text-brand-outline font-semibold">{log.fecha}</p>
                      </div>
                      <div className="text-right text-[10px]">
                        {log.tipo !== "CONFIGURACION" && (
                          <>
                            <p className="font-bold text-[#43474f]">{log.registros} registros</p>
                            {log.errores > 0 && (
                              <p className="text-[#ba1a1a] font-bold">{log.errores} errores</p>
                            )}
                            {log.errores === 0 && (
                              <p className="text-[#006a6a]">sin errores</p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  {filteredLogs.length === 0 && (
                    <div className="p-12 text-center text-brand-outline font-medium text-xs">
                      No hay registros de auditoría.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal Usuario */}
      {showUserModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="user-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191c1d]/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="bg-white border border-brand-outline-variant rounded shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-brand-outline-variant pb-3">
              <h2
                id="user-modal-title"
                className="text-base font-bold text-brand-primary flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-xl">
                  {editingUser ? "edit" : "person_add"}
                </span>
                {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
              </h2>
              <button
                onClick={() => { setShowUserModal(false); setEditingUser(null); }}
                aria-label="Cerrar"
                className="text-brand-outline hover:text-brand-error cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleGuardarUsuario} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                  Nombre completo
                </label>
                <input
                  required
                  type="text"
                  value={userForm.nombre}
                  onChange={(e) => setUserForm((f) => ({ ...f, nombre: e.target.value }))}
                  placeholder="Ej: Lic. María García"
                  className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="email@fi.mdp.edu.ar"
                  className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                  Rol
                </label>
                <select
                  value={userForm.rol}
                  onChange={(e) =>
                    setUserForm((f) => ({
                      ...f,
                      rol: e.target.value as Usuario["rol"],
                    }))
                  }
                  className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                >
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="ADMIN_DEPARTAMENTAL">Admin Departamental</option>
                  <option value="TUTOR">Tutor</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-2">
                  Carreras asignadas
                </label>
                <div className="space-y-2">
                  {CARRERAS.map((c) => (
                    <label
                      key={c}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={userForm.carrerasAsignadas.includes(c)}
                        onChange={() => toggleCarreraUsuario(c)}
                        className="accent-brand-primary"
                      />
                      <span className="text-xs font-medium text-[#43474f]">{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userForm.activo}
                  onChange={(e) =>
                    setUserForm((f) => ({ ...f, activo: e.target.checked }))
                  }
                  className="accent-brand-primary"
                />
                <span className="text-xs font-medium text-[#43474f]">Cuenta activa</span>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowUserModal(false); setEditingUser(null); }}
                  className="px-4 py-2 border border-brand-outline-variant text-[#43474f] rounded text-xs font-semibold hover:bg-[#edeeef] transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-primary text-white rounded text-xs font-bold hover:opacity-90 transition-all"
                >
                  {editingUser ? "Guardar Cambios" : "Crear Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Umbral */}
      {umbralEditando && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="umbral-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191c1d]/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="bg-white border border-brand-outline-variant rounded shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-brand-outline-variant pb-3">
              <h2
                id="umbral-modal-title"
                className="text-base font-bold text-brand-primary flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-xl">tune</span>
                Umbral — Tramo {umbralEditando.etapa}
              </h2>
              <button
                onClick={() => setUmbralEditando(null)}
                aria-label="Cerrar"
                className="text-brand-outline hover:text-brand-error cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleGuardarUmbral} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                  Crítico desde (valor)
                </label>
                <input
                  required
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={umbralForm.criticoDesde}
                  onChange={(e) =>
                    setUmbralForm((f) => ({
                      ...f,
                      criticoDesde: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                  Medio desde (valor)
                </label>
                <input
                  required
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={umbralForm.medioDesde}
                  onChange={(e) =>
                    setUmbralForm((f) => ({
                      ...f,
                      medioDesde: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                  Seguro hasta (valor)
                </label>
                <input
                  required
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={umbralForm.seguroHasta}
                  onChange={(e) =>
                    setUmbralForm((f) => ({
                      ...f,
                      seguroHasta: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUmbralEditando(null)}
                  className="px-4 py-2 border border-brand-outline-variant text-[#43474f] rounded text-xs font-semibold hover:bg-[#edeeef] transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-primary text-white rounded text-xs font-bold hover:opacity-90 transition-all"
                >
                  Guardar Umbral
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
