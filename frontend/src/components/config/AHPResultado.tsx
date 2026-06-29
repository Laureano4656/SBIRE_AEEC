interface AHPResultadoProps {
  resultado: string;
  onNewConfig: () => void;
}

export function AHPResultado({ resultado, onNewConfig }: AHPResultadoProps) {
  return (
    <div className="bg-white border border-brand-outline-variant rounded shadow-xs p-6 space-y-4">
      <h4 className="font-bold text-brand-primary text-sm border-b border-brand-outline-variant pb-2">
        Pesos Calculados
      </h4>
      <pre className="bg-slate-900 text-emerald-400 text-xs p-4 rounded overflow-x-auto leading-relaxed font-mono">
        {resultado}
      </pre>
      <button
        onClick={onNewConfig}
        className="w-full border border-brand-outline-variant text-brand-primary py-2.5 px-4 rounded text-xs font-bold hover:bg-[#f3f4f5] transition-all"
      >
        Nueva Configuración
      </button>
    </div>
  );
}
