export type TicketStatus = "ABIERTO" | "EN_PROCESO" | "RESUELTO" | "CERRADO";

export type TicketPriority = "BAJA" | "MEDIA" | "ALTA";

export interface TicketUser {
  id: number;
  name: string;
  lastName: string;
  email: string;
  role: "ADMIN" | "AGENTE" | "EMPLEADO";
}

export interface TicketCategory {
  id: number;
  name: string;
  description: string | null;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdById: number;
  assignedToId: number | null;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  createdBy: TicketUser;
  assignedTo: TicketUser | null;
  category: TicketCategory;
}

export interface CreateTicketData {
  title: string;
  description: string;
  priority: TicketPriority;
  categoryId: number;
}

export interface UpdateTicketStatusData {
  status: TicketStatus;
}

export interface AssignTicketData {
  assignedToId: number;
}
