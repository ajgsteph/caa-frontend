import type {
    CertificateListResponse,
    CertificateResponse,
    DownloadLinkResponse,
} from "@/types/certificates";
import type { CreateCertificateValues } from "@/lib/validations/certificate.schema";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://api.certifa.art";

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

// ─── Certificates ─────────────────────────────────────────────────────────────

export const certificatesApi = {
    list: (token: string): Promise<CertificateListResponse> =>
        apiFetch("/api/v1/certificates", token),

    get: (token: string, id: number): Promise<CertificateResponse> =>
        apiFetch(`/api/v1/certificates/${id}`, token),

    create: (token: string, data: CreateCertificateValues): Promise<CertificateResponse> =>
        apiFetch("/api/v1/certificates", token, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }),

    revoke: (token: string, id: number, reason: string): Promise<void> =>
        apiFetch(`/api/v1/certificates/${id}/revoke`, token, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reason }),
        }),

    getDownloadLink: (token: string, id: number): Promise<DownloadLinkResponse> =>
        apiFetch(`/api/v1/certificates/${id}/download-link`, token),
};