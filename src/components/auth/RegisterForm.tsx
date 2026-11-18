import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { authService } from "../../services/authService";

const registerSchema = z
  .object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    email: z
      .string()
      .min(1, "El correo es obligatorio")
      .email("Ingresá un correo válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirmá tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [serverError, setServerError] = useState("");
  const [registered, setRegistered] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError("");

    const { confirmPassword, ...credentials } = values;

    try {
      await authService.register(credentials);
      setRegistered(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        setServerError(
          Array.isArray(message)
            ? message.join(", ")
            : message ||
                "No se pudo completar el registro. Intentá nuevamente.",
        );
      } else {
        setServerError("Ocurrió un error inesperado. Intentá nuevamente.");
      }
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20";

  if (registered) {
    return (
      <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-8 text-center shadow-xl shadow-black/20">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
          <UserPlus size={30} />
        </div>

        <h2 className="mt-6 text-2xl font-bold text-white">
          ¡Registro exitoso!
        </h2>

        <p className="mt-3 leading-relaxed text-slate-400">
          Tu cuenta fue creada correctamente. Ya podés iniciar sesión en el
          sistema.
        </p>

        <Link
          to="/login"
          className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-cyan-600 px-5 py-3 font-semibold text-white transition hover:bg-cyan-500"
        >
          Ir a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {serverError && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {serverError}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Nombre
          </label>
          <input
            id="name"
            type="text"
            autoComplete="given-name"
            placeholder="Tu nombre"
            className={inputClass}
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Apellido
          </label>
          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            placeholder="Tu apellido"
            className={inputClass}
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="mt-1.5 text-xs text-red-400">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="correo@ejemplo.com"
          className={inputClass}
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            className={`${inputClass} pr-12`}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-cyan-400"
            aria-label={
              isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {isPasswordVisible ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1.5 text-xs text-red-400">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Confirmar contraseña
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={isConfirmPasswordVisible ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repetí tu contraseña"
            className={`${inputClass} pr-12`}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setIsConfirmPasswordVisible((visible) => !visible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-cyan-400"
            aria-label={
              isConfirmPasswordVisible
                ? "Ocultar contraseña"
                : "Mostrar contraseña"
            }
          >
            {isConfirmPasswordVisible ? (
              <EyeOff size={19} />
            ) : (
              <Eye size={19} />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1.5 text-xs text-red-400">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <UserPlus size={19} />
        {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
      </button>

      <p className="text-center text-sm text-slate-400">
        ¿Ya tenés una cuenta?{" "}
        <Link
          to="/login"
          className="font-semibold text-cyan-400 transition hover:text-cyan-300"
        >
          Iniciá sesión
        </Link>
      </p>
    </form>
  );
};
