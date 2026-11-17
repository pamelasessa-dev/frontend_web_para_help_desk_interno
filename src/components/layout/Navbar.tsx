import { useAuth } from "../../context/AuthContext";
import { LogOut, User } from "lucide-react";

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-3">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">
            Bienvenido, {user?.email}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User size={18} />
            <span>{user?.role}</span>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
};
