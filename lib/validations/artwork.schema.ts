import { z } from "zod";
import type { ArtworkType } from "@/types/artworks";

const ARTWORK_TYPES: [ArtworkType, ...ArtworkType[]] = [
    "PAINTING", "SCULPTURE", "PHOTOGRAPHY", "DRAWING",
    "ENGRAVING", "DIGITAL_ART", "TEXTILE", "INSTALLATION", "OTHER",
];

export const artworkSchema = z.object({
    title: z.string().min(1, "Le titre est requis").max(255),
    type: z.enum(ARTWORK_TYPES, { error: "Type invalide" }),
    technique: z.string().max(255).optional().or(z.literal("")),
    dimensions: z.string().max(255).optional().or(z.literal("")),
    year: z
        .number({ error: "Année invalide" })
        .int()
        .min(1000)
        .max(new Date().getFullYear())
        .optional(),
    description: z.string().max(5000).optional().or(z.literal("")),
    signature: z.string().max(255).optional().or(z.literal("")),
});

export type ArtworkFormValues = z.infer<typeof artworkSchema>;