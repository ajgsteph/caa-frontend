import { z } from "zod";

export const updateEmailSchema = z.object({
    email: z.string().email("Adresse email invalide").max(191),
    current_password: z.string().min(1, "Mot de passe requis"),
});

export const updatePasswordSchema = z
    .object({
        current_password: z.string().min(1, "Mot de passe actuel requis"),
        password: z.string().min(8, "Au moins 8 caractères"),
        password_confirmation: z.string().min(1, "Confirmation requise"),
    })
    .refine((d) => d.password === d.password_confirmation, {
        message: "Les mots de passe ne correspondent pas",
        path: ["password_confirmation"],
    });

export const updatePhoneSchema = z.object({
    phone: z
        .string()
        .regex(/^\+?[0-9\s\-]{6,30}$/, "Format invalide (ex: +221770000000)")
        .max(30),
});

export type UpdateEmailValues = z.infer<typeof updateEmailSchema>;
export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;
export type UpdatePhoneValues = z.infer<typeof updatePhoneSchema>;