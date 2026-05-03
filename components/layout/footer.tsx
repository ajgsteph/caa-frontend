import { Logo } from "@/components/shared/logo";

export function Footer() {
    return (
        <footer className="border-t border-border/40 py-10 bg-background">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-3">
                    <Logo className="w-7 h-7" />
                    <span className="text-sm font-medium">Caa — Certificat d'Authenticité Artiste</span>
                </div>
                <div className="text-sm">
                    © {new Date().getFullYear()} Caa. Fait avec soin pour les artistes d'Afrique.
                </div>
            </div>
        </footer>
    );
}