"use client";

import { useCertificates } from "@/lib/query/certificates.queries";
import { CertificateCard } from "./certificate-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import { CustomSpinner } from "@/components/custom-ui/custom-spinner";

function CertSkeleton() {
    return (
        <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "rgba(28,20,16,0.1)" }}>
            <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-px w-full" />
            <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
            </div>
            <Skeleton className="h-8 w-full" />
        </div>
    );
}

export function CertificateList() {
    const { data: certificates, isLoading, isError, refetch } = useCertificates();

    if (isLoading) {
        return (
            // <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            //     {Array.from({ length: 4 }).map((_, i) => <CertSkeleton key={i} />)}
            // </div>
            <CustomSpinner />
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <p className="text-sm">Impossible de charger vos certificats.</p>
                <Button variant="outline" onClick={() => refetch()}>Réessayer</Button>
            </div>
        );
    }

    if (!certificates?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-cert-terra text-white">
                    <Award className="h-8 w-8" />
                </div>
                <div className="text-center">
                    <h3 className="font-semibold mb-1">
                        Aucun certificat émis
                    </h3>
                    <p className="text-sm">
                        Les certificats apparaîtront ici après leur création depuis une œuvre.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
                <CertificateCard key={cert.id} certificate={cert} />
            ))}
        </div>
    );
}