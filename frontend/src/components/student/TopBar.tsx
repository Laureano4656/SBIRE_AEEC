interface TopBarProps {
  title: string;
  onShowToast: (text: string) => void;
}

export default function TopBar({ title, onShowToast }: TopBarProps) {
  return (
    <header className="bg-white border-b border-[#e2e8f0] h-16 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center">
        <h2 className="text-sm font-black text-brand-primary uppercase tracking-widest">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <nav className="flex gap-4 text-xs font-semibold text-slate-500">
          <a
            href="#docs"
            onClick={(e) => {
              e.preventDefault();
              onShowToast("Conexión con SIU Guaraní activa.");
            }}
            className="hover:text-brand-primary transition-colors"
          >
            Documentación
          </a>
        </nav>

        <div className="w-[1px] h-6 bg-slate-200" />
      </div>
    </header>
  );
}
