import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useAuthStore } from "../../stores/authStore";

// 1. Esquema de validación con Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Formato de correo inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // 2. Manejo del envío del formulario
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      // Llama a la acción del store de Zustand
      await login(data);

      // Obtiene el usuario actualizado después del login
      const user = useAuthStore.getState().user;

      if (!user) {
        throw new Error("No se pudo recuperar la sesión.");
      }

      // 3. Redirección según el rol (Alineado con las rutas del Sidebar.tsx de tus compañeros)
      if (user.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "AGENTE") {
        navigate("/agente/dashboard", { replace: true });
      } else {
        // EMPLEADO: El sidebar de tus compañeros usa la ruta "/tickets" con la etiqueta "Mis Tickets"
        navigate("/empleado/tickets", { replace: true });
      }
    } catch (error: unknown) {
      // 4. Manejo de errores de Axios (Backend)
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        setServerError(
          Array.isArray(message)
            ? message[0] // Si es un array de errores de class-validator (NestJS)
            : typeof message === "string"
              ? message
              : "Credenciales incorrectas o error del servidor",
        );
      } else {
        // Manejo de errores genéricos
        setServerError(
          error instanceof Error ? error.message : "No se pudo iniciar sesión.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Renderizado del formulario UI
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
      {/* Campo Email */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">
          Correo electrónico
        </label>

        <input
          type="email"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          placeholder="tu@empresa.com"
          {...register("email")}
        />

        {errors.email && (
          <p className="text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>

      {/* Campo Contraseña */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">Contraseña</label>

        <input
          type="password"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          placeholder="Ingresá tu contraseña"
          {...register("password")}
        />

        {errors.password && (
          <p className="text-xs text-red-400">{errors.password.message}</p>
        )}
      </div>

      {/* Mensaje de error del servidor */}
      {serverError && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          {serverError}
        </div>
      )}

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLoading ? "Verificando credenciales..." : "Iniciar sesión"}
      </button>
    </form>
  );
};
