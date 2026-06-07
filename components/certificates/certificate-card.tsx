"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, ImageOff } from "lucide-react";
import { Certificate, CERTIFICATE_STATUS_LABELS, PAYMENT_METHOD_LABELS } from "@/types/certificates";
import { useDownloadLink } from "@/lib/query/certificates.mutations";
import { ARTWORK_TYPE_LABELS } from "@/types/artworks";
import { RevokeCertificateButton } from "./revoke-certificate-button";
import CustomButton from "../custom-ui/custom-button";

const STATUS_STYLES: Record<string, string> = {
    ACTIVE: "bg-emerald-500 hover:bg-emerald-600 text-white",
    PENDING: "bg-amber-500 hover:bg-amber-600 text-white",
    REVOKED: "bg-gray-800 hover:bg-gray-900 text-white",
};

interface CertificateCardProps {
    certificate: Certificate;
}

export function CertificateCard({ certificate: cert }: CertificateCardProps) {
    const downloadMut = useDownloadLink();
    const statusStyle = STATUS_STYLES[cert.status] ?? STATUS_STYLES.PENDING;

    const createdAt = new Date(cert.created_at).toLocaleDateString("fr-FR", {
        year: "numeric", month: "long", day: "numeric",
    });

    return (
        <Card className="overflow-hidden border shadow-none transition-all duration-200 hover:-translate-y-1 group rounded-none bg-white p-0">

            {/* ─── IMAGE HEADER & BADGES ─── */}
            <div className="relative h-48 overflow-hidden bg-gray-50 border-b">
                {cert.artwork.image_url ? (
                    <img
                        src={cert.artwork.image_url}
                        alt={cert.artwork.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <ImageOff className="h-10 w-10 opacity-30 text-gray-400" />
                    </div>
                )}

                {/* Badge Type d'œuvre (Haut Gauche) */}
                <div className="absolute top-3 left-3">
                    <Badge className="text-xs font-medium border-0 rounded-none bg-black/70 text-white hover:bg-black/80 backdrop-blur-sm">
                        {ARTWORK_TYPE_LABELS[cert.artwork.type]}
                    </Badge>
                </div>

                {/* Badge Statut Certificat (Haut Droite) */}
                <div className="absolute top-3 right-3">
                    <Badge className={`text-xs font-medium border-0 rounded-none shadow-sm ${statusStyle}`}>
                        {CERTIFICATE_STATUS_LABELS[cert.status]}
                    </Badge>
                </div>
            </div>

            <CardContent className="p-4 space-y-4">

                {/* ─── TITRE ET DATE ─── */}
                <div className="space-y-1">
                    <h3 className="font-semibold text-base leading-tight truncate text-gray-900">
                        {cert.artwork.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        Émis le {createdAt}
                    </p>
                </div>

                {/* ─── DÉTAILS TECHNIQUES (Grille grise) ─── */}
                <div className="grid grid-cols-2 gap-3 text-sm bg-gray-50/50 p-3 border border-gray-100">
                    <div>
                        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">N° Certificat</p>
                        <p className="font-mono font-semibold truncate text-xs">{cert.unique_number}</p>
                    </div>
                    <div>
                        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">Paiement</p>
                        <p className="font-medium truncate text-xs">{PAYMENT_METHOD_LABELS[cert.payment_method]}</p>
                    </div>
                    <div className="col-span-2 pt-1">
                        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">Acheteur</p>
                        <p className="font-medium truncate text-sm">
                            {cert.client.first_name} {cert.client.last_name}
                            <span className="text-muted-foreground font-normal ml-1">({cert.client.email})</span>
                        </p>
                    </div>

                    {cert.status === "REVOKED" && cert.revocation_reason && (
                        <div className="col-span-2 mt-1 pt-2 border-t border-red-100">
                            <p className="text-[11px] uppercase tracking-wider text-red-600/70 font-medium mb-0.5">Motif de révocation</p>
                            <p className="text-red-600 italic text-xs leading-relaxed">{cert.revocation_reason}</p>
                        </div>
                    )}
                </div>

                {/* ─── ACTIONS ─── */}
                <div className="flex w-full gap-2 pt-1">
                    {cert.status === "ACTIVE" && (
                        <>
                            <div className="flex-1 min-w-0">
                                <CustomButton
                                    text={downloadMut.isPending ? "Génération..." : "Télécharger"}
                                    onClick={() => downloadMut.mutate(cert.id)}
                                    disabled={downloadMut.isPending}
                                    className="w-full h-12 bg-cert-terra hover:bg-cert-terra/90 text-white min-w-0 px-2"
                                    icon={<Download className="h-4 w-4 shrink-0" />}
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <RevokeCertificateButton certificateId={cert.id} certificateNumber={cert.unique_number} />
                            </div>
                        </>
                    )}

                    {cert.status === "PENDING" && (
                        <div className="w-full h-12 flex items-center justify-center border border-amber-200 bg-amber-50 text-amber-700 text-sm font-bold">
                            En attente de paiement
                        </div>
                    )}

                    {cert.status === "REVOKED" && (
                        <div className="w-full h-12 flex items-center justify-center border border-gray-200 bg-gray-50 text-gray-500 text-sm font-bold">
                            Certificat invalidé
                        </div>
                    )}
                </div>

            </CardContent>
        </Card>
    );
}