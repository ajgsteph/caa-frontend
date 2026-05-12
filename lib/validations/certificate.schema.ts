import { z } from "zod";
import type { PaymentMethod } from "@/types/certificates";

const PAYMENT_METHODS: [PaymentMethod, ...PaymentMethod[]] = [
    "ORANGE_MONEY", "MTN_MOMO", "WAVE", "CARD",
];

export const createCertificateSchema = z.object({
    artwork_id: z.number({ error: "Œuvre requise" }).int().positive(),
    client: z.object({
        last_name: z.string().min(1, "Nom requis").max(120),
        first_name: z.string().min(1, "Prénom requis").max(120),
        email: z.string().email("Email invalide").max(191),
        phone: z.string().max(30).optional().or(z.literal("")),
    }),
    payment: z.object({
        method: z.enum(PAYMENT_METHODS, { error: "Méthode de paiement requise" }),
    }),
});

export const revokeCertificateSchema = z.object({
    reason: z.string().min(10, "Le motif doit faire au moins 10 caractères").max(1000),
});

export type CreateCertificateValues = z.infer<typeof createCertificateSchema>;
export type RevokeCertificateValues = z.infer<typeof revokeCertificateSchema>;