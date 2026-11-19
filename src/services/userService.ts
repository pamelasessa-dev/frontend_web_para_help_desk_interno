import { api } from "./api";
import type { User, UserRole } from "../types/user";

export interface CreateUserPayload {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export const userService = {
  // Obtener usuarios, opcionalmente filtrados por rol
  async getAll(role?: UserRole): Promise<User[]> {
    const { data } = await api.get<User[]>("/users", {
      params: role ? { role } : {},
    });

    return data;
  },

  // Obtener agentes (se mantiene para TicketsPage)
  async getAgents(): Promise<User[]> {
    return this.getAll("AGENTE");
  },

  // Obtener un usuario por su ID
  async getById(id: number): Promise<User> {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  // Crear un usuario (el backend asigna EMPLEADO por defecto)
  async create(payload: CreateUserPayload): Promise<User> {
    const { data } = await api.post<User>("/users", payload);
    return data;
  },
};
