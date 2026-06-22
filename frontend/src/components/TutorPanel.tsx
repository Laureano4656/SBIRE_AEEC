import { useState, type FormEvent } from "react";
import type { Student } from "../types.ts";
import StudentProfileView from "./StudentProfileView.tsx";

interface Entrevista {
  id: string;
  studentId: string;
  studentName: string;
  fecha: string;
  tipo: "Presencial" | "Virtual";
  estado: "Pendiente" | "Realizada" | "Cancelada";
  notas: string;
}

interface Intervencion {
  id: string;
  entrevistaId: string;
  tipo: "tutoria_academica" | "derivacion" | "seguimiento_virtual" | "asesoria_par" | "otro";
  descripcion: string;
  resultado: "positivo" | "neutro" | "negativo" | "sin_contacto";
  fecha: string;
}

interface Alerta {
  id: string;
  studentId: string;
  studentName: string;
  tipo: string;
  severidad: "ALTA" | "MEDIA" | "BAJA";
  descripcion: string;
  fecha: string;
  estado: "NUEVA" | "EN_REVISION" | "RESUELTA";
}

interface TutorPanelProps {
  onLogout: () => void;
}

type ActiveMenu = "estudiantes" | "entrevistas" | "alertas";

export default function TutorPanel({ onLogout }: TutorPanelProps) {
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>("estudiantes");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState<
    "TODOS" | "CRÍTICO" | "MEDIO" | "BAJO"
  >("TODOS");
  const [filterSeveridad, setFilterSeveridad] = useState<
    "TODAS" | "ALTA" | "MEDIA" | "BAJA"
  >("TODAS");

  const [students, setStudents] = useState<Student[]>([
    {
      id: "s1",
      dni: "87654321",
      lastNames: "García",
      firstNames: "Mateo",
      fullName: "García, Mateo",
      email: "mateo.garcia@example.com",
      avatarUrl:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=150",
      career: "Analista Programador Universitario",
      year: 2,
      legajo: "2021001",
      riskLevel: "CRÍTICO",
      riskValue: 8, // 0 to 10
      tramo: "INICIAL",
      lastRecalculation: "16/06/2026",
      statusAlerta: "NUEVA",
      gpa: 3.5,
      subjectsApproved: 4,
      subjectsTotal: 8,
      engagement: "Bajo",
      phone: "123-456-7890",
    },
    {
      id: "s2",
      dni: "76543210",
      lastNames: "López",
      firstNames: "Sofía",
      fullName: "López, Sofía",
      email: "sofia.lopez@example.com",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      career: "Analista Programador Universitario",
      year: 2,
      legajo: "2021014",
      riskLevel: "MEDIO",
      riskValue: 4.8,
      tramo: "INICIAL",
      lastRecalculation: "16/06/2026",
      statusAlerta: "SIN ALERTA",
      gpa: 6.8,
      subjectsApproved: 6,
      subjectsTotal: 8,
      engagement: "Medio",
      phone: "123-456-7891",
    },
  ]);

  // Entrevistas
  // FIX: antes studentId quedaba en "" para los dos registros, así que no
  // había forma de vincular la entrevista con el estudiante real.
  const [entrevistas, setEntrevistas] = useState<Entrevista[]>([
    {
      id: "e1",
      studentId: "s1",
      studentName: "García, Mateo",
      fecha: "16/06/2026",
      tipo: "Presencial",
      estado: "Pendiente",
      notas: "",
    },
    {
      id: "e2",
      studentId: "s2",
      studentName: "López, Sofía",
      fecha: "12/06/2026",
      tipo: "Virtual",
      estado: "Realizada",
      notas: "Alumna retomó regularidad. Acordamos seguimiento en 2 semanas.",
    },
  ]);

  // Intervenciones
  const [intervenciones, setIntervenciones] = useState<Intervencion[]>([]);

  // Alertas
  const [alertas, setAlertas] = useState<Alerta[]>([
    {
      id: "a1",
      studentId: "s1",
      studentName: "García, Mateo",
      tipo: "Riesgo Académico Crítico",
      severidad: "ALTA",
      descripcion:
        "El índice de riesgo recalculado supera el umbral crítico (8.00/10). Solo aprobó 4 de 8 materias del tramo inicial.",
      fecha: "16/06/2026",
      estado: "NUEVA",
    },
    {
      id: "a2",
      studentId: "s1",
      studentName: "García, Mateo",
      tipo: "Bajo Engagement",
      severidad: "MEDIA",
      descripcion:
        "Nivel de interacción con la plataforma reportado como Bajo durante las últimas dos semanas.",
      fecha: "14/06/2026",
      estado: "EN_REVISION",
    },
    {
      id: "a3",
      studentId: "s2",
      studentName: "López, Sofía",
      tipo: "Rendimiento",
      severidad: "BAJA",
      descripcion:
        "Promedio general por debajo del esperado. Se recomienda seguimiento preventivo.",
      fecha: "10/06/2026",
      estado: "RESUELTA",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );

  // Form nueva entrevista
  const [form, setForm] = useState({
    studentId: "",
    fecha: "",
    tipo: "Presencial" as "Presencial" | "Virtual",
    notas: "",
  });

  const [showIntervencionModal, setShowIntervencionModal] = useState(false);
  const [intervencionForm, setIntervencionForm] = useState({
    entrevistaId: "",
    tipo: "tutoria_academica" as Intervencion["tipo"],
    descripcion: "",
    resultado: "positivo" as Intervencion["resultado"],
  });

  const handleUpdateStudent = (updated: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s)),
    );
  };

  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.dni.includes(searchQuery) ||
      s.legajo.includes(searchQuery);
    const matchRisk =
      filterRisk === "TODOS" ||
      (filterRisk === "CRÍTICO" && s.riskLevel === "CRÍTICO") ||
      (filterRisk === "MEDIO" && s.riskLevel === "MEDIO") ||
      (filterRisk === "BAJO" &&
        (s.riskLevel === "BAJO" || s.riskLevel === "SEGURO"));
    return matchSearch && matchRisk;
  });

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const filteredAlertas = alertas.filter(
    (a) => filterSeveridad === "TODAS" || a.severidad === filterSeveridad,
  );

  const riskBadge = (level: string) => {
    switch (level) {
      case "CRÍTICO":
        return (
          <span className="bg-[#ffdad6] text-[#93000a] px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#ba1a1a] rounded-full animate-pulse" />
            CRÍTICO
          </span>
        );
      case "MEDIO":
        return (
          <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
            MEDIO
          </span>
        );
      default:
        return (
          <span className="bg-[#e2f3f5] text-[#006e6e] px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#006a6a] rounded-full" />
            BAJO
          </span>
        );
    }
  };

  const estadoBadge = (estado: Entrevista["estado"]) => {
    switch (estado) {
      case "Pendiente":
        return (
          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">
            Pendiente
          </span>
        );
      case "Realizada":
        return (
          <span className="bg-[#e2f3f5] text-[#006e6e] px-2 py-0.5 rounded text-[10px] font-bold">
            Realizada
          </span>
        );
      case "Cancelada":
        return (
          <span className="bg-[#f3f4f5] text-[#43474f] px-2 py-0.5 rounded text-[10px] font-bold">
            Cancelada
          </span>
        );
    }
  };

  const severityBadge = (severidad: Alerta["severidad"]) => {
    switch (severidad) {
      case "ALTA":
        return (
          <span className="bg-[#ffdad6] text-[#93000a] px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#ba1a1a] rounded-full animate-pulse" />
            ALTA
          </span>
        );
      case "MEDIA":
        return (
          <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
            MEDIA
          </span>
        );
      default:
        return (
          <span className="bg-[#e2f3f5] text-[#006e6e] px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#006a6a] rounded-full" />
            BAJA
          </span>
        );
    }
  };

  const estadoAlertaBadge = (estado: Alerta["estado"]) => {
    switch (estado) {
      case "NUEVA":
        return (
          <span className="bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded text-[10px] font-bold">
            Nueva
          </span>
        );
      case "EN_REVISION":
        return (
          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">
            En Revisión
          </span>
        );
      case "RESUELTA":
        return (
          <span className="bg-[#e2f3f5] text-[#006e6e] px-2 py-0.5 rounded text-[10px] font-bold">
            Resuelta
          </span>
        );
      default:
        return null;
    }
  };

  // Abre el modal de nueva entrevista con un estudiante precargado.
  // Centralizado porque lo usan tanto la tabla de estudiantes como las alertas.
  const abrirNuevaEntrevista = (studentId: string) => {
    setForm((f) => ({ ...f, studentId }));
    setShowModal(true);
    setActiveMenu("entrevistas");
  };

  const handleCrearEntrevista = (e: FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === form.studentId);
    if (!student) return;

    const nueva: Entrevista = {
      id: "e_" + Date.now(),
      studentId: form.studentId,
      studentName: `${student.lastNames}, ${student.firstNames}`,
      fecha: form.fecha,
      tipo: form.tipo,
      estado: "Pendiente",
      notas: form.notas,
    };

    setEntrevistas([nueva, ...entrevistas]);

    setShowModal(false);
    setForm({ studentId: "", fecha: "", tipo: "Presencial", notas: "" });
  };

  const handleCrearIntervencion = (e: FormEvent) => {
    e.preventDefault();
    const nueva: Intervencion = {
      id: "i_" + Date.now(),
      entrevistaId: intervencionForm.entrevistaId,
      tipo: intervencionForm.tipo,
      descripcion: intervencionForm.descripcion,
      resultado: intervencionForm.resultado,
      fecha: new Date().toLocaleDateString("es-AR"),
    };
    setIntervenciones([nueva, ...intervenciones]);
    setShowIntervencionModal(false);
    setIntervencionForm({
      entrevistaId: "",
      tipo: "tutoria_academica",
      descripcion: "",
      resultado: "positivo",
    });
  };

  const abrirIntervencionModal = (entrevistaId: string) => {
    setIntervencionForm((f) => ({ ...f, entrevistaId }));
    setShowIntervencionModal(true);
  };

  const markAsRealizada = (id: string) => {
    setEntrevistas((prev) =>
      prev.map((e) => (e.id === id ? { ...e, estado: "Realizada" } : e)),
    );
  };

  const markAsCancelada = (id: string) => {
    setEntrevistas((prev) =>
      prev.map((e) => (e.id === id ? { ...e, estado: "Cancelada" } : e)),
    );
  };

  const marcarEnRevision = (id: string) => {
    setAlertas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, estado: "EN_REVISION" } : a)),
    );
  };

  const resolverAlerta = (id: string) => {
    setAlertas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, estado: "RESUELTA" } : a)),
    );
  };

  const verEstudianteDesdeAlerta = (studentId: string) => {
    setActiveMenu("estudiantes");
    setSelectedStudentId(studentId);
  };

  // Stats rápidas
  const criticos = students.filter((s) => s.riskLevel === "CRÍTICO").length;
  const pendientes = entrevistas.filter((e) => e.estado === "Pendiente").length;
  const realizadas = entrevistas.filter((e) => e.estado === "Realizada").length;

  const alertasActivas = alertas.filter((a) => a.estado !== "RESUELTA");
  const alertasNuevas = alertas.filter((a) => a.estado === "NUEVA").length;
  const alertasEnRevision = alertas.filter(
    (a) => a.estado === "EN_REVISION",
  ).length;
  const alertasResueltas = alertas.filter(
    (a) => a.estado === "RESUELTA",
  ).length;

  return (
    <div className="min-h-screen flex text-[#191c1d] bg-[#f8f9fa]">
      {/* Sidebar */}
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
            onClick={() => {
              setActiveMenu("estudiantes");
              setSelectedStudentId(null);
            }}
            className={`w-full flex items-center gap-3 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeMenu === "estudiantes"
                ? "text-brand-primary bg-[#edeeef] border-r-4 border-brand-primary"
                : "text-[#43474f] hover:text-brand-primary hover:bg-[#f3f4f5]"
            }`}
          >
            <span className="material-symbols-outlined text-lg">groups</span>
            Mis Estudiantes
          </button>

          <button
            onClick={() => {
              setActiveMenu("entrevistas");
              setSelectedStudentId(null);
            }}
            className={`w-full flex items-center gap-3 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeMenu === "entrevistas"
                ? "text-brand-primary bg-[#edeeef] border-r-4 border-brand-primary"
                : "text-[#43474f] hover:text-brand-primary hover:bg-[#f3f4f5]"
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              event_note
            </span>
            <span className="flex-1 text-left">Entrevistas</span>
            {pendientes > 0 && (
              <span className="bg-brand-primary text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                {pendientes}
              </span>
            )}
          </button>

          {/* FIX: este botón estaba mal pegado dentro del <form> del modal
              de "Nueva Entrevista" y referenciaba una variable
              "alertasActivas" inexistente, lo que rompía la compilación. */}
          <button
            onClick={() => {
              setActiveMenu("alertas");
              setSelectedStudentId(null);
            }}
            className={`w-full flex items-center gap-3 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeMenu === "alertas"
                ? "text-brand-primary bg-[#edeeef] border-r-4 border-brand-primary"
                : "text-[#43474f] hover:text-brand-primary hover:bg-[#f3f4f5]"
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              notifications_active
            </span>
            <span className="flex-1 text-left">Alertas</span>
            {alertasActivas.length > 0 && (
              <span className="bg-brand-error text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                {alertasActivas.length}
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

      {/* Main */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        <header className="bg-white border-b border-brand-outline-variant h-16 flex items-center justify-between px-8 sticky top-0 z-10 shadow-xs">
          <h2 className="text-sm font-black text-brand-primary uppercase tracking-widest">
            {activeMenu === "estudiantes"
              ? "Mis Estudiantes Asignados"
              : activeMenu === "entrevistas"
                ? "Entrevistas y Seguimientos"
                : "Alertas de Riesgo Académico"}
          </h2>
          {activeMenu === "entrevistas" && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 bg-brand-primary text-white py-2 px-4 rounded text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Nueva Entrevista
            </button>
          )}
        </header>

        <main className="p-8 flex-1 space-y-6 max-w-6xl w-full mx-auto">
          {/* ── ESTUDIANTES ── */}
          {activeMenu === "estudiantes" && (
            selectedStudent ? (
              <StudentProfileView
                student={selectedStudent}
                onBack={() => setSelectedStudentId(null)}
                onUpdateStudent={handleUpdateStudent}
              />
            ) : (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
                    <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                      ASIGNADOS
                    </span>
                    <span className="text-3xl font-black text-brand-primary mt-1 block">
                      {students.length}
                    </span>
                    <p className="text-[10px] text-brand-outline mt-1 font-medium">
                      estudiantes a cargo
                    </p>
                  </div>
                  <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
                    <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                      RIESGO CRÍTICO
                    </span>
                    <span className="text-3xl font-black text-brand-error mt-1 block">
                      {criticos}
                    </span>
                    <p className="text-[10px] text-brand-outline mt-1 font-medium">
                      requieren atención inmediata
                    </p>
                  </div>
                  <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
                    <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                      ENTREVISTAS PENDIENTES
                    </span>
                    <span className="text-3xl font-black text-amber-600 mt-1 block">
                      {pendientes}
                    </span>
                    <p className="text-[10px] text-brand-outline mt-1 font-medium">
                      sin concretar aún
                    </p>
                  </div>
                </div>

                {/* Filtros */}
                <div className="bg-white border border-brand-outline-variant rounded p-4 flex flex-wrap gap-4 items-center shadow-xs text-xs font-semibold">
                  <div className="relative flex-1 min-w-48">
                    <span className="material-symbols-outlined absolute left-2.5 top-2 text-brand-outline text-lg">
                      search
                    </span>
                    <input
                      type="text"
                      placeholder="Buscar por nombre, DNI o legajo..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 border border-brand-outline-variant rounded bg-[#f3f4f5] text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                    />
                  </div>
                  <div className="flex border border-brand-outline-variant rounded overflow-hidden">
                    {(["TODOS", "CRÍTICO", "MEDIO", "BAJO"] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setFilterRisk(r)}
                        className={`px-3 py-1.5 font-bold cursor-pointer border-l first:border-l-0 border-brand-outline-variant transition-colors ${
                          filterRisk === r
                            ? r === "CRÍTICO"
                              ? "bg-[#ffdad6] text-[#ba1a1a]"
                              : r === "MEDIO"
                                ? "bg-amber-100 text-amber-800"
                                : r === "BAJO"
                                  ? "bg-[#e2f3f5] text-[#006e6e]"
                                  : "bg-brand-primary text-white"
                            : "bg-white text-brand-primary"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tabla */}
                <div className="bg-white border border-brand-outline-variant rounded shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#edeeef] text-[#43474f] font-bold uppercase tracking-wider">
                          <th className="p-3 pl-5 text-left border-b border-brand-outline-variant">
                            Estudiante
                          </th>
                          <th className="p-3 text-center border-b border-brand-outline-variant">
                            Tramo
                          </th>
                          <th className="p-3 text-center border-b border-brand-outline-variant">
                            Índice Riesgo
                          </th>
                          <th className="p-3 text-center border-b border-brand-outline-variant">
                            Nivel
                          </th>
                          <th className="p-3 text-center border-b border-brand-outline-variant">
                            Alertas
                          </th>
                          <th className="p-3 text-center border-b border-brand-outline-variant">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-outline-variant">
                        {filteredStudents.map((s) => {
                          const alertasDelEstudiante = alertas.filter(
                            (a) =>
                              a.studentId === s.id && a.estado !== "RESUELTA",
                          ).length;
                          return (
                            <tr
                              key={s.id}
                              className="hover:bg-[#f8f9fa] transition-colors"
                            >
                              <td className="p-3 pl-5">
                                <button
                                  onClick={() => setSelectedStudentId(s.id)}
                                  className="font-bold text-brand-primary hover:underline text-left cursor-pointer"
                                >
                                  {s.lastNames}, {s.firstNames}
                                </button>
                                <div className="text-[10px] text-brand-outline font-semibold">
                                  DNI: {s.dni} | {s.career}
                                </div>
                              </td>
                              <td className="p-3 text-center">
                                <span className="bg-[#edeeef] text-[#43474f] px-2 py-0.5 rounded text-[10px] font-bold">
                                  TRAMO {s.tramo}
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                <span
                                  className={`font-black text-xs ${s.riskValue >= 7.5 ? "text-[#ba1a1a]" : s.riskValue >= 4 ? "text-amber-600" : "text-[#006e6e]"}`}
                                >
                                  {s.riskValue.toFixed(2)}
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                {riskBadge(s.riskLevel)}
                              </td>
                              <td className="p-3 text-center">
                                {alertasDelEstudiante > 0 ? (
                                  <button
                                    onClick={() => {
                                      setActiveMenu("alertas");
                                      setSelectedStudentId(null);
                                    }}
                                    title="Ver alertas activas"
                                    className="bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded text-[10px] font-bold hover:bg-[#ffc6c1] transition-colors cursor-pointer"
                                  >
                                    {alertasDelEstudiante} activa
                                    {alertasDelEstudiante > 1 ? "s" : ""}
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-brand-outline font-semibold">
                                    —
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => setSelectedStudentId(s.id)}
                                    title="Ver perfil completo"
                                    className="p-1 text-brand-primary hover:bg-brand-primary-container/10 rounded transition-all cursor-pointer"
                                  >
                                    <span className="material-symbols-outlined text-base">
                                      visibility
                                    </span>
                                  </button>
                                  <button
                                    onClick={() => abrirNuevaEntrevista(s.id)}
                                    className="text-brand-primary hover:underline font-bold text-[10px] flex items-center gap-1"
                                  >
                                    <span className="material-symbols-outlined text-sm">
                                      event_note
                                    </span>
                                    Agendar
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {filteredStudents.length === 0 && (
                          <tr>
                            <td
                              colSpan={6}
                              className="p-8 text-center text-brand-outline font-medium"
                            >
                              No se encontraron estudiantes.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-3 bg-[#f8f9fa] border-t border-brand-outline-variant text-[10px] text-[#43474f] font-semibold">
                    Mostrando {filteredStudents.length} de {students.length}{" "}
                    estudiantes
                  </div>
                </div>
              </div>
            )
          )}

          {/* ── ENTREVISTAS ── */}
          {activeMenu === "entrevistas" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                    <span className="material-symbols-outlined text-2xl">
                      pending_actions
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                      PENDIENTES
                    </span>
                    <span className="text-2xl font-extrabold text-amber-600">
                      {pendientes}
                    </span>
                  </div>
                </div>
                <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#e2f3f5] flex items-center justify-center text-[#006a6a]">
                    <span className="material-symbols-outlined text-2xl">
                      check_circle
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                      REALIZADAS
                    </span>
                    <span className="text-2xl font-extrabold text-[#006a6a]">
                      {realizadas}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-brand-outline-variant rounded shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-brand-outline-variant bg-[#f8f9fa] flex justify-between items-center">
                  <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-lg">
                      event_note
                    </span>
                    Historial de Entrevistas
                  </h4>
                  <span className="text-[10px] text-brand-outline font-bold">
                    {entrevistas.length} registros
                  </span>
                </div>

                <div className="divide-y divide-brand-outline-variant">
                  {entrevistas.map((e) => (
                    <div
                      key={e.id}
                      className="p-5 hover:bg-[#f8f9fa] transition-colors flex flex-col md:flex-row md:items-start justify-between gap-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-brand-primary">
                            {e.studentName}
                          </span>
                          {estadoBadge(e.estado)}
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${e.tipo === "Virtual" ? "bg-[#eef2ff] text-brand-primary" : "bg-[#f3f4f5] text-[#43474f]"}`}
                          >
                            {e.tipo}
                          </span>
                        </div>
                        <p className="text-[11px] text-brand-outline font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">
                            calendar_today
                          </span>
                          {e.fecha}
                        </p>
                        {e.notas && (
                          <p className="text-xs text-[#43474f] leading-relaxed max-w-lg italic">
                            "{e.notas}"
                          </p>
                        )}
                        {(() => {
                          const interv = intervenciones.find(
                            (i) => i.entrevistaId === e.id,
                          );
                          if (!interv) return null;
                          return (
                            <div className="mt-2 p-2.5 bg-[#eef2ff] border border-brand-primary/20 rounded">
                              <p className="text-[10px] font-bold text-brand-primary uppercase tracking-wider mb-1">
                                Intervención registrada
                              </p>
                              <p className="text-[10px] text-[#43474f] font-semibold">
                                Tipo:{" "}
                                {interv.tipo === "tutoria_academica"
                                  ? "Tutoría Académica"
                                  : interv.tipo === "derivacion"
                                    ? "Derivación"
                                    : interv.tipo === "seguimiento_virtual"
                                      ? "Seguimiento Virtual"
                                      : interv.tipo === "asesoria_par"
                                        ? "Asesoría Par"
                                        : "Otro"}
                              </p>
                              {interv.descripcion && (
                                <p className="text-[10px] text-[#43474f] mt-0.5">
                                  "{interv.descripcion}"
                                </p>
                              )}
                              <p className="text-[10px] text-[#43474f] font-semibold mt-0.5">
                                Resultado:{" "}
                                {interv.resultado === "positivo"
                                  ? "Positivo"
                                  : interv.resultado === "neutro"
                                    ? "Neutro"
                                    : interv.resultado === "negativo"
                                      ? "Negativo"
                                      : "Sin Contacto"}
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                      {e.estado === "Pendiente" && (
                        <div className="flex gap-2 self-start">
                          <button
                            onClick={() => markAsRealizada(e.id)}
                            className="text-[10px] font-bold text-[#006a6a] border border-[#006a6a]/30 bg-[#e2f3f5] hover:bg-[#c8eeee] px-3 py-1.5 rounded transition-all whitespace-nowrap"
                          >
                            Marcar como realizada
                          </button>
                          <button
                            onClick={() => markAsCancelada(e.id)}
                            className="text-[10px] font-bold text-[#43474f] border border-brand-outline-variant bg-[#f3f4f5] hover:bg-[#edeeef] px-3 py-1.5 rounded transition-all whitespace-nowrap"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                      {e.estado === "Realizada" &&
                        !intervenciones.find((i) => i.entrevistaId === e.id) && (
                          <div className="flex gap-2 self-start">
                            <button
                              onClick={() => abrirIntervencionModal(e.id)}
                              className="text-[10px] font-bold text-brand-primary border border-brand-primary/30 bg-[#eef2ff] hover:bg-[#dde3fb] px-3 py-1.5 rounded transition-all whitespace-nowrap"
                            >
                              Vincular a intervención
                            </button>
                          </div>
                        )}
                    </div>
                  ))}

                  {entrevistas.length === 0 && (
                    <div className="p-12 text-center text-brand-outline font-medium text-xs">
                      No hay entrevistas registradas. Agendá la primera con el
                      botón de arriba.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── ALERTAS ── */}
          {activeMenu === "alertas" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
                  <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                    ALERTAS NUEVAS
                  </span>
                  <span className="text-3xl font-black text-brand-error mt-1 block">
                    {alertasNuevas}
                  </span>
                  <p className="text-[10px] text-brand-outline mt-1 font-medium">
                    sin revisar todavía
                  </p>
                </div>
                <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
                  <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                    EN REVISIÓN
                  </span>
                  <span className="text-3xl font-black text-amber-600 mt-1 block">
                    {alertasEnRevision}
                  </span>
                  <p className="text-[10px] text-brand-outline mt-1 font-medium">
                    siendo evaluadas
                  </p>
                </div>
                <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
                  <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                    RESUELTAS
                  </span>
                  <span className="text-3xl font-black text-[#006a6a] mt-1 block">
                    {alertasResueltas}
                  </span>
                  <p className="text-[10px] text-brand-outline mt-1 font-medium">
                    cerradas con seguimiento
                  </p>
                </div>
              </div>

              {/* Filtro de severidad */}
              <div className="bg-white border border-brand-outline-variant rounded p-4 flex flex-wrap gap-4 items-center shadow-xs text-xs font-semibold">
                <span className="text-[11px] font-bold text-[#43474f] uppercase tracking-wider">
                  Severidad:
                </span>
                <div className="flex border border-brand-outline-variant rounded overflow-hidden">
                  {(["TODAS", "ALTA", "MEDIA", "BAJA"] as const).map((sev) => (
                    <button
                      key={sev}
                      onClick={() => setFilterSeveridad(sev)}
                      className={`px-3 py-1.5 font-bold cursor-pointer border-l first:border-l-0 border-brand-outline-variant transition-colors ${
                        filterSeveridad === sev
                          ? sev === "ALTA"
                            ? "bg-[#ffdad6] text-[#ba1a1a]"
                            : sev === "MEDIA"
                              ? "bg-amber-100 text-amber-800"
                              : sev === "BAJA"
                                ? "bg-[#e2f3f5] text-[#006e6e]"
                                : "bg-brand-primary text-white"
                          : "bg-white text-brand-primary"
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista de alertas */}
              <div className="bg-white border border-brand-outline-variant rounded shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-brand-outline-variant bg-[#f8f9fa] flex justify-between items-center">
                  <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-lg">
                      notifications_active
                    </span>
                    Alertas de Riesgo
                  </h4>
                  <span className="text-[10px] text-brand-outline font-bold">
                    {filteredAlertas.length} de {alertas.length} registros
                  </span>
                </div>

                <div className="divide-y divide-brand-outline-variant">
                  {filteredAlertas.map((a) => (
                    <div
                      key={a.id}
                      className="p-5 hover:bg-[#f8f9fa] transition-colors flex flex-col md:flex-row md:items-start justify-between gap-3"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-brand-primary">
                            {a.studentName}
                          </span>
                          {severityBadge(a.severidad)}
                          {estadoAlertaBadge(a.estado)}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f3f4f5] text-[#43474f]">
                            {a.tipo}
                          </span>
                        </div>
                        <p className="text-[11px] text-brand-outline font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">
                            calendar_today
                          </span>
                          {a.fecha}
                        </p>
                        <p className="text-xs text-[#43474f] leading-relaxed max-w-lg">
                          {a.descripcion}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 self-start">
                        {a.estado === "NUEVA" && (
                          <button
                            onClick={() => marcarEnRevision(a.id)}
                            className="text-[10px] font-bold text-amber-800 border border-amber-300 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded transition-all whitespace-nowrap"
                          >
                            Marcar en Revisión
                          </button>
                        )}
                        {a.estado !== "RESUELTA" && (
                          <button
                            onClick={() => resolverAlerta(a.id)}
                            className="text-[10px] font-bold text-[#006a6a] border border-[#006a6a]/30 bg-[#e2f3f5] hover:bg-[#c8eeee] px-3 py-1.5 rounded transition-all whitespace-nowrap"
                          >
                            Resolver
                          </button>
                        )}
                        <button
                          onClick={() => abrirNuevaEntrevista(a.studentId)}
                          className="text-[10px] font-bold text-brand-primary border border-brand-primary/30 bg-[#eef2ff] hover:bg-[#dde3fb] px-3 py-1.5 rounded transition-all whitespace-nowrap flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">
                            event_note
                          </span>
                          Agendar Entrevista
                        </button>
                        <button
                          onClick={() => verEstudianteDesdeAlerta(a.studentId)}
                          className="text-[10px] font-bold text-[#43474f] border border-brand-outline-variant bg-[#f3f4f5] hover:bg-[#edeeef] px-3 py-1.5 rounded transition-all whitespace-nowrap"
                        >
                          Ver Estudiante
                        </button>
                      </div>
                    </div>
                  ))}

                  {filteredAlertas.length === 0 && (
                    <div className="p-12 text-center text-brand-outline font-medium text-xs">
                      No hay alertas que coincidan con el filtro seleccionado.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal nueva entrevista */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="nueva-entrevista-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191c1d]/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="bg-white border border-brand-outline-variant rounded shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-brand-outline-variant pb-3">
              <h2
                id="nueva-entrevista-title"
                className="text-base font-bold text-brand-primary flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-xl">
                  event_note
                </span>
                Nueva Entrevista
              </h2>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Cerrar"
                className="text-brand-outline hover:text-brand-error cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form
              onSubmit={handleCrearEntrevista}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                  Estudiante
                </label>
                <select
                  required
                  value={form.studentId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, studentId: e.target.value }))
                  }
                  className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                >
                  <option value="">Seleccioná un estudiante...</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.lastNames}, {s.firstNames} — {s.riskLevel}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    required
                    value={form.fecha}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, fecha: e.target.value }))
                    }
                    className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                    Modalidad
                  </label>
                  <select
                    value={form.tipo}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        tipo: e.target.value as "Presencial" | "Virtual",
                      }))
                    }
                    className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                  >
                    <option value="Presencial">Presencial</option>
                    <option value="Virtual">Virtual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                  Notas previas (opcional)
                </label>
                <textarea
                  rows={3}
                  value={form.notas}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notas: e.target.value }))
                  }
                  placeholder="Motivo de la entrevista, puntos a tratar..."
                  className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                />
              </div>

              {/* FIX: el botón de "Alertas" que estaba acá adentro se movió
                  al <nav> del sidebar, donde corresponde. Ahora el modal
                  solo tiene las dos acciones que le corresponden. */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-brand-outline-variant text-[#43474f] rounded text-xs font-semibold hover:bg-[#edeeef] transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-primary text-white rounded text-xs font-bold hover:opacity-90 transition-all"
                >
                  Agendar Entrevista
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal registrar intervención */}
      {showIntervencionModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="registrar-intervencion-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191c1d]/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="bg-white border border-brand-outline-variant rounded shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-brand-outline-variant pb-3">
              <h2
                id="registrar-intervencion-title"
                className="text-base font-bold text-brand-primary flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-xl">
                  assignment
                </span>
                Registrar Intervención
              </h2>
              <button
                onClick={() => setShowIntervencionModal(false)}
                aria-label="Cerrar"
                className="text-brand-outline hover:text-brand-error cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form
              onSubmit={handleCrearIntervencion}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                  Tipo de intervención
                </label>
                <select
                  required
                  value={intervencionForm.tipo}
                  onChange={(e) =>
                    setIntervencionForm((f) => ({
                      ...f,
                      tipo: e.target.value as Intervencion["tipo"],
                    }))
                  }
                  className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                >
                  <option value="tutoria_academica">Tutoría Académica</option>
                  <option value="derivacion">Derivación</option>
                  <option value="seguimiento_virtual">
                    Seguimiento Virtual
                  </option>
                  <option value="asesoria_par">Asesoría Par</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                  Descripción
                </label>
                <textarea
                  required
                  rows={4}
                  value={intervencionForm.descripcion}
                  onChange={(e) =>
                    setIntervencionForm((f) => ({
                      ...f,
                      descripcion: e.target.value,
                    }))
                  }
                  placeholder="Describí lo ocurrido durante la intervención..."
                  className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                  Resultado observado
                </label>
                <select
                  required
                  value={intervencionForm.resultado}
                  onChange={(e) =>
                    setIntervencionForm((f) => ({
                      ...f,
                      resultado: e.target.value as Intervencion["resultado"],
                    }))
                  }
                  className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                >
                  <option value="positivo">Positivo</option>
                  <option value="neutro">Neutro</option>
                  <option value="negativo">Negativo</option>
                  <option value="sin_contacto">Sin Contacto</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIntervencionModal(false)}
                  className="px-4 py-2 border border-brand-outline-variant text-[#43474f] rounded text-xs font-semibold hover:bg-[#edeeef] transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-primary text-white rounded text-xs font-bold hover:opacity-90 transition-all"
                >
                  Registrar Intervención
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
