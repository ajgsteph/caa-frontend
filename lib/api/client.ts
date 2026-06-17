// Client HTTP partagé vers le backend Laravel (/api/v1).
// Utilisé côté serveur ET côté client : on lit donc `process.env.NEXT_PUBLIC_BACKEND_URL`
// directement plutôt que `@/lib/env`, qui valide des secrets serveur (AUTH_SECRET)
// indisponibles dans le bundle navigateur.

const BASE =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://api.certifa.art";

// ─── Erreur typée renvoyée par Laravel ──────────────────────────────────────

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

export type BackendFetchOptions = RequestInit & { token?: string };

// ─── Helper fetch unique ─────────────────────────────────────────────────────

export async function backendFetch<T>(
    path: string,
    options: BackendFetchOptions = {}
): Promise<T> {
    const { token, ...init } = options;

    const headers: Record<string, string> = {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init.headers as Record<string, string> | undefined),
    };

    // Les corps JSON (string) reçoivent le Content-Type automatiquement ;
    // un FormData ne doit PAS le recevoir (le navigateur fixe la frontière multipart).
    if (typeof init.body === "string" && !("Content-Type" in headers)) {
        headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${BASE}${path}`, {
        ...init,
        headers,
        cache: "no-store",
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new ApiError(
            res.status,
            body.message ?? `Une erreur est survenue (${res.status})`,
            body.errors
        );
    }

    // Certaines réponses (DELETE, revoke) sont vides (204).
    return res.json().catch(() => ({})) as Promise<T>;
}
