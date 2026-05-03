import { z } from "zod";

const envSchema = z.object({

  BACKEND_URL: z
    .string()
    .url("BACKEND_URL doit être une URL valide")
    .default("https://caa-backend-603u.onrender.com"),

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