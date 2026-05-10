"use server";

import { auth } from "@/auth";
import { profileApi } from "@/lib/api/profile.api";
import {
    updateEmailSchema,
    updatePasswordSchema,
    updatePhoneSchema,
    type UpdateEmailValues,
    type UpdatePasswordValues,
    type UpdatePhoneValues,
} from "@/lib/validations/profile.schema";
import type { ApiUser } from "@/types/auth";

export type ProfileActionResult =
    | { success: true; message?: string }
    | { success: false; error: string; fieldErrors?: Record<string, string[]> };

// ─── Helper : sanctumToken depuis le JWT via auth() ──────────────────────────
// auth() côté serveur retourne le token JWT complet, pas juste session.user.
// On caste en unknown pour accéder aux champs custom du callback jwt().

async function getSanctumToken(): Promise<string> {
    const session = await auth();
    if (!session) throw new Error("Non authentifié.");
    if (!session.sanctumToken) throw new Error("Session invalide. Veuillez vous reconnecter.");
    return session.sanctumToken;
}

// ─── Récupère le profil complet — appelable depuis un Server Component ───────

export async function getServerProfile(): Promise<ApiUser | null> {
    try {
        const token = await getSanctumToken();
        const res = await profileApi.get(token);
        return res.data;
    } catch {
        return null;
    }
}

function handleError(err: unknown): ProfileActionResult {
    const e = err as { message?: string; errors?: Record<string, string[]> };
    return {
        success: false,
        error: e.message ?? "Une erreur est survenue.",
        fieldErrors: e.errors,
    };
}

// ─── Actions de modification ──────────────────────────────────────────────────

export async function updateEmailAction(
    values: UpdateEmailValues
): Promise<ProfileActionResult> {
    const parsed = updateEmailSchema.safeParse(values);
    if (!parsed.success)
        return {
            success: false,
            error: "Données invalides.",
            fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        };

    try {
        const token = await getSanctumToken();
        await profileApi.updateEmail(token, parsed.data);
        return { success: true, message: "Email mis à jour avec succès." };
    } catch (err) {
        return handleError(err);
    }
}

export async function updatePasswordAction(
    values: UpdatePasswordValues
): Promise<ProfileActionResult> {
    const parsed = updatePasswordSchema.safeParse(values);
    if (!parsed.success)
        return {
            success: false,
            error: "Données invalides.",
            fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        };

    try {
        const token = await getSanctumToken();
        await profileApi.updatePassword(token, {
            current_password: parsed.data.current_password,
            password: parsed.data.password,
        });
        return { success: true, message: "Mot de passe mis à jour avec succès." };
    } catch (err) {
        return handleError(err);
    }
}

export async function updatePhoneAction(
    values: UpdatePhoneValues
): Promise<ProfileActionResult> {
    const parsed = updatePhoneSchema.safeParse(values);
    if (!parsed.success)
        return {
            success: false,
            error: "Données invalides.",
            fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        };

    try {
        const token = await getSanctumToken();
        await profileApi.updatePhone(token, parsed.data);
        return { success: true, message: "Téléphone mis à jour avec succès." };
    } catch (err) {
        return handleError(err);
    }
}