import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeUserRole } from "../../api/admin.ts";
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