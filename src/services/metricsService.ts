import { api } from "./api";
import type { TicketMetrics } from "../types/metrics";

export const metricsService = {
  async getMetrics(): Promise<TicketMetrics> {
    const response = await api.get<TicketMetrics>("/tickets/metrics");
    return response.data;
  },
};
