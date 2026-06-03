import { z } from "zod";

const envSchema = z.object({

  NEXT_PUBLIC_BACKEND_URL: z
    .string()
    .url("NEXT_PUBLIC_BACKEND_URL doit être une URL valide"),

  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET doit faire au moins 32 caractères"),

  NEXTAUTH_URL: z.string().url().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Variables d'environnement invalides :");
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error("Configuration d'environnement invalide. Arrêt du serveur.");
}

export const env = parsed.data;