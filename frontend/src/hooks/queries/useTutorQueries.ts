import { useQuery } from "@tanstack/react-query";

import { getTutorEstudiantes } from "../../api/tutors.ts";

export const tutorKeys = {
  estudiantes: (tutor_id: number) => ["tutorEstudiantes", tutor_id] as const,
};

export const useTutorEstudiantes = (tutor_id: number | undefined) => {
  return useQuery({
    enabled: !!tutor_id,
    queryKey: tutorKeys.estudiantes(tutor_id ?? 0),
    queryFn: () => getTutorEstudiantes(tutor_id!),
  });
};
