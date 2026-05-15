// import { useSession } from "next-auth/react";

// export function useToken(): string | null {
//     const { data: session } = useSession();
//     return (session as unknown as { sanctumToken?: string })?.sanctumToken ?? null;
// }

"use client";

import React, { createContext, useContext } from "react";

const TokenContext = createContext<string | null>(null);

export function TokenProvider({ 
    children, 
    token 
}: { 
    children: React.ReactNode; 
    token: string | null;
}) {
    return (
        <TokenContext.Provider value={token}>
            {children}
        </TokenContext.Provider>
    );
}

export function useToken(): string | null {
    const context = useContext(TokenContext);
    
    if (context === undefined) {
        console.warn("useToken doit être utilisé à l'intérieur d'un TokenProvider");
    }
    
    return context ?? null;
}