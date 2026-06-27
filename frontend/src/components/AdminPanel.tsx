import { useMemo } from "react";
import {
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import type { Survey, Student } from "../types/types.ts";
import AdminStudentView from "./admin/AdminStudentView.tsx";
import AHPConfigPanel from "./config/AHPConfigPanel.tsx";
import ReportesPanel from "./reportes/ReportesPanel.tsx";
import Sidebar from "./layout/Sidebar.tsx";
import TopBar from "./layout/TopBar.tsx";
import PanelView from "./panel/PanelView.tsx";
import MisEstudiantesView from "./estudiantes/MisEstudiantesView.tsx";
import EncuestasView from "./encuestas/EncuestasView.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import { useEstudiantesPorCarrera } from "../hooks/queries/useAdminDepQueries.ts";
import { mapToStudent, getRiskLevel } from "../utils/studentMapping.ts";

interface AdminPanelProps {
  surveys: Survey[];
  onLogout: () => void;
}

export default function AdminPanel({ surveys, onLogout }: AdminPanelProps) {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { dni } = useParams<{ dni: string }>();
  const navigate = useNavigate();

  const carreraId = useAuth().user?.carrera_id ?? 1;

  const { data: apiStudents, isLoading, isError } = useEstudiantesPorCarrera(carreraId);

  const searchQuery = searchParams.get("q") ?? "";
  const filterYear = searchParams.get("year") ?? "Todos";
  const filterCareer = searchParams.get("career") ?? "Todas";
  const filterRisk =
    (searchParams.get("risk") as "TODOS" | "CRÍTICO" | "MEDIO" | "BAJO") ??
    "TODOS";

  const studentsForChildren: Student[] = useMemo(
    () => apiStudents?.map(mapToStudent) ?? [],
    [apiStudents],
  );

  const filteredStudents = useMemo(
    () =>
      apiStudents?.filter((s) => {
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
      }),
    [apiStudents, searchQuery, filterYear, filterCareer, filterRisk],
  );

  const selectedStudent = useMemo(() => {
    const api = apiStudents?.find((s) => s.dni === dni);
    return api ? mapToStudent(api) : undefined;
  }, [apiStudents, dni]);

  const updateFilters = (updates: Record<string, string>) => {
    const next = new URLSearchParams(searchParams);
    for (const [k, v] of Object.entries(updates)) {
      if (!v || v === "Todos" || v === "TODOS") next.delete(k);
      else next.set(k, v);
    }
    setSearchParams(next, { replace: true });
  };

  const handleSearchChange = (value: string) => {
    navigate(
      `/admin/estudiantes${value ? `?q=${encodeURIComponent(value)}` : ""}`,
    );
  };

  const title = dni
    ? "Expediente del Estudiante"
    : pathname === "/admin" || pathname === "/admin/panel"
      ? "Panel General de Control"
      : pathname.startsWith("/admin/estudiantes")
        ? "Seguimiento de Alertas Estudiantiles"
        : pathname.startsWith("/admin/encuestas")
          ? "Gestión de Relevamientos"
          : pathname.startsWith("/admin/reportes")
            ? "Diagnósticos e Históricos"
            : "Configuración del Entorno";

  return (
    <div className="min-h-screen flex text-[#191c1d] bg-[#f8f9fa]">
      <Sidebar onLogout={onLogout} />

      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        <TopBar
          title={title}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        <main className="p-8 flex-1 overflow-x-hidden">
          <Routes>
            <Route
              index
              element={
                <PanelView
                  carreraId={carreraId}
                  students={studentsForChildren}
                  onSelectStudent={(id) => navigate(`/admin/estudiantes/${id}`)}
                  onViewAllCriticos={() =>
                    navigate("/admin/estudiantes?risk=CR%C3%8DTICO")
                  }
                />
              }
            />
            <Route
              path="panel"
              element={
                <PanelView
                  carreraId={carreraId}
                  students={studentsForChildren}
                  onSelectStudent={(id) => navigate(`/admin/estudiantes/${id}`)}
                  onViewAllCriticos={() =>
                    navigate("/admin/estudiantes?risk=CR%C3%8DTICO")
                  }
                />
              }
            />
            <Route
              path="estudiantes"
              element={
                <MisEstudiantesView
                  onSearchChange={handleSearchChange}
                  filterYear={filterYear}
                  onFilterYearChange={(v) => updateFilters({ year: v })}
                  filterCareer={filterCareer}
                  onFilterCareerChange={(v) => updateFilters({ career: v })}
                  filterRisk={filterRisk}
                  onFilterRiskChange={(v) => updateFilters({ risk: v })}
                  filteredStudents={filteredStudents}
                  apiStudents={apiStudents}
                  isLoading={isLoading}
                  isError={isError}
                  onSelectStudent={(id) => navigate(`/admin/estudiantes/${id}`)}
                />
              }
            />
            <Route
              path="estudiantes/:dni"
              element={
                <AdminStudentView
                  student={selectedStudent!}
                  onBack={() => navigate("/admin/estudiantes")}
                />
              }
            />
            <Route
              path="encuestas"
              element={<EncuestasView initialSurveys={surveys} />}
            />
            <Route
              path="reportes"
              element={<ReportesPanel students={studentsForChildren} />}
            />
            <Route path="configuracion" element={<AHPConfigPanel />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
