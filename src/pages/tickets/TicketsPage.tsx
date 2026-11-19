import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Ticket as TicketIcon, Filter } from "lucide-react";

import { ticketService } from "../../services/ticketService";
import { useAuthStore } from "../../stores/authStore";
import type { Ticket } from "../../types/ticket";
import { categoryService } from "../../services/categoryService";
import type { Category } from "../../types/category";
import { userService } from "../../services/userService";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("TODOS");
  const [filterCategory, setFilterCategory] = useState<string>("TODAS");
  const [filterPriority, setFilterPriority] = useState<string>("TODAS");
  const [filterAssignedTo, setFilterAssignedTo] = useState<string>("TODOS");
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");
  const [agents, setAgents] = useState<
    { id: number; name: string; lastName: string }[]
  >([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const ticketsData = await ticketService.getAll();
        setTickets(ticketsData);
      } catch {
        setError("No se pudieron cargar los tickets. Intentá nuevamente.");
      } finally {
        setLoading(false);
      }

      try {
        const cats = await categoryService.getAll();
        setCategories(cats);
      } catch {
        console.error("No se pudieron cargar las categorías.");
      }

      const canManage = user?.role === "ADMIN" || user?.role === "AGENTE";
      if (canManage) {
        try {
          const agentsData = await userService.getAgents();
          setAgents(agentsData);
        } catch {
          console.error("No se pudieron cargar los agentes.");
        }
      }
    };

    loadData();
  }, [user?.role]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchStatus =
        filterStatus === "TODOS" || ticket.status === filterStatus;
      const matchCategory =
        filterCategory === "TODAS" ||
        ticket.categoryId.toString() === filterCategory;
      const matchPriority =
        filterPriority === "TODAS" || ticket.priority === filterPriority;
      const matchAssignedTo =
        filterAssignedTo === "TODOS" ||
        ticket.assignedToId?.toString() === filterAssignedTo;

      const ticketDate = new Date(ticket.createdAt);
      const dateFrom = filterDateFrom ? new Date(filterDateFrom) : null;
      const dateTo = filterDateTo ? new Date(filterDateTo) : null;

      const matchDateFrom = !dateFrom || ticketDate >= dateFrom;
      const matchDateTo = !dateTo || ticketDate <= dateTo;

      return (
        matchStatus &&
        matchCategory &&
        matchPriority &&
        matchAssignedTo &&
        matchDateFrom &&
        matchDateTo
      );
    });
  }, [
    tickets,
    filterStatus,
    filterCategory,
    filterPriority,
    filterAssignedTo,
    filterDateFrom,
    filterDateTo,
  ]);

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

      {/* SECCIÓN DE FILTROS */}
      {/* SECCIÓN DE FILTROS */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-slate-600">
          <Filter size={18} />
          <span className="text-sm font-medium">Filtrar por:</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* Estado */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="ABIERTO">Abierto</option>
            <option value="EN_PROCESO">En proceso</option>
            <option value="RESUELTO">Resuelto</option>
            <option value="CERRADO">Cerrado</option>
          </select>

          {/* Categoría */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          >
            <option value="TODAS">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Prioridad */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          >
            <option value="TODAS">Todas las prioridades</option>
            <option value="BAJA">Baja</option>
            <option value="MEDIA">Media</option>
            <option value="ALTA">Alta</option>
          </select>

          {/* Asignado a */}
          <select
            value={filterAssignedTo}
            onChange={(e) => setFilterAssignedTo(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          >
            <option value="TODOS">Todos los asignados</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name} {agent.lastName}
              </option>
            ))}
          </select>

          {/* Fecha desde */}
          <input
            type="date"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
            placeholder="Fecha desde"
          />

          {/* Fecha hasta */}
          <input
            type="date"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
            placeholder="Fecha hasta"
          />
        </div>
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

      {!loading && !error && filteredTickets.length === 0 && (
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

      {!loading && !error && filteredTickets.length > 0 && (
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
                {filteredTickets.map((ticket) => (
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
