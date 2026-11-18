import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  User,
  Tag,
  MessageCircle,
  Send,
} from "lucide-react";

import { ticketService } from "../../services/ticketService";
import { commentService } from "../../services/commentService";

import type { Ticket } from "../../types/ticket";
import type { TicketComment } from "../../types/comment";

const statusLabels: Record<string, string> = {
  ABIERTO: "Abierto",
  EN_PROCESO: "En proceso",
  RESUELTO: "Resuelto",
  CERRADO: "Cerrado",
};

const statusStyles: Record<string, string> = {
  ABIERTO: "bg-blue-100 text-blue-700",
  EN_PROCESO: "bg-amber-100 text-amber-700",
  RESUELTO: "bg-green-100 text-green-700",
  CERRADO: "bg-slate-100 text-slate-600",
};

const priorityLabels: Record<string, string> = {
  BAJA: "Baja",
  MEDIA: "Media",
  ALTA: "Alta",
};

export const TicketDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [newComment, setNewComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");
  const [commentsError, setCommentsError] = useState("");
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    const loadTicket = async () => {
      if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
        setError("El número de ticket no es válido.");
        setLoading(false);
        setCommentsLoading(false);
        return;
      }

      const ticketId = Number(id);

      try {
        setLoading(true);
        setError("");

        const data = await ticketService.getById(ticketId);
        setTicket(data);
      } catch {
        setError(
          "No se pudo cargar el ticket. Verificá que tengas permiso para consultarlo.",
        );
      } finally {
        setLoading(false);
      }

      try {
        setCommentsLoading(true);
        setCommentsError("");

        const data = await commentService.getAll(ticketId);
        setComments(data);
      } catch {
        setCommentsError("No se pudieron cargar los comentarios.");
      } finally {
        setCommentsLoading(false);
      }
    };

    loadTicket();
  }, [id]);

  const handleSubmitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id || !newComment.trim()) {
      return;
    }

    try {
      setSending(true);
      setSendError("");

      const createdComment = await commentService.create(Number(id), {
        content: newComment.trim(),
      });

      setComments((previousComments) => [...previousComments, createdComment]);

      setNewComment("");
    } catch {
      setSendError("No se pudo enviar el comentario. Intentá nuevamente.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <p className="rounded-xl bg-white p-6 text-slate-500 shadow-sm">
        Cargando información del ticket...
      </p>
    );
  }

  if (error || !ticket) {
    return (
      <section className="space-y-4">
        <Link
          to="/tickets"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-700"
        >
          <ArrowLeft size={16} />
          Volver a tickets
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error || "No se encontró el ticket."}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          to="/tickets"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-cyan-700"
        >
          <ArrowLeft size={16} />
          Volver a tickets
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Ticket #{ticket.id}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              {ticket.title}
            </h1>
          </div>

          <span
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              statusStyles[ticket.status] ?? "bg-slate-100 text-slate-600"
            }`}
          >
            {statusLabels[ticket.status] ?? ticket.status}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-slate-800">
          Descripción del problema
        </h2>

        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
          {ticket.description}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <Tag size={18} />
            <span className="text-sm">Categoría</span>
          </div>
          <p className="mt-2 font-semibold text-slate-800">
            {ticket.category?.name ?? "Sin categoría"}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Prioridad</p>
          <p className="mt-2 font-semibold text-slate-800">
            {priorityLabels[ticket.priority] ?? ticket.priority}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <User size={18} />
            <span className="text-sm">Creado por</span>
          </div>
          <p className="mt-2 font-semibold text-slate-800">
            {ticket.createdBy
              ? `${ticket.createdBy.name} ${ticket.createdBy.lastName}`
              : "No disponible"}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <User size={18} />
            <span className="text-sm">Agente asignado</span>
          </div>
          <p className="mt-2 font-semibold text-slate-800">
            {ticket.assignedTo
              ? `${ticket.assignedTo.name} ${ticket.assignedTo.lastName}`
              : "Pendiente de asignación"}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-slate-500">
          <CalendarDays size={18} />
          <span className="text-sm">Fecha de creación</span>
        </div>
        <p className="mt-2 font-medium text-slate-800">
          {new Date(ticket.createdAt).toLocaleString("es-UY")}
        </p>
      </div>

      {/* Historial de comentarios */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <MessageCircle size={20} className="text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-800">Comentarios</h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {comments.length}
          </span>
        </div>

        {commentsLoading ? (
          <p className="text-sm text-slate-500">Cargando comentarios...</p>
        ) : commentsError ? (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {commentsError}
          </p>
        ) : comments.length === 0 ? (
          <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
            Todavía no hay comentarios en este ticket.
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <article
                key={comment.id}
                className="rounded-lg border border-slate-100 bg-slate-50 p-4"
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-800">
                    {comment.user
                      ? `${comment.user.name} ${comment.user.lastName}`
                      : "Usuario"}
                  </p>

                  <time className="text-xs text-slate-400">
                    {new Date(comment.createdAt).toLocaleString("es-UY")}
                  </time>
                </div>

                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {comment.content}
                </p>
              </article>
            ))}
          </div>
        )}

        {/* Formulario para agregar comentarios */}
        <form
          onSubmit={handleSubmitComment}
          className="mt-6 border-t border-slate-100 pt-5"
        >
          <label
            htmlFor="newComment"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Agregar un comentario
          </label>

          <textarea
            id="newComment"
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            placeholder="Escribí tu comentario..."
            rows={4}
            maxLength={2000}
            className="w-full resize-y rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          />

          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              {newComment.length}/2000 caracteres
            </p>

            <button
              type="submit"
              disabled={sending || !newComment.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={16} />
              {sending ? "Enviando..." : "Enviar comentario"}
            </button>
          </div>

          {sendError && (
            <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {sendError}
            </p>
          )}
        </form>
      </div>
    </section>
  );
};