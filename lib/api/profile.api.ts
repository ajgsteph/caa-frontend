import { backendFetch } from "@/lib/api/client";
import type { ApiUser } from "@/types/auth";

// ─── Endpoints profil ─────────────────────────────────────────────────────────

export const profileApi = {
    get: (token: string): Promise<{ data: ApiUser }> =>
        backendFetch("/api/v1/profile", { token }),

    updateEmail: (
        token: string,
        payload: { email: string; current_password: string }
    ): Promise<{ message: string; data?: ApiUser }> =>
        backendFetch("/api/v1/profile/email", {
            token,
            method: "PATCH",
            body: JSON.stringify(payload),
        }),

    updatePassword: (
        token: string,
        payload: { current_password: string; password: string }
    ): Promise<{ message: string }> =>
        backendFetch("/api/v1/profile/password", {
            token,
            method: "PATCH",
            body: JSON.stringify(payload),
        }),

    updatePhone: (
        token: string,
        payload: { phone: string }
    ): Promise<{ message: string; data?: ApiUser }> =>
        backendFetch("/api/v1/profile/phone", {
            token,
            method: "PATCH",
            body: JSON.stringify(payload),
        }),
};