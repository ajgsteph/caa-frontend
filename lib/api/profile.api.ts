import type { ApiUser } from "@/types/auth";

// ─── Helper ───────────────────────────────────────────────────────────────────

async function profileFetch<T>(
    path: string,
    token: string,
    options: RequestInit = {}
): Promise<T> {
    const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://api.certifa.art";

    const res = await fetch(`${backendUrl}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
        cache: "no-store",
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
        const err = new Error(body.message ?? `Erreur ${res.status}`) as Error & {
            status: number;
            errors?: Record<string, string[]>;
        };
        err.status = res.status;
        err.errors = body.errors;
        throw err;
    }

    return body as T;
}

// ─── Endpoints profil ─────────────────────────────────────────────────────────

export const profileApi = {
    get: (token: string): Promise<{ data: ApiUser }> =>
        profileFetch("/api/v1/profile", token),

    updateEmail: (
        token: string,
        payload: { email: string; current_password: string }
    ): Promise<{ message: string; data?: ApiUser }> =>
        profileFetch("/api/v1/profile/email", token, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),

    updatePassword: (
        token: string,
        payload: { current_password: string; password: string }
    ): Promise<{ message: string }> =>
        profileFetch("/api/v1/profile/password", token, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),

    updatePhone: (
        token: string,
        payload: { phone: string }
    ): Promise<{ message: string; data?: ApiUser }> =>
        profileFetch("/api/v1/profile/phone", token, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),
};