import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Student } from "../types/types";
import { getRiskLevel } from "../../utils/studentMapping.ts";
import { useRiskConfig } from "../../hooks/useRiskConfig.ts";

// ---------- Props ----------
type ReportesPanelProps = {
  students: Student[];
};

// ---------- Helpers ----------
const RISK_BADGE: Record<string, string> = {
  CRÍTICO: "bg-red-50 text-red-700 border-red-200",
  MEDIO: "bg-amber-50 text-amber-700 border-amber-200",
  BAJO: "bg-blue-50 text-blue-700 border-blue-200",
};

function escapeCsvField(value: string | number | null): string {
  const str = value === null ? "" : String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const CSV_HEADERS = [
  "DNI",
  "Apellido y Nombre",
  "Carrera",
  "Etapa",
  "% Carrera",
  "Índice de Riesgo",
  "Nivel de Riesgo",
  "Estado de Alerta",
  "Último Recálculo",
];

function studentToRow(s: Student, umbralRojo?: number, umbralAmarillo?: number): (string | number | null)[] {
  return [
    s.dni,
    `${s.apellido}, ${s.nombre}`,
    s.carrera,
    s.etapa,
    s.porcentaje_carrera,
    s.indice_riesgo,
    getRiskLevel(s.indice_riesgo, umbralRojo, umbralAmarillo),
    s.estado_alerta,
    s.ultima_fecha_recalculo,
  ];
}

export default function ReportesPanel({ students }: ReportesPanelProps) {
  const { umbralRojo, umbralAmarillo } = useRiskConfig();
  const [filtroCarrera, setFiltroCarrera] = useState("TODAS");
  const [filtroEtapa, setFiltroEtapa] = useState("TODAS");
  const [filtroRiesgo, setFiltroRiesgo] = useState("TODOS");
  const [busqueda, setBusqueda] = useState("");

  const carrerasDisponibles = useMemo(
    () => Array.from(new Set(students.map((s) => s.carrera))).sort(),
    [students],
  );

  const etapasDisponibles = useMemo(
    () => Array.from(new Set(students.map((s) => s.etapa))).sort(),
    [students],
  );

  const estudiantesFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return students.filter((s) => {
      if (filtroCarrera !== "TODAS" && s.carrera !== filtroCarrera) return false;
      if (filtroEtapa !== "TODAS" && s.etapa !== filtroEtapa) return false;
      const level = getRiskLevel(s.indice_riesgo, umbralRojo, umbralAmarillo);
      if (filtroRiesgo !== "TODOS" && level !== filtroRiesgo)
        return false;
      if (
        q &&
        !`${s.apellido} ${s.nombre}`.toLowerCase().includes(q) &&
        !s.dni.includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [students, filtroCarrera, filtroEtapa, filtroRiesgo, busqueda]);

  const resumenFiltros = `Carrera: ${filtroCarrera === "TODAS" ? "Todas" : filtroCarrera} · Etapa: ${filtroEtapa === "TODAS" ? "Todas" : filtroEtapa} · Riesgo: ${filtroRiesgo === "TODOS" ? "Todos" : filtroRiesgo} · Resultados: ${estudiantesFiltrados.length
    }`;

  const exportarCSV = () => {
    const filas = estudiantesFiltrados.map((s) => studentToRow(s, umbralRojo, umbralAmarillo));
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
          "DNI",
          "Apellido y Nombre",
          "Carrera",
          "Etapa",
          "Riesgo",
          "Estado Alerta",
        ],
      ],
      body: estudiantesFiltrados.map((s) => [
        s.dni,
        `${s.apellido}, ${s.nombre}`,
        s.carrera,
        s.etapa,
        getRiskLevel(s.indice_riesgo, umbralRojo, umbralAmarillo),
        s.estado_alerta ?? "-",
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [79, 70, 229] },
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
              Etapa
            </label>
            <select
              value={filtroEtapa}
              onChange={(e) => setFiltroEtapa(e.target.value)}
              className="w-full border border-brand-outline-variant rounded p-2 text-xs"
            >
              <option value="TODAS">Todas</option>
              {etapasDisponibles.map((e) => (
                <option key={e} value={e}>
                  {e}
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
                  DNI
                </th>
                <th className="text-left font-extrabold text-brand-outline uppercase tracking-wider p-3">
                  Apellido y Nombre
                </th>
                <th className="text-left font-extrabold text-brand-outline uppercase tracking-wider p-3">
                  Carrera
                </th>
                <th className="text-left font-extrabold text-brand-outline uppercase tracking-wider p-3">
                  Etapa
                </th>
                <th className="text-left font-extrabold text-brand-outline uppercase tracking-wider p-3">
                  Riesgo
                </th>
                <th className="text-left font-extrabold text-brand-outline uppercase tracking-wider p-3">
                  Estado Alerta
                </th>
                <th className="text-left font-extrabold text-brand-outline uppercase tracking-wider p-3">
                  Últ. Recálculo
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
                      {s.dni}
                    </td>
                    <td className="p-3 text-[#43474f]">
                      {s.apellido}, {s.nombre}
                    </td>
                    <td className="p-3 text-[#43474f]">{s.carrera}</td>
                    <td className="p-3 text-[#43474f]">{s.etapa}</td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded border text-[10px] font-bold ${RISK_BADGE[getRiskLevel(s.indice_riesgo, umbralRojo, umbralAmarillo)]}`}
                      >
                        {getRiskLevel(s.indice_riesgo, umbralRojo, umbralAmarillo)}
                      </span>
                    </td>
                    <td className="p-3 text-[#43474f]">
                      {s.estado_alerta ?? "-"}
                    </td>
                    <td className="p-3 text-[#43474f]">
                      {s.ultima_fecha_recalculo ?? "-"}
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
