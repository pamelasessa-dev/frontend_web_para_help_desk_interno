export type MetricTicketStatus =
  | "ABIERTO"
  | "EN_PROCESO"
  | "RESUELTO"
  | "CERRADO";

export interface CategoryMetric {
  categoryId: number;
  categoryName: string;
  total: number;
}

export interface StatusMetric {
  status: MetricTicketStatus;
  total: number;
}

export interface TicketMetrics {
  totalTickets: number;
  byCategory: CategoryMetric[];
  byStatus: StatusMetric[];
}
