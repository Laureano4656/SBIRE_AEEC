interface AlertPillProps {
  status: "NUEVA" | "EN REVISIÓN" | "INTERVENIDA" | "SIN ALERTA";
}

export default function AlertPill({ status }: AlertPillProps) {
  switch (status) {
    case "NUEVA":
      return (
        <span className="bg-[#ffdad6] text-[#93000a] px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[#ba1a1a] rounded-full animate-pulse"></span>
          NUEVA
        </span>
      );
    case "EN REVISIÓN":
      return (
        <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
          EN REVISIÓN
        </span>
      );
    case "INTERVENIDA":
      return (
        <span className="bg-[#e2f3f5] text-[#006e6e] px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[#006a6a] rounded-full"></span>
          INTERVENIDA
        </span>
      );
    default:
      return (
        <span className="bg-[#f3f4f5] text-[#43474f] px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-0.5">
          SIN ALERTA
        </span>
      );
  }
}
