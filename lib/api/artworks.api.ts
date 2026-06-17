import { backendFetch } from "@/lib/api/client";
import type {
    ArtworkListResponse,
    ArtworkResponse,
} from "@/types/artworks";

// ─── Artworks ─────────────────────────────────────────────────────────────────

export const artworksApi = {
    list: (token: string): Promise<ArtworkListResponse> =>
        backendFetch("/api/v1/artworks", { token }),

    get: (token: string, id: number): Promise<ArtworkResponse> =>
        backendFetch(`/api/v1/artworks/${id}`, { token }),

    create: (token: string, formData: FormData): Promise<ArtworkResponse> =>
        backendFetch("/api/v1/artworks", { token, method: "POST", body: formData }),

    update: (token: string, id: number, formData: FormData): Promise<ArtworkResponse> =>
        backendFetch(`/api/v1/artworks/${id}`, { token, method: "POST", body: formData }),

    delete: (token: string, id: number): Promise<void> =>
        backendFetch(`/api/v1/artworks/${id}`, { token, method: "DELETE" }),
};