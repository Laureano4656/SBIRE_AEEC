import { useState, useRef } from "react";

interface NotaRow {
  legajo: string;
  apellido: string;
  nombre: string;
  materia: string;
  nota: string;
  fecha: string;
}

interface DocentePanelProps {
  onLogout: () => void;
}

function parseCSV(text: string): NotaRow[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  // Ignora la primer línea (header)
  return lines.slice(1).map((line) => {
    const [legajo, apellido, nombre, materia, nota, fecha] = line
      .split(",")
      .map((v) => v.trim());
    return { legajo, apellido, nombre, materia, nota, fecha };
  });
}

type UploadStatus = "idle" | "preview" | "uploading" | "success" | "error";

export default function DocentePanel({ onLogout }: DocentePanelProps) {
  const [rows, setRows] = useState<NotaRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [filterMateria, setFilterMateria] = useState("Todas");
  const fileRef = useRef<HTMLInputElement>(null);

  const materias = [
    "Todas",
    ...Array.from(new Set(rows.map((r) => r.materia).filter(Boolean))),
  ];

  const filteredRows =
    filterMateria === "Todas"
      ? rows
      : rows.filter((r) => r.materia === filterMateria);

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setErrorMsg("El archivo debe ser .csv");
      setStatus("error");
      return;
    }
    setFileName(file.name);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.length === 0) {
        setErrorMsg("El CSV está vacío o tiene formato incorrecto.");
        setStatus("error");
        return;
      }
      setRows(parsed);
      setStatus("preview");
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async () => {
    setStatus("uploading");
    try {
      const res = await fetch("http://127.0.0.1:8000/notas/importar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notas: rows }),
      });
      if (!res.ok) throw new Error("Error del servidor");
      setStatus("success");
    } catch (e) {
      setErrorMsg("No se pudo conectar con el backend.");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setRows([]);
    setFileName(null);
    setStatus("idle");
    setErrorMsg(null);
    setFilterMateria("Todas");
    if (fileRef.current) fileRef.current.value = "";
  };

  const notaColor = (nota: string) => {
    const n = parseFloat(nota);
    if (isNaN(n)) return "text-[#43474f]";
    if (n >= 7) return "text-[#006a6a] font-black";
    if (n >= 4) return "text-amber-600 font-black";
    return "text-[#ba1a1a] font-black";
  };

  return (
    <div className="min-h-screen flex text-[#191c1d] bg-[#f8f9fa]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-brand-outline-variant flex flex-col fixed left-0 top-0 h-screen z-20">
        <div className="px-6 py-8 border-b border-brand-outline-variant bg-[#f8f9fa]">
          <h1 className="text-2xl font-black text-brand-primary tracking-tight">
            SBIRE
          </h1>
          <p className="text-[10px] text-[#43474f] font-bold uppercase tracking-widest mt-1">
            Panel Docente
          </p>
        </div>

        <nav className="flex-1 py-6 space-y-1">
          <div className="w-full flex items-center gap-3 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-brand-primary bg-[#edeeef] border-r-4 border-brand-primary">
            <span className="material-symbols-outlined text-lg">
              upload_file
            </span>
            Carga de Notas
          </div>
        </nav>

        <div className="p-4 border-t border-brand-outline-variant bg-[#f8f9fa] mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-black text-sm">
              DC
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-xs truncate text-brand-primary">
                Docente
              </p>
              <p className="text-[10px] text-[#43474f] font-semibold uppercase tracking-wide">
                Ing. Industrial
              </p>
            </div>
            <button
              onClick={onLogout}
              title="Cerrar sesión"
              className="p-1 hover:text-brand-error text-[#43474f] rounded transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        <header className="bg-white border-b border-brand-outline-variant h-16 flex items-center px-8 sticky top-0 z-10 shadow-xs">
          <h2 className="text-sm font-black text-brand-primary uppercase tracking-widest">
            Importación de Notas — CSV
          </h2>
        </header>

        <main className="p-8 flex-1 space-y-6 max-w-5xl w-full mx-auto">
          {/* Header */}
          <div>
            <h3 className="text-2xl font-bold text-brand-primary tracking-tight">
              Carga de Calificaciones
            </h3>
            <p className="text-xs text-[#43474f] mt-1">
              Importá un archivo CSV con las notas de tus alumnos. El sistema
              las procesará y actualizará los perfiles de riesgo
              automáticamente.
            </p>
          </div>

          {/* Formato esperado */}
          <div className="bg-white border border-brand-outline-variant rounded p-4 shadow-xs">
            <h4 className="text-[10px] font-extrabold text-brand-outline uppercase tracking-wider mb-2">
              Formato esperado del CSV
            </h4>
            <pre className="bg-[#f8f9fa] border border-brand-outline-variant rounded p-3 text-[11px] font-mono text-[#43474f] overflow-x-auto">
              {`legajo,apellido,nombre,cod_carrera,materia,nota,fecha
12345,García,Mateo,12,Análisis Matemático II,8,15/06/2026
12346,López,Sofía,13,Física II,5,15/06/2026`}
            </pre>
          </div>

          {/* Drop zone */}
          {status === "idle" || status === "error" ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              className="bg-white border-2 border-dashed border-brand-outline-variant hover:border-brand-primary rounded p-12 text-center cursor-pointer transition-all group"
            >
              <span className="material-symbols-outlined text-5xl text-brand-outline group-hover:text-brand-primary transition-colors">
                upload_file
              </span>
              <p className="font-bold text-brand-primary mt-3 text-sm">
                Arrastrá tu CSV aquí o hacé clic para seleccionar
              </p>
              <p className="text-[11px] text-brand-outline mt-1">
                Solo archivos .csv — máx. 5 MB
              </p>
              {errorMsg && (
                <p className="mt-3 text-xs text-brand-error font-bold bg-red-50 border border-brand-error/20 rounded px-3 py-2 inline-block">
                  {errorMsg}
                </p>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleInputChange}
              />
            </div>
          ) : status === "success" ? (
            <div className="bg-white border border-brand-outline-variant rounded p-8 text-center space-y-3 shadow-xs">
              <span className="material-symbols-outlined text-5xl text-[#006a6a]">
                check_circle
              </span>
              <h4 className="font-bold text-[#006a6a] text-lg">
                ¡Notas importadas exitosamente!
              </h4>
              <p className="text-xs text-[#43474f]">
                Se procesaron {rows.length} registros. Los perfiles de riesgo se
                recalcularán en los próximos minutos.
              </p>
              <button
                onClick={handleReset}
                className="bg-brand-primary text-white text-xs font-bold px-6 py-2.5 rounded hover:opacity-90 transition-all"
              >
                Cargar otro archivo
              </button>
            </div>
          ) : null}

          {/* Preview tabla */}
          {(status === "preview" || status === "uploading") &&
            rows.length > 0 && (
              <div className="space-y-4">
                {/* Info bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-brand-primary">
                      description
                    </span>
                    <div>
                      <p className="text-xs font-bold text-brand-primary">
                        {fileName}
                      </p>
                      <p className="text-[10px] text-brand-outline">
                        {rows.length} registros encontrados
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Filtro por materia */}
                    <div>
                      <select
                        value={filterMateria}
                        onChange={(e) => setFilterMateria(e.target.value)}
                        className="border border-brand-outline-variant rounded bg-white px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer"
                      >
                        {materias.map((m) => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleReset}
                      className="text-[10px] text-brand-error font-bold uppercase tracking-wider hover:underline"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>

                {/* Tabla preview */}
                <div className="bg-white border border-brand-outline-variant rounded shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#edeeef] text-[#43474f] font-bold uppercase tracking-wider">
                          <th className="p-3 pl-5 text-left border-b border-brand-outline-variant">
                            Legajo
                          </th>
                          <th className="p-3 text-left border-b border-brand-outline-variant">
                            Alumno
                          </th>
                          <th className="p-3 text-left border-b border-brand-outline-variant">
                            Materia
                          </th>
                          <th className="p-3 text-center border-b border-brand-outline-variant">
                            Nota
                          </th>
                          <th className="p-3 text-center border-b border-brand-outline-variant">
                            Fecha
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-outline-variant">
                        {filteredRows.map((row, i) => (
                          <tr
                            key={i}
                            className="hover:bg-[#f8f9fa] transition-colors"
                          >
                            <td className="p-3 pl-5 font-mono text-[#43474f]">
                              {row.legajo}
                            </td>
                            <td className="p-3 font-bold text-brand-primary">
                              {row.apellido}, {row.nombre}
                            </td>
                            <td className="p-3 text-[#43474f]">
                              {row.materia}
                            </td>
                            <td
                              className={`p-3 text-center text-sm ${notaColor(row.nota)}`}
                            >
                              {row.nota}
                            </td>
                            <td className="p-3 text-center text-brand-outline font-medium">
                              {row.fecha}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-[#f8f9fa] border-t border-brand-outline-variant flex justify-between items-center">
                    <span className="text-[10px] text-[#43474f] font-semibold">
                      Mostrando {filteredRows.length} de {rows.length} registros
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={handleReset}
                        className="px-4 py-2 border border-brand-outline-variant text-[#43474f] rounded text-xs font-semibold hover:bg-[#edeeef] transition-all"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={status === "uploading"}
                        className="px-5 py-2 bg-brand-primary text-white rounded text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {status === "uploading" ? (
                          <>
                            <span className="material-symbols-outlined text-sm animate-spin">
                              progress_activity
                            </span>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-sm">
                              cloud_upload
                            </span>
                            Confirmar y enviar {rows.length} notas
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </main>
      </div>
    </div>
  );
}
