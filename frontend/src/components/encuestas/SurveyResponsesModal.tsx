import { useState } from "react";
import type { Survey } from "../types/types.ts";

interface SurveyResponsesModalProps {
  //survey: Survey;
  onClose: () => void;
}

export default function SurveyResponsesModal({

  onClose,
}: SurveyResponsesModalProps) {
  const { questions, responses } = survey;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResponses =
    responses?.filter((r) =>
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()),
    ) ?? [];

  const hasResponses = responses && responses.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191c1d]/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-brand-outline-variant rounded shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-outline-variant shrink-0">
          <div>
            <h2 className="text-base font-bold text-brand-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xl">ballot</span>
              {survey.title}
            </h2>
            <p className="text-xs text-[#43474f] mt-0.5">
              {survey.description}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="text-brand-outline hover:text-brand-error transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Stats bar */}
        <div className="flex gap-6 px-6 py-3 bg-[#f8f9fa] border-b border-brand-outline-variant text-xs shrink-0">
          <span className="font-semibold text-[#43474f]">
            Total respuestas:{" "}
            <span className="font-black text-brand-primary">
              {survey.responsesCount}
            </span>
          </span>
          <span className="font-semibold text-[#43474f]">
            Tasa de respuesta:{" "}
            <span className="font-black text-brand-primary">
              {survey.responseRate}%
            </span>
          </span>
          <div className="relative ml-auto">
            <span className="material-symbols-outlined absolute left-2 top-1.5 text-brand-outline text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar por estudiante..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 pl-7 pr-2.5 py-1 border border-brand-outline rounded bg-white text-xs focus:ring-1 focus:ring-brand-primary transition-all"
            />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!hasResponses ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="material-symbols-outlined text-5xl text-brand-outline mb-3">
                ballot
              </span>
              <p className="text-sm font-bold text-brand-primary">
                Sin respuestas todavía
              </p>
              <p className="text-xs text-brand-outline mt-1">
                Esta encuesta aún no ha recibido respuestas de los estudiantes.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {questions && questions.length > 0 && (
                <div className="bg-[#f8f9fa] border border-brand-outline-variant rounded p-4">
                  <h4 className="text-[10px] font-extrabold text-brand-outline uppercase tracking-wider mb-3">
                    Preguntas de la encuesta
                  </h4>
                  <div className="space-y-2">
                    {questions.map((q, idx) => (
                      <div key={q.id} className="text-xs flex gap-2">
                        <span className="font-black text-brand-primary shrink-0">
                          Q{idx + 1}.
                        </span>
                        <span className="text-[#43474f]">{q.texto}</span>
                        <span className="text-brand-outline italic">
                          ({q.tipo.replace("_", " ")})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Individual responses */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-brand-primary uppercase tracking-wider">
                  Respuestas individuales ({searchQuery
                    ? `${filteredResponses.length} de ${responses.length}`
                    : responses.length})
                </h4>

                {filteredResponses.length === 0 && responses.length > 0 && (
                  <div className="text-center py-10">
                    <span className="material-symbols-outlined text-4xl text-brand-outline mb-2">
                      search_off
                    </span>
                    <p className="text-sm font-bold text-brand-primary">
                      Ninguna respuesta coincide con la búsqueda
                    </p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-xs text-brand-error font-bold hover:underline mt-2 cursor-pointer"
                    >
                      Limpiar filtro
                    </button>
                  </div>
                )}

                {filteredResponses.map((resp) => (
                  <div
                    key={resp.id}
                    className="border border-brand-outline-variant rounded overflow-hidden"
                  >
                    <div className="bg-[#f8f9fa] px-4 py-2 border-b border-brand-outline-variant flex justify-between items-center">
                      <span className="text-xs font-extrabold text-brand-primary">
                        {resp.studentName}
                      </span>
                      <span className="text-[10px] text-brand-outline font-semibold">
                        {resp.submittedAt}
                      </span>
                    </div>
                    <div className="divide-y divide-brand-outline-variant">
                      {resp.answers.map((ans, idx) => {
                        const question = questions?.find(
                          (q) => q.id === ans.questionId,
                        );
                        return (
                          <div
                            key={ans.questionId}
                            className="px-4 py-2.5 flex items-start gap-3"
                          >
                            <span className="text-[10px] font-black text-brand-outline bg-[#edeeef] px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                              Q{idx + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] text-[#43474f] font-medium">
                                {question?.texto ?? "Pregunta"}
                              </p>
                              <p className="text-xs font-bold text-brand-primary mt-0.5">
                                {ans.answer}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-brand-outline-variant flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="bg-brand-primary text-white py-2 px-5 rounded text-xs font-bold hover:bg-[#002f5e] transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
