import { SUBJECTS_MATEO } from "../../data.ts";

export default function TrayectoriaView() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-sm">
        <div className="space-y-2 max-w-2xl">
          <h3 className="text-3xl font-bold tracking-tight text-slate-800">
            Hola Mateo,
          </h3>
          <p className="text-xl font-medium text-slate-500">
            este es tu resumen de trayectoria y materias.
          </p>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            Mantienes un excelente progreso académico de cara al tramo
            final de la carrera. Responde los relevamientos
            correspondientes para recibir atención y agendar tutorías.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 relative shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            AVANCE EN LA CARRERA
          </span>
          <span className="text-3xl font-black text-slate-800 mt-2 block">
            64%
          </span>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-brand-primary h-full rounded-full" style={{ width: "64%" }} />
          </div>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 relative shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            PROMEDIO GENERAL
          </span>
          <span className="text-3xl font-black text-slate-800 mt-2 block">
            8.42
          </span>
          <p className="text-[10px] text-slate-400 mt-4 font-semibold leading-none">
            Basado en 22 materias aprobadas
          </p>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 relative shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              MATERIAS APROBADAS
            </span>
            <span className="text-3xl font-black text-slate-800 mt-2 block">
              18 / 32
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
            Mis Materias Actuales
          </h4>
          <span className="text-xs text-brand-primary font-bold">
            Plan de Estudios 2020
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="p-4 pl-6">Materia</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-center">Calificación Parcial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {SUBJECTS_MATEO.map((sm, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-slate-800">{sm.name}</div>
                    <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      {sm.teacher}
                    </div>
                  </td>
                  <td className="p-4 text-center animate-fade-in">
                    <span className="bg-[#e0f1fe] text-[#0369a1] px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      {sm.status}
                    </span>
                  </td>
                  <td className="p-4 text-center font-bold text-slate-800 text-sm">
                    {sm.finalGrade !== "-" ? sm.finalGrade : "Pendiente de Examen"}
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
