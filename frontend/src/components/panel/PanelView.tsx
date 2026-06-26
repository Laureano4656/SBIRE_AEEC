import { useState } from "react";
import type { Student } from "../../types/types.ts";
import {
  useConteoEstudiantes,
  useConteoPorRiesgo,
  useEvolucionScore,
  useHistorialAlertas,
  useHistorialAlertasGenerales,
  useTotalAlertasNuevas,
  useTotalCriticos,
  useTotalIntervenciones,
} from "../../hooks/queries/useAdminDepQueries.ts";

interface PanelViewProps {
  carreraId: number;
  dashboardAnio: number;
  students: Student[];
  onSelectStudent: (id: string) => void;
  onViewAllCriticos: () => void;
}

export default function PanelView({
  carreraId,
  dashboardAnio,
  students,
  onSelectStudent,
  onViewAllCriticos,
}: PanelViewProps) {
  const [evolucionAnio, setEvolucionAnio] = useState<number>(2022);
  const [historialStudentId, setHistorialStudentId] = useState<string | null>(
    null,
  );

  const {
    data: totalEstudiantes,
    isLoading: loadingTotal,
    isError: errorTotal,
  } = useConteoEstudiantes(dashboardAnio, carreraId);
  const {
    data: totalCriticos,
    isLoading: loadingCriticos,
    isError: errorCriticos,
  } = useTotalCriticos(carreraId);
  const {
    data: totalAlertas,
    isLoading: loadingAlertas,
    isError: errorAlertas,
  } = useTotalAlertasNuevas(carreraId);
  const {
    data: totalIntervenciones,
    isLoading: loadingIntervenciones,
    isError: errorIntervenciones,
  } = useTotalIntervenciones(carreraId);
  const {
    data: conteoPorRiesgo,
    isLoading: loadingRiesgo,
    isError: errorRiesgo,
  } = useConteoPorRiesgo(dashboardAnio, carreraId);

  const donutRojo = conteoPorRiesgo?.rojo ?? 0;
  const donutAmarillo = conteoPorRiesgo?.amarillo ?? 0;
  const donutVerde = conteoPorRiesgo?.verde ?? 100;

  const {
    data: evolucionScore,
    isLoading: loadingEvolucion,
    isError: errorEvolucion,
  } = useEvolucionScore(evolucionAnio, carreraId);

  const {
    data: historialAlertas = [],
    isLoading: loadingHistorial,
    isError: errorHistorial,
  } = useHistorialAlertas(historialStudentId);

  const {
    data: historialAlertasGenerales = [],
  } = useHistorialAlertasGenerales(carreraId.toString());

  const monthLabels = [
    "",
    "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
    "JUL", "AGO", "SEP", "OCT", "NOV", "DIC",
  ];

  const buildEvolucionChart = () => {
    if (!evolucionScore || loadingEvolucion || errorEvolucion) return null;

    const data = Object.entries(evolucionScore)
      .map(([m, s]) => ({ month: parseInt(m), score: s as number }))
      .sort((a, b) => a.month - b.month);
    const n = data.length;
    const w = 540, h = 140;
    const pts = data.map((d, i) => ({
      x: n > 1 ? (i / (n - 1)) * w : w / 2,
      y: h - (Math.min(Math.max(d.score, 0), 10) / 10) * h,
    }));

    const buildPath = (p: { x: number; y: number }[]) => {
      if (p.length < 2) return "";
      let d = `M ${p[0].x.toFixed(2)},${p[0].y.toFixed(2)}`;
      for (let i = 1; i < p.length; i++) {
        const mx = (p[i - 1].x + p[i].x) / 2;
        d += ` C ${mx.toFixed(2)},${p[i - 1].y.toFixed(2)} ${mx.toFixed(2)},${p[i].y.toFixed(2)} ${p[i].x.toFixed(2)},${p[i].y.toFixed(2)}`;
      }
      return d;
    };

    const linePath = buildPath(pts);
    const areaPath = linePath
      ? `${linePath} L ${pts[n - 1].x.toFixed(2)},${h} L ${pts[0].x.toFixed(2)},${h} Z`
      : "";

    return { data, pts, linePath, areaPath, n };
  };

  const criticalStudents = students.filter((s) => s.riskLevel === "CRÍTICO");

  return (
    <div className="space-y-8 animate-fade-in z-0">
      <div>
        <h3 className="text-3xl font-bold text-brand-primary tracking-tight">
          Hola, Administrador Departamental
        </h3>
        <p className="text-[#43474f] font-medium text-sm mt-1">
          Resumen general
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
          <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
            TOTAL ESTUDIANTES
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            {loadingTotal ? (
              <span className="inline-block w-20 h-8 bg-gray-200 rounded animate-pulse" />
            ) : errorTotal || !totalEstudiantes ? (
              <span className="text-3xl font-black text-brand-primary">—</span>
            ) : (
              <span className="text-3xl font-black text-brand-primary">
                {totalEstudiantes?.toLocaleString() ?? "—"}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
          <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
            RIESGO CRÍTICO
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            {loadingCriticos ? (
              <span className="inline-block w-20 h-8 bg-gray-200 rounded animate-pulse" />
            ) : errorCriticos || !totalCriticos ? (
              <span className="text-3xl font-black text-brand-error">—</span>
            ) : (
              <span className="text-3xl font-black text-brand-error">
                {totalCriticos?.total.toLocaleString() ?? "—"}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
          <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
            ALERTAS PENDIENTES
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            {loadingAlertas ? (
              <span className="inline-block w-20 h-8 bg-gray-200 rounded animate-pulse" />
            ) : errorAlertas || !totalAlertas ? (
              <span className="text-3xl font-black text-[#5a9ef1]">—</span>
            ) : (
              <span className="text-3xl font-black text-[#5a9ef1]">
                {totalAlertas?.total.toLocaleString() ?? "—"}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white border border-brand-outline-variant rounded p-5 shadow-xs">
          <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
            INTERVENCIONES (MES)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            {loadingIntervenciones ? (
              <span className="inline-block w-20 h-8 bg-gray-200 rounded animate-pulse" />
            ) : errorIntervenciones || !totalIntervenciones ? (
              <span className="text-3xl font-black text-[#006a6a]">—</span>
            ) : (
              <span className="text-3xl font-black text-[#006a6a]">
                {totalIntervenciones?.total.toLocaleString() ?? "—"}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-brand-outline-variant rounded p-6 shadow-xs flex flex-col">
          <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1 mb-5">
            <span className="material-symbols-outlined text-lg">
              donut_large
            </span>
            Semáforo General de Alumnos
          </h4>

          {loadingRiesgo ? (
            <div className="flex-1 flex flex-col justify-center items-center py-4">
              <span className="inline-block w-40 h-40 bg-gray-200 rounded-full animate-pulse" />
            </div>
          ) : errorRiesgo || !conteoPorRiesgo ? (
            <div className="flex-1 flex flex-col justify-center items-center py-4">
              <p className="text-brand-outline text-xs">Sin datos</p>
            </div>
          ) : (
            <>
              <div className="flex-1 flex flex-col justify-center items-center relative py-4">
                <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#edeeef" strokeWidth="3" />
                  <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#ba1a1a" strokeWidth="3.2" strokeDasharray={`${donutRojo} 100`} strokeDashoffset="0" />
                  <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#d97706" strokeWidth="3.2" strokeDasharray={`${donutAmarillo} 100`} strokeDashoffset={`-${donutRojo}`} />
                  <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#006a6a" strokeWidth="3.2" strokeDasharray={`${donutVerde} 100`} strokeDashoffset={`-${donutRojo + donutAmarillo}`} />
                </svg>
                <div className="absolute inset-x-0 top-18 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-brand-primary">
                    {loadingTotal ? "—" : (totalEstudiantes?.toLocaleString() ?? "—")}
                  </span>
                  <span className="text-[9px] text-brand-outline font-bold uppercase">
                    Población Activa
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-brand-outline-variant grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#006a6a] mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-brand-primary">{donutVerde}% Seguro</p>
                </div>
                <div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-brand-primary">{donutAmarillo}% Medio</p>
                </div>
                <div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-[#ba1a1a]">{donutRojo}% Crítico</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="lg:col-span-2 bg-white border border-brand-outline-variant rounded p-6 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-lg">trending_up</span>
              Evolución de Alertas por Cohorte
            </h4>
            <div className="flex gap-1.5">
              {[2022, 2023, 2024].map((year) => (
                <button
                  key={year}
                  onClick={() => setEvolucionAnio(year)}
                  className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                    evolucionAnio === year
                      ? "bg-brand-primary text-white border border-brand-primary font-extrabold"
                      : "bg-[#f3f4f5] text-[#43474f] border border-brand-outline-variant font-semibold hover:bg-[#e0e1e5]"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {(() => {
            const chart = buildEvolucionChart();
            if (!chart) {
              return (
                <div className="flex-1 bg-[#f8f9fa] border border-brand-outline-variant rounded p-2 h-44 flex items-center justify-center">
                  {loadingEvolucion ? (
                    <span className="inline-block w-full h-full bg-gray-200 rounded animate-pulse" />
                  ) : (
                    <p className="text-brand-outline text-xs">Sin datos</p>
                  )}
                </div>
              );
            }

            return (
              <div className="relative flex-1 bg-[#f8f9fa] border border-brand-outline-variant rounded p-2 h-44 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 540 140" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#001e40" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#001e40" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="35" x2="540" y2="35" stroke="#c3c6d1" strokeWidth="0.5" strokeDasharray="4 4" />
                  <line x1="0" y1="70" x2="540" y2="70" stroke="#c3c6d1" strokeWidth="0.5" strokeDasharray="4 4" />
                  <line x1="0" y1="105" x2="540" y2="105" stroke="#c3c6d1" strokeWidth="0.5" strokeDasharray="4 4" />
                  {chart.areaPath && <path d={chart.areaPath} fill="url(#areaGrad)" />}
                  {chart.linePath && <path d={chart.linePath} fill="none" stroke="#001e40" strokeWidth="2.5" />}
                  {chart.pts.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#001e40" />
                  ))}
                </svg>
                <div className="absolute inset-x-0 bottom-1 flex justify-between px-3 text-[9px] text-[#43474f] font-bold">
                  {chart.data.map((d, i) => (
                    <span key={i}>{monthLabels[d.month]}</span>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      <div className="bg-white border border-brand-outline-variant rounded shadow-xs overflow-hidden">
        <div className="bg-[#f8f9fa] border-b border-brand-outline-variant px-6 py-4 flex justify-between items-center">
          <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-lg">emergency</span>
            Alertas Críticas Recientes
          </h4>
          <button
            onClick={onViewAllCriticos}
            className="text-xs text-brand-primary font-bold hover:underline"
          >
            Ver listado completo
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#edeeef] text-[#43474f] font-bold uppercase tracking-wider">
                <th className="p-3 pl-6">Estudiante</th>
                <th className="p-3">Carrera / Año</th>
                <th className="p-3 text-center">Nivel Riesgo</th>
                <th className="p-3 text-center">Último Recálculo</th>
                <th className="p-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-outline-variant">
              {criticalStudents.slice(0, 5).map((s) => (
                <tr key={s.id} className="hover:bg-[#f8f9fa] transition-colors">
                  <td className="p-3 pl-6 font-bold text-brand-primary">
                    {s.lastNames}, {s.firstNames}
                  </td>
                  <td className="p-3 font-medium">
                    {s.career} ({s.year}° Año)
                  </td>
                  <td className="p-3 text-center">
                    <span className="bg-[#ffdad6] text-[#93000a] text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#ba1a1a] rounded-full" />
                      CRÍTICO ({s.riskValue.toFixed(1)})
                    </span>
                  </td>
                  <td className="p-3 text-center text-brand-outline font-medium">
                    {s.lastRecalculation}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => setHistorialStudentId(s.id)}
                        className="text-brand-secondary hover:underline font-bold"
                      >
                        Historial
                      </button>
                      <button
                        onClick={() => onSelectStudent(s.id)}
                        className="text-brand-primary hover:underline font-bold"
                      >
                        Intervenir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {criticalStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-brand-outline font-medium">
                    No hay alertas críticas activas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {historialStudentId &&
        (() => {
          const selected = students.find((s) => s.id === historialStudentId);
          return (
            <div className="bg-white border border-brand-outline-variant rounded shadow-xs overflow-hidden">
              <div className="bg-[#f8f9fa] border-b border-brand-outline-variant px-6 py-4 flex justify-between items-center">
                <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-lg">timeline</span>
                  Historial de Alertas — {selected?.lastNames}, {selected?.firstNames}
                </h4>
                <button
                  onClick={() => setHistorialStudentId(null)}
                  className="text-xs text-brand-error font-bold hover:underline"
                >
                  Cerrar
                </button>
              </div>
              <div className="p-4">
                {loadingHistorial ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                    ))}
                  </div>
                ) : errorHistorial ? (
                  <p className="text-center text-brand-outline text-xs py-4">Sin datos</p>
                ) : historialAlertasGenerales.length === 0 ? (
                  <p className="text-center text-brand-outline text-xs py-4">
                    No hay eventos registrados para esta carrera.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {historialAlertas.map((evt, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs">
                        <span className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${evt.tipo === "alerta" ? "bg-[#ba1a1a]" : "bg-[#006a6a]"}`} />
                        <div className="flex-1">
                          <span className="font-bold text-brand-primary capitalize">{evt.descripcion}</span>
                          <span className="text-brand-outline ml-2">
                            {evt.fecha ? new Date(evt.fecha).toLocaleDateString("es-AR") : "-"}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-brand-outline">{evt.tipo}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })()}
    </div>
  );
}
