"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Menu, X } from "lucide-react";
import CustomButton from "@/components/custom-ui/custom-button";

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    const navLinks = [
        { name: "Comment ça marche", href: "#how" },
        { name: "Garanties", href: "#benefits" },
        { name: "Tarif", href: "#pricing" },
    ];

    return (
        <>
            <header className="border-b border-caa-terra/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container h-20 flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 relative z-50">
                        <Logo className="w-10 h-10 text-foreground" />
                        <span className="font-serif font-semibold text-xl tracking-tight">Caa</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-8 text-md font-medium text-caa-muted">
                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href} className="hover:text-foreground transition-colors">
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden lg:flex items-center gap-4">
                        <CustomButton 
                        text="Se connecter" 
                        href="/auth/login"
                        className="border-none"
                        />
                        <CustomButton text="Créer mon compte" href="/auth/register" />
                    </div>

                    {/* Mobile Toggle Button */}
                    <button
                        className="lg:hidden relative z-50 p-2 -mr-2 text-foreground"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>


            {/* L'Overlay Mobile */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-background flex flex-col lg:hidden animate-in slide-in-from-top-2 fade-in duration-200">

                    <div className="container mx-auto px-6 h-20 flex items-center justify-between border-b border-border/10">
                        <Link href="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                            <Logo className="w-10 h-10 text-foreground" />
                            <span className="font-semibold text-xl tracking-tight">Caa</span>
                        </Link>
                        <button
                            className="p-2 -mr-2 text-foreground"
                            onClick={() => setIsMobileMenuOpen(false)}
                            aria-label="Fermer le menu"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Contenu du menu */}
                    <div className="flex-1 flex flex-col items-center justify-center gap-10 pb-20">
                        <nav className="flex flex-col items-center gap-8 text-2xl font-medium">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                        <div className="flex flex-col gap-4 justify-center items-center">
                            <CustomButton text="Se connecter" href="/auth/login" className="border-none" onClick={() => setIsMobileMenuOpen(false)} />
                            <CustomButton text="Créer mon compte" href="/auth/register" onClick={() => setIsMobileMenuOpen(false)} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}