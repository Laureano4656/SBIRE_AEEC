import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getTutorEstudiantes,
  getTutorAlertasSinAtender,
  getTutorIntervenciones,
  getTutorEntrevistas,
  getGeneralEstudiante,
  crearTutorIntervencion,
  crearTutorEntrevista,
  completarTutorEntrevista,
  cancelarTutorEntrevista,
  actualizarEstadoAlerta,
} from "../../api/tutors.ts";
import type {
  IntervencionCreatePayload,
  EntrevistaCreatePayload,
} from "../../types/admin_dep.ts";

export const tutorKeys = {
  estudiantes: (tutor_id: number) => ["tutorEstudiantes", tutor_id] as const,
  alertas: (carrera_id: number) => ["tutorAlertas", carrera_id] as const,
  intervenciones: (tutor_id: number) =>
    ["tutorIntervenciones", tutor_id] as const,
  entrevistas: (tutor_id: number) => ["tutorEntrevistas", tutor_id] as const,
  general: (estudiante_id: number) => ["tutorGeneralEstudiante", estudiante_id] as const,
};

export const useTutorEstudiantes = (tutor_id: number | undefined) => {
  return useQuery({
    queryKey: tutorKeys.estudiantes(tutor_id ?? 0),
    queryFn: () => getTutorEstudiantes(tutor_id!),
  });
};

export const useGeneralEstudiante = (estudiante_id: number | null) => {
  return useQuery({
    enabled: estudiante_id !== null,
    queryKey: tutorKeys.general(estudiante_id ?? 0),
    queryFn: () => getGeneralEstudiante(estudiante_id!),
  });
};

export const useTutorAlertasSinAtender = (
  carrera_id: number | undefined | null,
) => {
  return useQuery({
    //enabled: !!carrera_id,
    queryKey: tutorKeys.alertas(carrera_id ?? 0),
    queryFn: () => getTutorAlertasSinAtender(1),
  });
};

export const useTutorIntervenciones = (tutor_id: number | undefined) => {
  return useQuery({
    enabled: !!tutor_id,
    queryKey: tutorKeys.intervenciones(tutor_id ?? 0),
    queryFn: () => getTutorIntervenciones(tutor_id!),
  });
};

export const useTutorEntrevistas = (tutor_id: number | undefined) => {
  return useQuery({
    enabled: !!tutor_id,
    queryKey: tutorKeys.entrevistas(tutor_id ?? 0),
    queryFn: () => getTutorEntrevistas(tutor_id!),
  });
};

export const useCrearTutorIntervencion = (
  tutor_id: number | undefined,
  carrera_id: number | undefined | null,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IntervencionCreatePayload) =>
      crearTutorIntervencion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tutorKeys.intervenciones(tutor_id ?? 0),
      });
      queryClient.invalidateQueries({
        queryKey: tutorKeys.alertas(carrera_id ?? 0),
      });
    },
  });
};

export const useCrearTutorEntrevista = (tutor_id: number | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EntrevistaCreatePayload) => crearTutorEntrevista(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tutorKeys.entrevistas(tutor_id ?? 0),
      });
    },
  });
};

export const useCompletarTutorEntrevista = (tutor_id: number | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ entrevista_id, comentario }: { entrevista_id: number; comentario?: string }) =>
      completarTutorEntrevista(entrevista_id, comentario),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tutorKeys.entrevistas(tutor_id ?? 0),
      });
    },
  });
};

export const useCancelarTutorEntrevista = (tutor_id: number | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entrevista_id: number) =>
      cancelarTutorEntrevista(entrevista_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tutorKeys.entrevistas(tutor_id ?? 0),
      });
    },
  });
};

export const useActualizarEstadoAlerta = (
  carrera_id: number | undefined | null,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      alerta_id,
      estado,
    }: {
      alerta_id: number;
      estado: string;
    }) => actualizarEstadoAlerta(alerta_id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tutorKeys.alertas(carrera_id ?? 0),
      });
    },
  });
};
