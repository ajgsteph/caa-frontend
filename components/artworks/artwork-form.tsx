"use client";

import { useForm, type UseFormReturn } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { artworkSchema, type ArtworkFormValues } from "@/lib/validations/artwork.schema";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AlertCircle, ImagePlus, X } from "lucide-react";
import { ARTWORK_TYPE_LABELS, type Artwork } from "@/types/artworks";
import { useCreateArtwork, useUpdateArtwork } from "@/lib/query/artworks.mutations";
import CustomButton from "../custom-ui/custom-button";
import { FieldError } from "../custom-ui/field-error";

interface ArtworkFormProps {
    artwork?: Artwork;
    onSuccess?: () => void;
}

function buildDefaults(artwork?: Artwork): ArtworkFormValues {
    return {
        title: artwork?.title ?? "",
        type: artwork?.type ?? "PAINTING",
        technique: artwork?.technique ?? "",
        dimensions: artwork?.dimensions ?? "",
        year: artwork?.year ?? new Date().getFullYear(),
        description: artwork?.description ?? "",
        signature: artwork?.signature ?? "",
    };
}

function submitLabel(isPending: boolean, isEditing: boolean): string {
    if (isPending) return isEditing ? "Enregistrement…" : "Création…";
    return isEditing ? "Enregistrer les modifications" : "Créer l'œuvre";
}

// Champ "Type" isolé : confine les `form.watch(...)` et la liste d'options.
function ArtworkTypeField({ form }: { form: UseFormReturn<ArtworkFormValues> }) {
    const current = form.watch("type");
    return (
        <div className="space-y-0">
            <Label className="text-sm font-medium">
                Type <span className="text-red-600 text-xl">*</span>
            </Label>
            <Select
                value={current || ""}
                onValueChange={(v) => form.setValue("type", v as ArtworkFormValues["type"])}
            >
                <SelectTrigger className="rounded-none h-12! w-full">
                    <SelectValue placeholder="Choisir un type">
                        {current ? ARTWORK_TYPE_LABELS[current as keyof typeof ARTWORK_TYPE_LABELS] : "Choisir un type"}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-none">
                    {Object.entries(ARTWORK_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem className="rounded-none" key={value} value={value}>
                            {label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <FieldError message={form.formState.errors.type?.message} />
        </div>
    );
}

export function ArtworkForm({ artwork, onSuccess }: ArtworkFormProps) {
    const router = useRouter();
    const isEditing = !!artwork;
    const createMut = useCreateArtwork();
    const updateMut = useUpdateArtwork(artwork?.id ?? 0);
    const mutation = isEditing ? updateMut : createMut;

    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(artwork?.image_url ?? null);
    const [serverError, setServerError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const form = useForm<ArtworkFormValues>({
        resolver: standardSchemaResolver(artworkSchema),
        defaultValues: buildDefaults(artwork),
    });

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const onSubmit = (values: ArtworkFormValues) => {
        setServerError(null);
        mutation.mutate(
            { values, image },
            {
                onSuccess: () => {
                    onSuccess?.();
                    router.push("/dashboard/my-works");
                },
                onError: (err: unknown) => {
                    const e = err as { message?: string };
                    setServerError(e.message ?? "Une erreur est survenue.");
                },
            }
        );
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* Erreur serveur */}
            {serverError && (
                <div className="flex items-start gap-2.5 rounded-lg px-4 py-3 text-sm border bg-red-50 border-red-200 text-red-700">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    {serverError}
                </div>
            )}

            {/* Image upload */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">
                    Image de l'œuvre
                    <span className="ml-1 text-xs font-normal">
                        (jpg/png/webp, max 5 Mo)
                    </span>
                </Label>

                <div
                    className="relative rounded-none border-2 border-dashed overflow-hidden cursor-pointer transition-colors hover:border-[var(--terra)]"
                    style={{ borderColor: "rgba(28,20,16,0.2)", minHeight: "180px" }}
                    onClick={() => fileRef.current?.click()}
                >
                    {preview ? (
                        <>
                            <img src={preview} alt="Aperçu" className="w-full h-48 object-cover" />
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setImage(null); setPreview(null); }}
                                className="absolute top-2 right-2 rounded-full p-1 bg-black/60 text-white hover:bg-black/80"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 gap-2">
                            <ImagePlus className="h-8 w-8 opacity-40" />
                            <span className="text-sm">Cliquer pour ajouter une image</span>
                        </div>
                    )}
                </div>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} className="hidden" />
            </div>

            {/* Grille champs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Titre */}
                <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="title" className="text-sm font-medium">
                        Titre <span className="text-red-600 text-xl">*</span>
                    </Label>
                    <Input id="title" {...form.register("title")} placeholder="Les Tisserandes" className="h-12 rounded-none" />
                    <FieldError message={form.formState.errors.title?.message} />
                </div>

                {/* Type */}
                <ArtworkTypeField form={form} />

                {/* Année */}
                <div className="space-y-1.5">
                    <Label htmlFor="year" className="text-sm font-medium">Année</Label>
                    <Input
                        id="year"
                        type="number"
                        min={1000}
                        max={new Date().getFullYear()}
                        {...form.register("year", { valueAsNumber: true })}
                        className="rounded-none h-12"
                    />
                    <FieldError message={form.formState.errors.year?.message} />
                </div>

                {/* Technique */}
                <div className="space-y-1.5">
                    <Label htmlFor="technique" className="text-sm font-medium">Technique</Label>
                    <Input id="technique" {...form.register("technique")} placeholder="Acrylique sur toile" className="rounded-none h-12" />
                </div>

                {/* Dimensions */}
                <div className="space-y-1.5">
                    <Label htmlFor="dimensions" className="text-sm font-medium">Dimensions</Label>
                    <Input id="dimensions" {...form.register("dimensions")} placeholder="120 × 90 cm" className="rounded-none h-12" />
                </div>

                {/* Signature */}
                <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="signature" className="text-sm font-medium">Signature</Label>
                    <Input id="signature" {...form.register("signature")} placeholder="A. Diallo" className="rounded-none h-12" />
                </div>

                {/* Description */}
                <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                    <Textarea
                        id="description"
                        {...form.register("description")}
                        placeholder="Décrivez votre œuvre…"
                        rows={10}
                        className="resize-none rounded-none"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
                <CustomButton
                    text="Annuler"
                    onClick={() => router.back()}
                    disabled={mutation.isPending}
                    className="flex-1"
                />

                <CustomButton
                    text={submitLabel(mutation.isPending, isEditing)}
                    type="submit"
                    disabled={mutation.isPending}
                    className="flex-1 bg-cert-terra text-white"
                />
            </div>
        </form>
    );
}
