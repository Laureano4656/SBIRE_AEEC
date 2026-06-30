export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#001e40] text-white flex flex-col items-center justify-center font-sans px-6">
      <div className="absolute inset-0 bg-radial from-[#022c5e]/30 to-transparent pointer-events-none" />

      <div className="relative flex flex-col items-center gap-8 max-w-md text-center">
        <svg
          className="w-20 h-20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>

        <h1 className="font-bold text-3xl tracking-[0.25em]">
          SBIRE
        </h1>
        <p className="text-sky-300/40 text-xs tracking-widest uppercase font-mono">
          SISTEMA TRAVESÍA
        </p>

        <p className="text-gray-300 text-sm leading-relaxed mt-4">
          Para acceder al sistema, ingresá desde el campus virtual de
          la Facultad de Ingeniería de la UNMdP.
        </p>

        <p className="text-xs text-white/50 uppercase tracking-[0.2em] font-medium mt-8">
          Facultad de Ingeniería UNMdP
        </p>
      </div>
    </div>
  );
}
