
export interface UsuarioAdminResponse {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  moodle_id: string;
  rol: string;
  activo: boolean;
  max_casos_activos: number;
  nombre_carrera: string;
  carrera_id: number;
}

export interface RolUpdateResponse {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  activo: boolean;
}

export interface UsuarioCreatePayload {
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  carrera_id: number;
  activo: boolean;
}

export interface CarreraResponse {
  id: number;
  nombre: string;
}

export interface UsuarioUpdatePayload {
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: string;
  carrera_id?: number;
  activo?: boolean;
}