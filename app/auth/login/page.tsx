import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion — CAA",
  description: "Connectez-vous à votre espace artiste CAA",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* En-tête */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Bienvenue sur CAA
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Certificat d&apos;Authenticité Artiste — connectez-vous à votre espace
          </p>
        </div>

        {/* Carte formulaire */}
        <div className="relative rounded-none border border-gray-200 bg-white p-8 shadow-sm">
          {/* Coins décoratifs */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-caa-terra" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-caa-terra" />
          <LoginForm />
        </div>
      </div>
    </main>
  );
}