interface SoporteViewProps {
  onOpenChat: () => void;
}

export default function SoporteView({ onOpenChat }: SoporteViewProps) {
  return (
    <div className="space-y-8 animate-fade-in text-slate-800">
      <div>
        <span className="text-xs font-bold text-[#0369a1] uppercase tracking-wider bg-[#e0f1fe] px-3 py-1 rounded-lg">
          Cuerpo de Tutores Asignados
        </span>
        <h3 className="text-3xl font-bold tracking-tight text-slate-800 mt-2">
          Soporte Académico y Tutoría
        </h3>
        <p className="text-slate-500 font-medium text-sm mt-1 leading-normal">
          Aquí puedes acceder a las herramientas de apoyo académico del
          Sistema Travesía. Revisa horarios de consulta, solicita
          apoyo personalizado, o abre el canal de chat con tu tutor.
        </p>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs space-y-6">
          <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-primary">
              person_search
            </span>
            Tu Tutor Académico Oficial
          </h4>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              alt="Tutor de Mateo"
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
            />
            <div className="space-y-1">
              <h5 className="font-bold text-base text-slate-800">
                Dr. Juan Pérez
              </h5>
              <p className="text-xs text-slate-500 font-semibold">
                Tutor Senior - Departamento de Orientación al Alumno
              </p>
              <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 pt-1">
                <span className="material-symbols-outlined text-sm">mail</span>
                jperez@fi.mdp.edu.ar
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenChat}
              className="bg-brand-primary text-white hover:opacity-90 font-bold text-xs py-2.5 px-5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">chat</span>
              Abrir Chat con mi Tutor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
