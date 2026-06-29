import { useState, useEffect } from "react";
import type { ActiveMenu } from "./types";
import type { Student } from "../../types/types";
import type { EntrevistaTutorResponse, IntervencionTutorResponse } from "../../types/admin_dep.ts";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import IntervencionesView from "./IntervencionesView";
import EntrevistasView from "./EntrevistasView";
import AlertasView from "./AlertasView";
import RevisionesPendientesView from "./RevisionesPendientesView";
import StudentProfileView from "../student/StudentProfileView";
import AgendarEntrevistaModal from "./AgendarEntrevistaModal";
import CompletarEntrevistaModal from "./CompletarEntrevistaModal";
import ElegirIntervencionModal from "./ElegirIntervencionModal";
import { useAuth } from "../../hooks/useAuth.ts";
import {
  useTutorAlertasSinAtender,
  useTutorIntervenciones,
  useTutorEntrevistas,
  useTutorEstudiantes,
  useGeneralEstudiante,
  useCrearTutorIntervencion,
  useCrearTutorEntrevista,
  useCompletarTutorEntrevista,
  useCancelarTutorEntrevista,
  useActualizarEstadoAlerta,
  useRevisionesPendientes,
  useAprobarRevision,
} from "../../hooks/queries/useTutorQueries.ts";
import { getRiskLevel } from "../../utils/studentMapping.ts";

interface TutorPanelProps {
  onLogout: () => void;
}

export default function TutorPanel({ onLogout }: TutorPanelProps) {
  const { user } = useAuth();
  const tutorId = user?.id;
  const carreraId = user?.carrera_id;

  const [activeMenu, setActiveMenu] = useState<ActiveMenu>("intervenciones");

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedEstudianteId, setSelectedEstudianteId] = useState<number | null>(null);

  const alertasQuery = useTutorAlertasSinAtender(carreraId);
  const intervencionesQuery = useTutorIntervenciones(tutorId);
  const entrevistasQuery = useTutorEntrevistas(tutorId);
  const estudiantesQuery = useTutorEstudiantes(tutorId);
  const generalQuery = useGeneralEstudiante(selectedEstudianteId);
  const revisionesQuery = useRevisionesPendientes(carreraId);
  const revisiones = revisionesQuery.data ?? [];
  const alertas = alertasQuery.data ?? [];
  const intervenciones = intervencionesQuery.data ?? [];
  const entrevistas = entrevistasQuery.data ?? [];
  const tutorEstudiantes = estudiantesQuery.data ?? [];
  const datosGenerales = generalQuery.data ?? null;

  useEffect(() => {
    if (!datosGenerales || !selectedStudent) return;
    setSelectedStudent((prev) =>
      prev
        ? {
            ...prev,
            year: datosGenerales.anio,
            subjectsApproved: datosGenerales.materias_aprobadas,
            subjectsTotal: datosGenerales.materias_totales,
          }
        : prev,
    );
  }, [datosGenerales]);

  const crearIntervencion = useCrearTutorIntervencion(tutorId, carreraId);
  const crearEntrevista = useCrearTutorEntrevista(tutorId);
  const completarEntrevista = useCompletarTutorEntrevista(tutorId);
  const cancelarEntrevista = useCancelarTutorEntrevista(tutorId);
  const actualizarEstado = useActualizarEstadoAlerta(carreraId);
  const aprobarRevision = useAprobarRevision(carreraId);

  const [intervencionModal, setIntervencionModal] =
    useState<{ alerta_id: number; estudiante_id: number } | null>(null);

  const handleAtender = (alerta_id: number, _estudiante_id: number) => {
    crearIntervencion.mutate({
      alerta_id,
      tutor_id: tutorId!,
      tipo: "seguimiento_virtual",
      resultado: "sin_contacto",
      fecha: new Date().toISOString().split("T")[0],
    });
  };

  const handleIntervenir = (alerta_id: number, estudiante_id: number) => {
    setIntervencionModal({ alerta_id, estudiante_id });
  };

  const handleIntervencionSubmit = async (data: {
    alerta_id: number;
    tutor_id: number;
    tipo: string;
    resultado: string;
    fecha: string;
    descripcion?: string;
    estudiante_id?: number;
  }) => {
    const created = await crearIntervencion.mutateAsync(data);
    setIntervencionModal(null);
    if (data.tipo === "entrevista" && data.estudiante_id) {
      setEntrevistaModal({
        id: created.id,
        alerta_id: data.alerta_id,
        estudiante_id: data.estudiante_id,
        estudiante_nombre: "",
        estudiante_apellido: "",
      } as IntervencionTutorResponse);
    }
  };

  const [entrevistaModal, setEntrevistaModal] =
    useState<IntervencionTutorResponse | null>(null);
  const [completarModal, setCompletarModal] =
    useState<EntrevistaTutorResponse | null>(null);

  const handleAgendarEntrevista = (intervencion: IntervencionTutorResponse) => {
    setEntrevistaModal(intervencion);
  };

  const handleAgendarSubmit = (data: {
    alerta_id: number;
    tutor_id: number;
    estudiante_id: number;
    fecha_propuesta: string;
    modalidad: string;
    notas_previas: string;
    intervencion_id: number;
  }) => {
    crearEntrevista.mutate(data);
    setEntrevistaModal(null);
  };

  const handleCompletarEntrevista = (e: EntrevistaTutorResponse) => {
    setCompletarModal(e);
  };

  const handleCompletarSubmit = (data: { entrevista_id: number; comentario: string; resultado: string }) => {
    completarEntrevista.mutate({ entrevista_id: data.entrevista_id, comentario: data.comentario });
    if (completarModal) {
      crearIntervencion.mutate({
        alerta_id: completarModal.alerta_id,
        tutor_id: completarModal.tutor_id,
        tipo: "entrevista",
        resultado: data.resultado,
        fecha: new Date().toISOString().split("T")[0],
        descripcion: data.comentario,
      });
    }
    setCompletarModal(null);
  };

  const handleCancelarEntrevista = (id: number) => {
    cancelarEntrevista.mutate(id);
  };

  const handleCambiarEstadoAlerta = (alerta_id: number, estado: string) => {
    actualizarEstado.mutate({ alerta_id, estado });
  };

  const handleSelectStudent = (dni: string, estudiante_id: number) => {
    const api = tutorEstudiantes.find((s) => s.dni === dni);
    let student: Student;
    if (api) {
      student = {
        id: api.dni,
        dni: api.dni,
        firstNames: api.nombre,
        lastNames: api.apellido,
        fullName: `${api.nombre} ${api.apellido}`,
        email: "",
        avatarUrl: "",
        career: api.carrera,
        year: 0,
        legajo: "",
        riskLevel: getRiskLevel(api.indice_riesgo),
        riskValue: api.indice_riesgo ?? 0,
        tramo: "INICIAL" as const,
        lastRecalculation:
          api.ultima_fecha_recalculo === null
            ? "-"
            : typeof api.ultima_fecha_recalculo === "string"
              ? api.ultima_fecha_recalculo
              : api.ultima_fecha_recalculo.toISOString(),
        statusAlerta: api.estado_alerta ?? "SIN ALERTA",
        gpa: 0,
        subjectsApproved: 0,
        subjectsTotal: 0,
        engagement: "Medio",
        phone: "",
      };
    } else {
      const iv = intervenciones.find((x) => x.estudiante_dni === dni);
      if (!iv) return;
      student = {
        id: dni,
        dni,
        firstNames: iv.estudiante_nombre,
        lastNames: iv.estudiante_apellido,
        fullName: `${iv.estudiante_nombre} ${iv.estudiante_apellido}`,
        email: "",
        avatarUrl: "",
        career: "",
        year: 0,
        legajo: "",
        riskLevel: "BAJO",
        riskValue: 0,
        tramo: "INICIAL" as const,
        lastRecalculation: "-",
        statusAlerta: "SIN ALERTA",
        gpa: 0,
        subjectsApproved: 0,
        subjectsTotal: 0,
        engagement: "Medio",
        phone: "",
      };
    }
    setSelectedEstudianteId(estudiante_id);
    setSelectedStudent(student);
  };

  const handleBackFromStudent = () => {
    setSelectedStudent(null);
    setSelectedEstudianteId(null);
  };

  const handleUpdateStudent = (updated: Student) => {
    setSelectedStudent(updated);
  };

  const pendientes = entrevistas.filter((e) => e.estado === "pendiente").length;
  const alertasActivas = alertas.length;
  const revisionesPendientes = revisiones.length;

  return (
    <div className="min-h-screen flex text-[#191c1d] bg-[#f8f9fa]">
      <Sidebar
        activeMenu={activeMenu}
        pendientes={pendientes}
        alertasActivas={alertasActivas}
        revisionesPendientes={revisionesPendientes}
        onMenuChange={(menu) => {
          setActiveMenu(menu);
          setSelectedStudent(null);
          setSelectedEstudianteId(null);
        }}
        onLogout={onLogout}
      />

      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        <TopBar activeMenu={activeMenu} />

        <main className="p-8 flex-1 space-y-6 max-w-6xl w-full mx-auto">
          {activeMenu === "intervenciones" && (
            <IntervencionesView
              intervenciones={intervenciones}
              isLoading={intervencionesQuery.isLoading}
              isError={intervencionesQuery.isError}
              onAgendarEntrevista={handleAgendarEntrevista}
              onIntervenir={handleIntervenir}
              onSelectStudent={handleSelectStudent}
            />
          )}

          {activeMenu === "entrevistas" && (
            <EntrevistasView
              entrevistas={entrevistas}
              isLoading={entrevistasQuery.isLoading}
              isError={entrevistasQuery.isError}
              onCompletar={handleCompletarEntrevista}
              onCancelar={handleCancelarEntrevista}
            />
          )}

          {activeMenu === "alertas" && (
            <AlertasView
              alertas={alertas}
              isLoading={alertasQuery.isLoading}
              isError={alertasQuery.isError}
              onAtender={handleAtender}
              onCambiarEstado={handleCambiarEstadoAlerta}
            />
          )}

          {activeMenu === "revisiones" && (
            <RevisionesPendientesView
              items={revisiones}
              isLoading={revisionesQuery.isLoading}
              isError={revisionesQuery.isError}
              onAprobar={async (respuesta_id, riesgo_calculado) => {
                await aprobarRevision.mutateAsync({ respuesta_id, riesgo_calculado });
              }}
            />
          )}
        </main>
      </div>
      {intervencionModal && (
        <ElegirIntervencionModal
          alerta_id={intervencionModal.alerta_id}
          estudiante_id={intervencionModal.estudiante_id}
          tutorId={tutorId!}
          onClose={() => setIntervencionModal(null)}
          onSubmit={handleIntervencionSubmit}
        />
      )}
      {entrevistaModal && (
        <AgendarEntrevistaModal
          intervencion={entrevistaModal}
          tutorId={tutorId!}
          onClose={() => setEntrevistaModal(null)}
          onSubmit={handleAgendarSubmit}
        />
      )}
      {completarModal && (
        <CompletarEntrevistaModal
          entrevista={completarModal}
          onClose={() => setCompletarModal(null)}
          onSubmit={handleCompletarSubmit}
        />
      )}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191c1d]/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-brand-outline-variant rounded shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <StudentProfileView
              student={selectedStudent}
              onBack={handleBackFromStudent}
              onUpdateStudent={handleUpdateStudent}
            />
          </div>
        </div>
      )}
    </div>
  );
}
