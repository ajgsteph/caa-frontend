"use server";

import { signIn, signOut, auth } from "@/auth";
import { authApi, ApiError } from "@/lib/api/auth.api";
import { loginSchema, registerSchema } from "@/lib/validations/auth.schema";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import type { LoginFormValues, RegisterFormValues } from "@/lib/validations/auth.schema";

// ─── Types de retour ─────────────────────────────────────────────────────────

export type ActionResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

// ─── Login ────────────────────────────────────────────────────────────────────

export async function loginAction(
  values: LoginFormValues
): Promise<ActionResult> {
  // 1. Validation Zod côté serveur (défense en profondeur)
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      error: "Données invalides.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  // 2. Appel Auth.js signIn — déclenche authorize() dans auth.ts
  let authError: string | null = null;

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (error: unknown) {
    // redirect() de Next.js lance une exception interne — la laisser remonter
    if (isRedirectError(error)) throw error;

    // Auth.js enveloppe l'erreur de authorize() dans une AuthError
    // Le vrai message est dans error.cause?.err?.message
    const cause = (error as { cause?: { err?: { message?: string } } })?.cause;
    authError =
      cause?.err?.message ??
      (error instanceof Error ? error.message : "Identifiants invalides.");
  }

  if (authError) {
    return { success: false, error: authError };
  }

  // 3. Redirection après succès — hors du try/catch
  redirect("/dashboard");
}

// ─── Register ─────────────────────────────────────────────────────────────────

export async function registerAction(
  values: RegisterFormValues
): Promise<ActionResult> {
  // 1. Validation Zod côté serveur
  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      error: "Données invalides.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  // 2. Appel direct au backend pour créer le compte
  try {
    const { last_name, first_name, artist_name, email, password, phone } =
      parsed.data;

    await authApi.register({
      last_name,
      first_name,
      artist_name,
      email,
      password,
      phone: phone || undefined,
    });
  } catch (error: unknown) {
    if (isRedirectError(error)) throw error;
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        fieldErrors: error.errors,
      };
    }
    return { success: false, error: "Erreur lors de la création du compte." };
  }

  // 3. Connexion automatique après inscription réussie
  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (error: unknown) {
    if (isRedirectError(error)) throw error;
    redirect("/auth/login?registered=true");
  }

  redirect("/dashboard");
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logoutAction(): Promise<void> {
  const session = await auth();

  if (session?.sanctumToken) {
    await authApi.logout(session.sanctumToken).catch(() => { });
  }

  await signOut({ redirectTo: "/auth/login" });
}