import { env } from "@/lib/env";
import type {
  LoginApiResponse,
  RegisterApiResponse,
  ApiUser,
} from "@/types/auth";

// ─── Erreur typée retournée par Laravel ──────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── Helper fetch vers le backend ────────────────────────────────────────────

async function backendFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...fetchOptions.headers,
  };

  const res = await fetch(`${env.BACKEND_URL}${path}`, {
    ...fetchOptions,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      body.message ?? "Une erreur est survenue",
      body.errors
    );
  }

  return res.json() as Promise<T>;
}

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