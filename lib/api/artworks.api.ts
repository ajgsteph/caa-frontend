import type {
    ArtworkListResponse,
    ArtworkResponse,
} from "@/types/artworks";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://caa-backend-603u.onrender.com";

async function apiFetch<T>(
    path: string,
    token: string,
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        ...options,
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
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

// ─── Artworks ─────────────────────────────────────────────────────────────────

export const artworksApi = {
    list: (token: string): Promise<ArtworkListResponse> =>
        apiFetch("/api/v1/artworks", token),

    get: (token: string, id: number): Promise<ArtworkResponse> =>
        apiFetch(`/api/v1/artworks/${id}`, token),

    create: (token: string, formData: FormData): Promise<ArtworkResponse> =>
        apiFetch("/api/v1/artworks", token, {
            method: "POST",
            body: formData,
        }),

    update: (token: string, id: number, formData: FormData): Promise<ArtworkResponse> =>
        apiFetch(`/api/v1/artworks/${id}`, token, {
            method: "POST",
            body: formData,
        }),

    delete: (token: string, id: number): Promise<void> =>
        apiFetch(`/api/v1/artworks/${id}`, token, { method: "DELETE" }),
};