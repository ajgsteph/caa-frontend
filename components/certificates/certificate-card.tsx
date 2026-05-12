"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Download, ShieldOff, ImageOff } from "lucide-react";
import { Certificate, CERTIFICATE_STATUS_LABELS, PAYMENT_METHOD_LABELS } from "@/types/certificates";
import { useDownloadLink, useRevokeCertificate } from "@/lib/query/certificates.mutations";
import { ARTWORK_TYPE_LABELS } from "@/types/artworks";

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
    ACTIVE: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    PENDING: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    REVOKED: { bg: "bg-gray-100", text: "text-gray-500", border: "border-gray-200" },
};

interface CertificateCardProps {
    certificate: Certificate;
}

export function CertificateCard({ certificate: cert }: CertificateCardProps) {
    const revokeMut = useRevokeCertificate();
    const downloadMut = useDownloadLink();
    const [reason, setReason] = useState("");
    const [revokeError, setRevokeError] = useState<string | null>(null);
    const statusStyle = STATUS_STYLES[cert.status] ?? STATUS_STYLES.PENDING;

    const handleRevoke = () => {
        setRevokeError(null);
        if (reason.trim().length < 10) {
            setRevokeError("Le motif doit faire au moins 10 caractères.");
            return;
        }
        revokeMut.mutate(
            { id: cert.id, reason },
            {
                onError: (err: unknown) => {
                    const e = err as { message?: string };
                    setRevokeError(e.message ?? "Erreur lors de la révocation.");
                },
            }
        );
    };

    const createdAt = new Date(cert.created_at).toLocaleDateString("fr-FR", {
        year: "numeric", month: "short", day: "numeric",
    });

    return (
        <Card
            className="border shadow-sm"
            style={{ borderColor: "rgba(28,20,16,0.1)", background: "var(--cream)" }}
        >
            <CardContent className="p-5 space-y-4">

                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Miniature œuvre */}
                        <div
                            className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
                            style={{ background: "var(--cream-deep)" }}
                        >
                            {cert.artwork.image_url ? (
                                <img src={cert.artwork.image_url} alt={cert.artwork.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full" style={{ color: "var(--muted)" }}>
                                    <ImageOff className="h-5 w-5 opacity-30" />
                                </div>
                            )}
                        </div>

                        <div className="min-w-0">
                            <p className="font-semibold text-sm truncate" style={{ color: "var(--ink)", fontFamily: "Fraunces, serif" }}>
                                {cert.artwork.title}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                                {ARTWORK_TYPE_LABELS[cert.artwork.type]} · {createdAt}
                            </p>
                        </div>
                    </div>

                    <Badge className={`text-xs border flex-shrink-0 ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                        {CERTIFICATE_STATUS_LABELS[cert.status]}
                    </Badge>
                </div>

                <Separator style={{ background: "rgba(28,20,16,0.06)" }} />

                {/* Numéro + infos */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                        <p className="uppercase tracking-wide mb-0.5 font-medium" style={{ color: "var(--muted)" }}>N° Certificat</p>
                        <p className="font-mono font-semibold" style={{ color: "var(--ink)" }}>{cert.number}</p>
                    </div>
                    <div>
                        <p className="uppercase tracking-wide mb-0.5 font-medium" style={{ color: "var(--muted)" }}>Paiement</p>
                        <p style={{ color: "var(--ink)" }}>{PAYMENT_METHOD_LABELS[cert.payment_method]}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="uppercase tracking-wide mb-0.5 font-medium" style={{ color: "var(--muted)" }}>Acheteur</p>
                        <p style={{ color: "var(--ink)" }}>{cert.client.first_name} {cert.client.last_name}</p>
                        <p style={{ color: "var(--muted)" }}>{cert.client.email}</p>
                    </div>
                    {cert.status === "REVOKED" && cert.revocation_reason && (
                        <div className="col-span-2">
                            <p className="uppercase tracking-wide mb-0.5 font-medium" style={{ color: "var(--muted)" }}>Motif de révocation</p>
                            <p className="italic text-red-600">{cert.revocation_reason}</p>
                        </div>
                    )}
                </div>

                <Separator style={{ background: "rgba(28,20,16,0.06)" }} />

                {/* Actions */}
                <div className="flex gap-2">
                    {cert.status === "ACTIVE" && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 gap-1.5 text-xs border-[rgba(28,20,16,0.15)]"
                            onClick={() => downloadMut.mutate(cert.id)}
                            disabled={downloadMut.isPending}
                        >
                            <Download className="h-3.5 w-3.5" />
                            {downloadMut.isPending ? "Chargement…" : "Télécharger PDF"}
                        </Button>
                    )}

                    {cert.status === "ACTIVE" && (
                        <AlertDialog>
                            <AlertDialogTrigger>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50 text-xs"
                                >
                                    <ShieldOff className="h-3.5 w-3.5" />
                                    Révoquer
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Révoquer ce certificat ?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Le certificat <strong>{cert.number}</strong> sera invalidé définitivement.
                                        L'acheteur ne pourra plus le vérifier.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <div className="space-y-2 my-2">
                                    <Label className="text-sm font-medium">Motif de révocation <span className="text-red-500">*</span></Label>
                                    <Textarea
                                        placeholder="Expliquez la raison de la révocation (min. 10 caractères)…"
                                        value={reason}
                                        onChange={(e) => { setReason(e.target.value); setRevokeError(null); }}
                                        rows={3}
                                        className="resize-none text-sm"
                                    />
                                    {revokeError && <p className="text-xs text-red-600">{revokeError}</p>}
                                </div>

                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => { setReason(""); setRevokeError(null); }}>
                                        Annuler
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleRevoke}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                        disabled={revokeMut.isPending}
                                    >
                                        {revokeMut.isPending ? "Révocation…" : "Confirmer la révocation"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}