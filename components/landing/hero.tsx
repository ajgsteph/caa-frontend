import { Badge } from "@/components/ui/badge";
import { CertificateVisual } from "@/components/shared/certificate-visual";
import CustomButton from "../custom-ui/custom-button";

export function Hero() {
  return (
    <section className="py-20">
      <div className="container grid md:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Badge variant="secondary" className="mb-8 px-1 sm:px-4 py-3 text-[9px] sm:text-xs tracking-wider uppercase rounded-none bg-cert-secondary border border-cert-terra">
            <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-foreground mr-1 md:mr-2" />
            Certification professionnelle pour artistes
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Chaque œuvre mérite son <em className="text-cert-terra">sceau d'authenticité</em>.
          </h1>

          <p className="text-lg text-cert-muted max-w-lg mb-10 font-medium">
            Certifa permet aux artistes africains de générer des certificats d'authenticité professionnels, vérifiables par QR code. Protégez votre signature, rassurez vos acheteurs.
          </p>

          <div className="flex flex-wrap gap-4 items-center mb-5">
            <CustomButton
              href="/auth/register"
              text="Commencer maintenant"
              className="bg-gray-900 text-white border-0"
            />
            <CustomButton
              href="#how"
              text="Voir comment ça marche"
            />
          </div>

          <p className="text-sm text-muted-foreground">
            10 000 FCFA / certificat · Paiement Mobile Money ou CB
          </p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
          <CertificateVisual />
        </div>
      </div>
    </section>
  );
}