import { backendFetch, ApiError } from "@/lib/api/client";
import type {
  LoginApiResponse,
  RegisterApiResponse,
  ApiUser,
} from "@/types/auth";

// Ré-exporté pour compatibilité : `auth.ts` et `auth.actions.ts` importent
// `ApiError` depuis ce module.
export { ApiError };

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const authApi = {
  login: (credentials: {
    email: string;
    password: string;
  }): Promise<LoginApiResponse> =>
    backendFetch<LoginApiResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({
        ...credentials,
        device_name: "Certifa Web",
      }),
    }),

  register: (data: {
    last_name: string;
    first_name: string;
    artist_name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<RegisterApiResponse> =>
    backendFetch<RegisterApiResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: (token: string, allDevices = false): Promise<{ message: string }> =>
    backendFetch<{ message: string }>("/api/v1/auth/logout", {
      method: "POST",
      token,
      body: JSON.stringify({ all_devices: allDevices }),
    }),

  getProfile: (token: string): Promise<{ data: ApiUser }> =>
    backendFetch<{ data: ApiUser }>("/api/v1/profile", {
      method: "GET",
      token,
    }),
};