import { useRef, useState, type Dispatch, type DragEvent, type SetStateAction } from "react";
import { useCreateIndicadorMutation } from "../../hooks/mutations/useIndicadoresMutations";
import { useAuth } from "../../hooks/useAuth";
import type { TipoPreguntaEncuesta } from "../../types/types";
import { TIPO_LABEL, type Dimension, type DraggedInfo } from "./types";
import { useEventosDisparadores } from "../../hooks/queries/useEventosDisparadoresQueries";

interface AHPBoardProps {
  dimensiones: Dimension[];
  onDimensionesChange: Dispatch<SetStateAction<Dimension[]>>;
  boardError: string | null;
  onBoardErrorChange: (error: string | null) => void;
  onNext: () => void;
}

export function AHPBoard({
  dimensiones,
  onDimensionesChange,
  boardError,
  onBoardErrorChange,
  onNext,
}: AHPBoardProps) {
  const { data: eventos } = useEventosDisparadores();
  const [modalDimensionOpen, setModalDimensionOpen] = useState(false);
  const [nuevaDimNombre, setNuevaDimNombre] = useState("");

  const [modalIndicadorOpen, setModalIndicadorOpen] = useState(false);
  const [nuevoIndDimIdx, setNuevoIndDimIdx] = useState(0);
  const [nuevoIndNombre, setNuevoIndNombre] = useState("");
  const [nuevoIndPregunta, setNuevoIndPregunta] = useState("");

  const [modalPreguntaOpen, setModalPreguntaOpen] = useState(false);
  const [preguntaDestino, setPreguntaDestino] = useState<{
    dimIdx: number;
    indIdx: number;
  } | null>(null);

  const draggedRef = useRef<DraggedInfo>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);

  const [formTexto, setFormTexto] = useState("");
  const [formTipo, setFormTipo] = useState<TipoPreguntaEncuesta>("texto_libre");
  const [formOpciones, setFormOpciones] = useState<string[]>(["", ""]);
  const [formEventoId, setFormEventoId] = useState<number>(0);
  const [errorPregunta, setErrorPregunta] = useState<string | null>(null);

  const { user } = useAuth();
  const { mutate: createIndicador } = useCreateIndicadorMutation();

  const handleGuardarConfiguracion = () => {
    let esValido = true;
    dimensiones.forEach((dim) => {
      dim.indicadores.forEach((ind) => {
        if (ind.preguntas.length === 0) esValido = false;
      });
    });

    if (!esValido) {
      alert(
        "Error: hay un indicador sin preguntas. Revisá el tablero antes de guardar.",
      );
      return;
    }

    alert(
      "Configuración validada con éxito. Se enviaría el siguiente JSON al backend:\n\n" +
      JSON.stringify(dimensiones, null, 2),
    );
  };

  const abrirModalNuevaDimension = () => {
    setNuevaDimNombre("");
    setModalDimensionOpen(true);
  };

  const guardarNuevaDimension = () => {
    const nombre = nuevaDimNombre.trim();
    if (!nombre) {
      alert("El nombre de la dimensión es obligatorio.");
      return;
    }
    if (
      dimensiones.some((d) => d.nombre.toLowerCase() === nombre.toLowerCase())
    ) {
      alert("Ya existe una dimensión con ese nombre.");
      return;
    }
    createIndicador({
      nombre,
      dimension: null,
      carrera_id: user?.carrera_id ?? 0,
      preguntas_id: null,
    });
    onDimensionesChange((prev) => [
      ...prev,
      { id: "dim_new_" + Date.now(), nombre, indicadores: [] },
    ]);
    setModalDimensionOpen(false);
  };

  const toggleIndicadorActivo = (dimIdx: number, indIdx: number) => {
    onDimensionesChange((prev) => {
      const next = prev.map((d) => ({ ...d, indicadores: [...d.indicadores] }));
      next[dimIdx].indicadores[indIdx] = {
        ...next[dimIdx].indicadores[indIdx],
        activo: !next[dimIdx].indicadores[indIdx].activo,
      };
      return next;
    });
  };

  const abrirModalNuevoIndicador = () => {
    setNuevoIndDimIdx(0);
    setNuevoIndNombre("");
    setNuevoIndPregunta("");
    setModalIndicadorOpen(true);
  };

  const guardarNuevoIndicador = () => {
    if (!nuevoIndNombre.trim() || !nuevoIndPregunta.trim()) {
      alert("El nombre del indicador y la primera pregunta son obligatorios.");
      return;
    }
    createIndicador({
      nombre: nuevoIndNombre.trim(),
      dimension: nuevoIndDimIdx,
      carrera_id: user?.carrera_id ?? 0,
      preguntas_id: null,
    });
    onDimensionesChange((prev) => {
      const next = prev.map((d) => ({ ...d, indicadores: [...d.indicadores] }));
      next[nuevoIndDimIdx].indicadores.push({
        id: "ind_new_" + Date.now(),
        nombre: nuevoIndNombre.trim(),
        activo: true,
        preguntas: [
          {
            id: "q_new_" + Date.now(),
            texto: nuevoIndPregunta.trim(),
            tipo: "texto_libre" as const,
            evento_disparador: 1,
          },
        ],
      });
      return next;
    });
    setModalIndicadorOpen(false);
  };

  const abrirModalPregunta = (dimIdx: number, indIdx: number) => {
    setPreguntaDestino({ dimIdx, indIdx });
    setFormTexto("");
    setFormTipo("texto_libre");
    setFormOpciones(["", ""]);
    setFormEventoId(0);
    setErrorPregunta(null);
    setModalPreguntaOpen(true);
  };

  const resetFormPregunta = () => {
    setFormTexto("");
    setFormTipo("texto_libre");
    setFormOpciones(["", ""]);
    setFormEventoId(0);
    setErrorPregunta(null);
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
    if (formEventoId === 0) {
      setErrorPregunta("Debe seleccionar un evento disparador.");
      return;
    }

    if (!preguntaDestino) return;
    const { dimIdx, indIdx } = preguntaDestino;
    // TODO: enviar la pregunta al backend

    onDimensionesChange((prev) => {
      const next = prev.map((d) => ({ ...d, indicadores: [...d.indicadores] }));
      next[dimIdx].indicadores[indIdx] = {
        ...next[dimIdx].indicadores[indIdx],
        preguntas: [
          ...next[dimIdx].indicadores[indIdx].preguntas,
          {
            id: "q_new_" + Date.now(),
            texto: formTexto.trim(),
            tipo: formTipo,
            evento_disparador: formEventoId,
          },
        ],
      };
      return next;
    });
    setModalPreguntaOpen(false);
    resetFormPregunta();
  };

  // Drag & drop
  const handleDragStart = (dimIdx: number, indIdx: number, qIdx: number) => {
    draggedRef.current = { dimIdx, indIdx, qIdx };
  };

  const handleDragOver = (key: string, e: DragEvent) => {
    e.preventDefault();
    setDragOverKey(key);
  };

  const handleDragLeave = (key: string) => {
    setDragOverKey((curr) => (curr === key ? null : curr));
  };

  const handleDrop = (targetDimIdx: number, targetIndIdx: number) => {
    setDragOverKey(null);
    const src = draggedRef.current;
    draggedRef.current = null;
    if (!src) return;
    if (src.dimIdx === targetDimIdx && src.indIdx === targetIndIdx) return;

    onDimensionesChange((prev) => {
      const next: Dimension[] = prev.map((d) => ({
        ...d,
        indicadores: d.indicadores.map((ind) => ({
          ...ind,
          preguntas: [...ind.preguntas],
        })),
      }));

      const preguntaMovida = next[src.dimIdx].indicadores[
        src.indIdx
      ].preguntas.splice(src.qIdx, 1)[0];
      if (!preguntaMovida) return prev;

      next[targetDimIdx].indicadores[targetIndIdx].preguntas.push(preguntaMovida);

      const indicadorOrigen = next[src.dimIdx].indicadores[src.indIdx];
      if (indicadorOrigen.preguntas.length === 0) {
        const eliminarInd = confirm(
          `⚠️ El indicador "${indicadorOrigen.nombre}" se quedó sin preguntas.\n¿Deseás eliminar el indicador vacío? (Si cancelás, la pregunta volverá a su lugar original).`,
        );
        if (eliminarInd) {
          next[src.dimIdx].indicadores.splice(src.indIdx, 1);
          if (next[src.dimIdx].indicadores.length === 0) {
            const eliminarDim = confirm(
              `⚠️ La dimensión "${next[src.dimIdx].nombre}" se quedó sin indicadores.\n¿Deseás eliminar la dimensión?`,
            );
            if (eliminarDim) next.splice(src.dimIdx, 1);
          }
        } else {
          return prev;
        }
      }

      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white border border-brand-outline-variant rounded shadow-xs p-4">
        <h4 className="font-bold text-brand-primary text-sm">
          Paso 1 — Construí y seleccioná tus indicadores
        </h4>
        <div className="flex gap-2">
          <button
            onClick={abrirModalNuevaDimension}
            className="border border-brand-primary text-brand-primary py-2 px-4 rounded text-xs font-bold hover:bg-[#eef2ff] transition-all"
          >
            + Nueva Dimensión
          </button>
          <button
            onClick={abrirModalNuevoIndicador}
            disabled={dimensiones.length === 0}
            className="bg-brand-primary text-white py-2 px-4 rounded text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Crear Nuevo Indicador
          </button>
          <button
            onClick={handleGuardarConfiguracion}
            disabled={dimensiones.length === 0}
            className="bg-emerald-600 text-white py-2 px-4 rounded text-xs font-bold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar Configuración
          </button>
        </div>
      </div>

      <p className="text-xs text-[#43474f] leading-relaxed">
        Arrastrá las preguntas entre indicadores para reorganizarlas. Tildá
        el indicador para incluirlo en la comparación AHP.
      </p>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {dimensiones.map((dim, dimIdx) => (
          <div
            key={dim.id}
            className="bg-[#edeeef] rounded w-80 min-w-[20rem] p-4 flex flex-col gap-3"
          >
            <p className="text-[10px] font-extrabold text-brand-outline uppercase tracking-wider border-b border-brand-outline-variant pb-2">
              {dim.nombre}
            </p>

            {dim.indicadores.length === 0 && (
              <p className="text-[11px] text-brand-outline italic">
                Sin indicadores todavía. Usá "+ Crear Nuevo Indicador" para
                agregar el primero.
              </p>
            )}

            {dim.indicadores.map((ind, indIdx) => {
              const zoneKey = `${dimIdx}-${indIdx}`;
              return (
                <div
                  key={ind.id}
                  className="bg-white border-l-4 border-brand-primary rounded shadow-xs p-3"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-[#43474f] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ind.activo}
                        onChange={() => toggleIndicadorActivo(dimIdx, indIdx)}
                        className="rounded border-brand-outline-variant text-brand-primary w-3.5 h-3.5"
                      />
                      {ind.nombre}
                    </label>
                    <button
                      onClick={() => abrirModalPregunta(dimIdx, indIdx)}
                      className="text-[10px] bg-[#e2e6ea] text-[#43474f] border border-brand-outline-variant rounded px-2 py-1 font-bold hover:bg-[#dae0e5]"
                    >
                      + Pregunta
                    </button>
                  </div>

                  <div
                    onDragOver={(e) => handleDragOver(zoneKey, e)}
                    onDragLeave={() => handleDragLeave(zoneKey)}
                    onDrop={() => handleDrop(dimIdx, indIdx)}
                    className={`min-h-[2.5rem] rounded transition-all ${dragOverKey === zoneKey
                      ? "border-2 border-dashed border-brand-primary bg-[#f8f9fa]"
                      : ""
                      }`}
                  >
                    {ind.preguntas.map((q, qIdx) => (
                      <div
                        key={q.id}
                        draggable
                        onDragStart={() => handleDragStart(dimIdx, indIdx, qIdx)}
                        className="bg-[#fdfdfd] border border-brand-outline-variant rounded p-2 mb-1.5 text-[11px] flex items-center gap-2 cursor-grab active:cursor-grabbing active:opacity-70"
                      >
                        <span className="bg-brand-outline text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                          {TIPO_LABEL[q.tipo]}
                        </span>
                        <span className="text-[#43474f]">{q.texto}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {boardError && (
        <p className="text-xs text-brand-error font-semibold bg-red-50 border border-brand-error/20 rounded p-3">
          {boardError}
        </p>
      )}

      <button
        onClick={onNext}
        className="w-full bg-brand-primary text-white py-2.5 px-4 rounded text-xs font-bold hover:opacity-90 transition-all"
      >
        Siguiente: Configurar Pesos →
      </button>

      {/* MODAL — Nueva Dimensión */}
      {modalDimensionOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-brand-primary text-sm">
              Crear Nueva Dimensión
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#43474f]">
                Nombre de la Dimensión
              </label>
              <input
                type="text"
                value={nuevaDimNombre}
                onChange={(e) => setNuevaDimNombre(e.target.value)}
                placeholder="Ej: Dimensión Psicosocial"
                className="w-full border border-brand-outline-variant rounded p-2 text-xs"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setModalDimensionOpen(false)}
                className="text-xs font-bold text-[#43474f] bg-[#e2e6ea] py-2 px-4 rounded hover:bg-[#dae0e5]"
              >
                Cancelar
              </button>
              <button
                onClick={guardarNuevaDimension}
                className="text-xs font-bold text-white bg-brand-primary py-2 px-4 rounded hover:opacity-90"
              >
                Crear Dimensión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL — Nuevo Indicador */}
      {modalIndicadorOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-brand-primary text-sm">
              Crear Nuevo Indicador
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#43474f]">
                Nombre del Indicador
              </label>
              <input
                type="text"
                value={nuevoIndNombre}
                onChange={(e) => setNuevoIndNombre(e.target.value)}
                placeholder="Ej: Salud Mental"
                className="w-full border border-brand-outline-variant rounded p-2 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#43474f]">
                Dimensión
              </label>
              <select
                value={nuevoIndDimIdx}
                onChange={(e) => setNuevoIndDimIdx(Number(e.target.value))}
                className="w-full border border-brand-outline-variant rounded p-2 text-xs"
              >
                {dimensiones.map((dim, idx) => (
                  <option key={dim.id} value={idx}>
                    {dim.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setModalIndicadorOpen(false)}
                className="text-xs font-bold text-[#43474f] bg-[#e2e6ea] py-2 px-4 rounded hover:bg-[#dae0e5]"
              >
                Cancelar
              </button>
              <button
                onClick={guardarNuevoIndicador}
                className="text-xs font-bold text-white bg-brand-primary py-2 px-4 rounded hover:opacity-90"
              >
                Crear Indicador
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL — Nueva Pregunta */}
      {modalPreguntaOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md border border-brand-primary rounded p-4 space-y-3 bg-[#eef2ff]">
            <p className="text-xs font-bold text-brand-primary">
              Nueva Pregunta
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

            <div>
              <label className="block text-[11px] font-bold text-[#43474f] uppercase tracking-wider mb-1">
                Evento Disparador
              </label>
              <select
                value={formEventoId}
                onChange={(e) => setFormEventoId(Number(e.target.value))}
                className="w-full border border-brand-outline rounded px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary"
              >
                <option value={0} disabled>
                  Seleccionar evento...
                </option>
                {eventos?.map((ev: { id: number; nombre: string }) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.nombre}
                  </option>
                ))}
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
                      onChange={(e) => handleCambiarOpcion(idx, e.target.value)}
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

            {errorPregunta && (
              <p className="text-xs text-brand-error font-semibold bg-red-50 border border-brand-error/20 rounded p-2">
                {errorPregunta}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setModalPreguntaOpen(false);
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
                Agregar Pregunta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
