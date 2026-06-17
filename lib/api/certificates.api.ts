import { backendFetch } from "@/lib/api/client";
import type {
    CertificateListResponse,
    CertificateResponse,
    DownloadLinkResponse,
    PaymentResponse,
} from "@/types/certificates";
import type { CreateCertificateValues } from "@/lib/validations/certificate.schema";

// ─── Certificates ─────────────────────────────────────────────────────────────

export const certificatesApi = {
    list: (token: string): Promise<CertificateListResponse> =>
        backendFetch("/api/v1/certificates", { token }),

    get: (token: string, id: number): Promise<CertificateResponse> =>
        backendFetch(`/api/v1/certificates/${id}`, { token }),

    create: (token: string, data: CreateCertificateValues): Promise<CertificateResponse> =>
        backendFetch("/api/v1/certificates", {
            token,
            method: "POST",
            body: JSON.stringify(data),
        }),

    revoke: (token: string, id: number, reason: string): Promise<void> =>
        backendFetch(`/api/v1/certificates/${id}/revoke`, {
            token,
            method: "POST",
            body: JSON.stringify({ reason }),
        }),

    getDownloadLink: (token: string, id: number): Promise<DownloadLinkResponse> =>
        backendFetch(`/api/v1/certificates/${id}/download-link`, { token }),

    // Crée une nouvelle tentative de paiement pour un certificat encore PENDING.
    retryPayment: (token: string, id: number): Promise<PaymentResponse> =>
        backendFetch(`/api/v1/certificates/${id}/payments`, { token, method: "POST" }),
};