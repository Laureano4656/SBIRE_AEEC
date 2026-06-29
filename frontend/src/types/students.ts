
export interface MateriaListResponse {
  id: number;
  nombre: string;
  codigo: string;
  cuatrimestre_sugerido: number;
  es_basica_critica: boolean;
  estado: string;
  cuatrimestre_dictado: number;
}


export interface AsignacionPendiente {
  asignacion_id: number;
  evento_disparador: number;
  periodo_lectivo: string;
  completado: boolean;
  nombre_evento: string;
}

export interface PreguntaEncuesta {
  id: number;
  indicador_id: number | null;
  carrera_id: number | null;
  texto_pregunta: string;
  evento_id: number;
  tipo_pregunta: string;
  configuracion_riesgo: unknown;
  activa: boolean;
  opciones: { id: number; pregunta_id: number; texto_opcion: string }[];
  respuesta_previa: unknown | null;
}

export interface BloqueAcademico {
  materia_id: number;
  materia_nombre: string;
  preguntas: PreguntaEncuesta[];
}

export interface FormularioEncuesta {
  asignacion_id: number;
  evento_disparador: number;
  periodo_lectivo: string;
  preguntas_generales: PreguntaEncuesta[];
  bloques_academicos: BloqueAcademico[];
}

export interface UsuarioResponse {
  id: number;
  carrera_id: number | null;
  nombre: string;
  apellido: string;
  email: string;
  moodle_id: string;
  rol: string; 
  max_casos_activos: number | null; 
  activo: boolean; 
}