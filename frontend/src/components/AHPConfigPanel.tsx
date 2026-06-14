import { useState } from "react";

const CATALOGO: Record<string, string[]> = {
  "Dimensión Académica": [
    "Promedio General",
    "Situación Final",
    "Materias Recursadas",
  ],
  "Dimensión Sociodemográfica": ["Horas de Trabajo", "Distancia a la Facultad"],
  "Dimensión Hábitos": ["Horas de Estudio", "Actividades Externas"],
};

type Par = { padre: string; i: string; j: string };
type SliderMap = Record<string, number>; // key: `${padre}||${i}||${j}`

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
  const [paso, setPaso] = useState<"seleccion" | "sliders" | "resultado">(
    "seleccion",
  );
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    Object.values(CATALOGO)
      .flat()
      .forEach((c) => (init[c] = true));
    return init;
  });
  const [pares, setPares] = useState<Par[]>([]);
  const [sliders, setSliders] = useState<SliderMap>({});
  const [resultado, setResultado] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Build jerarquia from checked
  const buildJerarquia = () => {
    const j: Record<string, string[]> = {};
    for (const [dim, criterios] of Object.entries(CATALOGO)) {
      const activos = criterios.filter((c) => checked[c]);
      if (activos.length > 0) j[dim] = activos;
    }
    return j;
  };

  const handleGenerarSliders = () => {
    const jerarquia = buildJerarquia();
    const dims = Object.keys(jerarquia);
    if (dims.length === 0) return;

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
    setPaso("sliders");
  };

  const sliderKey = (p: Par) => `${p.padre}||${p.i}||${p.j}`;
  const getSlider = (p: Par) => sliders[sliderKey(p)] ?? 0;
  const setSlider = (p: Par, v: number) =>
    setSliders((prev) => ({ ...prev, [sliderKey(p)]: v }));

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
    } catch (e: any) {
      setError("No se pudo conectar con el backend (http://127.0.0.1:8000).");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPaso("seleccion");
    setResultado(null);
    setError(null);
  };

  // Group pares by padre for rendering
  const paresPorPadre: Record<string, Par[]> = {};
  pares.forEach((p) => {
    if (!paresPorPadre[p.padre]) paresPorPadre[p.padre] = [];
    paresPorPadre[p.padre].push(p);
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h3 className="text-2xl font-bold text-brand-primary tracking-tight">
          Configurador de Semáforos — AHP
        </h3>
        <p className="text-xs text-[#43474f] mt-1">
          Definí los indicadores y sus pesos relativos mediante comparación por
          pares (método AHP).
        </p>
      </div>

      {/* PASO 1 — Selección de indicadores */}
      {paso === "seleccion" && (
        <div className="bg-white border border-brand-outline-variant rounded shadow-xs p-6 space-y-5">
          <h4 className="font-bold text-brand-primary text-sm border-b border-brand-outline-variant pb-2">
            Paso 1 — Seleccioná los indicadores a medir
          </h4>

          {Object.entries(CATALOGO).map(([dim, criterios]) => (
            <div key={dim}>
              <p className="text-[10px] font-extrabold text-brand-outline uppercase tracking-wider mb-2">
                {dim}
              </p>
              <div className="space-y-1.5">
                {criterios.map((c) => (
                  <label
                    key={c}
                    className="flex items-center gap-2.5 text-xs font-semibold text-[#43474f] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked[c]}
                      onChange={(e) =>
                        setChecked((prev) => ({
                          ...prev,
                          [c]: e.target.checked,
                        }))
                      }
                      className="rounded border-brand-outline-variant text-brand-primary w-3.5 h-3.5"
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={handleGenerarSliders}
            className="w-full bg-brand-primary text-white py-2.5 px-4 rounded text-xs font-bold hover:opacity-90 transition-all"
          >
            Siguiente: Configurar Pesos →
          </button>
        </div>
      )}

      {/* PASO 2 — Sliders de comparación */}
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

          {Object.entries(paresPorPadre).map(([padre, ps]) => (
            <div key={padre} className="space-y-3">
              <p className="text-[10px] font-extrabold text-brand-outline uppercase tracking-wider">
                {padre}
              </p>
              {ps.map((p) => {
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
              })}
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

      {/* PASO 3 — Resultado */}
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
    </div>
  );
}
