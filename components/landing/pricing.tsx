import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CustomButton from "../custom-ui/custom-button";

export function Pricing() {
    return (
        <section className="py-24">
            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <div className="text-xs tracking-widest uppercase text-certifia-terra font-semibold mb-4">Un tarif simple</div>
                    <h2 className="text-4xl md:text-5xl font-semibold tracking-wide mb-6">
                        Un seul prix. Aucune surprise, <em className="text-certifia-terra">aucun abonnement</em>.
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-md">
                        Vous payez uniquement quand vous certifiez. Pas de frais cachés, pas d'engagement mensuel. Pensé pour les réalités des artistes en Afrique.
                    </p>
                </div>

                <Card className="relative overflow-hidden bg-secondary border-none rounded-none p-2">
                    {/* Coins décoratifs */}
                    <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-certifia-terra" />
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-certifia-terra" />

                    <CardContent className="p-8 md:p-10">
                        <div className="text-sm font-medium text-certifia-terra mb-4">Par certificat</div>
                        <div className="text-6xl font-light tracking-tight mb-2">
                            10 000<sub className="text-lg text-muted-foreground ml-2">FCFA</sub>
                        </div>
                        <div className="text-sm text-muted-foreground mb-8">≈ 15 € — Paiement unique</div>

                        <ul className="space-y-4 text-sm mb-10">
                            {['Certificat PDF haute qualité', 'QR code de vérification permanent', 'Œuvre ajoutée à la base de données', 'Page publique pour l\'acheteur'].map((feat, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="text-foreground font-bold">✓</span>
                                    <span className="text-muted-foreground">{feat}</span>
                                </li>
                            ))}
                        </ul>

                        <CustomButton
                            href="/#cta"
                            text="Certifier une œuvre"
                            className="w-full mb-8 text-certifia-terra" />

                        <div className="pt-6 border-t border-dashed border-border/50 flex flex-wrap gap-2 justify-center">
                            {['Orange Money', 'MTN MoMo', 'Carte bancaire'].map((method) => (
                                <span key={method} className="text-xs px-3 py-2 bg-gray-900 border border-border/50 text-white rounded-none">
                                    {method}
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}