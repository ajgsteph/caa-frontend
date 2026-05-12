import { useSession } from "next-auth/react";

export function useToken(): string | null {
    const { data: session } = useSession();
    return (session as unknown as { sanctumToken?: string })?.sanctumToken ?? null;
}

