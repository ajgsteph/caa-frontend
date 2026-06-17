// Globaux exposés par le script CDN KKiaPay (https://cdn.kkiapay.me/k.js).

export interface KkiapayWidgetOptions {
    amount: number;
    api_key: string;
    sandbox?: boolean;
    /** Métadonnée renvoyée telle quelle dans le webhook (stateData) — on y met le payment_id. */
    data?: string;
    email?: string;
    phone?: string;
    fullname?: string;
    name?: string;
    theme?: string;
    position?: "left" | "right" | "center";
}

export interface KkiapaySuccessResponse {
    transactionId: string;
    [key: string]: unknown;
}

declare global {
    interface Window {
        openKkiapayWidget?: (options: KkiapayWidgetOptions) => void;
        addSuccessListener?: (cb: (response: KkiapaySuccessResponse) => void) => void;
        addFailedListener?: (cb: (error: unknown) => void) => void;
    }
}

export {};
