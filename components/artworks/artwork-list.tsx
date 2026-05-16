"use client";

import { useArtworks } from "@/lib/query/artworks.queries";
import { ArtworkCard } from "./artwork-card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, ImageOff } from "lucide-react";
import Link from "next/link";
import CustomButton from "../custom-ui/custom-button";
import { CustomSpinner } from "../custom-ui/custom-spinner";

function ArtworkSkeleton() {
    return (
        <div className="rounded-none overflow-hidden border">
            <Skeleton className="h-48 w-full rounded-none" />
            <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-full mt-3" />
            </div>
        </div>
    );
}

export function ArtworkList() {
    const { data: artworks, isLoading, isError, refetch } = useArtworks();

    if (isLoading) {
        return (
            // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            //     {Array.from({ length: 6 }).map((_, i) => <ArtworkSkeleton key={i} />)}
            // </div>

            <CustomSpinner />

        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <p className="text-sm">
                    Impossible de charger vos œuvres.
                </p>
                <CustomButton
                    text="Réessayer"
                    onClick={() => refetch()}
                    className="bg-cert-terra text-white hover:bg-cert-terra/90"
                />
            </div>
        );
    }

    if (!artworks?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-cert-terra">
                    <ImageOff className="h-8 w-8 text-white" />
                </div>
                <div className="text-center">
                    <h3 className="font-semibold mb-1">
                        Aucune œuvre pour l'instant
                    </h3>
                    <p className="text-sm">
                        Commencez par ajouter votre première œuvre.
                    </p>
                </div>
                <Link href="/dashboard/my-works/new">
                    <CustomButton
                        text="Ajouter une œuvre"
                        icon={<PlusCircle className="h-4 w-4 mr-2" />}
                        className="text-cert-terra"
                    />
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
        </div>
    );
}