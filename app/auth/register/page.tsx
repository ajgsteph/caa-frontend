import { RegisterForm } from "@/components/auth/register-form";
import type { Metadata } from "next";
import DecorativeCorners from "@/components/custom-ui/decorative-corners";

export const metadata: Metadata = {
  title: "Créer un compte — CAA",
  description: "Inscrivez-vous en tant qu'artiste sur la plateforme CAA",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* En-tête */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Rejoindre CAA
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Créez votre compte artiste et commencez à certifier vos œuvres
          </p>
        </div>

        {/* Carte formulaire */}
        <div className="relative rounded-none border border-gray-200 bg-white p-8 shadow-sm">
          <DecorativeCorners />
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}