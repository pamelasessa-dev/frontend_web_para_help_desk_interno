import { useEffect, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Clock3,
  LoaderCircle,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { metricsService } from "../../services/metricsService";
import type { TicketMetrics } from "../../types/metrics";
import { useToast } from "../../components/ui/ToastContext";

const STATUS_LABELS: Record<string, string> = {
  ABIERTO: "Abiertos",
  EN_PROCESO: "En proceso",
  RESUELTO: "Resueltos",
  CERRADO: "Cerrados",
};

const STATUS_COLORS: Record<string, string> = {
  ABIERTO: "#0ea5e9",
  EN_PROCESO: "#f59e0b",
  RESUELTO: "#10b981",
  CERRADO: "#64748b",
};

export function DashboardPage() {
  const [metrics, setMetrics] = useState<TicketMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    let active = true;

    const loadMetrics = async () => {
      try {
        setLoading(true);
        setError(false);

        const data = await metricsService.getMetrics();

        if (active) {
          setMetrics(data);
        }
      } catch {
        if (active) {
          setError(true);
          showToast("No se pudieron cargar las metricas.", "error");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadMetrics();

    return () => {
      active = false;
    };
  }, [showToast]);

  const statusData =
    metrics?.byStatus.map((item) => ({
      ...item,
      label: STATUS_LABELS[item.status] ?? item.status,
    })) ?? [];

  if (loading) {
    return (
      <section className="flex min-h-[350px] flex-col items-center justify-center gap-3">
        <LoaderCircle className="h-9 w-9 animate-spin text-cyan-600" />
        <p className="text-sm text-slate-500">Cargando metricas...</p>
      </section>
    );
  }

  if (error || !metrics) {
    return (
      <section className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto h-10 w-10 text-red-500" />

        <h2 className="mt-3 text-lg font-semibold text-slate-800">
          No se pudieron cargar las metricas
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Verifica tu conexion con el servidor e intenta nuevamente.
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-5 rounded-lg bg-cyan-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
        >
          Reintentar
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>

        <p className="mt-1 text-sm text-slate-500">
          Resumen general de los tickets del sistema.
        </p>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total de tickets
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {metrics.totalTickets}
              </p>
            </div>

            <div className="rounded-xl bg-cyan-50 p-3">
              <ClipboardList className="h-7 w-7 text-cyan-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Abiertos</p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {metrics.byStatus.find((item) => item.status === "ABIERTO")
                  ?.total ?? 0}
              </p>
            </div>

            <Clock3 className="h-7 w-7 text-sky-500" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Resueltos</p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {metrics.byStatus.find((item) => item.status === "RESUELTO")
                  ?.total ?? 0}
              </p>
            </div>

            <CheckCircle2 className="h-7 w-7 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Graficos */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Tickets por categoria */}
        <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-cyan-600" />

            <h2 className="text-base font-semibold text-slate-800">
              Tickets por categoria
            </h2>
          </div>

          {metrics.byCategory.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">
              No hay categorias para mostrar.
            </p>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metrics.byCategory}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -15,
                    bottom: 45,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

                  <XAxis
                    dataKey="categoryName"
                    angle={-25}
                    textAnchor="end"
                    interval={0}
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Bar
                    dataKey="total"
                    name="Tickets"
                    fill="#0891b2"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Tickets por estado */}
        <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-cyan-600" />

            <h2 className="text-base font-semibold text-slate-800">
              Tickets por estado
            </h2>
          </div>

          {metrics.totalTickets === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">
              Todavia no hay tickets para mostrar.
            </p>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="total"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    innerRadius={55}
                    paddingAngle={3}
                  >
                    {statusData.map((item) => (
                      <Cell
                        key={item.status}
                        fill={STATUS_COLORS[item.status]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2">
            {statusData.map((item) => (
              <div key={item.status} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: STATUS_COLORS[item.status],
                  }}
                />

                <span className="text-xs text-slate-600">
                  {item.label}: {item.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}