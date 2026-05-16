"use client"

import { useEffect, useState } from "react"
import { Fingerprint } from "lucide-react"
import { cn } from "@/lib/utils"

export function CustomSpinner({ className }: { className?: string }) {
    const [hash, setHash] = useState("0xA1B2C3...9F8E")

    useEffect(() => {
        const interval = setInterval(() => {
            const randomHex1 = Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0')
            const randomHex2 = Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0')
            setHash(`0x${randomHex1}...${randomHex2}`)
        }, 120)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className={cn("flex flex-col items-center justify-center gap-2 text-cert-terra py-20", className)}>
            
            {/* ─── ICÔNE ANIMÉE ─── */}
            <div className="relative flex items-center justify-center w-12 h-12">
                <svg 
                    className="absolute inset-0 w-full h-full animate-[spin_3s_linear_infinite] opacity-40" 
                    viewBox="0 0 100 100"
                >
                    <circle 
                        cx="50" 
                        cy="50" 
                        r="46" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeDasharray="15 10 5 10 25 15" 
                    />
                </svg>
                <Fingerprint 
                    className="w-6 h-6 animate-pulse opacity-90" 
                    strokeWidth={1.5} 
                />
            </div>
            
            {/* ─── TEXTE CRYPTOGRAPHIQUE ─── */}
            <div className="flex flex-col items-center gap-1.5 font-mono">
                {/* Titre principal */}
                {/* <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.25em] uppercase opacity-90">
                    CERTIFA
                    <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />
                </div> */}
                
                {/* Hash dynamique en dessous */}
                <div className="text-[10px] text-muted-foreground tracking-widest opacity-60">
                    {hash}
                </div>
            </div>

        </div>
    )
}