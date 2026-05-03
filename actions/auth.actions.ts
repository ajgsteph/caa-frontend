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
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      error: "Données invalides.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  let authError: string | null = null;

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (error: unknown) {
    if (isRedirectError(error)) throw error;

    const cause = (error as { cause?: { err?: { message?: string } } })?.cause;
    authError =
      cause?.err?.message ??
      (error instanceof Error ? error.message : "Identifiants invalides.");
  }

  if (authError) {
    return { success: false, error: authError };
  }

  redirect("/dashboard");
}

// ─── Register ─────────────────────────────────────────────────────────────────

export async function registerAction(
  values: RegisterFormValues
): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      error: "Données invalides.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

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

  if (session) {
    const rawToken = (session as unknown as { sanctumToken?: string }).sanctumToken;
    if (rawToken) {
      await authApi.logout(rawToken).catch(() => { });
    }
  }

  await signOut({ redirectTo: "/auth/login" });
}