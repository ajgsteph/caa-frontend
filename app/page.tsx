import { Hero } from "@/components/landing/hero";
import { Steps } from "@/components/landing/steps";
import { Pricing } from "@/components/landing/pricing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Benefits } from "@/components/landing/benefits";
import CustomButton from "@/components/custom-ui/custom-button";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col font-sans">
      <Header />

      <main className="flex-grow">
        <Hero />
        <Steps />
        <Benefits />
        <Pricing />

        {/* CTA SECTION */}
        <section id="pricing" className="py-32 text-center bg-secondary/50">
          <div className="container flex justify-center items-center flex-col">
            <div className="text-xs tracking-widest uppercase text-certifia-terra font-semibold mb-6">
              Rejoignez le mouvement
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-wide mb-6">
              Votre art mérite d'être <em className="text-certifia-terra">protégé</em>.
            </h2>
            <p className="text-lg text-certifia-muted mb-10 max-w-xl mx-auto">
              Rejoignez les artistes africains qui scellent déjà leur héritage avec Certifia.
            </p>
            <CustomButton
              href="/auth/register"
              text="Créer mon compte artiste"
              className="text-certifia-terra"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
