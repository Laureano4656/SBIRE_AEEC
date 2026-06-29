import { feedbackLabel, sliderKey, type Par, type SliderMap } from "./types";

interface AHPSlidersProps {
  pares: Par[];
  sliders: SliderMap;
  onSliderChange: (p: Par, v: number) => void;
  jerarquiaSnapshot: Record<string, string[]>;
  loading: boolean;
  error: string | null;
  onBack: () => void;
  onCalculate: () => void;
}

function renderSliderRow(
  p: Par,
  sliders: SliderMap,
  onSliderChange: (p: Par, v: number) => void,
) {
  const v = sliders[sliderKey(p)] ?? 0;
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
          onChange={(e) => onSliderChange(p, Number(e.target.value))}
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
}

export function AHPSliders({
  pares,
  sliders,
  onSliderChange,
  jerarquiaSnapshot,
  loading,
  error,
  onBack,
  onCalculate,
}: AHPSlidersProps) {
  const paresPorPadre: Record<string, Par[]> = {};
  pares.forEach((p) => {
    if (!paresPorPadre[p.padre]) paresPorPadre[p.padre] = [];
    paresPorPadre[p.padre].push(p);
  });

  return (
    <div className="bg-white border border-brand-outline-variant rounded shadow-xs p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-brand-outline-variant pb-2">
        <h4 className="font-bold text-brand-primary text-sm">
          Paso 2 — Comparación por pares
        </h4>
        <button
          onClick={onBack}
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
            {paresPorPadre["Índice de Riesgo"].map((p) =>
              renderSliderRow(p, sliders, onSliderChange),
            )}
          </div>
        )}

      {Object.entries(jerarquiaSnapshot).map(([dim, criterios]) => (
        <div key={dim} className="space-y-3">
          <p className="text-[10px] font-extrabold text-brand-outline uppercase tracking-wider">
            {dim}
          </p>

          {criterios.length > 1 &&
            (paresPorPadre[dim] ?? []).map((p) =>
              renderSliderRow(p, sliders, onSliderChange),
            )}

          {criterios.length === 1 && (
            <p className="text-xs text-[#43474f] bg-[#f8f9fa] border border-brand-outline-variant rounded p-3">
              <strong className="text-brand-primary">{criterios[0]}</strong> es
              el único indicador activo de esta dimensión — recibe
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
        onClick={onCalculate}
        disabled={loading}
        className="w-full bg-brand-primary text-white py-2.5 px-4 rounded text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50"
      >
        {loading ? "Calculando..." : "Calcular Pesos Finales"}
      </button>
    </div>
  );
}
