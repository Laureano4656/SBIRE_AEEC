import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { RiskLevel, Student } from "../types/types"; // ajustá la ruta si tu carpeta es distinta

// ---------- Props ----------
type ReportesPanelProps = {
  students: Student[];
};

// ---------- Helpers ----------
const RISK_BADGE: Record<RiskLevel, string> = {
  CRÍTICO: "bg-red-50 text-red-700 border-red-200",
  MEDIO: "bg-amber-50 text-amber-700 border-amber-200",
  BAJO: "bg-blue-50 text-blue-700 border-blue-200",
  SEGURO: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const formatCursada = (year: number) => `${year}° Año`;

function escapeCsvField(value: string | number): string {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const CSV_HEADERS = [
  "Legajo",
  "DNI",
  "Apellido y Nombre",
  "Carrera",
  "Cursada",
  "Tramo",
  "Nivel de Riesgo",
  "Promedio",
  "Materias Aprobadas",
  "Materias Totales",
  "Estado de Alerta",
];

function studentToRow(s: Student): (string | number)[] {
  return [
    s.legajo,
    s.dni,
    s.fullName,
    s.career,
    formatCursada(s.year),
    s.tramo,
    s.riskLevel,
    s.gpa.toFixed(2),
    s.subjectsApproved,
    s.subjectsTotal,
    s.statusAlerta,
  ];
}

export default function ReportesPanel({ students }: ReportesPanelProps) {
  const [filtroCarrera, setFiltroCarrera] = useState("TODAS");
  const [filtroAnio, setFiltroAnio] = useState("TODAS");
  const [filtroRiesgo, setFiltroRiesgo] = useState("TODOS");
  const [busqueda, setBusqueda] = useState("");

  const carrerasDisponibles = useMemo(
    () => Array.from(new Set(students.map((s) => s.career))).sort(),
    [students],
  );

  const aniosDisponibles = useMemo(
    () =>
      Array.from(new Set(students.map((s) => s.year))).sort((a, b) => a - b),
    [students],
  );

  const estudiantesFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return students.filter((s) => {
      if (filtroCarrera !== "TODAS" && s.career !== filtroCarrera) return false;
      if (filtroAnio !== "TODAS" && String(s.year) !== filtroAnio) return false;
      if (filtroRiesgo !== "TODOS" && s.riskLevel !== filtroRiesgo)
        return false;
      if (
        q &&
        !s.fullName.toLowerCase().includes(q) &&
        !s.legajo.toLowerCase().includes(q) &&
        !s.dni.includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [students, filtroCarrera, filtroAnio, filtroRiesgo, busqueda]);

  const resumenFiltros = `Carrera: ${filtroCarrera === "TODAS" ? "Todas" : filtroCarrera} · Cursada: ${filtroAnio === "TODAS" ? "Todas" : formatCursada(Number(filtroAnio))
    } · Riesgo: ${filtroRiesgo === "TODOS" ? "Todos" : filtroRiesgo} · Resultados: ${estudiantesFiltrados.length
    }`;

  const exportarCSV = () => {
    const filas = estudiantesFiltrados.map(studentToRow);
    const csvContent = [CSV_HEADERS, ...filas]
      .map((fila) => fila.map(escapeCsvField).join(","))
      .join("\n");

    // BOM al inicio para que Excel detecte UTF-8 y muestre bien los acentos
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reporte_estudiantes_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text("Reporte de Estudiantes — SBIRE", 14, 15);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(resumenFiltros, 14, 21);

    autoTable(doc, {
      startY: 26,
      head: [
        [
          "Legajo",
          "Apellido y Nombre",
          "Carrera",
          "Cursada",
          "Riesgo",
          "Prom.",
          "Aprobadas",
        ],
      ],
      body: estudiantesFiltrados.map((s) => [
        s.legajo,
        s.fullName,
        s.career,
        formatCursada(s.year),
        s.riskLevel,
        s.gpa.toFixed(2),
        `${s.subjectsApproved}/${s.subjectsTotal}`,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [79, 70, 229] }, // reemplazá por el hex real de --color-brand-primary si difiere
    });

    doc.save(`reporte_estudiantes_${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl">
      <div>
        <h3 className="text-2xl font-bold text-brand-primary tracking-tight">
          Reportes de Estudiantes
        </h3>
        <p className="text-xs text-[#43474f] mt-1">
          Filtrá por carrera, cursada y nivel de riesgo, y exportá el resultado
          a CSV o PDF.
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-brand-outline-variant rounded shadow-xs p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-brand-outline uppercase tracking-wider">
              Carrera
            </label>
            <select
              value={filtroCarrera}
              onChange={(e) => setFiltroCarrera(e.target.value)}
              className="w-full border border-brand-outline-variant rounded p-2 text-xs"
            >
              <option value="TODAS">Todas</option>
              {carrerasDisponibles.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-brand-outline uppercase tracking-wider">
              Cursada (Año)
            </label>
            <select
              value={filtroAnio}
              onChange={(e) => setFiltroAnio(e.target.value)}
              className="w-full border border-brand-outline-variant rounded p-2 text-xs"
            >
              <option value="TODAS">Todas</option>
              {aniosDisponibles.map((a) => (
                <option key={a} value={a}>
                  {formatCursada(a)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-brand-outline uppercase tracking-wider">
              Nivel de Riesgo
            </label>
            <select
              value={filtroRiesgo}
              onChange={(e) => setFiltroRiesgo(e.target.value)}
              className="w-full border border-brand-outline-variant rounded p-2 text-xs"
            >
              <option value="TODOS">Todos</option>
              <option value="CRÍTICO">Crítico</option>
              <option value="MEDIO">Medio</option>
              <option value="BAJO">Bajo</option>
              <option value="SEGURO">Seguro</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-brand-outline uppercase tracking-wider">
              Buscar
            </label>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Nombre, legajo o DNI..."
              className="w-full border border-brand-outline-variant rounded p-2 text-xs"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-brand-outline-variant pt-3">
          <p className="text-xs text-[#43474f]">
            Mostrando{" "}
            <strong className="text-brand-primary">
              {estudiantesFiltrados.length}
            </strong>{" "}
            de {students.length} estudiantes
          </p>
          <div className="flex gap-2">
            <button
              onClick={exportarCSV}
              disabled={estudiantesFiltrados.length === 0}
              className="border border-brand-primary text-brand-primary py-2 px-4 rounded text-xs font-bold hover:bg-[#eef2ff] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Exportar CSV
            </button>
            <button
              onClick={exportarPDF}
              disabled={estudiantesFiltrados.length === 0}
              className="bg-brand-primary text-white py-2 px-4 rounded text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Exportar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de resultados */}
      <div className="bg-white border border-brand-outline-variant rounded shadow-xs overflow-x-auto">
        {estudiantesFiltrados.length === 0 ? (
          <p className="text-xs text-[#43474f] italic p-6 text-center">
            No hay estudiantes que coincidan con los filtros seleccionados.
          </p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-brand-outline-variant">
                <th className="text-left font-extrabold text-brand-outline uppercase tracking-wider p-3">
                  Legajo
                </th>
                <th className="text-left font-extrabold text-brand-outline uppercase tracking-wider p-3">
                  Apellido y Nombre
                </th>
                <th className="text-left font-extrabold text-brand-outline uppercase tracking-wider p-3">
                  Carrera
                </th>
                <th className="text-left font-extrabold text-brand-outline uppercase tracking-wider p-3">
                  Cursada
                </th>
                <th className="text-left font-extrabold text-brand-outline uppercase tracking-wider p-3">
                  Riesgo
                </th>
                <th className="text-left font-extrabold text-brand-outline uppercase tracking-wider p-3">
                  Promedio
                </th>
                <th className="text-left font-extrabold text-brand-outline uppercase tracking-wider p-3">
                  Aprobadas
                </th>
              </tr>
            </thead>
            <tbody>
              {estudiantesFiltrados.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-brand-outline-variant last:border-b-0"
                >
                  <td className="p-3 text-[#43474f] font-semibold">
                    {s.legajo}
                  </td>
                  <td className="p-3 text-[#43474f]">{s.fullName}</td>
                  <td className="p-3 text-[#43474f]">{s.career}</td>
                  <td className="p-3 text-[#43474f]">
                    {formatCursada(s.year)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded border text-[10px] font-bold ${RISK_BADGE[s.riskLevel]}`}
                    >
                      {s.riskLevel}
                    </span>
                  </td>
                  <td className="p-3 text-[#43474f]">{s.gpa.toFixed(2)}</td>
                  <td className="p-3 text-[#43474f]">
                    {s.subjectsApproved}/{s.subjectsTotal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
