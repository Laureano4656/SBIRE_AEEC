import { useState } from "react";
import type { Survey } from "../../types/types.ts";
import SurveyEditor from "./SurveyEditor.tsx";
import SurveyResponsesModal from "./SurveyResponsesModal.tsx";

interface EncuestasViewProps {
  initialSurveys: Survey[];
}

export default function EncuestasView({ initialSurveys }: EncuestasViewProps) {
  const [localSurveys, setLocalSurveys] = useState<Survey[]>(initialSurveys);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);
  const [viewingResponsesSurvey, setViewingResponsesSurvey] =
    useState<Survey | null>(null);

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

  return (
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
                <tr key={sur.id} className="hover:bg-[#f8f9fa] transition-colors">
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
                      className={`px-2 py-0.5 rounded text-[10px] font-black inline-block ${
                        sur.status === "Activa"
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
                            onClick={() => setViewingResponsesSurvey(sur)}
                            className="text-brand-secondary hover:underline font-bold"
                          >
                            Ver Respuestas ({sur.responsesCount})
                          </button>
                          <button
                            onClick={() => {
                              const updated = localSurveys.map((s) =>
                                s.id === sur.id
                                  ? { ...s, status: "Finalizada" as const }
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
  );
}
