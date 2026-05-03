import { Card, CardContent } from "@/components/ui/card";

export function Benefits() {
    const artistBenefits = [
        "Protection contre la contrefaçon et les copies non autorisées.",
        "Valorisation de votre cote : chaque œuvre tracée, horodatée, signée.",
        "Portfolio numérique consultable par galeristes et collectionneurs.",
        "Historique de vente conservé — preuve de provenance pour les reventes.",
        "Image professionnelle renforcée auprès du marché international."
    ];

    const buyerBenefits = [
        "Vérification instantanée via QR code — plus de doute sur l'authenticité.",
        "Provenance et identité de l'artiste confirmées par une base indépendante.",
        "Valeur de revente sécurisée grâce au certificat attaché à l'œuvre.",
        "Traçabilité complète : date de création, dimensions, technique, numéro unique.",
        "Achat serein, localement ou à distance, sans risque de fraude."
    ];

    return (
        <section id="benefits" className="py-24 bg-caa-ink text-background">
            <div className="container mx-auto px-6">
                <div className="text-xs tracking-widest uppercase text-caa-gold font-semibold mb-4">
                    Une garantie des deux côtés
                </div>
                <h2 className="text-4xl md:text-5xl font-semibold tracking-wide max-w-2xl mb-16">
                    Un pont de confiance entre <em className="text-caa-terra">l'artiste</em> et <em className="text-caa-terra">l'acheteur</em>.
                </h2>

                <div className="grid md:grid-cols-2 gap-10">
                    {/* Carte Artiste */}
                    <Card className="bg-background/5 border-border/10 rounded-none shadow-none text-background">
                        <CardContent className="p-8 md:p-10">
                            <div className="inline-block italic text-xl text-muted mb-6 pb-3 border-b border-muted/30 w-full">
                                Pour l'artiste
                            </div>
                            <ul className="space-y-4">
                                {artistBenefits.map((benefit, i) => (
                                    <li key={i} className="flex gap-4 text-sm leading-relaxed text-background/80">
                                        <span className="flex-shrink-0 w-4 h-4 mt-1 bg-caa-terra" style={{ clipPath: 'polygon(0 50%, 40% 100%, 100% 0, 40% 75%)' }} />
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Carte Acheteur */}
                    <Card className="bg-background/5 border-border/10 rounded-none shadow-none text-background">
                        <CardContent className="p-8 md:p-10">
                            <div className="inline-block italic text-xl text-muted mb-6 pb-3 border-b border-muted/30 w-full">
                                Pour l'acheteur
                            </div>
                            <ul className="space-y-4">
                                {buyerBenefits.map((benefit, i) => (
                                    <li key={i} className="flex gap-4 text-sm leading-relaxed text-background/80">
                                        <span className="flex-shrink-0 w-4 h-4 mt-1 bg-caa-terra" style={{ clipPath: 'polygon(0 50%, 40% 100%, 100% 0, 40% 75%)' }} />
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}