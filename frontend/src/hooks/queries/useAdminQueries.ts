import { useQuery } from "@tanstack/react-query";
import { getUsuarios } from "../../api/admin.ts";


export const adminSupremoKeys = {
  all: ["adminSupremo"] as const,
  usuarios: () => [...adminSupremoKeys.all, "usuarios"] as const,
};


export const useUsuariosAdmin = () => {
  return useQuery({
    queryKey: adminSupremoKeys.usuarios(),
    queryFn: getUsuarios,
  });
};