import { Artwork } from "./artworks";

export type PaymentMethod =
    | "ORANGE_MONEY"
    | "MTN_MOMO"
    | "WAVE"
    | "CARD";

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
    ORANGE_MONEY: "Orange Money",
    MTN_MOMO: "MTN MoMo",
    WAVE: "Wave",
    CARD: "Carte bancaire",
};

export type CertificateStatus = "PENDING" | "ACTIVE" | "REVOKED";

export const CERTIFICATE_STATUS_LABELS: Record<CertificateStatus, string> = {
    PENDING: "En attente",
    ACTIVE: "Actif",
    REVOKED: "Révoqué",
};

export interface CertificateClient {
    last_name: string;
    first_name: string;
    email: string;
    phone?: string | null;
}

export interface Certificate {
    id: number;
    number: string;
    status: CertificateStatus;
    artwork: Pick<Artwork, "id" | "title" | "type" | "image_url">;
    client: CertificateClient;
    payment_method: PaymentMethod;
    created_at: string;
    revoked_at: string | null;
    revocation_reason: string | null;
}

export interface CertificateListResponse {
    data: Certificate[];
}

export interface CertificateResponse {
    data: Certificate;
}

export interface DownloadLinkResponse {
    url: string;
    expires_in_seconds: number;
}