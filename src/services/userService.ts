import { api } from "./api";
import type { User } from "../types/user";

export const userService = {
  async getAgents(): Promise<User[]> {
    const response = await api.get<User[]>("/users", {
      params: { role: "AGENTE" },
    });

    return response.data;
  },
};
