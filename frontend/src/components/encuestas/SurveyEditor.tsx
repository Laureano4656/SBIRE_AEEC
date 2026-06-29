import { useState } from "react";
import type {
  Survey,
  SurveyQuestion,
  TipoPreguntaEncuesta,
} from "../types/types.ts";

type SurveyEditorProps = {
  //onSave: (survey: Survey) => void;
  onCancel: () => void;
  //initialSurvey?: Survey;
};

const TIPO_PREGUNTA_LABEL: Record<TipoPreguntaEncuesta, string> = {
  texto_libre: "Texto Libre",
  opcion_multiple: "Opción Múltiple",
  escala: "Escala (1 a 5)",
  si_no: "Sí / No",
};

export default function SurveyEditor({
  //onSave,
  onCancel,
  //initialSurvey,
}: SurveyEditorProps) {
  const esEdicion = Boolean(initialSurvey);
  const [paso, setPaso] = useState<"datos" | "preguntas">("datos");

  // Paso 1 — datos generales
  const [titulo, setTitulo] = useState(initialSurvey?.title ?? "");
  const [tipo, setTipo] = useState<"Única" | "Periódica">(
    initialSurvey?.type ?? "Única",
  );
  const [descripcion, setDescripcion] = useState(
    initialSurvey?.description ?? "",
  );
  const [errorPaso1, setErrorPaso1] = useState<string | null>(null);

  // Paso 2 — preguntas
  const [preguntas, setPreguntas] = useState<SurveyQuestion[]>(
    initialSurvey?.questions ?? [],
  );
  const [mostrarFormPregunta, setMostrarFormPregunta] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [formTexto, setFormTexto] = useState("");
  const [formTipo, setFormTipo] = useState<TipoPreguntaEncuesta>("texto_libre");
  const [formOpciones, setFormOpciones] = useState<string[]>(["", ""]);
  const [formObligatoria, setFormObligatoria] = useState(true);
  const [errorPregunta, setErrorPregunta] = useState<string | null>(null);

  const irAPreguntas = () => {
    if (!titulo.trim()) {
      setErrorPaso1("El título de la encuesta es obligatorio.");
      return;
    }
    setErrorPaso1(null);
    setPaso("preguntas");
  };

  const resetFormPregunta = () => {
    setFormTexto("");
    setFormTipo("texto_libre");
    setFormOpciones(["", ""]);
    setFormObligatoria(true);
    setEditandoId(null);
    setErrorPregunta(null);
  };

  const abrirNuevaPregunta = () => {
    resetFormPregunta();
    setMostrarFormPregunta(true);
  };

  const editarPregunta = (q: SurveyQuestion) => {
    setFormTexto(q.texto);
    setFormTipo(q.tipo);
    setFormOpciones(
      q.opciones && q.opciones.length > 0 ? [...q.opciones] : ["", ""],
    );
    setFormObligatoria(q.obligatoria);
    setEditandoId(q.id);
    setErrorPregunta(null);
    setMostrarFormPregunta(true);
  };

  const eliminarPregunta = (id: string) => {
    setPreguntas((prev) => prev.filter((q) => q.id !== id));
  };

  const moverPregunta = (id: string, direccion: "arriba" | "abajo") => {
    setPreguntas((prev) => {
      const idx = prev.findIndex((q) => q.id === id);
      if (idx === -1) return prev;
      const nuevoIdx = direccion === "arriba" ? idx - 1 : idx + 1;
      if (nuevoIdx < 0 || nuevoIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[nuevoIdx]] = [next[nuevoIdx], next[idx]];
      return next;
    });
  };

  const handleAgregarOpcion = () => setFormOpciones((prev) => [...prev, ""]);
  const handleEliminarOpcion = (idx: number) =>
    setFormOpciones((prev) => prev.filter((_, i) => i !== idx));
  const handleCambiarOpcion = (idx: number, valor: string) =>
    setFormOpciones((prev) => prev.map((o, i) => (i === idx ? valor : o)));

  const guardarPregunta = () => {
    if (!formTexto.trim()) {
      setErrorPregunta("El texto de la pregunta es obligatorio.");
      return;
    }
    let opcionesLimpias: string[] | undefined;
    if (formTipo === "opcion_multiple") {
      opcionesLimpias = formOpciones
        .map((o) => o.trim())
        .filter((o) => o.length > 0);
      if (opcionesLimpias.length < 2) {
        setErrorPregunta(
          "Una pregunta de opción múltiple necesita al menos 2 opciones.",
        );
        return;
      }
    }

    if (editandoId) {
      setPreguntas((prev) =>
        prev.map((q) =>
          q.id === editandoId
            ? {
              ...q,
              texto: formTexto.trim(),
              tipo: formTipo,
              opciones: opcionesLimpias,
              obligatoria: formObligatoria,
            }
            : q,
        ),
      );
    } else {
      setPreguntas((prev) => [
        ...prev,
        {
          id: "preg_" + Date.now(),
          texto: formTexto.trim(),
          tipo: formTipo,
          opciones: opcionesLimpias,
          obligatoria: formObligatoria,
          evento_disparador: 0,
        },
      ]);
    }
    setMostrarFormPregunta(false);
    resetFormPregunta();
  };

  const handleGuardarEncuesta = () => {
    if (preguntas.length === 0) {
      alert("Agregá al menos una pregunta antes de guardar la encuesta.");
      return;
    }

    const base: Survey = initialSurvey ?? {
      id: "sur_" + Date.now(),
      title: "",
      description: "",
      type: "Única",
      status: "Borrador",
      creationDate: new Date().toLocaleDateString("es-AR"),
      responsesCount: 0,
      responseRate: 0,
      urgentCasesCount: 0,
    };

    const encuestaGuardada: Survey = {
      ...base,
      title: titulo.trim(),
      description:
        descripcion.trim() || "Formulario de relevamiento institucional.",
      type: tipo,
      questions: preguntas,
    };
    onSave(encuestaGuardada);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191c1d]/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-brand-outline-variant rounded shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-brand-outline-variant pb-3">
          <h2 className="text-lg font-bold text-brand-primary flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xl">add_box</span>
            {esEdicion ? "Editar Encuesta" : "Nueva Encuesta de Relevamiento"}
          </h2>
          <div className="flex gap-1 text-[10px] font-bold uppercase tracking-wider">
            <span
              className={`px-2 py-1 rounded ${paso === "datos"
                  ? "bg-brand-primary text-white"
                  : "bg-[#edeeef] text-[#43474f]"
                }`}
            >
              1. Datos
            </span>
            <span
              className={`px-2 py-1 rounded ${paso === "preguntas"
                  ? "bg-brand-primary text-white"
                  : "bg-[#edeeef] text-[#43474f]"
                }`}
            >
              2. Preguntas
            </span>
          </div>
        </div>

        {paso === "datos" && (
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                Título de la Encuesta
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="ej: Satisfacción Cursadas Q2"
                className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                Tipo de Relevamiento
              </label>
              <select
                value={tipo}
                onChange={(e) =>
                  setTipo(e.target.value as "Única" | "Periódica")
                }
                className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary"
              >
                <option value="Única">Única (Un solo envío al ingresar)</option>
                <option value="Periódica">
                  Periódica (Envío por cuatrimestre)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                Descripción o Alcance
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={3}
                placeholder="Propósito, marco institucional y a quién va dirigida..."
                className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary"
              />
            </div>

            {errorPaso1 && (
              <p className="text-xs text-brand-error font-semibold bg-red-50 border border-brand-error/20 rounded p-3">
                {errorPaso1}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-2 border border-brand-outline-variant text-[#43474f] rounded text-xs font-semibold hover:bg-[#e7e8e9] transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={irAPreguntas}
                className="px-4 py-2 bg-brand-primary text-white rounded text-xs font-bold hover:bg-[#002f5e] transition-all"
              >
                Siguiente: Agregar Preguntas →
              </button>
            </div>
          </div>
        )}

        {paso === "preguntas" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#43474f]">
                <strong className="text-brand-primary">{titulo}</strong> —{" "}
                {preguntas.length} pregunta(s)
              </p>
              <button
                type="button"
                onClick={abrirNuevaPregunta}
                className="text-xs font-bold text-brand-primary border border-brand-primary rounded px-3 py-1.5 hover:bg-[#eef2ff] transition-all"
              >
                + Agregar Pregunta
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {preguntas.length === 0 && (
                <p className="text-xs text-[#43474f] italic bg-[#f8f9fa] border border-brand-outline-variant rounded p-4 text-center">
                  Todavía no agregaste ninguna pregunta.
                </p>
              )}
              {preguntas.map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-[#f8f9fa] border border-brand-outline-variant rounded p-3 flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-brand-outline text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                        {TIPO_PREGUNTA_LABEL[q.tipo]}
                      </span>
                      {q.obligatoria && (
                        <span className="text-[9px] font-bold text-brand-error">
                          OBLIGATORIA
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#43474f] font-semibold">
                      {q.texto}
                    </p>
                    {q.opciones && q.opciones.length > 0 && (
                      <ul className="mt-1 ml-3 list-disc text-[11px] text-brand-outline">
                        {q.opciones.map((o, i) => (
                          <li key={i}>{o}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 items-center">
                    <button
                      onClick={() => moverPregunta(q.id, "arriba")}
                      disabled={idx === 0}
                      title="Subir"
                      className="text-brand-outline hover:text-brand-primary disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-base">
                        arrow_upward
                      </span>
                    </button>
                    <button
                      onClick={() => moverPregunta(q.id, "abajo")}
                      disabled={idx === preguntas.length - 1}
                      title="Bajar"
                      className="text-brand-outline hover:text-brand-primary disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-base">
                        arrow_downward
                      </span>
                    </button>
                    <button
                      onClick={() => editarPregunta(q)}
                      title="Editar"
                      className="text-brand-outline hover:text-brand-primary"
                    >
                      <span className="material-symbols-outlined text-base">
                        edit
                      </span>
                    </button>
                    <button
                      onClick={() => eliminarPregunta(q.id)}
                      title="Eliminar"
                      className="text-brand-outline hover:text-brand-error"
                    >
                      <span className="material-symbols-outlined text-base">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {mostrarFormPregunta && (
              <div className="border border-brand-primary rounded p-4 space-y-3 bg-[#eef2ff]">
                <p className="text-xs font-bold text-brand-primary">
                  {editandoId ? "Editar Pregunta" : "Nueva Pregunta"}
                </p>

                <div>
                  <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                    Texto de la Pregunta
                  </label>
                  <input
                    type="text"
                    value={formTexto}
                    onChange={(e) => setFormTexto(e.target.value)}
                    placeholder="Ej: ¿Cómo calificás la carga horaria?"
                    className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                    Tipo de Pregunta
                  </label>
                  <select
                    value={formTipo}
                    onChange={(e) =>
                      setFormTipo(e.target.value as TipoPreguntaEncuesta)
                    }
                    className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary"
                  >
                    <option value="texto_libre">Texto Libre</option>
                    <option value="opcion_multiple">Opción Múltiple</option>
                    <option value="escala">Escala (1 a 5)</option>
                    <option value="si_no">Sí / No</option>
                  </select>
                </div>

                {formTipo === "opcion_multiple" && (
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider">
                      Opciones
                    </label>
                    {formOpciones.map((opcion, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={opcion}
                          onChange={(e) =>
                            handleCambiarOpcion(idx, e.target.value)
                          }
                          placeholder={`Opción ${idx + 1}`}
                          className="flex-1 border border-brand-outline rounded px-3 py-1.5 text-xs focus:ring-1 focus:ring-brand-primary"
                        />
                        <button
                          onClick={() => handleEliminarOpcion(idx)}
                          disabled={formOpciones.length <= 2}
                          title="Eliminar opción"
                          className="text-brand-outline hover:text-brand-error disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <span className="material-symbols-outlined text-base">
                            close
                          </span>
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={handleAgregarOpcion}
                      className="text-[11px] font-bold text-brand-primary hover:underline"
                    >
                      + Agregar opción
                    </button>
                  </div>
                )}

                <label className="flex items-center gap-2 text-xs font-semibold text-[#43474f] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formObligatoria}
                    onChange={(e) => setFormObligatoria(e.target.checked)}
                    className="rounded border-brand-outline-variant text-brand-primary w-3.5 h-3.5"
                  />
                  Pregunta obligatoria
                </label>

                {errorPregunta && (
                  <p className="text-xs text-brand-error font-semibold bg-red-50 border border-brand-error/20 rounded p-2">
                    {errorPregunta}
                  </p>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setMostrarFormPregunta(false);
                      resetFormPregunta();
                    }}
                    className="text-xs font-bold text-[#43474f] bg-[#e2e6ea] py-1.5 px-3 rounded hover:bg-[#dae0e5]"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={guardarPregunta}
                    className="text-xs font-bold text-white bg-brand-primary py-1.5 px-3 rounded hover:opacity-90"
                  >
                    {editandoId ? "Guardar Cambios" : "Agregar Pregunta"}
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between gap-2 pt-2 border-t border-brand-outline-variant">
              <button
                type="button"
                onClick={() => setPaso("datos")}
                className="px-3 py-2 border border-brand-outline-variant text-[#43474f] rounded text-xs font-semibold hover:bg-[#e7e8e9] transition-all"
              >
                ← Atrás
              </button>
              <button
                type="button"
                onClick={handleGuardarEncuesta}
                className="px-4 py-2 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 transition-all"
              >
                {esEdicion ? "Guardar Cambios" : "Guardar Encuesta"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
