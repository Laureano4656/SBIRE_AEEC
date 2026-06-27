
export interface UsuarioAdminResponse {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  moodle_id: string;
  rol: string;
  activo: boolean;
  max_casos_activos: number;
}

export interface RolUpdateResponse {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  activo: boolean;
}