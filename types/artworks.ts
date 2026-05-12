export type ArtworkType =
    | "PAINTING"
    | "SCULPTURE"
    | "PHOTOGRAPHY"
    | "DRAWING"
    | "ENGRAVING"
    | "DIGITAL_ART"
    | "TEXTILE"
    | "INSTALLATION"
    | "OTHER";

export const ARTWORK_TYPE_LABELS: Record<ArtworkType, string> = {
    PAINTING: "Peinture",
    SCULPTURE: "Sculpture",
    PHOTOGRAPHY: "Photographie",
    DRAWING: "Dessin",
    ENGRAVING: "Gravure",
    DIGITAL_ART: "Art numérique",
    TEXTILE: "Textile",
    INSTALLATION: "Installation",
    OTHER: "Autre",
};

export interface Artwork {
    id: number;
    title: string;
    type: ArtworkType;
    technique: string | null;
    dimensions: string | null;
    year: number | null;
    description: string | null;
    signature: string | null;
    image_url: string | null;
    created_at: string;
    updated_at: string;
    certificates_count?: number;
}

export interface ArtworkListResponse {
    data: Artwork[];
}

export interface ArtworkResponse {
    data: Artwork;
}
