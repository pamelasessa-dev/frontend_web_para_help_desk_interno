import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
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
        {
          to: "/admin/dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
        },
        {
          to: "/tickets",
          label: "Todos los Tickets",
          icon: Ticket,
        },
        {
          to: "/admin/usuarios",
          label: "Usuarios",
          icon: Users,
        },
        {
          to: "/agente/categorias",
          label: "Categorías",
          icon: Tags,
        },
      ];
    }

    if (user?.role === "AGENTE") {
      return [
        {
          to: "/agente/dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
        },
        {
          to: "/tickets",
          label: "Bandeja de Tickets",
          icon: Ticket,
        },
        {
          to: "/agente/categorias",
          label: "Categorías",
          icon: Tags,
        },
      ];
    }

    if (user?.role === "EMPLEADO") {
      return [
        {
          to: "/tickets",
          label: "Mis Tickets",
          icon: Ticket,
        },
      ];
    }

    return [];
  })();

  return (
    <aside className="flex w-full flex-row items-center border-b border-slate-200 bg-white text-slate-800">
      <div className="border-r border-slate-200 px-6 py-4">
        <h2 className="whitespace-nowrap text-lg font-bold tracking-tight">
          Help Desk<span className="text-cyan-600">.</span>
        </h2>
        <p className="mt-1 text-xs text-slate-500">{user?.role}</p>
      </div>

      <nav
        className={`flex-1 overflow-x-auto px-4 py-2 ${
          isOpen ? "flex" : "hidden md:flex"
        }`}
      >
        <ul className="flex min-w-max items-center gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-100 text-slate-950"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <Icon size={18} />
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