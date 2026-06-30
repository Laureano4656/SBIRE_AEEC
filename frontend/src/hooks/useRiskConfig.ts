import { useAuth } from "./useAuth";
import { useUltimaConfiguracion } from "./queries/useIndicadoresQueries";

export function useRiskConfig() {
  const { user } = useAuth();
  const carrera_id = user?.carrera_id;
  const { data: config } = useUltimaConfiguracion(carrera_id, "temprana");
  return {
    umbralRojo: config?.configuracion?.umbral_rojo ?? 7.5,
    umbralAmarillo: config?.configuracion?.umbral_amarillo ?? 4.0,
  };
}
