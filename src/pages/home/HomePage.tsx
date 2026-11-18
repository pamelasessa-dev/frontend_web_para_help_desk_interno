import { Headset, Ticket, MessageCircle, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_30%_10%,rgba(6,182,212,0.20),transparent)]" />

      <div className="relative z-10">
        <header className="border-b border-white/10">
          <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-12">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/30">
                <Headset className="h-6 w-6" />
              </span>

              <span className="text-lg font-bold text-white">
                Help Desk Interno
              </span>
            </Link>

            <div className="flex flex-wrap items-center gap-4 text-sm sm:gap-6">
              <a
                href="#inicio"
                className="font-medium text-white transition hover:text-cyan-400"
              >
                Inicio
              </a>

              <a
                href="#servicios"
                className="text-slate-300 transition hover:text-cyan-400"
              >
                Servicios
              </a>

              <a
                href="#contacto"
                className="text-slate-300 transition hover:text-cyan-400"
              >
                Contacto
              </a>

              <Link
                to="/login"
                className="text-slate-300 transition hover:text-cyan-400"
              >
                Iniciar sesión
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-cyan-600 px-5 py-2.5 font-semibold text-white transition hover:bg-cyan-500"
              >
                Registrarse
              </Link>
            </div>
          </nav>
        </header>

        <section
          id="inicio"
          className="flex min-h-[65vh] items-center justify-center px-6 py-20 text-center"
        >
          <div className="mx-auto max-w-4xl">
            <span className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold tracking-wider text-cyan-400">
              SOPORTE TÉCNICO INTERNO
            </span>

            <h1 className="mt-8 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Un solo lugar para gestionar tus{" "}
              <span className="text-cyan-400">solicitudes de soporte.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
              Centralizá tus tickets, realizá seguimiento y conectate con el
              equipo de soporte de manera sencilla y organizada.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/login"
                className="rounded-full bg-cyan-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-500"
              >
                Iniciar sesión
              </Link>

              <a
                href="#servicios"
                className="rounded-full border border-slate-600 px-8 py-3.5 font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400"
              >
                Conocer los servicios
              </a>
            </div>
          </div>
        </section>

        <section
          id="servicios"
          className="border-t border-white/10 bg-slate-900/50 px-6 py-20"
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold tracking-widest text-cyan-400">
                NUESTROS SERVICIOS
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white">
                Estamos para ayudarte
              </h2>

              <p className="mt-4 text-slate-400">
                Todo lo que necesitás para gestionar tus solicitudes.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <ServiceCard
                icon={<Ticket className="h-7 w-7" />}
                title="Gestión de tickets"
                description="Creá y consultá solicitudes de soporte desde un único lugar."
              />

              <ServiceCard
                icon={<MessageCircle className="h-7 w-7" />}
                title="Comunicación"
                description="Mantené el seguimiento de tus solicitudes y sus comentarios."
              />

              <ServiceCard
                icon={<ShieldCheck className="h-7 w-7" />}
                title="Soporte organizado"
                description="Facilitamos la gestión y resolución de problemas técnicos."
              />
            </div>
          </div>
        </section>

        <section id="contacto" className="px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-white">
            ¿Necesitás una cuenta?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Registrate para acceder al sistema y gestionar tus solicitudes de
            soporte.
          </p>

          <Link
            to="/register"
            className="mt-7 inline-flex rounded-full bg-cyan-600 px-7 py-3 font-semibold text-white transition hover:bg-cyan-500"
          >
            Crear una cuenta
          </Link>
        </section>

        <footer className="border-t border-white/10 px-6 py-6 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Help Desk Interno. Todos los derechos
            reservados.
          </p>
        </footer>
      </div>
    </main>
  );
};

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceCard = ({ icon, title, description }: ServiceCardProps) => {
  return (
    <article className="rounded-2xl border border-slate-700/70 bg-slate-950/70 p-7 transition hover:-translate-y-1 hover:border-cyan-500/50">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>

      <p className="mt-3 leading-relaxed text-slate-400">{description}</p>
    </article>
  );
};