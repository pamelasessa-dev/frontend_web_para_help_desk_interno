import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import { LayoutDashboard, Ticket, Tags, Users, Settings } from "lucide-react";

export const Sidebar = () => {
  const user = useAuthStore((state) => state.user);

  const baseItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];
  const menuItems = (() => {
    if (user?.role === "ADMIN") {
      return [
        ...baseItems,
        { to: "/tickets", label: "Todos los Tickets", icon: Ticket },
        { to: "/categories", label: "Categorías", icon: Tags },
        { to: "/users", label: "Usuarios", icon: Users },
        { to: "/settings", label: "Configuración", icon: Settings },
      ];
    }

    if (user?.role === "AGENTE") {
      return [
        ...baseItems,
        { to: "/tickets", label: "Bandeja de Tickets", icon: Ticket },
        { to: "/categories", label: "Categorías", icon: Tags },
      ];
    }

    if (user?.role === "EMPLEADO") {
      return [
        ...baseItems,
        { to: "/tickets", label: "Mis Tickets", icon: Ticket },
      ];
    }
    return baseItems;
  })();

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen flex flex-col">
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
  );
};
