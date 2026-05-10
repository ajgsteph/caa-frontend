export function Steps() {
    const steps = [
        { num: "01", title: "Créez votre compte", desc: "Inscription rapide. Votre identité d'artiste est vérifiée pour garantir la légitimité de chaque certificat émis." },
        { num: "02", title: "Certifiez chaque œuvre", desc: "Remplissez le formulaire — titre, technique, dimensions, photo. Un certificat unique est généré avec QR code." },
        { num: "03", title: "Base de données à vie", desc: "Vos œuvres certifiées sont stockées dans une base consultable. L'acheteur scanne le QR pour vérifier l'authenticité." },
    ];

    return (
        <section id="how" className="py-20 bg-secondary/90">
            <div className="container">
                <div className="text-xs tracking-widest uppercase text-cert-terra font-semibold mb-4">Trois étapes</div>
                <h2 className="text-4xl md:text-5xl font-semibold tracking-wide max-w-2xl mb-16">
                    Du pinceau au certificat, en <em className="text-cert-terra">quelques minutes</em>.
                </h2>

                <div className="grid md:grid-cols-3 gap-10">
                    {steps.map((step) => (
                        <div key={step.num} className="pt-8 border-t border-border/50">
                            <div className="italic text-5xl text-cert-terra mb-6 leading-none">{step.num}</div>
                            <h3 className="font-medium text-xl mb-3">{step.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}