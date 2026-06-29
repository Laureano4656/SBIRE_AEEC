import { useState } from "react";
import type { Dimension, Par, SliderMap } from "./types";
import { getPares, sliderKey, sliderToSaaty } from "./types";
import { AHPBoard } from "./AHPBoard";
import { AHPSliders } from "./AHPSliders";
import { AHPResultado } from "./AHPResultado";

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
            evento_disparador: 1,
          },
          {
            id: "q_2",
            texto: "¿Nivel educativo de tu padre?",
            tipo: "opcion_multiple",
            evento_disparador: 1,
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
            evento_disparador: 1,
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
            evento_disparador: 1,
          },
        ],
      },
    ],
  },
];

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

  const buildJerarquia = (): Record<string, string[]> => {
    const j: Record<string, string[]> = {};
    dimensiones.forEach((dim) => {
      const nombres = dim.indicadores
        .filter((ind) => ind.activo && ind.preguntas.length > 0)
        .map((ind) => ind.nombre);
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
      const valor = sliderToSaaty(sliders[sliderKey(p)] ?? 0);
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
      // TODO: enviar requestData al endpoint /calcular-ahp
      // Ejemplo con un futuro hook:
      //   const data = await calcularAhp(requestData);
      //   setResultado(JSON.stringify(data, null, 2));
      setResultado(JSON.stringify({ mensaje: "Placeholder - pendiente de integración con el backend" }, null, 2));
      setPaso("resultado");
    } catch {
      setError("No se pudo conectar con el backend.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPaso("board");
    setResultado(null);
    setError(null);
  };

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

      {paso === "board" && (
        <AHPBoard
          dimensiones={dimensiones}
          onDimensionesChange={setDimensiones}
          boardError={boardError}
          onBoardErrorChange={setBoardError}
          onNext={handleGenerarSliders}
        />
      )}

      {paso === "sliders" && (
        <AHPSliders
          pares={pares}
          sliders={sliders}
          onSliderChange={(p, v) =>
            setSliders((prev) => ({ ...prev, [sliderKey(p)]: v }))
          }
          jerarquiaSnapshot={jerarquiaSnapshot}
          loading={loading}
          error={error}
          onBack={reset}
          onCalculate={handleEnviar}
        />
      )}

      {paso === "resultado" && resultado && (
        <AHPResultado resultado={resultado} onNewConfig={reset} />
      )}
    </div>
  );
}
