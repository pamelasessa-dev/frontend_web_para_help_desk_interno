import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import { LoginPage } from "./pages/auth/LoginPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { useAuthStore } from "./stores/auth.store";

// Página provisional para comprobar el acceso de cada rol.
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
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <section className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-2xl font-bold text-red-600">Acceso denegado</h1>

        <p className="mt-3 text-slate-600">
          No tenés permisos para acceder a esta sección.
        </p>

        <button
          type="button"
          onClick={() => window.location.assign("/")}
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
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<LoginPage />} />

        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Inicio */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas exclusivas de ADMIN */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route
            path="/admin/dashboard"
            element={<RoleHome title="Panel de administración" />}
          />
        </Route>

        {/* Rutas exclusivas de AGENTE */}
        <Route element={<ProtectedRoute allowedRoles={["AGENTE"]} />}>
          <Route
            path="/agente/dashboard"
            element={<RoleHome title="Panel de agente" />}
          />
        </Route>

        {/* Rutas exclusivas de EMPLEADO */}
        <Route element={<ProtectedRoute allowedRoles={["EMPLEADO"]} />}>
          <Route
            path="/empleado/tickets"
            element={<RoleHome title="Mis tickets" />}
          />
        </Route>

        {/* Rutas inexistentes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
