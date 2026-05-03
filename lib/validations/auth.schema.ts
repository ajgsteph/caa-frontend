import { z } from "zod";

// ─── Login ────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Adresse email invalide")
    .max(191),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Register ─────────────────────────────────────────────────────────────────

export const registerSchema = z
  .object({
    last_name: z
      .string()
      .min(1, "Le nom est requis")
      .max(120, "Maximum 120 caractères"),
    first_name: z
      .string()
      .min(1, "Le prénom est requis")
      .max(120, "Maximum 120 caractères"),
    artist_name: z
      .string()
      .min(1, "Le nom d'artiste est requis")
      .max(120, "Maximum 120 caractères"),
    email: z
      .string()
      .min(1, "L'email est requis")
      .email("Adresse email invalide")
      .max(191),
    password: z
      .string(),
    //   .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    // password_confirmation: z.string().min(1, "La confirmation est requise"),
    phone: z
      .string()
      .regex(
        /^\+?[0-9\s\-]{6,30}$/,
        "Format de téléphone invalide (ex: +221770000000)"
      )
      .max(30)
      .optional()
      .or(z.literal("")),
  })
  // .refine((data) => data.password === data.password_confirmation, {
  //   message: "Les mots de passe ne correspondent pas",
  //   path: ["password_confirmation"],
  // });

export type RegisterFormValues = z.infer<typeof registerSchema>;