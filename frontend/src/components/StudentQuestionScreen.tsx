interface StudentQuestionScreenProps {
  onAnswer: (isStudent: boolean) => void;
}

export default function StudentQuestionScreen({
  onAnswer,
}: StudentQuestionScreenProps) {
  return (
    <div className="fixed inset-0 bg-[#001e40] text-white flex flex-col items-center justify-center font-sans select-none z-50">
      <div className="absolute inset-0 bg-radial from-[#022c5e]/30 to-transparent pointer-events-none" />

      <div className="relative flex flex-col items-center justify-between h-full py-16 px-6 max-w-md w-full">
        <div />

        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative w-20 h-20 text-white flex items-center justify-center">
              <svg
                className="w-16 h-16 relative"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>

            <h1 className="font-bold text-2xl tracking-[0.25em] text-white mt-2">
              SBIRE
            </h1>
            <p className="text-sky-300/40 text-xs tracking-widest uppercase -mt-2 font-mono">
              SISTEMA TRAVESÍA
            </p>
          </div>

          <div className="flex flex-col items-center gap-6 w-full">
            <p className="text-lg text-gray-200 font-normal text-center">
              ¿Sos estudiante?
            </p>

            <div className="flex gap-4 w-full max-w-xs">
              <button
                onClick={() => onAnswer(true)}
                className="flex-1 bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white font-bold py-3 px-6 rounded transition-colors cursor-pointer"
              >
                Sí
              </button>
              <button
                onClick={() => onAnswer(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold py-3 px-6 rounded transition-colors border border-white/20 cursor-pointer"
              >
                No
              </button>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs text-white/50 uppercase tracking-[0.2em] font-medium text-center">
            Facultad de Ingeniería UNMdP
          </p>
        </div>
      </div>
    </div>
  );
}
