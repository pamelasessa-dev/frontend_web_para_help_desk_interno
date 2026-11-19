import { api } from "./api";
import type { TicketComment, CreateCommentData } from "../types/comment";

export const commentService = {
  async getAll(ticketId: number): Promise<TicketComment[]> {
    const response = await api.get<TicketComment[]>(
      `/tickets/${ticketId}/comments`,
    );

    return response.data;
  },

  async create(
    ticketId: number,
    data: CreateCommentData,
  ): Promise<TicketComment> {
    const response = await api.post<TicketComment>(
      `/tickets/${ticketId}/comments`,
      data,
    );

    return response.data;
  },

  async update(
    ticketId: number,
    commentId: number,
    data: CreateCommentData,
  ): Promise<TicketComment> {
    const response = await api.patch<TicketComment>(
      `/tickets/${ticketId}/comments/${commentId}`,
      data,
    );

    return response.data;
  },
};