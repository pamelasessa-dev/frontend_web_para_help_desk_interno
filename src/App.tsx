import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import { HomePage } from "./pages/home/HomePage";
import { LoginPage } from "./pages/auth/LoginPage";
import { TicketsPage } from "./pages/tickets/TicketsPage";
import { CreateTicketPage } from "./pages/tickets/CreateTicketPage";
import { TicketDetailPage } from "./pages/tickets/TicketDetailPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { CategoriesPage } from "./pages/categories/CategoriesPage";

import { ProtectedRoute } from "./routes/ProtectedRoute";
import { MainLayout } from "./layouts/MainLayout";
import { useAuthStore } from "./stores/authStore";
import { ToastProvider } from "./components/ui/ToastContext";

// Dashboard general.
const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-700">
          ¡Bienvenido/a, {user?.name} {user?.lastName}!
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Desde aquí podrás acceder a las funcionalidades del sistema Help Desk.
        </p>

        <p className="mt-4 inline-block rounded-full bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-700">
          Rol: {user?.role}
        </p>
      </div>
    </section>
  );
};

interface RoleHomeProps {
  title: string;
}

const RoleHome = ({ title }: RoleHomeProps) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <section className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>

        <p className="mt-4 text-slate-600">
          Bienvenido/a, {user?.name} {user?.lastName}
        </p>

        <p className="mt-2 text-sm text-slate-500">Correo: {user?.email}</p>

        <p className="mt-2 text-sm font-semibold text-cyan-700">
          Rol: {user?.role}
        </p>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 w-full rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white transition hover:bg-red-500"
        >
          Cerrar sesión
        </button>
      </section>
    </main>
  );
};

// Página para usuarios sin permisos.
const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <section className="max-w-md rounded-xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-red-600">Acceso denegado</h1>

        <p className="mt-3 text-slate-600">
          No tenés permisos para acceder a esta sección.
        </p>

        <button
          type="button"
          onClick={() => navigate("/login", { replace: true })}
          className="mt-6 rounded-lg bg-cyan-600 px-5 py-2.5 font-semibold text-white hover:bg-cyan-500"
        >
          Volver al inicio
        </button>
      </section>
    </main>
  );
};

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas protegidas para todos los usuarios autenticados */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "AGENTE", "EMPLEADO"]} />
            }
          >
            <Route element={<MainLayout />}>
              {/* Dashboard general */}
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Tickets generales */}
              <Route path="/tickets" element={<TicketsPage />} />
              <Route path="/tickets/:id" element={<TicketDetailPage />} />

              {/* Crear tickets: solo empleados */}
              <Route element={<ProtectedRoute allowedRoles={["EMPLEADO"]} />}>
                <Route path="/tickets/nuevo" element={<CreateTicketPage />} />
              </Route>

              {/* Rutas compartidas entre ADMIN y AGENTE */}
              <Route
                element={<ProtectedRoute allowedRoles={["ADMIN", "AGENTE"]} />}
              >
                <Route path="/agente/tickets" element={<TicketsPage />} />
                <Route path="/agente/categorias" element={<CategoriesPage />} />
              </Route>

              {/* Rutas específicas de ADMIN */}
              <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route
                  path="/admin/dashboard"
                  element={<RoleHome title="Panel de administración" />}
                />
              </Route>

              {/* Rutas específicas de AGENTE */}
              <Route element={<ProtectedRoute allowedRoles={["AGENTE"]} />}>
                <Route
                  path="/agente/dashboard"
                  element={<RoleHome title="Panel de agente" />}
                />
              </Route>

              {/* Rutas específicas de EMPLEADO */}
              <Route element={<ProtectedRoute allowedRoles={["EMPLEADO"]} />}>
                <Route
                  path="/empleado/tickets"
                  element={<RoleHome title="Mis tickets" />}
                />
              </Route>
            </Route>
          </Route>

          {/* Rutas inexistentes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;