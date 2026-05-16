import { ArtworkForm } from "@/components/artworks/artwork-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import DecorativeCorners from "@/components/custom-ui/decorative-corners";


export const metadata: Metadata = { title: "Nouvelle œuvre — CAA" };

export default async function NewArtworkPage() {
    return (
        <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
                <Link
                    href="/dashboard/my-works"
                    className="flex items-center gap-1.5 text-sm transition-colors hover:opacity-70"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Mes œuvres
                </Link>
            </div>

            <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Nouvelle œuvre
                </h1>
                <p className="text-sm mt-1">
                    Renseignez les informations de votre création.
                </p>
            </div>

            <div className="relative rounded-none border p-6 md:p-8 bg-white">
                <DecorativeCorners />
                <ArtworkForm />
            </div>
        </div>
    );
}