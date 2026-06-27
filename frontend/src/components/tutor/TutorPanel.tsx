import { useState, type FormEvent } from "react";
import type { Student } from "../../types/types";
import type { ActiveMenu, Entrevista, Intervencion, Alerta } from "./types";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import EstudiantesView from "./EstudiantesView";
import EntrevistasView from "./EntrevistasView";
import AlertasView from "./AlertasView";
import { useAuth } from "../../hooks/useAuth.ts";

interface TutorPanelProps {
  onLogout: () => void;
}

interface EntrevistaFormState {
  studentId: string;
  fecha: string;
  tipo: "Presencial" | "Virtual";
  notas: string;
}

interface IntervencionFormState {
  entrevistaId: string;
  tipo: Intervencion["tipo"];
  descripcion: string;
  resultado: Intervencion["resultado"];
}

const EMPTY_ENTREVISTA_FORM: EntrevistaFormState = {
  studentId: "",
  fecha: "",
  tipo: "Presencial",
  notas: "",
};

const EMPTY_INTERVENCION_FORM: IntervencionFormState = {
  entrevistaId: "",
  tipo: "tutoria_academica",
  descripcion: "",
  resultado: "positivo",
};

export default function TutorPanel({ onLogout }: TutorPanelProps) {
  const tutorId = useAuth().user?.id;
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>("estudiantes");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [showEntrevistaModal, setShowEntrevistaModal] = useState(false);
  const [showIntervencionModal, setShowIntervencionModal] = useState(false);
  const [entrevistaForm, setEntrevistaForm] = useState<EntrevistaFormState>(EMPTY_ENTREVISTA_FORM);
  const [intervencionForm, setIntervencionForm] = useState<IntervencionFormState>(EMPTY_INTERVENCION_FORM);

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
      riskValue: 8,
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

  const [intervenciones, setIntervenciones] = useState<Intervencion[]>([]);

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

  const handleUpdateStudent = (updated: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const abrirNuevaEntrevista = (studentId: string) => {
    setEntrevistaForm((f) => ({ ...f, studentId }));
    setShowEntrevistaModal(true);
    setActiveMenu("entrevistas");
  };

  const handleCrearEntrevista = (e: FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === entrevistaForm.studentId);
    if (!student) return;
    const nueva: Entrevista = {
      id: "e_" + Date.now(),
      studentId: entrevistaForm.studentId,
      studentName: `${student.lastNames}, ${student.firstNames}`,
      fecha: entrevistaForm.fecha,
      tipo: entrevistaForm.tipo,
      estado: "Pendiente",
      notas: entrevistaForm.notas,
    };
    setEntrevistas((prev) => [nueva, ...prev]);
    setShowEntrevistaModal(false);
    setEntrevistaForm(EMPTY_ENTREVISTA_FORM);
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
    setIntervenciones((prev) => [nueva, ...prev]);
    setShowIntervencionModal(false);
    setIntervencionForm(EMPTY_INTERVENCION_FORM);
  };

  const verEstudiante = (studentId: string) => {
    setSelectedStudentId(studentId);
    setActiveMenu("estudiantes");
  };

  const pendientes = entrevistas.filter((e) => e.estado === "Pendiente").length;
  const alertasActivas = alertas.filter((a) => a.estado !== "RESUELTA");

  return (
    <div className="min-h-screen flex text-[#191c1d] bg-[#f8f9fa]">
      <Sidebar
        activeMenu={activeMenu}
        pendientes={pendientes}
        alertasActivas={alertasActivas.length}
        onMenuChange={(menu) => {
          setActiveMenu(menu);
          if (menu !== "estudiantes") setSelectedStudentId(null);
        }}
        onLogout={onLogout}
      />

      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        <TopBar
          activeMenu={activeMenu}
          onNuevaEntrevista={() => abrirNuevaEntrevista("")}
        />

        <main className="p-8 flex-1 space-y-6 max-w-6xl w-full mx-auto">
          {activeMenu === "estudiantes" && (
            <EstudiantesView
              tutorId={tutorId}
              students={students}
              alertas={alertas}
              selectedStudentId={selectedStudentId}
              onSelectStudent={setSelectedStudentId}
              onUpdateStudent={handleUpdateStudent}
              onAbrirEntrevista={abrirNuevaEntrevista}
              onVerAlertas={() => setActiveMenu("alertas")}
            />
          )}

          {activeMenu === "entrevistas" && (
            <EntrevistasView
              entrevistas={entrevistas}
              intervenciones={intervenciones}
              students={students}
              showModal={showEntrevistaModal}
              showIntervencionModal={showIntervencionModal}
              entrevistaForm={entrevistaForm}
              intervencionForm={intervencionForm}
              onEntrevistaFormChange={setEntrevistaForm}
              onIntervencionFormChange={setIntervencionForm}
              onCrearEntrevista={handleCrearEntrevista}
              onCrearIntervencion={handleCrearIntervencion}
              onCerrarEntrevistaModal={() => {
                setShowEntrevistaModal(false);
                setEntrevistaForm(EMPTY_ENTREVISTA_FORM);
              }}
              onCerrarIntervencionModal={() => {
                setShowIntervencionModal(false);
                setIntervencionForm(EMPTY_INTERVENCION_FORM);
              }}
              onAbrirIntervencionModal={(entrevistaId) => {
                setIntervencionForm((f) => ({ ...f, entrevistaId }));
                setShowIntervencionModal(true);
              }}
              onMarcarRealizada={(id) =>
                setEntrevistas((prev) =>
                  prev.map((e) =>
                    e.id === id ? { ...e, estado: "Realizada" } : e,
                  ),
                )
              }
              onMarcarCancelada={(id) =>
                setEntrevistas((prev) =>
                  prev.map((e) =>
                    e.id === id ? { ...e, estado: "Cancelada" } : e,
                  ),
                )
              }
            />
          )}

          {activeMenu === "alertas" && (
            <AlertasView
              alertas={alertas}
              onMarcarEnRevision={(id) =>
                setAlertas((prev) =>
                  prev.map((a) =>
                    a.id === id ? { ...a, estado: "EN_REVISION" } : a,
                  ),
                )
              }
              onResolver={(id) =>
                setAlertas((prev) =>
                  prev.map((a) =>
                    a.id === id ? { ...a, estado: "RESUELTA" } : a,
                  ),
                )
              }
              onAbrirEntrevista={abrirNuevaEntrevista}
              onVerEstudiante={verEstudiante}
            />
          )}
        </main>
      </div>
    </div>
  );
}
