import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  changeUserRole,
  createUsuario,
  updateUsuario,
  toggleUsuarioActivo,
} from "../../api/admin.ts";
import { adminSupremoKeys } from "../queries/useAdminQueries.ts";

export const useChangeUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminSupremoKeys.usuarios() });
    },
  });
};

export const useCreateUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminSupremoKeys.usuarios() });
    },
  });
};

export const useUpdateUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminSupremoKeys.usuarios() });
    },
  });
};

export const useToggleUsuarioActivo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleUsuarioActivo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminSupremoKeys.usuarios() });
    },
  });
};