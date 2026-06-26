import { useState } from "react";

export interface StudentSurvey {
  id: string;
  title: string;
  description: string;
  category: string;
  dueDate?: string;
  status: "PENDIENTE" | "COMPLETADA";
  completedAt?: string;
  questions: Question[];
}

interface Question {
  id: string;
  question: string;
  type: "select" | "text";
  options?: string[];
  value: string;
}

interface EncuestasViewProps {
  surveys: StudentSurvey[];
  onSurveysChange: (surveys: StudentSurvey[]) => void;
  onShowToast: (text: string, variant?: "success" | "error" | "info") => void;
}

export default function EncuestasView({
  surveys,
  onSurveysChange,
  onShowToast,
}: EncuestasViewProps) {
  const [selectedSurveyToFill, setSelectedSurveyToFill] =
    useState<StudentSurvey | null>(null);
  const [selectedSurveyToInspect, setSelectedSurveyToInspect] =
    useState<StudentSurvey | null>(null);
  const [activeSurveyTab, setActiveSurveyTab] = useState<
    "pendientes" | "completadas"
  >("pendientes");

  const pendingSurveys = surveys.filter((s) => s.status === "PENDIENTE");
  const completedSurveys = surveys.filter((s) => s.status === "COMPLETADA");

  const handleSurveyOptionChange = (questionId: string, newValue: string) => {
    if (!selectedSurveyToFill) return;
    const updatedQuestions = selectedSurveyToFill.questions.map((q) =>
      q.id === questionId ? { ...q, value: newValue } : q,
    );
    setSelectedSurveyToFill({
      ...selectedSurveyToFill,
      questions: updatedQuestions,
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSurveyToFill) return;

    const missingAnswer = selectedSurveyToFill.questions.find(
      (q) => q.type === "select" && !q.value,
    );
    if (missingAnswer) {
      onShowToast(
        "Faltan preguntas por responder. Revisá el formulario antes de enviarlo.",
        "error",
      );
      return;
    }

    onSurveysChange(
      surveys.map((s) =>
        s.id === selectedSurveyToFill.id
          ? {
              ...s,
              status: "COMPLETADA" as const,
              completedAt: new Date().toLocaleDateString("es-AR"),
              questions: selectedSurveyToFill.questions,
            }
          : s,
      ),
    );

    setSelectedSurveyToFill(null);
    onShowToast(
      "¡Encuesta enviada exitosamente! Tu aporte ayuda a perfeccionar las trayectorias de la Facultad de Ingeniería.",
      "success",
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <span className="text-xs font-bold text-brand-primary uppercase tracking-wider bg-[#eef2ff] px-3 py-1 rounded-lg">
          Estudiante Mateo García
        </span>
        <h3 className="text-3xl font-bold tracking-tight text-slate-800 mt-2">
          Mis Encuestas y Relevamientos
        </h3>
        <p className="text-slate-500 font-medium text-sm mt-1 leading-normal">
          Responde las encuestas planificadas por el cuerpo de tutores.
          Tus respuestas nos permiten modelar de forma proactiva tu
          trayecto formativo, evitar la inactividad y brindarte apoyo
          continuo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
            <span className="material-symbols-outlined text-2xl">pending_actions</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
              ENCUESTAS PENDIENTES
            </span>
            <span className="text-2xl font-extrabold text-slate-800 mt-0.5 block">
              {pendingSurveys.length} para completar
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <span className="material-symbols-outlined text-2xl">check_circle</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
              ENCUESTAS COMPLETADAS
            </span>
            <span className="text-2xl font-extrabold text-slate-800 mt-0.5 block">
              {completedSurveys.length} registradas
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            <span className="material-symbols-outlined text-2xl">insights</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
              RETROALIMENTACIÓN ACTIVA
            </span>
            <span className="text-2xl font-extrabold text-slate-800 mt-0.5 block">
              100% Confidencial
            </span>
          </div>
        </div>
      </div>

      <div className="flex border-b border-slate-200" role="tablist">
        <button
          role="tab"
          aria-selected={activeSurveyTab === "pendientes"}
          onClick={() => setActiveSurveyTab("pendientes")}
          className={`py-3.5 px-6 text-sm font-bold tracking-tight border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeSurveyTab === "pendientes"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <span className="material-symbols-outlined text-lg">pending</span>
          Pendientes de Respuesta
          {pendingSurveys.length > 0 && (
            <span className="bg-brand-primary text-white text-[10px] px-1.5 py-0.5 rounded-full font-black ml-1">
              {pendingSurveys.length}
            </span>
          )}
        </button>
        <button
          role="tab"
          aria-selected={activeSurveyTab === "completadas"}
          onClick={() => setActiveSurveyTab("completadas")}
          className={`py-3.5 px-6 text-sm font-bold tracking-tight border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeSurveyTab === "completadas"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <span className="material-symbols-outlined text-lg">task_alt</span>
          Historial y Respuestas Enviadas
          <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1">
            {completedSurveys.length}
          </span>
        </button>
      </div>

      {activeSurveyTab === "pendientes" ? (
        <div className="space-y-6">
          {pendingSurveys.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingSurveys.map((ps) => (
                <div
                  key={ps.id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-200 transition-all duration-300 shadow-xs relative"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase bg-indigo-50 text-brand-primary px-3 py-1 rounded-lg">
                        {ps.category}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-base leading-snug">
                      {ps.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {ps.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {ps.questions.length} Cuestionamientos
                    </span>
                    <button
                      onClick={() => setSelectedSurveyToFill(ps)}
                      className="bg-brand-primary text-white hover:opacity-90 font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">rate_review</span>
                      Completar Formulario
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-4xl">emoji_events</span>
              </div>
              <h4 className="font-bold text-slate-800 text-lg">
                ¡Excelente trabajo académico!
              </h4>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                No posees encuestas de trayectorias pendientes por este
                ciclo estudiantil. Haz completado el 100% de los
                cuestionarios requeridos por tus tutores.
              </p>
              <button
                onClick={() => setActiveSurveyTab("completadas")}
                className="text-brand-primary font-bold text-xs hover:underline mt-2 inline-block bg-slate-50 px-4 py-2 rounded-lg"
              >
                Revisar Respuestas Históricas
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {completedSurveys.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedSurveys.map((cs) => (
                <div
                  key={cs.id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-300 transition-all duration-300 shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px] font-black">done</span>
                        completada
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        Enviado: {cs.completedAt}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-base leading-snug">
                      {cs.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {cs.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Categoría: {cs.category}
                    </span>
                    <button
                      onClick={() => setSelectedSurveyToInspect(cs)}
                      className="border border-slate-200 hover:bg-slate-50 text-brand-primary font-bold text-xs py-2 px-4 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">visibility</span>
                      Ver Mis Respuestas
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
              No hay registros archivados. Complete los cuestionarios
              activos para visualizar su historial.
            </div>
          )}
        </div>
      )}

      {selectedSurveyToFill && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="survey-fill-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full p-8 space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-brand-primary uppercase bg-[#eef2ff] px-2.5 py-1 rounded-lg">
                  {selectedSurveyToFill.category}
                </span>
                <h2 id="survey-fill-title" className="text-lg font-black text-slate-800 flex items-center gap-2 mt-2 leading-tight">
                  <span className="material-symbols-outlined text-2xl text-brand-secondary">ballot</span>
                  {selectedSurveyToFill.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedSurveyToFill(null)}
                aria-label="Cerrar formulario"
                className="text-slate-400 hover:text-red-500 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6 text-xs text-slate-600 font-semibold">
              <div className="max-h-[380px] overflow-y-auto pr-2 space-y-5">
                {selectedSurveyToFill.questions.map((q, index) => (
                  <div key={q.id} className="space-y-2.5 pt-1">
                    {q.type === "text" ? (
                      <label htmlFor={q.id} className="text-slate-800 font-bold block leading-relaxed">
                        {index + 1}. {q.question}
                      </label>
                    ) : (
                      <p id={`${q.id}-label`} className="text-slate-800 font-bold block leading-relaxed">
                        {index + 1}. {q.question}
                        {!q.value && (
                          <span className="text-red-500 ml-1" aria-label="obligatorio">*</span>
                        )}
                      </p>
                    )}

                    {q.type === "select" && q.options && (
                      <div role="group" aria-labelledby={`${q.id}-label`} className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                        {q.options.map((opt) => (
                          <button
                            type="button"
                            key={opt}
                            aria-pressed={q.value === opt}
                            onClick={() => handleSurveyOptionChange(q.id, opt)}
                            className={`p-2.5 border rounded-xl font-bold capitalize transition-all text-center ${
                              q.value === opt
                                ? "bg-brand-primary text-white border-brand-primary"
                                : "bg-white text-brand-primary border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            {opt === "no_aplica" ? "No Aplica" : opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {q.type === "text" && (
                      <textarea
                        id={q.id}
                        value={q.value}
                        onChange={(e) => handleSurveyOptionChange(q.id, e.target.value)}
                        rows={3}
                        placeholder="Por favor, relate cualquier otra consideración para tu tutor aquí..."
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-slate-800 bg-slate-50 focus:outline-none transition-all"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedSurveyToFill(null)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:opacity-95 transition-all shadow-xs"
                >
                  Enviar Respuestas Oficiales
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedSurveyToInspect && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="survey-inspect-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full p-8 space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-700 uppercase bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1.5 w-max">
                  <span className="material-symbols-outlined text-[10px] font-black">done</span>
                  Respuestas Archivadas • Enviada el {selectedSurveyToInspect.completedAt}
                </span>
                <h2 id="survey-inspect-title" className="text-lg font-black text-slate-800 flex items-center gap-2 mt-2 leading-tight">
                  <span className="material-symbols-outlined text-2xl text-emerald-600">assignment_turned_in</span>
                  {selectedSurveyToInspect.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedSurveyToInspect(null)}
                aria-label="Cerrar detalle de respuestas"
                className="text-slate-400 hover:text-red-500 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-6 text-xs text-slate-600 font-semibold max-h-[380px] overflow-y-auto pr-2">
              {selectedSurveyToInspect.questions.map((q, index) => (
                <div key={q.id} className="space-y-2 border-b border-dashed border-slate-100 pb-4 last:border-none last:pb-0">
                  <p className="text-slate-800 font-bold block leading-relaxed">
                    {index + 1}. {q.question}
                  </p>

                  {q.type === "select" ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {q.options?.map((opt) => {
                        const isValueChosen = q.value === opt;
                        return (
                          <span
                            key={opt}
                            className={`px-3 py-1.5 rounded-lg font-bold capitalize text-[10px] ${
                              isValueChosen
                                ? "bg-emerald-500 text-white shadow-xs"
                                : "bg-slate-100 text-slate-400 opacity-60"
                            }`}
                          >
                            {opt === "no_aplica" ? "No Aplica" : opt}
                            {isValueChosen && " ✓"}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium leading-relaxed italic">
                      "{q.value || "No se ingresaron comentarios adicionales para esta pregunta."}"
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">shield</span>
                Registro Oficial Cifrado
              </span>
              <button
                onClick={() => setSelectedSurveyToInspect(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
              >
                Cerrar Expediente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
