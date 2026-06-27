
export interface MateriaListResponse {
  id: number;
  nombre: string;
  codigo: string;
  cuatrimestre_sugerido: number;
  es_basica_critica: boolean;
  estado: string;
  cuatrimestre_dictado: number;
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