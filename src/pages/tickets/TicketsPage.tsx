import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Ticket as TicketIcon } from "lucide-react";

import { ticketService } from "../../services/ticketService";
import { useAuthStore } from "../../stores/authStore";
import type { Ticket } from "../../types/ticket";

const statusStyles: Record<string, string> = {
  ABIERTO: "bg-blue-100 text-blue-700",
  EN_PROCESO: "bg-amber-100 text-amber-700",
  RESUELTO: "bg-green-100 text-green-700",
  CERRADO: "bg-slate-100 text-slate-600",
};

const statusLabels: Record<string, string> = {
  ABIERTO: "Abierto",
  EN_PROCESO: "En proceso",
  RESUELTO: "Resuelto",
  CERRADO: "Cerrado",
};

const priorityLabels: Record<string, string> = {
  BAJA: "Baja",
  MEDIA: "Media",
  ALTA: "Alta",
};

export const TicketsPage = () => {
  const user = useAuthStore((state) => state.user);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await ticketService.getAll();
        setTickets(data);
      } catch {
        setError("No se pudieron cargar los tickets. Intentá nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  const pageTitle =
    user?.role === "ADMIN"
      ? "Todos los tickets"
      : user?.role === "AGENTE"
        ? "Bandeja de tickets"
        : "Mis tickets";

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{pageTitle}</h1>
          <p className="mt-1 text-sm text-slate-500">
            Consultá y gestioná los tickets del sistema.
          </p>
        </div>

        {user?.role === "EMPLEADO" && (
          <Link
            to="/tickets/nuevo"
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            <Plus size={18} />
            Crear ticket
          </Link>
        )}
      </div>

      {loading && (
        <p className="rounded-xl bg-white p-6 text-slate-500 shadow-sm">
          Cargando tickets...
        </p>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && tickets.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <TicketIcon className="mx-auto text-slate-400" size={36} />
          <h2 className="mt-3 font-semibold text-slate-700">
            No hay tickets todavía
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Cuando se creen tickets, aparecerán en esta sección.
          </p>
        </div>
      )}

      {!loading && !error && tickets.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">Ticket</th>
                  <th className="px-5 py-4">Categoría</th>
                  <th className="px-5 py-4">Prioridad</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4">Asignado a</th>
                  <th className="px-5 py-4">Fecha</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="font-semibold text-cyan-700 hover:text-cyan-900"
                      >
                        #{ticket.id} - {ticket.title}
                      </Link>
                      <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                        {ticket.description}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {ticket.category?.name ?? "Sin categoría"}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {priorityLabels[ticket.priority] ?? ticket.priority}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyles[ticket.status] ??
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {statusLabels[ticket.status] ?? ticket.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {ticket.assignedTo
                        ? `${ticket.assignedTo.name} ${ticket.assignedTo.lastName}`
                        : "Sin asignar"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                      {new Date(ticket.createdAt).toLocaleDateString("es-UY")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};