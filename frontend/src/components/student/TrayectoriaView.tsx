import { useMateriasCursadas, useMateriasAprobadas, useMateriasTotales } from "../../hooks/queries/useEstudianteQueries.ts";

interface TrayectoriaViewProps {
  estudianteId: number;
}

export default function TrayectoriaView({ estudianteId }: TrayectoriaViewProps) {
  const { data: materias, isLoading: loadingMaterias } = useMateriasCursadas(estudianteId);
  const { data: aprobadas, isLoading: loadingAprobadas } = useMateriasAprobadas(estudianteId);
  const { data: totales, isLoading: loadingTotales } = useMateriasTotales(estudianteId);

  const isLoading = loadingMaterias || loadingAprobadas || loadingTotales;
  const totalAprobadas = aprobadas ?? 0;
  const totalMaterias = totales ?? 0;
  const porcentajeAvance = totalMaterias > 0 ? Math.round((totalAprobadas / totalMaterias) * 100) : 0;

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-slate-200 rounded w-1/3" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
            <div className="h-4 bg-slate-200 rounded w-2/3" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs animate-pulse">
              <div className="h-3 bg-slate-200 rounded w-1/2 mb-4" />
              <div className="h-8 bg-slate-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-sm">
        <div className="space-y-2 max-w-2xl">
          <h3 className="text-3xl font-bold tracking-tight text-slate-800">
            Mi Trayectoria Académica
          </h3>
          <p className="text-xl font-medium text-slate-500">
            Resumen de tu progreso académico.
          </p>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            Mantenés {totalAprobadas} materias aprobadas sobre {totalMaterias} del plan de estudios.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 relative shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            AVANCE EN LA CARRERA
          </span>
          <span className="text-3xl font-black text-slate-800 mt-2 block">
            {porcentajeAvance}%
          </span>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-brand-primary h-full rounded-full" style={{ width: `${porcentajeAvance}%` }} />
          </div>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 relative shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              MATERIAS APROBADAS
            </span>
            <span className="text-3xl font-black text-slate-800 mt-2 block">
              {totalAprobadas} / {totalMaterias}
            </span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-xs">
        <div className="px-6 py-5 border-b border-[#e2e8f0] flex justify-between items-center bg-slate-50">
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <span className="material-symbols-outlined text-lg text-brand-primary">
              menu_book
            </span>
            Mis Materias
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="p-4 pl-6">Materia</th>
                <th className="p-4 text-center">Código</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-center">Cuatrimestre</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {materias?.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400 font-semibold text-xs">
                    No hay materias registradas.
                  </td>
                </tr>
              )}
              {materias?.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-slate-800">{m.nombre}</div>
                  </td>
                  <td className="p-4 text-center text-slate-500 font-semibold">
                    {m.codigo}
                  </td>
                  <td className="p-4 text-center animate-fade-in">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      m.estado === "aprobada" ? "bg-emerald-50 text-emerald-700" :
                      m.estado === "cursando" ? "bg-[#e0f1fe] text-[#0369a1]" :
                      m.estado === "desaprobada" ? "bg-red-50 text-red-700" :
                      "bg-slate-100 text-slate-600"
                    }`}>
                      {m.estado}
                    </span>
                  </td>
                  <td className="p-4 text-center text-slate-500 font-semibold">
                    {m.cuatrimestre_sugerido}°
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
