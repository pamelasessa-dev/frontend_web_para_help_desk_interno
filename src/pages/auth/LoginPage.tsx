import { Headset } from "lucide-react";
import { LoginForm } from "../../components/auth/LoginForm";

export const LoginPage = () => {
  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Lado Izquierdo: Branding (Solo visible en pantallas grandes) */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_30%_20%,rgba(6,182,212,0.25),transparent)]" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/30">
              <Headset className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold text-white">
              Help Desk Interno
            </span>
          </div>
          <div>
            <h2 className="max-w-md text-3xl font-bold leading-tight text-white">
              Un solo lugar para cada problema técnico
            </h2>
            <p className="mt-4 max-w-md text-slate-400">
              Empleados abren y siguen sus tickets. Agentes los resuelven.
              Administración supervisa toda la operación.
            </p>
          </div>
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Help Desk Interno
          </p>
        </div>
      </div>

      {/* Lado Derecho Formulario de Login */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Inicia sesión</h1>
            <p className="mt-2 text-sm text-slate-400">
              Accede a tus tickets y al panel de tu rol.
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
};
