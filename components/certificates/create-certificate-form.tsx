"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, type UseFormReturn } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { createCertificateSchema, type CreateCertificateValues } from "@/lib/validations/certificate.schema";
import { useArtworks } from "@/lib/query/artworks.queries";
import { useCreateCertificate, useRetryPayment } from "@/lib/query/certificates.mutations";
import { useCertificate } from "@/lib/query/certificates.queries";
import { certificateKeys } from "@/lib/helpers/certificate-keys";
import { useKkiapay } from "@/hooks/use-kkiapay";
import { PAYMENT_METHOD_LABELS, type PaymentMethod } from "@/types/certificates";
import type { Artwork } from "@/types/artworks";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import CustomButton from "@/components/custom-ui/custom-button";
import { CustomSpinner } from "@/components/custom-ui/custom-spinner";
import { FieldError } from "@/components/custom-ui/field-error";
import { AlertCircle, AlertTriangle, Loader2, PlusCircle, XCircle } from "lucide-react";

type CertificateForm = UseFormReturn<CreateCertificateValues>;

// Sélecteur d'œuvre isolé : confine les `form.watch(...)` et la recherche du titre.
function ArtworkSelectField({ form, artworks }: { form: CertificateForm; artworks: Artwork[] }) {
    const selectedId = form.watch("artwork_id");
    const selectedTitle = artworks.find((a) => a.id === selectedId)?.title;
    return (
        <div className="space-y-1.5">
            <Label className="text-sm font-medium">Œuvre à certifier <span className="text-red-600">*</span></Label>
            <Select
                value={selectedId?.toString() || ""}
                onValueChange={(v) => form.setValue("artwork_id", Number(v))}
            >
                <SelectTrigger className="rounded-none h-12 w-full">
                    <SelectValue placeholder="Sélectionnez une œuvre">
                        {selectedId ? selectedTitle : "Sélectionnez une œuvre"}
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
            <FieldError message={form.formState.errors.artwork_id?.message} />
        </div>
    );
}

// Sélecteur de méthode de paiement isolé.
function PaymentMethodField({ form }: { form: CertificateForm }) {
    const current = form.watch("payment.method");
    return (
        <div className="space-y-1.5">
            <Label className="text-sm font-medium">Méthode de paiement (10 000 FCFA) <span className="text-red-600">*</span></Label>
            <Select
                value={current || ""}
                onValueChange={(v) => form.setValue("payment.method", v as PaymentMethod)}
            >
                <SelectTrigger className="rounded-none h-12 w-full">
                    <SelectValue placeholder="Choisir le moyen de paiement">
                        {current ? PAYMENT_METHOD_LABELS[current as PaymentMethod] : "Choisir le moyen de paiement"}
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
            <FieldError message={form.formState.errors.payment?.method?.message} />
        </div>
    );
}

function EmptyArtworksNotice() {
    return (
        <div className="flex flex-col items-center justify-center p-10 border bg-white space-y-4 rounded-none">
            <AlertTriangle className="h-10 w-10 text-amber-500" />
            <p className="text-center text-sm">Vous devez d&apos;abord ajouter une œuvre avant de pouvoir générer un certificat.</p>
            <CustomButton
                text="Ajouter une œuvre"
                href="/dashboard/my-works/new"
                icon={<PlusCircle className="h-4 w-4 mr-2" />}
                className="bg-cert-terra text-white"
            />
        </div>
    );
}

type PaymentPhase = "form" | "processing" | "failed";

export function CreateCertificateForm() {
    const router = useRouter();
    const qc = useQueryClient();
    const { data: session } = useSession();
    const { data: artworks, isLoading: isLoadingArtworks } = useArtworks();
    const createMut = useCreateCertificate();
    const retryMut = useRetryPayment();

    const [serverError, setServerError] = useState<string | null>(null);
    const [phase, setPhase] = useState<PaymentPhase>("form");
    const [certId, setCertId] = useState<number | null>(null);

    // Pendant le traitement, on suit le certificat jusqu'à son activation par le webhook.
    const { data: polledCert } = useCertificate(certId ?? 0, {
        pollWhilePending: phase === "processing",
    });

    const { openWidget } = useKkiapay({
        onSuccess: () => setPhase("processing"),
        onFailed: () => setPhase("failed"),
    });

    const launchWidget = useCallback(
        (paymentId: number, amount: number) => {
            const fullname = `${session?.user?.firstName ?? ""} ${session?.user?.lastName ?? ""}`.trim();
            openWidget({
                amount,
                data: JSON.stringify({ payment_id: paymentId }),
                email: session?.user?.email,
                fullname: fullname || undefined,
            });
        },
        [openWidget, session]
    );

    // Une fois le certificat ACTIVE (webhook traité), on bascule vers la liste.
    useEffect(() => {
        if (phase === "processing" && polledCert?.status === "ACTIVE") {
            qc.invalidateQueries({ queryKey: certificateKeys.all() });
            router.push("/dashboard/certificates");
        }
    }, [phase, polledCert?.status, qc, router]);

    const form = useForm<CreateCertificateValues>({
        resolver: standardSchemaResolver(createCertificateSchema),
        defaultValues: {
            client: { first_name: "", last_name: "", email: "", phone: "" },
        },
    });

    const onSubmit = (values: CreateCertificateValues) => {
        setServerError(null);
        createMut.mutate(values, {
            onSuccess: (res) => {
                const cert = res.data;
                if (!cert.payment) {
                    setServerError("Paiement introuvable. Réessayez.");
                    return;
                }
                setCertId(cert.id);
                launchWidget(cert.payment.id, cert.payment.amount);
            },
            onError: (err: unknown) => {
                const e = err as { message?: string };
                setServerError(e.message ?? "Une erreur est survenue lors de la création.");
            },
        });
    };

    const handleRetry = () => {
        if (!certId) return;
        setServerError(null);
        retryMut.mutate(certId, {
            onSuccess: (res) => {
                setPhase("form");
                launchWidget(res.data.id, res.data.amount);
            },
            onError: (err: unknown) => {
                const e = err as { message?: string };
                setServerError(e.message ?? "Impossible de relancer le paiement.");
            },
        });
    };

    if (isLoadingArtworks) return <CustomSpinner />;
    if (!artworks || artworks.length === 0) return <EmptyArtworksNotice />;

    if (phase === "processing") {
        return (
            <div className="flex flex-col items-center justify-center p-10 border bg-white space-y-4 rounded-none">
                <Loader2 className="h-10 w-10 text-cert-terra animate-spin" />
                <h3 className="font-semibold text-lg">Paiement reçu</h3>
                <p className="text-center text-sm text-muted-foreground max-w-md">
                    Votre certificat est en cours de préparation (QR code, PDF, email).
                    Cette page se met à jour automatiquement dès qu&apos;il est prêt.
                </p>
                <CustomButton
                    text="Voir mes certificats"
                    href="/dashboard/certificates"
                    className="bg-cert-terra text-white"
                />
            </div>
        );
    }

    if (phase === "failed") {
        return (
            <div className="flex flex-col items-center justify-center p-10 border bg-white space-y-4 rounded-none">
                <XCircle className="h-10 w-10 text-red-600" />
                <h3 className="font-semibold text-lg">Paiement échoué</h3>
                <p className="text-center text-sm text-muted-foreground max-w-md">
                    Le paiement n&apos;a pas abouti. Vous pouvez relancer une nouvelle tentative.
                </p>
                {serverError && <p className="text-xs text-red-600">{serverError}</p>}
                <div className="flex gap-3 pt-2">
                    <CustomButton text="Annuler" onClick={() => router.push("/dashboard/certificates")} />
                    <CustomButton
                        text={retryMut.isPending ? "Relance…" : "Réessayer le paiement"}
                        onClick={handleRetry}
                        disabled={retryMut.isPending}
                        className="bg-cert-terra text-white"
                    />
                </div>
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
                        <ArtworkSelectField form={form} artworks={artworks} />
                        <PaymentMethodField form={form} />
                    </div>

                    {/* ─── SECTION CLIENT ACHETEUR ─── */}
                    <div className="bg-white p-6 border-0 space-y-6">
                        <h3 className="font-semibold text-lg border-b pb-2">Informations de l&apos;Acheteur</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="first_name" className="text-sm font-medium">Prénom <span className="text-red-600">*</span></Label>
                                <Input id="first_name" {...form.register("client.first_name")} placeholder="Aïsha" className="h-12 rounded-none" />
                                <FieldError message={form.formState.errors.client?.first_name?.message} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="last_name" className="text-sm font-medium">Nom <span className="text-red-600">*</span></Label>
                                <Input id="last_name" {...form.register("client.last_name")} placeholder="Diallo" className="h-12 rounded-none" />
                                <FieldError message={form.formState.errors.client?.last_name?.message} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-sm font-medium">Email <span className="text-red-600">*</span></Label>
                                <Input id="email" type="email" {...form.register("client.email")} placeholder="client@email.com" className="h-12 rounded-none" />
                                <FieldError message={form.formState.errors.client?.email?.message} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="phone" className="text-sm font-medium">Téléphone (Optionnel)</Label>
                                <Input id="phone" {...form.register("client.phone")} placeholder="+221..." className="h-12 rounded-none" />
                                <FieldError message={form.formState.errors.client?.phone?.message} />
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
                            text={createMut.isPending ? "Préparation du paiement…" : "Payer & générer le certificat"}
                            className="flex-1 bg-cert-terra text-white"
                            disabled={createMut.isPending}
                        />
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
