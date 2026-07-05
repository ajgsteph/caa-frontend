"use client";
import { Hero } from "@/components/landing/hero";
import { Steps } from "@/components/landing/steps";
import { Pricing } from "@/components/landing/pricing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Benefits } from "@/components/landing/benefits";
import CustomButton from "@/components/custom-ui/custom-button";
import { useSession } from "next-auth/react";

export default function Home() {
     const { status } = useSession();
      const isLoading = status === "loading";
      const isConnected = status === "authenticated";
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
            <div className="text-xs tracking-widest uppercase text-cert-terra font-semibold mb-6">
              Rejoignez le mouvement
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-wide mb-6">
              Votre art mérite d'être <em className="text-cert-terra">protégé</em>.
            </h2>
            <p className="text-lg text-cert-muted mb-10 max-w-xl mx-auto">
              Rejoignez les artistes qui scellent déjà leur héritage avec Certifa.
            </p>
            {
              isConnected ? (
                <CustomButton
                  href="/dashboard"
                  text="Accéder au tableau de bord"
                  className="text-cert-terra"
                />
              ) : (
                <CustomButton
                  href="/auth/register"
                  text="Créer mon compte artiste"
                  className="text-cert-terra"
                />
              )
            }
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
