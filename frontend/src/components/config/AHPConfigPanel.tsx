import { useEffect, useState } from "react";
import type { Dimension, Par, SliderMap, AHPRequest } from "./types";
import { getPares, sliderKey, sliderToSaaty } from "./types";
import { AHPBoard } from "./AHPBoard";
import { AHPSliders } from "./AHPSliders";
import { AHPResultado } from "./AHPResultado";
import { useIndicadoresPreguntas } from "../../hooks/queries/useIndicadoresQueries";
import { useAuth } from "../../hooks/useAuth";
import type { DimensionResponse } from "../../types/indicadores";
import type { TipoPreguntaEncuesta } from "../../types/types";
import { useSaveConfiguracionAhpMutation } from "../../hooks/mutations/useSaveConfiguracionAhpMutation";
import { calcularAhp } from "../../api/indicadores";




function mapDimension(dr: DimensionResponse): Dimension {
  return {
    id: dr.id.toString(),
    nombre: dr.nombre,
    indicadores: dr.indicadores.map((ir) => ({
      id: ir.id.toString(),
      nombre: ir.nombre,
      activo: true,
      preguntas: ir.preguntas.map((pr) => ({
        id: pr.id.toString(),
        texto: pr.texto_pregunta,
        tipo: pr.tipo_pregunta as TipoPreguntaEncuesta,
        evento_disparador: 0,
      })),
    })),
  };
}

export default function AHPConfigPanel() {
  const [paso, setPaso] = useState<"board" | "sliders" | "resultado">("board");
  const [dimensiones, setDimensiones] = useState<Dimension[]>([]);
  const [seeded, setSeeded] = useState(false);
  const { user } = useAuth();
  const { data: backendDimensiones, isLoading } = useIndicadoresPreguntas(
    user?.carrera_id,
  );
  const [pares, setPares] = useState<Par[]>([]);
  const [sliders, setSliders] = useState<SliderMap>({});
  const [jerarquiaSnapshot, setJerarquiaSnapshot] = useState<
    Record<string, string[]>
  >({});
  const [resultado, setResultado] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [boardError, setBoardError] = useState<string | null>(null);

  useEffect(() => {
    if (backendDimensiones && !seeded) {
      setDimensiones(backendDimensiones.map(mapDimension));
      setSeeded(true);
    }
  }, [backendDimensiones, seeded]);

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
    console.log("Jerarquía generada:", jerarquia);
    console.log("Pares generados:", nuevoPares);
    setPares(nuevoPares);
    setSliders({});
    setJerarquiaSnapshot(jerarquia);
    setPaso("sliders");
  };

  const { mutateAsync: saveConfigAsync } = useSaveConfiguracionAhpMutation();

  const handleEnviar = async () => {
    const dimNameToId = new Map(
      dimensiones.map((d) => [d.nombre, Number(d.id)]),
    );
    const indNameToId = new Map(
      dimensiones.flatMap((d) =>
        d.indicadores.map((ind) => [ind.nombre, Number(ind.id)]),
      ),
    );
    const activeDimIds = dimensiones
      .filter((d) => d.indicadores.some((ind) => ind.preguntas.length > 0))
      .map((d) => Number(d.id))
      .filter((id) => !isNaN(id));

    const jerarquia: Record<number, number[]> = {};
    if (activeDimIds.length > 1) jerarquia[0] = activeDimIds;
    for (const dim of dimensiones) {
      const dimId = Number(dim.id);
      if (isNaN(dimId)) continue;
      const activeIndIds = dim.indicadores
        .filter((ind) => ind.activo && ind.preguntas.length > 0)
        .map((ind) => Number(ind.id))
        .filter((id) => !isNaN(id));
      if (activeIndIds.length > 1) jerarquia[dimId] = activeIndIds;
    }

    const comparacionesPorNodo: Record<
      number,
      { criterio_i: number; criterio_j: number; valor: number }[]
    > = {};
    pares.forEach((p) => {
      const padreId = p.padre === "Índice de Riesgo"
        ? 0
        : (dimNameToId.get(p.padre) ?? NaN);
      const iId = indNameToId.get(p.i) ?? dimNameToId.get(p.i) ?? NaN;
      const jId = indNameToId.get(p.j) ?? dimNameToId.get(p.j) ?? NaN;
      if (isNaN(padreId) || isNaN(iId) || isNaN(jId)) return;
      const valor = sliderToSaaty(sliders[sliderKey(p)] ?? 0);
      if (!comparacionesPorNodo[padreId])
        comparacionesPorNodo[padreId] = [];
      comparacionesPorNodo[padreId].push({
        criterio_i: iId,
        criterio_j: jId,
        valor,
      });
    });

    const requestData: AHPRequest = {
      nodo_raiz: 0,
      jerarquia,
      comparaciones_por_nodo: comparacionesPorNodo,
      configuracion: {
        carrera_id: user?.carrera_id ?? 0,
        etapa: "temprana",
        umbral_amarillo: 0.33,
        umbral_rojo: 0.66,
        factor_extension: 1.0,
        descripcion: "",
        actualizado_por: user?.id ?? 0,
      },
    };

    setLoading(true);
    setError(null);
    try {
      // await saveConfigAsync({
      //   carrera_id: user?.carrera_id ?? 0,
      //   dimensiones: dimensiones.map((dim) => ({
      //     id: Number(dim.id) || null,
      //     nombre: dim.nombre,
      //     indicadores: dim.indicadores.map((ind) => ({
      //       id: Number(ind.id) || null,
      //       nombre: ind.nombre,
      //       activo: ind.activo,
      //       preguntas_ids: ind.preguntas.map((q) => Number(q.id) || null),
      //     })),
      //   })),
      // });
      console.log(requestData);
      const data = await calcularAhp(requestData);
      setResultado(JSON.stringify(requestData, null, 2));
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
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
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
        isLoading ? (
          <div className="flex items-center justify-center py-12">
            <span className="text-sm text-brand-outline animate-pulse">
              Cargando dimensiones...
            </span>
          </div>
        ) : (
          <AHPBoard
            dimensiones={dimensiones}
            onDimensionesChange={setDimensiones}
            boardError={boardError}
            onBoardErrorChange={setBoardError}
            onNext={handleGenerarSliders}
          />
        )
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
