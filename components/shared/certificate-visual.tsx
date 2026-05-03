import { Logo } from "./logo";

export function CertificateVisual() {
    return (
        <div className="relative mx-auto max-w-[340px] md:max-w-none lg:max-w-[25vw]">
            <div className="relative aspect-[3/4] bg-card text-card-foreground border border-border p-8 shadow-2xl -rotate-2 hover:rotate-0 transition-transform duration-500 ease-out flex flex-col">
                {/* Cadre intérieur */}
                <div className="absolute inset-2.5 border border-border/50 pointer-events-none" />

                <div className="text-center pb-4 border-b border-border/50 mb-5">
                    <div className="text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Certificat d'Authenticité</div>
                    <div className="font-serif text-xl italic text-foreground">N° CAA-2026-0142</div>
                </div>

                <div className="flex flex-col gap-3 text-xs flex-grow">
                    <div className="flex justify-between pb-2 border-b border-dashed border-border/50">
                        <span className="text-muted-foreground tracking-wide uppercase text-[10px]">Artiste</span>
                        <span className="font-medium">Aïsha Diallo</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-dashed border-border/50">
                        <span className="text-muted-foreground tracking-wide uppercase text-[10px]">Œuvre</span>
                        <span className="font-medium">Les Tisserandes</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-dashed border-border/50">
                        <span className="text-muted-foreground tracking-wide uppercase text-[10px]">Année</span>
                        <span className="font-medium">2026</span>
                    </div>

                    {/* Simulation visuel oeuvre */}
                    <div className="h-24 mt-2 bg-muted relative overflow-hidden flex items-center justify-center">
                        <span className="text-muted-foreground/50 text-[10px]">Visuel</span>
                    </div>
                </div>

                <div className="mt-5 flex justify-between items-end gap-4">
                    <div className="w-16 h-16 bg-foreground rounded-sm" /> {/* QR Placeholder */}
                    <div className="text-right">
                        <div className="font-serif text-[11px] tracking-widest text-muted-foreground">SCELLÉ & VÉRIFIÉ</div>
                        <div className="font-serif italic text-base mt-1">A. Diallo</div>
                    </div>
                </div>
            </div>

            {/* Tampon flottant */}
            <div className="absolute -top-4 -right-4 text-foreground rotate-12 z-10 bg-background rounded-full">
                <Logo className="w-24 h-24" />
            </div>
        </div>
    );
}