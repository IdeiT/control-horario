export interface Usuario {
  id?: number;
  username: string;
  password?: string;
  rol: 'Administrador' | 'Supervisor' | 'Empleado' | 'Auditor';
  departamento?: string;
}

export interface UsuarioToken {
  username: string;
  rol: string;
  departamento?: string;
  exp?: number;
}

export interface LoginRequest {
  username: string;
  password: string;
  recaptchaToken?: string;
}

export interface LoginResponse {
  token: string;
  mensaje?: string;
}
