import { useEffect, useState } from "react";
import { getCarreras, updateCarrera } from "../api/auth";
import type { Carrera } from "../api/auth";

interface CareerSelectionScreenProps {
  onValidated: () => void;
}

export default function CareerSelectionScreen({
  onValidated,
}: CareerSelectionScreenProps) {
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [selected, setSelected] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCarreras()
      .then((data) => {
        setCarreras(data.filter((c) => c.activo));
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar las carreras.");
        setLoading(false);
      });
  }, []);

  const handleSubmit = async () => {
    if (selected === "") return;
    setSaving(true);
    setError(null);
    try {
      await updateCarrera(selected);
      onValidated();
    } catch {
      setError("Error al guardar la carrera. Intentalo de nuevo.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#001e40] text-white flex flex-col items-center justify-center font-sans select-none z-50">
      <div className="absolute inset-0 bg-radial from-[#022c5e]/30 to-transparent pointer-events-none" />

      <div className="relative flex flex-col items-center justify-between h-full py-16 px-6 max-w-md w-full">
        <div />

        <div className="flex flex-col items-center gap-8 w-full">
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
                  d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                />
              </svg>
            </div>

            <h1 className="font-bold text-2xl tracking-[0.25em] text-white mt-2">
              SBIRE
            </h1>
            <p className="text-sky-300/40 text-xs tracking-widest uppercase -mt-2 font-mono">
              SELECCIONÁ TU CARRERA
            </p>
          </div>

          <div className="w-full flex flex-col items-center gap-4 mt-4">
            <p className="text-sm text-gray-300 text-center">
              Para completar tu registro, seleccioná la carrera que cursás:
            </p>

            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                <span className="text-sm text-gray-400">Cargando carreras...</span>
              </div>
            ) : (
              <select
                value={selected}
                onChange={(e) =>
                  setSelected(e.target.value ? Number(e.target.value) : "")
                }
                className="w-full max-w-xs px-4 py-3 rounded bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400/50 appearance-none cursor-pointer"
              >
                <option value="" disabled className="text-gray-400 bg-[#001e40]">
                  -- Seleccioná una carrera --
                </option>
                {carreras.map((c) => (
                  <option
                    key={c.id}
                    value={c.id}
                    className="text-white bg-[#001e40]"
                  >
                    {c.nombre}
                  </option>
                ))}
              </select>
            )}

            {error && (
              <p className="text-red-400 text-xs">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={selected === "" || saving}
              className="mt-2 w-full max-w-xs bg-sky-500 hover:bg-sky-400 active:bg-sky-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded transition-colors cursor-pointer"
            >
              {saving ? "Guardando..." : "Confirmar Carrera"}
            </button>
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
