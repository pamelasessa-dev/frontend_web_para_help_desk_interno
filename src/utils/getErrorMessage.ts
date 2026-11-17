import { isAxiosError } from "axios";

export function getErrorMessage(
  error: unknown,
  fallback = "Ocurrio un error inesperado",
): string {
  if (isAxiosError(error)) {
    if (!error.response) {
      return "No se pudo conectar con el servidor";
    }
    if (error.response.status === 403) {
      return "No tienes permisos para realizar esta accion";
    }
    const message = error.response.data?.message;
    if (Array.isArray(message)) return message[0];
    if (typeof message === "string") return message;
  }
  return fallback;
}
