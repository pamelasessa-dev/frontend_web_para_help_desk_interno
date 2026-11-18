import { useNavigate } from "react-router-dom";
import { LogOut, User, Menu } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
      <button
        onClick={onMenuClick}
        className="mr-4 rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
        aria-label="Abrir menú"
      >
        <Menu size={24} />
      </button>

      <div className="flex-1">
        <h1 className="text-lg font-semibold text-gray-800">
          Help Desk Interno
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-800">
                {user.name} {user.lastName}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
              <User size={20} />
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          aria-label="Cerrar sesión"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </button>
      </div>
    </header>
  );
};