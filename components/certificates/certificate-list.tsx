"use client";

import { useState } from "react";
import { useCertificates } from "@/lib/query/certificates.queries";
import { CertificateCard } from "./certificate-card";
import { CertificateTable } from "./certificate-table";
import { Button } from "@/components/ui/button";
import { Award, LayoutGrid, List } from "lucide-react";
import { CustomSpinner } from "@/components/custom-ui/custom-spinner";

export function CertificateList() {
    const { data: certificates, isLoading, isError, refetch } = useCertificates();
    const [view, setView] = useState<"grid" | "table">("table");

    if (isLoading) return <CustomSpinner />;

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <p className="text-sm">Impossible de charger vos certificats.</p>
                <Button variant="outline" onClick={() => refetch()} className="rounded-none">Réessayer</Button>
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
                    <h3 className="font-semibold mb-1">Aucun certificat émis</h3>
                    <p className="text-sm">Les certificats apparaîtront ici après leur création depuis une œuvre.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <div className="flex items-center border rounded-none p-1 bg-white shadow-sm">
                    <Button
                        variant={view === "grid" ? "secondary" : "ghost"}
                        size="sm"
                        className="h-8 px-3 rounded-none"
                        onClick={() => setView("grid")}
                    >
                        <LayoutGrid className="h-4 w-4 mr-2" />
                        Grille
                    </Button>
                    <Button
                        variant={view === "table" ? "secondary" : "ghost"}
                        size="sm"
                        className="h-8 px-3 rounded-none"
                        onClick={() => setView("table")}
                    >
                        <List className="h-4 w-4 mr-2" />
                        Liste
                    </Button>
                </div>
            </div>

            {view === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert) => (
                        <CertificateCard key={cert.id} certificate={cert} />
                    ))}
                </div>
            ) : (
                <CertificateTable certificates={certificates} />
            )}
        </div>
    );
}