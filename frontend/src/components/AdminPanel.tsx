/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import type { Student, Survey } from "../types/types.ts";
import AdminStudentView from "./AdminStudentView.tsx";
import AHPConfigPanel from "./AHPConfigPanel.tsx";
import ReportesPanel from "./ReportesPanel.tsx";
import SurveyEditor from "./SurveyEditor.tsx";
import SurveyResponsesModal from "./SurveyResponsesModal.tsx";
import {
  useConteoEstudiantes,
  useConteoPorRiesgo,
  useEvolucionScore,
  useEstudiantesPorCarrera,
  useHistorialAlertas,
  useTotalCriticos,
  useTotalAlertasNuevas,
  useTotalIntervenciones,
  useHistorialAlertasGenerales,
} from "../hooks/queries/useAdminDepQueries.ts";
import { useAuth } from "../hooks/useAuth.ts";

interface AdminPanelProps {
  surveys: Survey[];
  onLogout: () => void;
}

export default function AdminPanel({ surveys, onLogout }: AdminPanelProps) {
  const [activeMenu, setActiveMenu] = useState<
    "panel" | "estudiantes" | "encuestas" | "reportes" | "configuracion"
  >("panel");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );

  // Dashboard aggregate filters
  const dashboardAnio = 2019;
  const [evolucionAnio, setEvolucionAnio] = useState<number>(2019);
  const dashboardCarreraId = useAuth().user?.carrera_id ?? 1;
  const {
    data: totalEstudiantes,
    isLoading: loadingTotal,
    isError: errorTotal,
  } = useConteoEstudiantes(dashboardAnio, dashboardCarreraId);
  const {
    data: totalCriticos,
    isLoading: loadingCriticos,
    isError: errorCriticos,
  } = useTotalCriticos(dashboardCarreraId);
  const {
    data: totalAlertas,
    isLoading: loadingAlertas,
    isError: errorAlertas,
  } = useTotalAlertasNuevas(dashboardCarreraId);
  const {
    data: totalIntervenciones,
    isLoading: loadingIntervenciones,
    isError: errorIntervenciones,
  } = useTotalIntervenciones(dashboardCarreraId);
  const {
    data: conteoPorRiesgo,
    isLoading: loadingRiesgo,
    isError: errorRiesgo,
  } = useConteoPorRiesgo(dashboardAnio, dashboardCarreraId);

  const donutRojo = conteoPorRiesgo?.rojo ?? 0;
  const donutAmarillo = conteoPorRiesgo?.amarillo ?? 0;
  const donutVerde = conteoPorRiesgo?.verde ?? 100;

  const {
    data: evolucionScore,
    isLoading: loadingEvolucion,
    isError: errorEvolucion,
  } = useEvolucionScore(evolucionAnio, dashboardCarreraId);

  const {
    data: apiStudents,
    isLoading: loadingStudents,
    isError: errorStudents,
  } = useEstudiantesPorCarrera("Industrial");

  const [historialStudentId, setHistorialStudentId] = useState<string | null>(null);
  const {
    data: historialAlertas = [],
    isLoading: loadingHistorial,
    isError: errorHistorial,
  } = useHistorialAlertas(historialStudentId);

  const {
    data: historialAlertasGenerales = [],
    isLoading: loadingHistorialGenerales,
    isError: errorHistorialGenerales,
  } = useHistorialAlertasGenerales(dashboardCarreraId.toString());

  // Filters for student tracking
  const [searchQuery, setSearchQuery] = useState("");
  const [filterYear, setFilterYear] = useState("Todos");
  const [filterCareer, setFilterCareer] = useState("Todas");
  const [filterRisk, setFilterRisk] = useState<
    "TODOS" | "CRÍTICO" | "MEDIO" | "BAJO"
  >("TODOS");

  // Surveys state
  const [localSurveys, setLocalSurveys] = useState<Survey[]>(surveys);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);
  const [viewingResponsesSurvey, setViewingResponsesSurvey] =
    useState<Survey | null>(null);

  // Notifications bell simulator
  const [notifications, setNotifications] = useState([
    "Sofía Martínez registró nuevo ausentismo prolongado en Análisis II (14/10/2023)",
    "Mateo Alvarado tiene alertada su inactividad en campus virtual por más de 7 días",
    "Nueva respuesta de encuesta crítica recibida para Ingeniería Industrial",
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Derive risk level from indice_riesgo
  const getRiskLevel = (ir: number): "CRÍTICO" | "MEDIO" | "BAJO" =>
    ir >= 7.5 ? "CRÍTICO" : ir >= 4.0 ? "MEDIO" : "BAJO";

  // Selected student object helper (mapped for AdminStudentView)
  const selectedStudent = (() => {
    const api = apiStudents.find((s) => s.dni === selectedStudentId);
    if (!api) return undefined;
    return {
      id: api.dni,
      dni: api.dni,
      firstNames: api.nombre,
      lastNames: api.apellido,
      fullName: `${api.nombre} ${api.apellido}`,
      email: "",
      avatarUrl: "",
      career: api.carrera,
      year: parseInt(api.etapa) || 0,
      legajo: "",
      riskLevel: getRiskLevel(api.indice_riesgo),
      riskValue: api.indice_riesgo,
      tramo: "INICIAL" as const,
      lastRecalculation:
        typeof api.ultima_fecha_recalculo === "string"
          ? api.ultima_fecha_recalculo
          : (api.ultima_fecha_recalculo?.toISOString() ?? "-"),
      statusAlerta: (api.estado_alerta ?? "SIN ALERTA") as
        | "NUEVA"
        | "EN REVISIÓN"
        | "INTERVENIDA"
        | "SIN ALERTA",
      gpa: 0,
      subjectsApproved: 0,
      subjectsTotal: 0,
      engagement: "Medio" as const,
      phone: "",
    } as Student;
  })();

  // Filter students based on year, career, search state, risk
  const filteredStudents = apiStudents.filter((s) => {
    const fullName = `${s.nombre} ${s.apellido}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      s.dni.includes(searchQuery);

    const matchesYear = filterYear === "Todos" || s.etapa === filterYear;
    const matchesCareer =
      filterCareer === "Todas" ||
      s.carrera.toLowerCase().includes(filterCareer.toLowerCase());

    const riskLevel = getRiskLevel(s.indice_riesgo);
    const matchesRisk =
      filterRisk === "TODOS" ||
      (filterRisk === "CRÍTICO" && riskLevel === "CRÍTICO") ||
      (filterRisk === "MEDIO" && riskLevel === "MEDIO") ||
      (filterRisk === "BAJO" && riskLevel === "BAJO");

    return matchesSearch && matchesYear && matchesCareer && matchesRisk;
  });

  // Mapped students for ReportesPanel
  const studentsForChildren = apiStudents.map((s) => ({
    id: s.dni,
    dni: s.dni,
    firstNames: s.nombre,
    lastNames: s.apellido,
    fullName: `${s.nombre} ${s.apellido}`,
    email: "",
    avatarUrl: "",
    career: s.carrera,
    year: parseInt(s.etapa) || 0,
    legajo: "",
    riskLevel: getRiskLevel(s.indice_riesgo) as
      | "CRÍTICO"
      | "MEDIO"
      | "BAJO"
      | "SEGURO",
    riskValue: s.indice_riesgo,
    tramo: "INICIAL" as const,
    lastRecalculation:
      typeof s.ultima_fecha_recalculo === "string"
        ? s.ultima_fecha_recalculo
        : (s.ultima_fecha_recalculo?.toISOString() ?? "-"),
    statusAlerta: (s.estado_alerta ?? "SIN ALERTA") as
      | "NUEVA"
      | "EN REVISIÓN"
      | "INTERVENIDA"
      | "SIN ALERTA",
    gpa: 0,
    subjectsApproved: 0,
    subjectsTotal: 0,
    engagement: "Medio" as const,
    phone: "",
  }));

  // Survey creation/edición handler (delegado a SurveyEditor)
  const handleSaveSurvey = (survey: Survey) => {
    setLocalSurveys((prev) => {
      const yaExiste = prev.some((s) => s.id === survey.id);
      return yaExiste
        ? prev.map((s) => (s.id === survey.id ? survey : s))
        : [survey, ...prev];
    });
    setShowSurveyModal(false);
    setEditingSurvey(null);
  };

  const handleCancelSurveyEditor = () => {
    setShowSurveyModal(false);
    setEditingSurvey(null);
  };

  // Status Badge Helper
  const getAlertPill = (status: Student["statusAlerta"]) => {
    switch (status) {
      case "NUEVA":
        return (
          <span className="bg-[#ffdad6] text-[#93000a] px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#ba1a1a] rounded-full animate-pulse"></span>
            NUEVA
          </span>
        );
      case "EN REVISIÓN":
        return (
          <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
            EN REVISIÓN
          </span>
        );
      case "INTERVENIDA":
        return (
          <span className="bg-[#e2f3f5] text-[#006e6e] px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#006a6a] rounded-full"></span>
            INTERVENIDA
          </span>
        );
      default:
        return (
          <span className="bg-[#f3f4f5] text-[#43474f] px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-0.5">
            SIN ALERTA
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex text-[#191c1d] bg-[#f8f9fa]">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-brand-outline-variant flex flex-col fixed left-0 top-0 h-screen z-20">
        <div className="px-6 py-8 border-b border-brand-outline-variant bg-[#f8f9fa]">
          <h1 className="text-2xl font-black text-brand-primary tracking-tight">
            SBIRE
          </h1>
        </div>

        <nav className="flex-1 py-6 space-y-1">
          <button
            onClick={() => {
              setActiveMenu("panel");
              setSelectedStudentId(null);
            }}
            className={`w-full flex items-center gap-3 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeMenu === "panel" && !selectedStudentId
              ? "text-brand-primary bg-[#edeeef] border-r-4 border-brand-primary"
              : "text-[#43474f] hover:text-brand-primary hover:bg-[#f3f4f5]"
              }`}
          >
            <span className="material-symbols-outlined text-[#43474f] text-lg">
              dashboard
            </span>
            Panel Institucional
          </button>

          <button
            onClick={() => {
              setActiveMenu("estudiantes");
              setSelectedStudentId(null);
            }}
            className={`w-full flex items-center gap-3 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeMenu === "estudiantes" || selectedStudentId
              ? "text-brand-primary bg-[#edeeef] border-r-4 border-brand-primary"
              : "text-[#43474f] hover:text-brand-primary hover:bg-[#f3f4f5]"
              }`}
          >
            <span className="material-symbols-outlined text-[#43474f] text-lg">
              groups
            </span>
            Mis Estudiantes
          </button>

          <button
            onClick={() => {
              setActiveMenu("encuestas");
              setSelectedStudentId(null);
            }}
            className={`w-full flex items-center gap-3 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeMenu === "encuestas"
              ? "text-brand-primary bg-[#edeeef] border-r-4 border-brand-primary"
              : "text-[#43474f] hover:text-brand-primary hover:bg-[#f3f4f5]"
              }`}
          >
            <span className="material-symbols-outlined text-[#43474f] text-lg">
              edit_note
            </span>
            Encuestas
          </button>

          <button
            onClick={() => {
              setActiveMenu("reportes");
              setSelectedStudentId(null);
            }}
            className={`w-full flex items-center gap-3 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeMenu === "reportes"
              ? "text-brand-primary bg-[#edeeef] border-r-4 border-brand-primary"
              : "text-[#43474f] hover:text-brand-primary hover:bg-[#f3f4f5]"
              }`}
          >
            <span className="material-symbols-outlined text-[#43474f] text-lg">
              query_stats
            </span>
            Reportes
          </button>

          <button
            onClick={() => {
              setActiveMenu("configuracion");
              setSelectedStudentId(null);
            }}
            className={`w-full flex items-center gap-3 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeMenu === "configuracion"
              ? "text-brand-primary bg-[#edeeef] border-r-4 border-brand-primary"
              : "text-[#43474f] hover:text-brand-primary hover:bg-[#f3f4f5]"
              }`}
          >
            <span className="material-symbols-outlined text-[#43474f] text-lg">
              settings
            </span>
            Configuración
          </button>
        </nav>

        {/* Academic Administrator avatar */}
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

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white border-b border-brand-outline-variant h-16 flex items-center justify-between px-8 sticky top-0 z-10 shadow-xs">
          <div className="flex items-center">
            <h2 className="text-sm font-black text-brand-primary uppercase tracking-widest">
              {selectedStudentId
                ? "Expediente del Estudiante"
                : activeMenu === "panel"
                  ? "Panel General de Control"
                  : activeMenu === "estudiantes"
                    ? "Seguimiento de Alertas Estudiantiles"
                    : activeMenu === "encuestas"
                      ? "Gestión de Relevamientos"
                      : activeMenu === "reportes"
                        ? "Diagnósticos e Históricos"
                        : "Configuración del Entorno"}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Search Input */}
            <div className="relative w-64">
              <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-brand-outline text-lg">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar por DNI, Legajo, Apellido..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeMenu !== "estudiantes") {
                    setActiveMenu("estudiantes");
                  }
                }}
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

            {/* Notification Bell Simulator */}
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

        {/* Content canvas with generous negative space & standard padding */}
        <main className="p-8 flex-1 overflow-x-hidden">
          {selectedStudentId && selectedStudent ? (
            /* Selected Student Read-only view */
            <AdminStudentView
              student={selectedStudent}
              onBack={() => setSelectedStudentId(null)}
            />
          ) : activeMenu === "panel" ? (
            /* Institutional dashboard panel */
            <div className="space-y-8 animate-fade-in z-0">
              {/* Welcome Section */}
              <div>
                <h3 className="text-3xl font-bold text-brand-primary tracking-tight">
                  Hola, Administrador Departamental
                </h3>
                <p className="text-[#43474f] font-medium text-sm mt-1">
                  Resumen general
                </p>
              </div>

              {/* Metric Cards Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
                  <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                    TOTAL ESTUDIANTES
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    {loadingTotal ? (
                      <span className="inline-block w-20 h-8 bg-gray-200 rounded animate-pulse" />
                    ) : errorTotal || !totalEstudiantes ? (
                      <span className="text-3xl font-black text-brand-primary">
                        —
                      </span>
                    ) : (
                      <span className="text-3xl font-black text-brand-primary">
                        {totalEstudiantes?.toLocaleString() ?? "—"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
                  <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                    RIESGO CRÍTICO
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    {loadingCriticos ? (
                      <span className="inline-block w-20 h-8 bg-gray-200 rounded animate-pulse" />
                    ) : errorCriticos || !totalCriticos ? (
                      <span className="text-3xl font-black text-brand-error">
                        —
                      </span>
                    ) : (
                      <span className="text-3xl font-black text-brand-error">
                        {totalCriticos?.total.toLocaleString() ?? "—"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
                  <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                    ALERTAS PENDIENTES
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    {loadingAlertas ? (
                      <span className="inline-block w-20 h-8 bg-gray-200 rounded animate-pulse" />
                    ) : errorAlertas || !totalAlertas ? (
                      <span className="text-3xl font-black text-[#5a9ef1]">
                        —
                      </span>
                    ) : (
                      <span className="text-3xl font-black text-[#5a9ef1]">
                        {totalAlertas?.total.toLocaleString() ?? "—"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
                  <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                    INTERVENCIONES (MES)
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    {loadingIntervenciones ? (
                      <span className="inline-block w-20 h-8 bg-gray-200 rounded animate-pulse" />
                    ) : errorIntervenciones || !totalIntervenciones ? (
                      <span className="text-3xl font-black text-[#006a6a]">
                        —
                      </span>
                    ) : (
                      <span className="text-3xl font-black text-[#006a6a]">
                        {totalIntervenciones?.total.toLocaleString() ?? "—"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Charts Section: Donut + Evolution Area */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Donut general semáforo */}
                <div className="bg-white border border-brand-outline-variant rounded p-6 shadow-xs flex flex-col">
                  <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1 mb-5">
                    <span className="material-symbols-outlined text-lg">
                      donut_large
                    </span>
                    Semáforo General de Alumnos
                  </h4>

                  {loadingRiesgo ? (
                    <div className="flex-1 flex flex-col justify-center items-center py-4">
                      <span className="inline-block w-40 h-40 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                  ) : errorRiesgo || !conteoPorRiesgo ? (
                    <div className="flex-1 flex flex-col justify-center items-center py-4">
                      <p className="text-brand-outline text-xs">Sin datos</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 flex flex-col justify-center items-center relative py-4">
                        <svg
                          className="w-40 h-40 transform -rotate-90"
                          viewBox="0 0 36 36"
                        >
                          <circle
                            cx="18"
                            cy="18"
                            fill="transparent"
                            r="15.915"
                            stroke="#edeeef"
                            strokeWidth="3"
                          ></circle>
                          <circle
                            cx="18"
                            cy="18"
                            fill="transparent"
                            r="15.915"
                            stroke="#ba1a1a"
                            strokeWidth="3.2"
                            strokeDasharray={`${donutRojo} 100`}
                            strokeDashoffset="0"
                          ></circle>
                          <circle
                            cx="18"
                            cy="18"
                            fill="transparent"
                            r="15.915"
                            stroke="#d97706"
                            strokeWidth="3.2"
                            strokeDasharray={`${donutAmarillo} 100`}
                            strokeDashoffset={`-${donutRojo}`}
                          ></circle>
                          <circle
                            cx="18"
                            cy="18"
                            fill="transparent"
                            r="15.915"
                            stroke="#006a6a"
                            strokeWidth="3.2"
                            strokeDasharray={`${donutVerde} 100`}
                            strokeDashoffset={`-${donutRojo + donutAmarillo}`}
                          ></circle>
                        </svg>

                        <div className="absolute inset-x-0 top-18 flex flex-col items-center justify-center">
                          <span className="text-2xl font-black text-brand-primary">
                            {loadingTotal
                              ? "—"
                              : (totalEstudiantes?.toLocaleString() ??
                                "—")}
                          </span>
                          <span className="text-[9px] text-brand-outline font-bold uppercase">
                            Población Activa
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-brand-outline-variant grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="w-2.5 h-2.5 rounded-full bg-[#006a6a] mx-auto mb-1"></div>
                          <p className="text-[10px] font-bold text-brand-primary">
                            {donutVerde}% Seguro
                          </p>
                        </div>
                        <div>
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mx-auto mb-1"></div>
                          <p className="text-[10px] font-bold text-brand-primary">
                            {donutAmarillo}% Medio
                          </p>
                        </div>
                        <div>
                          <div className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] mx-auto mb-1"></div>
                          <p className="text-[10px] font-bold text-[#ba1a1a]">
                            {donutRojo}% Crítico
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Risk evolution per Cohort */}
                <div className="lg:col-span-2 bg-white border border-brand-outline-variant rounded p-6 shadow-xs flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-lg">
                        trending_up
                      </span>
                      Evolución de Alertas por Cohorte
                    </h4>

                    <div className="flex gap-1.5">
                      {[2022, 2023, 2024].map((year) => (
                        <button
                          key={year}
                          onClick={() => setEvolucionAnio(year)}
                          className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${evolucionAnio === year
                            ? "bg-brand-primary text-white border border-brand-primary font-extrabold"
                            : "bg-[#f3f4f5] text-[#43474f] border border-brand-outline-variant font-semibold hover:bg-[#e0e1e5]"
                            }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>

                  {loadingEvolucion ? (
                    <div className="flex-1 bg-[#f8f9fa] border border-brand-outline-variant rounded p-2 h-44 flex items-center justify-center">
                      <span className="inline-block w-full h-full bg-gray-200 rounded animate-pulse" />
                    </div>
                  ) : errorEvolucion || !evolucionScore ? (
                    <div className="flex-1 bg-[#f8f9fa] border border-brand-outline-variant rounded p-2 h-44 flex items-center justify-center">
                      <p className="text-brand-outline text-xs">Sin datos</p>
                    </div>
                  ) : (
                    (() => {
                      const monthLabels = [
                        "",
                        "ENE",
                        "FEB",
                        "MAR",
                        "ABR",
                        "MAY",
                        "JUN",
                        "JUL",
                        "AGO",
                        "SEP",
                        "OCT",
                        "NOV",
                        "DIC",
                      ];
                      const data = Object.entries(evolucionScore)
                        .map(([m, s]) => ({
                          month: parseInt(m),
                          score: s as number,
                        }))
                        .sort((a, b) => a.month - b.month);
                      const n = data.length;
                      const w = 540,
                        h = 140;
                      const pts = data.map((d, i) => ({
                        x: n > 1 ? (i / (n - 1)) * w : w / 2,
                        y: h - (Math.min(Math.max(d.score, 0), 10) / 10) * h,
                      }));
                      const buildPath = (p: { x: number; y: number }[]) => {
                        if (p.length < 2) return "";
                        let d = `M ${p[0].x.toFixed(2)},${p[0].y.toFixed(2)}`;
                        for (let i = 1; i < p.length; i++) {
                          const mx = (p[i - 1].x + p[i].x) / 2;
                          d += ` C ${mx.toFixed(2)},${p[i - 1].y.toFixed(2)} ${mx.toFixed(2)},${p[i].y.toFixed(2)} ${p[i].x.toFixed(2)},${p[i].y.toFixed(2)}`;
                        }
                        return d;
                      };
                      const linePath = buildPath(pts);
                      const areaPath = linePath
                        ? `${linePath} L ${pts[n - 1].x.toFixed(2)},${h} L ${pts[0].x.toFixed(2)},${h} Z`
                        : "";

                      return (
                        <>
                          <div className="relative flex-1 bg-[#f8f9fa] border border-brand-outline-variant rounded p-2 h-44 flex items-center justify-center">
                            <svg
                              className="w-full h-full"
                              viewBox="0 0 540 140"
                              preserveAspectRatio="none"
                            >
                              <defs>
                                <linearGradient
                                  id="areaGrad"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="0%"
                                    stopColor="#001e40"
                                    stopOpacity="0.15"
                                  />
                                  <stop
                                    offset="100%"
                                    stopColor="#001e40"
                                    stopOpacity="0.0"
                                  />
                                </linearGradient>
                              </defs>
                              <line
                                x1="0"
                                y1="35"
                                x2="540"
                                y2="35"
                                stroke="#c3c6d1"
                                strokeWidth="0.5"
                                strokeDasharray="4 4"
                              />
                              <line
                                x1="0"
                                y1="70"
                                x2="540"
                                y2="70"
                                stroke="#c3c6d1"
                                strokeWidth="0.5"
                                strokeDasharray="4 4"
                              />
                              <line
                                x1="0"
                                y1="105"
                                x2="540"
                                y2="105"
                                stroke="#c3c6d1"
                                strokeWidth="0.5"
                                strokeDasharray="4 4"
                              />
                              {areaPath && (
                                <path d={areaPath} fill="url(#areaGrad)" />
                              )}
                              {linePath && (
                                <path
                                  d={linePath}
                                  fill="none"
                                  stroke="#001e40"
                                  strokeWidth="2.5"
                                />
                              )}
                              {pts.map((p, i) => (
                                <circle
                                  key={i}
                                  cx={p.x}
                                  cy={p.y}
                                  r="3.5"
                                  fill="#001e40"
                                />
                              ))}
                            </svg>
                            <div className="absolute inset-x-0 bottom-1 flex justify-between px-3 text-[9px] text-[#43474f] font-bold">
                              {data.map((d, i) => (
                                <span key={i}>{monthLabels[d.month]}</span>
                              ))}
                            </div>
                          </div>
                        </>
                      );
                    })()
                  )}
                </div>
              </div>

              {/* Critical Alerts Recent list */}
              <div className="bg-white border border-brand-outline-variant rounded shadow-xs overflow-hidden">
                <div className="bg-[#f8f9fa] border-b border-brand-outline-variant px-6 py-4 flex justify-between items-center">
                  <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-lg">emergency</span>
                    Alertas Críticas Recientes
                  </h4>
                  <button
                    onClick={() => { setActiveMenu("estudiantes"); setFilterRisk("CRÍTICO"); }}
                    className="text-xs text-brand-primary font-bold hover:underline"
                  >
                    Ver listado completo
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#edeeef] text-[#43474f] font-bold uppercase tracking-wider">
                        <th className="p-3 pl-6">Estudiante</th>
                        <th className="p-3">Carrera / Año</th>
                        <th className="p-3 text-center">Nivel Riesgo</th>
                        <th className="p-3 text-center">Último Recálculo</th>
                        <th className="p-3 text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-outline-variant">
                      {studentsForChildren
                        .filter((s) => s.riskLevel === "CRÍTICO")
                        .slice(0, 5)
                        .map((s) => (
                          <tr key={s.id} className="hover:bg-[#f8f9fa] transition-colors">
                            <td className="p-3 pl-6 font-bold text-brand-primary">
                              {s.lastNames}, {s.firstNames}
                            </td>
                            <td className="p-3 font-medium">
                              {s.career} ({s.year}° Año)
                            </td>
                            <td className="p-3 text-center">
                              <span className="bg-[#ffdad6] text-[#93000a] text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-[#ba1a1a] rounded-full"></span>
                                CRÍTICO ({s.riskValue.toFixed(1)})
                              </span>
                            </td>
                            <td className="p-3 text-center text-brand-outline font-medium">
                              {s.lastRecalculation}
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex justify-center items-center gap-2">
                                <button
                                  onClick={() => setHistorialStudentId(s.id)}
                                  className="text-brand-secondary hover:underline font-bold"
                                >
                                  Historial
                                </button>
                                <button
                                  onClick={() => setSelectedStudentId(s.id)}
                                  className="text-brand-primary hover:underline font-bold"
                                >
                                  Intervenir
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      {studentsForChildren.filter((s) => s.riskLevel === "CRÍTICO").length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-brand-outline font-medium">
                            No hay alertas críticas activas.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Alert history detail for selected student */}
              {historialStudentId && (() => {
                const selected = studentsForChildren.find((s) => s.id === historialStudentId);
                return (
                  <div className="bg-white border border-brand-outline-variant rounded shadow-xs overflow-hidden">
                    <div className="bg-[#f8f9fa] border-b border-brand-outline-variant px-6 py-4 flex justify-between items-center">
                      <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-lg">timeline</span>
                        Historial de Alertas — {selected?.lastNames}, {selected?.firstNames}
                      </h4>
                      <button
                        onClick={() => setHistorialStudentId(null)}
                        className="text-xs text-brand-error font-bold hover:underline"
                      >
                        Cerrar
                      </button>
                    </div>
                    <div className="p-4">
                      {loadingHistorial ? (
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                          ))}
                        </div>
                      ) : errorHistorial ? (
                        <p className="text-center text-brand-outline text-xs py-4">Sin datos</p>
                      ) : historialAlertasGenerales.length === 0 ? (
                        <p className="text-center text-brand-outline text-xs py-4">
                          No hay eventos registrados para esta carrera.
                        </p>
                      ) : (
                        <ul className="space-y-3">
                          {historialAlertas.map((evt, i) => (
                            <li key={i} className="flex items-start gap-3 text-xs">
                              <span className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${evt.tipo === "alerta" ? "bg-[#ba1a1a]" : "bg-[#006a6a]"}`} />
                              <div className="flex-1">
                                <span className="font-bold text-brand-primary capitalize">{evt.descripcion}</span>
                                <span className="text-brand-outline ml-2">{evt.fecha ? new Date(evt.fecha).toLocaleDateString("es-AR") : "-"}</span>
                              </div>
                              <span className="text-[10px] uppercase font-bold text-brand-outline">{evt.tipo}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })()}

            </div>
          ) : activeMenu === "estudiantes" ? (
            /* Student alerts tracking listing view */
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-brand-primary tracking-tight">
                    Listado de Seguimiento
                  </h3>
                  <p className="text-xs text-[#43474f] mt-1">
                    Administración y filtros de alumnos bajo monitoreo del
                    Sistema Travesía.
                  </p>
                </div>
              </div>

              {/* Filtering bar representing second screenshot */}
              <div className="bg-white border border-brand-outline-variant rounded p-4 flex flex-col md:flex-row gap-4 items-center justify-between text-xs font-semibold shadow-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#43474f] uppercase block mb-1">
                      Año Académico
                    </span>
                    <select
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                      className="border border-brand-outline-variant rounded bg-white p-1.5 pr-6 cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs"
                    >
                      <option value="Todos">Todos</option>
                      <option value="1">1er Año</option>
                      <option value="2">2do Año</option>
                      <option value="3">3er Año</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold text-[#43474f] uppercase block mb-1">
                      Carrera
                    </span>
                    <select
                      value={filterCareer}
                      onChange={(e) => setFilterCareer(e.target.value)}
                      className="border border-brand-outline-variant rounded bg-white p-1.5 pr-6 cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-primary text-xs"
                    >
                      <option value="Todas">Todas</option>
                      <option value="Industrial">Ing. Industrial</option>
                      <option value="Informática">Ing. Informática</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold text-[#43474f] uppercase block mb-1">
                      Riesgo
                    </span>
                    <div className="flex border border-brand-outline-variant rounded overflow-hidden">
                      <button
                        onClick={() => setFilterRisk("TODOS")}
                        className={`px-3 py-1.5 cursor-pointer font-bold ${filterRisk === "TODOS" ? "bg-brand-primary text-white" : "bg-white text-brand-primary"}`}
                      >
                        TODOS
                      </button>
                      <button
                        onClick={() => setFilterRisk("CRÍTICO")}
                        className={`px-3 py-1.5 cursor-pointer font-bold border-l border-brand-outline-variant ${filterRisk === "CRÍTICO" ? "bg-[#ffdad6] text-[#ba1a1a]" : "bg-white text-brand-primary"}`}
                      >
                        CRÍTICO
                      </button>
                      <button
                        onClick={() => setFilterRisk("MEDIO")}
                        className={`px-3 py-1.5 cursor-pointer font-bold border-l border-brand-outline-variant ${filterRisk === "MEDIO" ? "bg-amber-100 text-amber-800" : "bg-white text-brand-primary"}`}
                      >
                        MEDIO
                      </button>
                      <button
                        onClick={() => setFilterRisk("BAJO")}
                        className={`px-3 py-1.5 cursor-pointer font-bold border-l border-brand-outline-variant ${filterRisk === "BAJO" ? "bg-[#e2f3f5] text-[#006e6e]" : "bg-white text-brand-primary"}`}
                      >
                        BAJO
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-right self-stretch md:self-auto">
                  <button
                    onClick={() => {
                      setFilterYear("Todos");
                      setFilterCareer("Todas");
                      setFilterRisk("TODOS");
                      setSearchQuery("");
                    }}
                    className="text-brand-error uppercase tracking-wider text-[10px] font-bold hover:underline"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>

              {/* Grid table showing current students */}
              <div className="xl:col-span-3 bg-white border border-brand-outline-variant rounded shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-center border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#edeeef] text-[#43474f] font-bold uppercase tracking-wider">
                        <th className="p-3 pl-5 border-b border-brand-outline-variant">
                          ESTUDIANTE / DNI
                        </th>
                        <th className="p-3 border-b border-brand-outline-variant text-center">
                          ÍNDICE RISK
                        </th>
                        <th className="p-3 border-b border-brand-outline-variant text-center">
                          ESTADO ALERTA
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-outline-variant">
                      {filteredStudents.map((s) => (
                        <tr
                          key={s.dni}
                          className="hover:bg-[#f8f9fa] transition-all"
                        >
                          <td className="p-3 pl-5">
                            <div
                              className="font-bold text-brand-primary hover:underline cursor-pointer"
                              onClick={() => setSelectedStudentId(s.dni)}
                            >
                              {s.apellido}, {s.nombre}
                            </div>
                            <div className="text-[10px] text-brand-outline font-semibold">
                              DNI: {s.dni} | {s.carrera}
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`font-black text-xs ${s.indice_riesgo >= 7.5 ? "text-[#ba1a1a]" : s.indice_riesgo >= 4.0 ? "text-amber-600" : "text-[#006e6e]"}`}
                            >
                              {s.indice_riesgo.toFixed(2)}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            {getAlertPill(
                              (s.estado_alerta ?? "SIN ALERTA") as
                              | "NUEVA"
                              | "EN REVISIÓN"
                              | "INTERVENIDA"
                              | "SIN ALERTA",
                            )}
                          </td>
                        </tr>
                      ))}

                      {filteredStudents.length === 0 && (
                        <tr>
                          <td
                            colSpan={3}
                            className="p-8 text-center text-brand-outline font-medium"
                          >
                            No se encontraron estudiantes que coincidan con los
                            filtros de búsqueda.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Summary bar */}
                <div className="p-4 bg-[#f8f9fa] border-t border-brand-outline-variant flex justify-between items-center text-xs text-[#43474f]">
                  <span className="font-semibold">
                    Mostrando {filteredStudents.length} de {apiStudents.length}{" "}
                    estudiantes asignados
                  </span>
                  <div className="flex gap-1">
                    <button className="px-2.5 py-1 border border-brand-outline-variant rounded bg-white font-bold opacity-50 cursor-not-allowed">
                      Anterior
                    </button>
                    <button className="px-3 py-1 bg-brand-primary text-white rounded font-bold">
                      1
                    </button>
                    <button className="px-3 py-1 border border-brand-outline-variant rounded bg-white hover:bg-[#edeeef] font-bold">
                      2
                    </button>
                    <button className="px-2.5 py-1 border border-brand-outline-variant rounded bg-white hover:bg-[#edeeef] font-bold">
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeMenu === "encuestas" ? (
            /* Managed Surveys & Creation */
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-brand-primary tracking-tight">
                    Gestión de Encuestas
                  </h3>
                  <p className="text-xs text-[#43474f] mt-1">
                    Administración de cuestionarios destinados a medir y mapear
                    las alertas contextuales externas.
                  </p>
                </div>
                <button
                  onClick={() => setShowSurveyModal(true)}
                  className="flex items-center gap-1.5 bg-brand-primary text-white py-2 px-4 rounded text-xs font-bold hover:bg-[#002f5e] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">
                    add_circle
                  </span>
                  Crear Nueva Encuesta
                </button>
              </div>

              {/* Stat Highlights at top of surveys panel */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-brand-outline-variant rounded p-5 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-[10px] font-extrabold text-brand-outline block uppercase tracking-wider">
                      Tasa de Respuesta Prom.
                    </span>
                    <span className="text-3xl font-black text-brand-primary mt-1 block">
                      68.4%
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-brand-primary bg-brand-primary-container/10 p-3 rounded-full text-2xl">
                    percent
                  </span>
                </div>
              </div>

              {/* List of Surveys as in screenshot 6 */}
              <div className="bg-white border border-brand-outline-variant rounded shadow-xs overflow-hidden">
                <div className="p-4 border-b border-brand-outline-variant flex justify-between bg-[#f8f9fa] items-center">
                  <h4 className="font-bold text-brand-primary text-xs uppercase tracking-wider">
                    Listado de Relevamientos
                  </h4>
                  <span className="text-[10px] text-brand-outline font-bold">
                    Total: {localSurveys.length} cuestionarios
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#edeeef] text-[#43474f] font-bold uppercase tracking-wider">
                        <th className="p-3 pl-5 border-b border-brand-outline-variant">
                          Nombre de la Encuesta
                        </th>
                        <th className="p-3 border-b border-brand-outline-variant text-center">
                          Tipo
                        </th>
                        <th className="p-3 border-b border-brand-outline-variant text-center">
                          Estado
                        </th>
                        <th className="p-3 border-b border-brand-outline-variant text-center">
                          Fecha Creación
                        </th>
                        <th className="p-3 border-b border-brand-outline-variant text-center">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-outline-variant">
                      {localSurveys.map((sur) => (
                        <tr
                          key={sur.id}
                          className="hover:bg-[#f8f9fa] transition-colors"
                        >
                          <td className="p-4 pl-5">
                            <div
                              className="font-extrabold text-brand-primary text-sm hover:underline cursor-pointer"
                              onClick={() => setEditingSurvey(sur)}
                            >
                              {sur.title}
                            </div>
                            <div className="text-[11px] text-[#43474f] font-medium mt-0.5">
                              {sur.description}
                            </div>
                            <div className="text-[10px] text-brand-outline font-bold mt-1">
                              {sur.questions?.length ?? 0} pregunta(s)
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <span className="bg-[#edeeef] text-brand-primary px-2 py-0.5 rounded text-[10px] font-bold">
                              {sur.type}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black inline-block ${sur.status === "Activa"
                                ? "bg-[#e2f3f5] text-[#006e6e]"
                                : sur.status === "Borrador"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-150 text-brand-error"
                                }`}
                            >
                              {sur.status}
                            </span>
                          </td>
                          <td className="p-4 text-center font-medium text-brand-outline">
                            {sur.creationDate}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex justify-center items-center gap-2">
                              {sur.status === "Activa" && (
                                <>
                                  <button
                                    onClick={() =>
                                      setViewingResponsesSurvey(sur)
                                    }
                                    className="text-brand-secondary hover:underline font-bold"
                                  >
                                    Ver Respuestas ({sur.responsesCount})
                                  </button>
                                  <button
                                    onClick={() => {
                                      const updated = localSurveys.map((s) =>
                                        s.id === sur.id
                                          ? {
                                            ...s,
                                            status: "Finalizada" as const,
                                          }
                                          : s,
                                      );
                                      setLocalSurveys(updated);
                                    }}
                                    className="text-brand-error hover:underline font-bold"
                                  >
                                    Finalizar
                                  </button>
                                </>
                              )}
                              {sur.status === "Borrador" && (
                                <button
                                  onClick={() => {
                                    const updated = localSurveys.map((s) =>
                                      s.id === sur.id
                                        ? { ...s, status: "Activa" as const }
                                        : s,
                                    );
                                    setLocalSurveys(updated);
                                  }}
                                  className="text-brand-primary hover:underline font-bold"
                                >
                                  Activar
                                </button>
                              )}
                              {sur.status === "Finalizada" && (
                                <span className="text-brand-outline font-medium italic">
                                  Terminada
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Survey creation/edición editor (2 pasos: datos + preguntas) */}
              {(showSurveyModal || editingSurvey) && (
                <SurveyEditor
                  key={editingSurvey?.id ?? "new"}
                  initialSurvey={editingSurvey ?? undefined}
                  onSave={handleSaveSurvey}
                  onCancel={handleCancelSurveyEditor}
                />
              )}

              {viewingResponsesSurvey && (
                <SurveyResponsesModal
                  survey={viewingResponsesSurvey}
                  onClose={() => setViewingResponsesSurvey(null)}
                />
              )}
            </div>
          ) : activeMenu === "reportes" ? (
            <ReportesPanel students={studentsForChildren} />
          ) : (
            <AHPConfigPanel />
          )}
        </main>
      </div>
    </div>
  );
}
