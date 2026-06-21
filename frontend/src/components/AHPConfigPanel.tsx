import { useRef, useState, type DragEvent } from "react";

// ---------- Tipos ----------
type TipoPregunta = "opcion_multiple" | "texto_libre" | "si_no";

type Pregunta = {
  id: string;
  texto: string;
  tipo: TipoPregunta;
};

type Indicador = {
  id: string;
  nombre: string;
  activo: boolean; // si participa en la comparación AHP
  preguntas: Pregunta[];
};

type Dimension = {
  id: string;
  nombre: string;
  indicadores: Indicador[];
};

type Par = { padre: string; i: string; j: string };
type SliderMap = Record<string, number>; // key: `${padre}||${i}||${j}`

type DraggedInfo = { dimIdx: number; indIdx: number; qIdx: number } | null;

const TIPO_LABEL: Record<TipoPregunta, string> = {
  opcion_multiple: "Opción Múltiple",
  texto_libre: "Texto Libre",
  si_no: "Sí / No",
};

// ---------- Datos iniciales (demo) ----------
const INITIAL_DIMENSIONES: Dimension[] = [
  {
    id: "dim_1",
    nombre: "Dimensión Sociodemográfica",
    indicadores: [
      {
        id: "ind_1",
        nombre: "Capital Cultural Familiar",
        activo: true,
        preguntas: [
          {
            id: "q_1",
            texto: "¿Nivel educativo de tu madre?",
            tipo: "opcion_multiple",
          },
          {
            id: "q_2",
            texto: "¿Nivel educativo de tu padre?",
            tipo: "opcion_multiple",
          },
        ],
      },
      {
        id: "ind_2",
        nombre: "Arraigo Local",
        activo: true,
        preguntas: [
          {
            id: "q_3",
            texto: "¿Tu familia vive en Mar del Plata?",
            tipo: "si_no",
          },
        ],
      },
    ],
  },
  {
    id: "dim_2",
    nombre: "Dimensión de Infraestructura",
    indicadores: [
      {
        id: "ind_3",
        nombre: "Estabilidad Habitacional",
        activo: true,
        preguntas: [
          {
            id: "q_4",
            texto: "¿Cómo es tu situación de vivienda?",
            tipo: "opcion_multiple",
          },
        ],
      },
    ],
  },
];

// ---------- Helpers AHP ----------
function getPares(arr: string[]): [string, string][] {
  const pares: [string, string][] = [];
  for (let a = 0; a < arr.length; a++)
    for (let b = a + 1; b < arr.length; b++) pares.push([arr[a], arr[b]]);
  return pares;
}

function sliderToSaaty(v: number): number {
  if (v > 0) return v + 1;
  if (v < 0) return 1 / (Math.abs(v) + 1);
  return 1;
}

function feedbackLabel(v: number, i: string, j: string): string {
  if (v > 0) return `${i} es ${v + 1}x más importante`;
  if (v < 0) return `${j} es ${Math.abs(v) + 1}x más importante`;
  return "Ambos tienen la misma importancia (1x)";
}

export default function AHPConfigPanel() {
  const [paso, setPaso] = useState<"board" | "sliders" | "resultado">("board");
  const [dimensiones, setDimensiones] =
    useState<Dimension[]>(INITIAL_DIMENSIONES);

  const [pares, setPares] = useState<Par[]>([]);
  const [sliders, setSliders] = useState<SliderMap>({});
  const [jerarquiaSnapshot, setJerarquiaSnapshot] = useState<
    Record<string, string[]>
  >({});
  const [resultado, setResultado] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [boardError, setBoardError] = useState<string | null>(null);

  // Modal: nueva dimensión
  const [modalDimensionOpen, setModalDimensionOpen] = useState(false);
  const [nuevaDimNombre, setNuevaDimNombre] = useState("");

  // Modal: nuevo indicador
  const [modalIndicadorOpen, setModalIndicadorOpen] = useState(false);
  const [nuevoIndDimIdx, setNuevoIndDimIdx] = useState(0);
  const [nuevoIndNombre, setNuevoIndNombre] = useState("");
  const [nuevoIndPregunta, setNuevoIndPregunta] = useState("");

  // Modal: nueva pregunta
  const [modalPreguntaOpen, setModalPreguntaOpen] = useState(false);
  const [preguntaDestino, setPreguntaDestino] = useState<{
    dimIdx: number;
    indIdx: number;
  } | null>(null);
  const [nuevaPreguntaTexto, setNuevaPreguntaTexto] = useState("");
  const [nuevaPreguntaTipo, setNuevaPreguntaTipo] =
    useState<TipoPregunta>("opcion_multiple");

  // Drag & drop
  const draggedRef = useRef<DraggedInfo>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);

  // ---------- Construcción dinámica de la jerarquía AHP ----------
  const buildJerarquia = (): Record<string, string[]> => {
    const j: Record<string, string[]> = {};
    dimensiones.forEach((dim) => {
      const nombres = dim.indicadores
        .filter((ind) => ind.activo && ind.preguntas.length > 0)
        .map((ind) => ind.nombre);
      // Siempre incluimos la dimensión, aunque no tenga indicadores activos:
      // así participa igual en la comparación de nivel superior (dimensión vs dimensión).
      j[dim.nombre] = nombres;
    });
    return j;
  };

  const handleGenerarSliders = () => {
    const jerarquia = buildJerarquia();
    const dims = Object.keys(jerarquia);
    if (dims.length === 0) {
      setBoardError(
        "No hay dimensiones definidas. Creá al menos un indicador para continuar.",
      );
      return;
    }
    setBoardError(null);

    const nuevoPares: Par[] = [];
    if (dims.length > 1)
      getPares(dims).forEach(([a, b]) =>
        nuevoPares.push({ padre: "Índice de Riesgo", i: a, j: b }),
      );
    for (const [dim, criterios] of Object.entries(jerarquia))
      if (criterios.length > 1)
        getPares(criterios).forEach(([a, b]) =>
          nuevoPares.push({ padre: dim, i: a, j: b }),
        );

    setPares(nuevoPares);
    setSliders({});
    setJerarquiaSnapshot(jerarquia);
    setPaso("sliders");
  };

  const sliderKey = (p: Par) => `${p.padre}||${p.i}||${p.j}`;
  const getSlider = (p: Par) => sliders[sliderKey(p)] ?? 0;
  const setSlider = (p: Par, v: number) =>
    setSliders((prev) => ({ ...prev, [sliderKey(p)]: v }));

  const renderSliderRow = (p: Par) => {
    const v = getSlider(p);
    return (
      <div
        key={sliderKey(p)}
        className="bg-[#f8f9fa] border border-brand-outline-variant rounded p-4 space-y-2"
      >
        <div className="flex items-center gap-3">
          <span className="w-1/3 text-right text-xs font-bold text-brand-primary truncate">
            {p.i}
          </span>
          <input
            type="range"
            min={-8}
            max={8}
            value={v}
            onChange={(e) => setSlider(p, Number(e.target.value))}
            className="flex-1 accent-[#4f46e5] cursor-pointer"
          />
          <span className="w-1/3 text-left text-xs font-bold text-brand-primary truncate">
            {p.j}
          </span>
        </div>
        <p
          className={`text-center text-[11px] font-bold rounded py-1 ${
            v === 0
              ? "bg-[#edeeef] text-[#43474f]"
              : v > 0
                ? "bg-[#eef2ff] text-brand-primary"
                : "bg-[#e2f3f5] text-[#006a6a]"
          }`}
        >
          {feedbackLabel(v, p.i, p.j)}
        </p>
      </div>
    );
  };

  const handleEnviar = async () => {
    const jerarquia = buildJerarquia();
    const dims = Object.keys(jerarquia);

    const requestData: {
      nodo_raiz: string;
      jerarquia: Record<string, string[]>;
      comparaciones_por_nodo: Record<
        string,
        { criterio_i: string; valor: number; criterio_j: string }[]
      >;
    } = {
      nodo_raiz: "Índice de Riesgo",
      jerarquia: {},
      comparaciones_por_nodo: {},
    };

    if (dims.length > 1) requestData.jerarquia["Índice de Riesgo"] = dims;
    for (const [dim, criterios] of Object.entries(jerarquia))
      if (criterios.length > 1) requestData.jerarquia[dim] = criterios;

    pares.forEach((p) => {
      const valor = sliderToSaaty(getSlider(p));
      if (!requestData.comparaciones_por_nodo[p.padre])
        requestData.comparaciones_por_nodo[p.padre] = [];
      requestData.comparaciones_por_nodo[p.padre].push({
        criterio_i: p.i,
        valor,
        criterio_j: p.j,
      });
    });

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/calcular-ahp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      const data = await res.json();
      setResultado(JSON.stringify(data, null, 2));
      setPaso("resultado");
    } catch {
      setError("No se pudo conectar con el backend (http://127.0.0.1:8000).");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPaso("board");
    setResultado(null);
    setError(null);
  };

  const handleGuardarConfiguracion = () => {
    // Validación: ningún indicador puede quedar sin preguntas.
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
    console.log(dimensiones);
  };

  // ---------- Gestión del tablero (indicadores y preguntas) ----------
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
    setDimensiones((prev) => [
      ...prev,
      { id: "dim_new_" + Date.now(), nombre, indicadores: [] },
    ]);
    setModalDimensionOpen(false);
  };

  const toggleIndicadorActivo = (dimIdx: number, indIdx: number) => {
    setDimensiones((prev) => {
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
    setDimensiones((prev) => {
      const next = prev.map((d) => ({ ...d, indicadores: [...d.indicadores] }));
      next[nuevoIndDimIdx].indicadores.push({
        id: "ind_new_" + Date.now(),
        nombre: nuevoIndNombre.trim(),
        activo: true,
        preguntas: [
          {
            id: "q_new_" + Date.now(),
            texto: nuevoIndPregunta.trim(),
            tipo: "texto_libre",
          },
        ],
      });
      return next;
    });
    setModalIndicadorOpen(false);
  };

  const abrirModalPregunta = (dimIdx: number, indIdx: number) => {
    setPreguntaDestino({ dimIdx, indIdx });
    setNuevaPreguntaTexto("");
    setNuevaPreguntaTipo("opcion_multiple");
    setModalPreguntaOpen(true);
  };

  const guardarNuevaPregunta = () => {
    if (!preguntaDestino || !nuevaPreguntaTexto.trim()) {
      alert("El texto de la pregunta es obligatorio.");
      return;
    }
    const { dimIdx, indIdx } = preguntaDestino;
    setDimensiones((prev) => {
      const next = prev.map((d) => ({ ...d, indicadores: [...d.indicadores] }));
      next[dimIdx].indicadores[indIdx] = {
        ...next[dimIdx].indicadores[indIdx],
        preguntas: [
          ...next[dimIdx].indicadores[indIdx].preguntas,
          {
            id: "q_new_" + Date.now(),
            texto: nuevaPreguntaTexto.trim(),
            tipo: nuevaPreguntaTipo,
          },
        ],
      };
      return next;
    });
    setModalPreguntaOpen(false);
  };

  // ---------- Drag & drop de preguntas entre indicadores ----------
  // Nota: el cálculo se hace fuera del updater de setState (no en la forma
  // `setX(prev => ...)`) porque acá usamos `confirm()`, que es un efecto
  // secundario. Si lo metiéramos dentro de un updater, React StrictMode
  // podría invocarlo dos veces en desarrollo y abrir el confirm() duplicado.
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

    const next: Dimension[] = dimensiones.map((d) => ({
      ...d,
      indicadores: d.indicadores.map((ind) => ({
        ...ind,
        preguntas: [...ind.preguntas],
      })),
    }));

    const preguntaMovida = next[src.dimIdx].indicadores[
      src.indIdx
    ].preguntas.splice(src.qIdx, 1)[0];
    if (!preguntaMovida) return;

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
        return; // cancelado: dejamos el estado tal como estaba
      }
    }

    setDimensiones(next);
  };

  // Agrupación para Paso 2 (sliders)
  const paresPorPadre: Record<string, Par[]> = {};
  pares.forEach((p) => {
    if (!paresPorPadre[p.padre]) paresPorPadre[p.padre] = [];
    paresPorPadre[p.padre].push(p);
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div>
        <h3 className="text-2xl font-bold text-brand-primary tracking-tight">
          Configurador de Semáforos — AHP
        </h3>
        <p className="text-xs text-[#43474f] mt-1">
          Construí tus indicadores y definí sus pesos relativos mediante
          comparación por pares (método AHP).
        </p>
      </div>

      {/* PASO 1 — Tablero dinámico de indicadores */}
      {paso === "board" && (
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
                            onChange={() =>
                              toggleIndicadorActivo(dimIdx, indIdx)
                            }
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
                        className={`min-h-[2.5rem] rounded transition-all ${
                          dragOverKey === zoneKey
                            ? "border-2 border-dashed border-brand-primary bg-[#f8f9fa]"
                            : ""
                        }`}
                      >
                        {ind.preguntas.map((q, qIdx) => (
                          <div
                            key={q.id}
                            draggable
                            onDragStart={() =>
                              handleDragStart(dimIdx, indIdx, qIdx)
                            }
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
            onClick={handleGenerarSliders}
            className="w-full bg-brand-primary text-white py-2.5 px-4 rounded text-xs font-bold hover:opacity-90 transition-all"
          >
            Siguiente: Configurar Pesos →
          </button>
        </div>
      )}

      {/* PASO 2 — Sliders de comparación (sin cambios funcionales) */}
      {paso === "sliders" && (
        <div className="bg-white border border-brand-outline-variant rounded shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-brand-outline-variant pb-2">
            <h4 className="font-bold text-brand-primary text-sm">
              Paso 2 — Comparación por pares
            </h4>
            <button
              onClick={reset}
              className="text-[10px] text-brand-outline font-bold hover:text-brand-error uppercase tracking-wider"
            >
              ← Volver
            </button>
          </div>

          <p className="text-xs text-[#43474f] leading-relaxed">
            Mové el control hacia un lado para darle mayor importancia a ese
            criterio.
          </p>

          {Object.keys(jerarquiaSnapshot).length > 1 &&
            paresPorPadre["Índice de Riesgo"] && (
              <div className="space-y-3">
                <p className="text-[10px] font-extrabold text-brand-outline uppercase tracking-wider">
                  Índice de Riesgo
                </p>
                {paresPorPadre["Índice de Riesgo"].map(renderSliderRow)}
              </div>
            )}

          {Object.entries(jerarquiaSnapshot).map(([dim, criterios]) => (
            <div key={dim} className="space-y-3">
              <p className="text-[10px] font-extrabold text-brand-outline uppercase tracking-wider">
                {dim}
              </p>

              {criterios.length > 1 &&
                (paresPorPadre[dim] ?? []).map(renderSliderRow)}

              {criterios.length === 1 && (
                <p className="text-xs text-[#43474f] bg-[#f8f9fa] border border-brand-outline-variant rounded p-3">
                  <strong className="text-brand-primary">{criterios[0]}</strong>{" "}
                  es el único indicador activo de esta dimensión — recibe
                  automáticamente el 100% del peso interno.
                </p>
              )}

              {criterios.length === 0 && (
                <p className="text-xs text-[#43474f] bg-[#f8f9fa] border border-brand-outline-variant rounded p-3 italic">
                  Esta dimensión no tiene indicadores activos.
                </p>
              )}
            </div>
          ))}

          {error && (
            <p className="text-xs text-brand-error font-semibold bg-red-50 border border-brand-error/20 rounded p-3">
              {error}
            </p>
          )}

          <button
            onClick={handleEnviar}
            disabled={loading}
            className="w-full bg-brand-primary text-white py-2.5 px-4 rounded text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? "Calculando..." : "Calcular Pesos Finales"}
          </button>
        </div>
      )}

      {/* PASO 3 — Resultado (sin cambios) */}
      {paso === "resultado" && resultado && (
        <div className="bg-white border border-brand-outline-variant rounded shadow-xs p-6 space-y-4">
          <h4 className="font-bold text-brand-primary text-sm border-b border-brand-outline-variant pb-2">
            Pesos Calculados
          </h4>
          <pre className="bg-slate-900 text-emerald-400 text-xs p-4 rounded overflow-x-auto leading-relaxed font-mono">
            {resultado}
          </pre>
          <button
            onClick={reset}
            className="w-full border border-brand-outline-variant text-brand-primary py-2.5 px-4 rounded text-xs font-bold hover:bg-[#f3f4f5] transition-all"
          >
            Nueva Configuración
          </button>
        </div>
      )}

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

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#43474f]">
                Primera Pregunta (obligatoria)
              </label>
              <input
                type="text"
                value={nuevoIndPregunta}
                onChange={(e) => setNuevoIndPregunta(e.target.value)}
                placeholder="Debe tener al menos una pregunta inicial..."
                className="w-full border border-brand-outline-variant rounded p-2 text-xs"
              />
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
      {modalPreguntaOpen && preguntaDestino && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-brand-primary text-sm">
              Añadir Pregunta
            </h3>
            <p className="text-[11px] text-[#43474f]">
              Destino:{" "}
              <strong>
                {
                  dimensiones[preguntaDestino.dimIdx].indicadores[
                    preguntaDestino.indIdx
                  ].nombre
                }
              </strong>
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#43474f]">
                Texto de la Pregunta
              </label>
              <input
                type="text"
                value={nuevaPreguntaTexto}
                onChange={(e) => setNuevaPreguntaTexto(e.target.value)}
                placeholder="Ej: ¿Trabajás actualmente?"
                className="w-full border border-brand-outline-variant rounded p-2 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#43474f]">Tipo</label>
              <select
                value={nuevaPreguntaTipo}
                onChange={(e) =>
                  setNuevaPreguntaTipo(e.target.value as TipoPregunta)
                }
                className="w-full border border-brand-outline-variant rounded p-2 text-xs"
              >
                <option value="opcion_multiple">Opción Múltiple</option>
                <option value="texto_libre">Texto Libre</option>
                <option value="si_no">Sí / No</option>
              </select>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setModalPreguntaOpen(false)}
                className="text-xs font-bold text-[#43474f] bg-[#e2e6ea] py-2 px-4 rounded hover:bg-[#dae0e5]"
              >
                Cancelar
              </button>
              <button
                onClick={guardarNuevaPregunta}
                className="text-xs font-bold text-white bg-brand-primary py-2 px-4 rounded hover:opacity-90"
              >
                Guardar Pregunta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
