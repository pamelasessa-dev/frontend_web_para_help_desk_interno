export interface CommentUser {
  id: number;
  name: string;
  lastName: string;
  email: string;
  role: "ADMIN" | "AGENTE" | "EMPLEADO";
}

export interface TicketComment {
  id: number;
  content: string;
  createdAt: string;
  user: CommentUser;
}

export interface CreateCommentData {
  content: string;
}
