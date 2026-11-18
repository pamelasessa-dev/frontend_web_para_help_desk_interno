import { api } from "./api";
import type { Category } from "../types/category";

export interface CategoryPayload {
  name: string;
  description?: string;
}

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const { data } = await api.get<Category[]>("/categories");
    return data;
  },

  async create(payload: CategoryPayload): Promise<Category> {
    const { data } = await api.post<Category>("/categories", payload);
    return data;
  },

  async update(id: number, payload: CategoryPayload): Promise<Category> {
    const { data } = await api.patch<Category>(`/categories/${id}`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};