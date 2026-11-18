import { api } from "./api";
import type {
  Ticket,
  CreateTicketData,
  UpdateTicketStatusData,
  AssignTicketData,
} from "../types/ticket";

export const ticketService = {
  async getAll(): Promise<Ticket[]> {
    const response = await api.get<Ticket[]>("/tickets");
    return response.data;
  },

  async getById(id: number): Promise<Ticket> {
    const response = await api.get<Ticket>(`/tickets/${id}`);
    return response.data;
  },

  async create(data: CreateTicketData): Promise<Ticket> {
    const response = await api.post<Ticket>("/tickets", data);
    return response.data;
  },

  async updateStatus(
    id: number,
    data: UpdateTicketStatusData,
  ): Promise<Ticket> {
    const response = await api.patch<Ticket>(`/tickets/${id}/status`, data);
    return response.data;
  },

  async assign(id: number, data: AssignTicketData): Promise<Ticket> {
    const response = await api.patch<Ticket>(`/tickets/${id}/assign`, data);
    return response.data;
  },
};
