"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { createCertificateSchema, type CreateCertificateValues } from "@/lib/validations/certificate.schema";
import { useArtworks } from "@/lib/query/artworks.queries";
import { useCreateCertificate } from "@/lib/query/certificates.mutations";
import { PAYMENT_METHOD_LABELS, type PaymentMethod } from "@/types/certificates";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import CustomButton from "@/components/custom-ui/custom-button";
import { CustomSpinner } from "@/components/custom-ui/custom-spinner";
import { AlertCircle, AlertTriangle, PlusCircle } from "lucide-react";

export function CreateCertificateForm() {
    const router = useRouter();
    const { data: artworks, isLoading: isLoadingArtworks } = useArtworks();
    const createMut = useCreateCertificate();

    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm<CreateCertificateValues>({
        resolver: standardSchemaResolver(createCertificateSchema),
        defaultValues: {
            client: { first_name: "", last_name: "", email: "", phone: "" },
        },
    });

    const onSubmit = (values: CreateCertificateValues) => {
        setServerError(null);
        createMut.mutate(values, {
            onSuccess: () => {
                router.push("/dashboard/certificates");
            },
            onError: (err: unknown) => {
                const e = err as { message?: string };
                setServerError(e.message ?? "Une erreur est survenue lors de la création.");
            },
        });
    };

    if (isLoadingArtworks) return <CustomSpinner />;

    if (!artworks || artworks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-10 border bg-white space-y-4 rounded-none">
                <AlertTriangle className="h-10 w-10 text-amber-500" />
                <p className="text-center text-sm">Vous devez d'abord ajouter une œuvre avant de pouvoir générer un certificat.</p>
                <CustomButton 
                    text="Ajouter une œuvre" 
                    href="/dashboard/my-works/new" 
                    icon={<PlusCircle className="h-4 w-4 mr-2" />} 
                    className="bg-cert-terra text-white" 
                />
            </div>
        );
    }

    return (
        <Card className="rounded-none shadow-none border-0 bg-transparent p-0">
            <CardContent className="p-0 border-0 shadow-none">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-0 border-0 shadow-none">

                    {serverError && (
                        <div className="flex items-start gap-2.5 rounded-none px-4 py-3 text-sm border bg-red-50 border-red-200 text-red-700">
                            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            {serverError}
                        </div>
                    )}

                    {/* ─── SECTION ŒUVRE & PAIEMENT ─── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 border-0">

                        {/* Œuvre */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium">Œuvre à certifier <span className="text-red-600">*</span></Label>
                            <Select
                                value={form.watch("artwork_id")?.toString() || ""}
                                onValueChange={(v) => form.setValue("artwork_id", Number(v))}
                            >
                                <SelectTrigger className="rounded-none h-12 w-full">
                                    <SelectValue placeholder="Sélectionnez une œuvre">
                                        {form.watch("artwork_id") ? artworks.find(a => a.id === form.watch("artwork_id"))?.title : "Sélectionnez une œuvre"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    {artworks.map((art) => (
                                        <SelectItem key={art.id} value={art.id.toString()} className="rounded-none">
                                            {art.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.formState.errors.artwork_id && <p className="text-xs text-red-600">{form.formState.errors.artwork_id.message}</p>}
                        </div>

                        {/* Paiement */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium">Méthode de paiement (10 000 FCFA) <span className="text-red-600">*</span></Label>
                            <Select
                                value={form.watch("payment.method") || ""}
                                onValueChange={(v) => form.setValue("payment.method", v as PaymentMethod)}
                            >
                                <SelectTrigger className="rounded-none h-12 w-full">
                                    <SelectValue placeholder="Choisir le moyen de paiement">
                                        {form.watch("payment.method") ? PAYMENT_METHOD_LABELS[form.watch("payment.method") as PaymentMethod] : "Choisir le moyen de paiement"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
                                        <SelectItem key={value} value={value} className="rounded-none">
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.formState.errors.payment?.method && <p className="text-xs text-red-600">{form.formState.errors.payment.method.message}</p>}
                        </div>

                    </div>

                    {/* ─── SECTION CLIENT ACHETEUR ─── */}
                    <div className="bg-white p-6 border-0 space-y-6">
                        <h3 className="font-semibold text-lg border-b pb-2">Informations de l'Acheteur</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="first_name" className="text-sm font-medium">Prénom <span className="text-red-600">*</span></Label>
                                <Input id="first_name" {...form.register("client.first_name")} placeholder="Aïsha" className="h-12 rounded-none" />
                                {form.formState.errors.client?.first_name && <p className="text-xs text-red-600">{form.formState.errors.client.first_name.message}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="last_name" className="text-sm font-medium">Nom <span className="text-red-600">*</span></Label>
                                <Input id="last_name" {...form.register("client.last_name")} placeholder="Diallo" className="h-12 rounded-none" />
                                {form.formState.errors.client?.last_name && <p className="text-xs text-red-600">{form.formState.errors.client.last_name.message}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-sm font-medium">Email <span className="text-red-600">*</span></Label>
                                <Input id="email" type="email" {...form.register("client.email")} placeholder="client@email.com" className="h-12 rounded-none" />
                                {form.formState.errors.client?.email && <p className="text-xs text-red-600">{form.formState.errors.client.email.message}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="phone" className="text-sm font-medium">Téléphone (Optionnel)</Label>
                                <Input id="phone" {...form.register("client.phone")} placeholder="+221..." className="h-12 rounded-none" />
                                {form.formState.errors.client?.phone && <p className="text-xs text-red-600">{form.formState.errors.client.phone.message}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <CustomButton
                            text="Annuler"
                            onClick={() => router.back()}
                            disabled={createMut.isPending}
                            className="flex-1"
                        />
                        <CustomButton
                            type="submit"
                            text={createMut.isPending ? "Génération..." : "Générer le certificat"}
                            className="flex-1 bg-cert-terra text-white"
                            disabled={createMut.isPending}
                        />
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}