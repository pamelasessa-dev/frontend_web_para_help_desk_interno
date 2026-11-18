import { Headset, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { RegisterForm } from "../../components/auth/RegisterForm";

export const RegisterPage = () => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <div className="relative hidden w-1/2 overflow-hidden border-r border-white/10 lg:flex lg:flex-col lg:justify-center lg:px-16 xl:px-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_30%_10%,rgba(6,182,212,0.20),transparent)]" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/30">
              <Headset size={27} />
            </span>
            <span className="text-xl font-bold">Help Desk Interno</span>
          </Link>

          <p className="mt-16 text-sm font-semibold tracking-widest text-cyan-400">
            SOPORTE TÉCNICO INTERNO
          </p>

          <h1 className="mt-5 max-w-xl text-4xl font-bold leading-tight xl:text-5xl">
            Creá tu cuenta y comenzá a gestionar tus{" "}
            <span className="text-cyan-400">solicitudes de soporte.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-400">
            Registrate en nuestra plataforma para crear tickets, consultar su
            estado y mantenerte en contacto con el equipo de soporte.
          </p>

          <div className="mt-12 flex items-center gap-3 text-slate-400">
            <UserPlus className="text-cyan-400" size={21} />
            <span className="text-sm">
              Un espacio para tus solicitudes de soporte.
            </span>
          </div>
        </div>

        <p className="absolute bottom-8 left-16 text-xs text-slate-600 xl:left-24">
          © {new Date().getFullYear()} Help Desk Interno
        </p>
      </div>

      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center lg:text-left">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 lg:hidden">
              <Headset size={27} />
            </div>

            <h2 className="text-3xl font-bold text-white">Crear una cuenta</h2>

            <p className="mt-2 text-slate-400">
              Completá tus datos para registrarte en el sistema.
            </p>
          </div>

          <RegisterForm />

          <p className="mt-8 text-center text-sm text-slate-500">
            <Link to="/" className="transition hover:text-cyan-400">
              Volver al inicio
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
