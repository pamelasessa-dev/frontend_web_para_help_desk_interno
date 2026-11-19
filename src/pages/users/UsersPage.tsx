import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Loader2,
  Plus,
  Search,
  Users,
  UserRound,
  Mail,
  RefreshCw,
} from "lucide-react";

import { userService } from "../../services/userService";
import type { User, UserRole } from "../../types/user";
import { UserFormModal } from "../../components/users/UserFormModal";
import { useToast } from "../../components/ui/ToastContext";
import { getErrorMessage } from "../../utils/getErrorMessage";

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "TODOS">("TODOS");
  const [showForm, setShowForm] = useState(false);

  const { showToast } = useToast();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch = [user.name, user.lastName, user.email]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);

      const matchesRole = roleFilter === "TODOS" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const handleCreateUser = async (data: {
    name: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    try {
      await userService.create(data);
      setShowForm(false);
      showToast("Usuario creado correctamente", "success");
      await loadUsers();
    } catch (err) {
      showToast(getErrorMessage(err), "error");
      throw err;
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "Administrador";
      case "AGENTE":
        return "Agente";
      case "EMPLEADO":
        return "Empleado";
      default:
        return role;
    }
  };

  const getRoleStyle = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-700";
      case "AGENTE":
        return "bg-cyan-100 text-cyan-700";
      case "EMPLEADO":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Gestión de usuarios
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Consultá y registrá los usuarios del sistema.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
        >
          <Plus size={18} />
          Nuevo usuario
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-100 p-3 text-cyan-700">
              <Users size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total de usuarios</p>
              <p className="text-2xl font-bold text-slate-800">
                {users.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-3 text-purple-700">
              <UserRound size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Empleados</p>
              <p className="text-2xl font-bold text-slate-800">
                {users.filter((user) => user.role === "EMPLEADO").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, apellido o correo..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(event.target.value as UserRole | "TODOS")
            }
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
          >
            <option value="TODOS">Todos los roles</option>
            <option value="ADMIN">Administradores</option>
            <option value="AGENTE">Agentes</option>
            <option value="EMPLEADO">Empleados</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="flex flex-col justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center">
          <p className="text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={() => void loadUsers()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:text-red-900"
          >
            <RefreshCw size={16} />
            Reintentar
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-800">Usuarios registrados</h2>
          <p className="mt-1 text-sm text-slate-500">
            {filteredUsers.length} usuario(s) encontrado(s)
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-slate-500">
            <Loader2 size={22} className="animate-spin" />
            <span className="text-sm">Cargando usuarios...</span>
          </div>
        ) : error ? (
          <div className="py-10 text-center text-sm text-slate-500">
            No se pudo cargar la lista de usuarios.
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center">
            <Users size={32} className="mx-auto text-slate-300" />
            <p className="mt-3 font-medium text-slate-600">
              No se encontraron usuarios
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Probá cambiar los filtros de búsqueda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Usuario</th>
                  <th className="px-5 py-3 font-semibold">Correo</th>
                  <th className="px-5 py-3 font-semibold">Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="transition hover:bg-slate-50">
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                          <UserRound size={19} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">
                            {user.name} {user.lastName}
                          </p>
                          <p className="text-xs text-slate-400">
                            ID: {user.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        <Mail size={15} className="text-slate-400" />
                        {user.email}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getRoleStyle(user.role)}`}
                      >
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <UserFormModal
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateUser}
        />
      )}
    </div>
  );
};