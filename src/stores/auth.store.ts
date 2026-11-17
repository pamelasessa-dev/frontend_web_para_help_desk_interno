import { create } from "zustand";
import {
  authService,
  type AuthUser,
  type LoginCredentials,
} from "../services/auth.service";
import { setUnauthorizedHandler } from "../services/api";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

function getStoredUser(): AuthUser | null {
  try {
    const savedUser = sessionStorage.getItem("auth_user");
    return savedUser ? (JSON.parse(savedUser) as AuthUser) : null;
  } catch {
    sessionStorage.removeItem("auth_user");
    sessionStorage.removeItem("access_token");
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  token: sessionStorage.getItem("access_token"),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });

    try {
      const data = await authService.login(credentials);

      sessionStorage.setItem("access_token", data.access_token);
      sessionStorage.setItem("auth_user", JSON.stringify(data.user));

      set({
        user: data.user,
        token: data.access_token,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: "No se pudo iniciar sesión. Verificá tus credenciales.",
      });

      throw error;
    }
  },

  logout: () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("auth_user");

    set({
      user: null,
      token: null,
      error: null,
      isLoading: false,
    });
  },
}));

// Si el backend responde 401, cerramos la sesión.
setUnauthorizedHandler(() => {
  useAuthStore.getState().logout();
});
