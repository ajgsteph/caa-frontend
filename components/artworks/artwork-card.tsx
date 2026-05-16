"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Award, ImageOff } from "lucide-react";
import { useDeleteArtwork } from "@/lib/query/artworks.mutations";
import { Artwork, ARTWORK_TYPE_LABELS } from "@/types/artworks";
import CustomButton from "../custom-ui/custom-button";

interface ArtworkCardProps {
    artwork: Artwork;
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
    const deleteMut = useDeleteArtwork();
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleDelete = () => {
        setDeleteError(null);
        deleteMut.mutate(artwork.id, {
            onError: (err: unknown) => {
                const e = err as { status?: number; message?: string };
                if (e.status === 422) {
                    setDeleteError("Cette œuvre possède un certificat actif et ne peut pas être supprimée.");
                } else {
                    setDeleteError(e.message ?? "Erreur lors de la suppression.");
                }
            },
        });
    };

    return (
        <Card className="overflow-hidden border shadow-none transition-all duration-200 hover:-translate-y-1 group rounded-none">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                {artwork.image_url ? (
                    <img
                        src={artwork.image_url}
                        alt={artwork.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <ImageOff className="h-10 w-10 opacity-30" />
                    </div>
                )}

                {/* Badge type */}
                <div className="absolute top-3 left-3">
                    <Badge className="text-xs font-medium border-0 rounded-none">
                        {ARTWORK_TYPE_LABELS[artwork.type]}
                    </Badge>
                </div>

                {/* Badge certificats */}
                {(artwork.certificates_count ?? 0) > 0 && (
                    <div className="absolute top-3 right-3">
                        <Badge className="text-xs font-medium gap-1 border-0">
                            <Award className="h-3 w-3" />
                            {artwork.certificates_count} cert.
                        </Badge>
                    </div>
                )}
            </div>

            <CardContent className="p-4 space-y-3">
                {/* Titre + année */}
                <div className="space-y-2">
                    <h3 className="font-semibold text-base leading-tight truncate">
                        {artwork.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm">
                        {artwork.year && <span>{artwork.year}</span>}
                        {artwork.year && artwork.technique && <span>·</span>}
                        {artwork.technique && <span className="truncate">{artwork.technique}</span>}
                    </div>
                </div>

                {/* Dimensions */}
                {artwork.dimensions && (
                    <p className="text-sm">{artwork.dimensions}</p>
                )}

                {/* Erreur suppression */}
                {deleteError && (
                    <p className="text-xs text-red-600 bg-red-50 rounded px-2 py-1.5">{deleteError}</p>
                )}

                {/* Actions */}
                <div className="flex w-full gap-2 pt-1">
                    <CustomButton
                        text="Modifier"
                        href={`/dashboard/my-works/${artwork.id}`}
                        className="flex-1 bg-cert-terra text-white min-w-0 px-2"
                        icon={<Pencil className="h-3.5 w-3.5 shrink-0" />}
                    />

                    <AlertDialog>
                        <AlertDialogTrigger className="flex-1 flex items-center justify-center gap-1.5 h-10 px-2 border border-red-600 text-cert-terra hover:bg-cert-terra hover:text-white transition-colors min-w-0 outline-none">
                            <Trash2 className="h-4 w-4 shrink-0" />
                            <span className="truncate font-bold text-sm">Supprimer</span>
                        </AlertDialogTrigger>

                        <AlertDialogContent className="rounded-none">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer cette œuvre ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    <strong>« {artwork.title} »</strong> sera définitivement supprimée.
                                    Cette action est irréversible. Les œuvres avec un certificat actif ne peuvent pas être supprimées.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-none">Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-cert-terra hover:bg-cert-terra/80 text-white rounded-none"
                                >
                                    Supprimer définitivement
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    );
}