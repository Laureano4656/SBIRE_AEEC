import { useQuery } from "@tanstack/react-query";
import {
  getDatosTutor,
  getEncuestasSinResponder,
  getMateriasAprobadas,
  getMateriasCursadas,
  getMateriasTotales,
} from "../../api/students.ts";

export const EstudianteKeys = {
  all: ["dashboard-estudiante"] as const,
  datosTutor: (estudiante_id: number) =>
    [...EstudianteKeys.all, "tutor", estudiante_id] as const,
  materiasAprobadas: (estudiante_id: number) =>
    [...EstudianteKeys.all, "materias-aprobadas", estudiante_id] as const,
  materiasTotales: (estudiante_id: number) =>
    [...EstudianteKeys.all, "materias-totales", estudiante_id] as const,
  materiasCursadas: (estudiante_id: number) =>
    [...EstudianteKeys.all, "materias-cursadas", estudiante_id] as const,
  encuestasSinResponder: (estudiante_id: number) =>
    [...EstudianteKeys.all, "encuestas-pendientes", estudiante_id] as const,
};

export const useDatosTutor = (estudianteId: number) => {
  return useQuery({
    queryKey: EstudianteKeys.datosTutor(estudianteId), // <-- Uso de la key factory
    queryFn: () => getDatosTutor(estudianteId),
    enabled: !!estudianteId,
  });
};

export const useMateriasAprobadas = (estudianteId: number) => {
  return useQuery({
    queryKey: EstudianteKeys.materiasAprobadas(estudianteId),
    queryFn: () => getMateriasAprobadas(estudianteId),
    enabled: !!estudianteId,
  });
};

export const useMateriasTotales = (estudianteId: number) => {
  return useQuery({
    queryKey: EstudianteKeys.materiasTotales(estudianteId),
    queryFn: () => getMateriasTotales(estudianteId),
    enabled: !!estudianteId,
  });
};

export const useMateriasCursadas = (estudianteId: number) => {
  return useQuery({
    queryKey: EstudianteKeys.materiasCursadas(estudianteId),
    queryFn: () => getMateriasCursadas(estudianteId),
    enabled: !!estudianteId,
  });
};

export const useEncuestasSinResponder = (estudianteId: number) => {
  return useQuery({
    queryKey: EstudianteKeys.encuestasSinResponder(estudianteId),
    queryFn: () => getEncuestasSinResponder(estudianteId),
    enabled: !!estudianteId,
  });
};