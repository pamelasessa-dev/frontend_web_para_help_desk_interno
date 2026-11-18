import { api } from "./api";

export type Role = "ADMIN" | "AGENTE" | "EMPLEADO";

export interface AuthUser {
  id: number;
  name: string;
  lastName: string;
  email: string;
  role: Role;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

export interface RegisterCredentials {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  name: string;
  lastName: string;
  email: string;
  role: Role;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", credentials);

    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>(
      "/auth/register",
      credentials,
    );

    return response.data;
  },
};
