import { useState } from "react";
import type { ActiveMenu } from "./types";
import type { IntervencionTutorResponse } from "../../types/admin_dep.ts";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import IntervencionesView from "./IntervencionesView";
import EntrevistasView from "./EntrevistasView";
import AlertasView from "./AlertasView";
import { useAuth } from "../../hooks/useAuth.ts";
import {
  useTutorAlertasSinAtender,
  useTutorIntervenciones,
  useTutorEntrevistas,
  useCrearTutorIntervencion,
  useCrearTutorEntrevista,
  useCompletarTutorEntrevista,
  useCancelarTutorEntrevista,
  useActualizarEstadoAlerta,
} from "../../hooks/queries/useTutorQueries.ts";

interface TutorPanelProps {
  onLogout: () => void;
}

export default function TutorPanel({ onLogout }: TutorPanelProps) {
  const { user } = useAuth();
  const tutorId = user?.id;
  const carreraId = user?.carrera_id;

  const [activeMenu, setActiveMenu] = useState<ActiveMenu>("intervenciones");

  const alertasQuery = useTutorAlertasSinAtender(carreraId);
  const intervencionesQuery = useTutorIntervenciones(tutorId);
  const entrevistasQuery = useTutorEntrevistas(tutorId);
  const alertas = alertasQuery.data ?? [];
  const intervenciones = intervencionesQuery.data ?? [];
  const entrevistas = entrevistasQuery.data ?? [];

  const crearIntervencion = useCrearTutorIntervencion(tutorId, carreraId);
  const crearEntrevista = useCrearTutorEntrevista(tutorId);
  const completarEntrevista = useCompletarTutorEntrevista(tutorId);
  const cancelarEntrevista = useCancelarTutorEntrevista(tutorId);
  const actualizarEstado = useActualizarEstadoAlerta(carreraId);

  const handleAtender = (alerta_id: number) => {
    crearIntervencion.mutate({
      alerta_id,
      tutor_id: tutorId!,
      tipo: "seguimiento_virtual",
      resultado: "positivo",
      fecha: new Date().toISOString().split("T")[0],
    });
  };

  const handleAgendarEntrevista = (intervencion: IntervencionTutorResponse) => {
    crearEntrevista.mutate({
      alerta_id: intervencion.alerta_id,
      tutor_id: tutorId!,
      estudiante_id: intervencion.estudiante_id,
      fecha_propuesta: new Date().toISOString(),
      modalidad: "virtual",
      notas_previas: "",
      intervencion_id: intervencion.id,
    });
  };

  const handleCompletarEntrevista = (id: number) => {
    completarEntrevista.mutate(id);
  };

  const handleCancelarEntrevista = (id: number) => {
    cancelarEntrevista.mutate(id);
  };

  const handleCambiarEstadoAlerta = (alerta_id: number, estado: string) => {
    actualizarEstado.mutate({ alerta_id, estado });
  };

  const pendientes = entrevistas.filter((e) => e.estado === "pendiente").length;
  const alertasActivas = alertas.length;

  return (
    <div className="min-h-screen flex text-[#191c1d] bg-[#f8f9fa]">
      <Sidebar
        activeMenu={activeMenu}
        pendientes={pendientes}
        alertasActivas={alertasActivas}
        onMenuChange={(menu) => {
          setActiveMenu(menu);
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
        </main>
      </div>
    </div>
  );
}
