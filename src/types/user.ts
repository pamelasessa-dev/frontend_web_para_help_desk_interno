export type UserRole = "ADMIN" | "AGENTE" | "EMPLEADO";

export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  role: UserRole;
}
