"use client";

import { useCallback, useEffect, useRef } from "react";
import type {
    KkiapaySuccessResponse,
    KkiapayWidgetOptions,
} from "@/types/kkiapay";

type Handlers = {
    onSuccess?: (response: KkiapaySuccessResponse) => void;
    onFailed?: (error: unknown) => void;
};

// Les listeners globaux de k.js sont additifs et difficilement supprimables :
// on n'enregistre qu'une seule fois un dispatcher qui relaie vers les handlers
// courants (via refs), pour éviter les déclenchements multiples.
let listenersRegistered = false;

/**
 * Pilote le widget KKiaPay chargé via le script CDN (voir app/dashboard/layout.tsx).
 * Lit la clé publique / le mode sandbox depuis les variables NEXT_PUBLIC_* (côté client).
 */
export function useKkiapay({ onSuccess, onFailed }: Handlers) {
    const successRef = useRef(onSuccess);
    const failedRef = useRef(onFailed);

    // Garde les handlers courants à jour sans muter les refs pendant le rendu.
    useEffect(() => {
        successRef.current = onSuccess;
        failedRef.current = onFailed;
    });

    useEffect(() => {
        if (typeof window === "undefined") return;

        // k.js est chargé en `afterInteractive` : ses globaux peuvent ne pas être
        // prêts au montage du formulaire. On réessaie jusqu'à leur disponibilité.
        const register = () => {
            if (listenersRegistered) return true;
            if (!window.addSuccessListener || !window.addFailedListener) return false;
            window.addSuccessListener((response) => successRef.current?.(response));
            window.addFailedListener((error) => failedRef.current?.(error));
            listenersRegistered = true;
            return true;
        };

        if (register()) return;
        const id = setInterval(() => {
            if (register()) clearInterval(id);
        }, 300);
        return () => clearInterval(id);
    }, []);

    const openWidget = useCallback(
        (opts: Omit<KkiapayWidgetOptions, "api_key" | "sandbox">) => {
            const apiKey = process.env.NEXT_PUBLIC_KKIAPAY_KEY;
            if (!window.openKkiapayWidget || !apiKey) {
                console.error("[KKiaPay] widget indisponible ou clé publique manquante.");
                return;
            }
            window.openKkiapayWidget({
                ...opts,
                api_key: apiKey,
                sandbox: process.env.NEXT_PUBLIC_KKIAPAY_SANDBOX !== "false",
            });
        },
        []
    );

    return { openWidget };
}
