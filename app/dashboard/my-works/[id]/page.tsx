"use client";

import { useArtwork } from "@/lib/query/artworks.queries";
import { ArtworkForm } from "@/components/artworks/artwork-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import DecorativeCorners from "@/components/custom-ui/decorative-corners";
import { CustomSpinner } from "@/components/custom-ui/custom-spinner";
import PageTitle from "@/components/shared/page-title";

interface EditArtworkPageProps {
    params: Promise<{ id: string }>;
}

export default function EditArtworkPage({ params }: EditArtworkPageProps) {
    const { id } = use(params);
    const { data: artwork, isLoading, isError } = useArtwork(Number(id));

    if (isLoading) {
        return (
            <CustomSpinner />
        );
    }

    if (isError || !artwork) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <p>Œuvre introuvable.</p>
                <Link href="/dashboard/my-works" className="text-sm underline">
                    Retour à mes œuvres
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl space-y-6">
            <Link
                href="/dashboard/my-works"
                className="inline-flex items-center gap-1.5 text-sm transition-colors hover:opacity-70"
            >
                <ArrowLeft className="h-4 w-4" />
                Mes œuvres
            </Link>

            <PageTitle title={`Modifier «${artwork.title}»`} description="Les modifications seront appliquées immédiatement." />

            <div className="relative rounded-none border bg-white p-6 md:p-8">
                <DecorativeCorners />
                <ArtworkForm artwork={artwork} />
            </div>
        </div>
    );
}