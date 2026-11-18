import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import { LayoutDashboard, Ticket, Tags, Users } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const user = useAuthStore((state) => state.user);

  const menuItems = (() => {
    if (user?.role === "ADMIN") {
      return [
        { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/agente/tickets", label: "Todos los Tickets", icon: Ticket },
        { to: "/admin/usuarios", label: "Usuarios", icon: Users },
        { to: "/agente/categorias", label: "Categorías", icon: Tags },
      ];
    }

    if (user?.role === "AGENTE") {
      return [
        { to: "/agente/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/agente/tickets", label: "Bandeja de Tickets", icon: Ticket },
        { to: "/agente/categorias", label: "Categorías", icon: Tags },
      ];
    }

    if (user?.role === "EMPLEADO") {
      return [{ to: "/empleado/tickets", label: "Mis Tickets", icon: Ticket }];
    }
    return [];
  })();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        fixed top-0 left-0 z-30 h-full w-64 bg-gray-800 text-white transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:z-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Help Desk</h2>
          <p className="text-sm text-gray-400 mt-1">{user?.role}</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:bg-gray-700"
                      }`
                    }
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};
