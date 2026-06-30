import { useQuery } from "@tanstack/react-query";
import { getUsuarios, getCarreras } from "../../api/admin.ts";


export const adminSupremoKeys = {
  all: ["adminSupremo"] as const,
  usuarios: () => [...adminSupremoKeys.all, "usuarios"] as const,
  carreras: () => [...adminSupremoKeys.all, "carreras"] as const,
};


export const useUsuariosAdmin = () => {
  return useQuery({
    queryKey: adminSupremoKeys.usuarios(),
    queryFn: getUsuarios,
  });
};

export const useCarreras = () => {
  return useQuery({
    queryKey: adminSupremoKeys.carreras(),
    queryFn: getCarreras,
  });
};