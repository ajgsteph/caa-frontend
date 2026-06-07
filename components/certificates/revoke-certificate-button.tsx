"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShieldOff } from "lucide-react";
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
import { useRevokeCertificate } from "@/lib/query/certificates.mutations";

interface RevokeCertificateButtonProps {
    certificateId: number;
    certificateNumber: string;
    layout?: "card" | "table"; // Définit le style du déclencheur
}

export function RevokeCertificateButton({ certificateId, certificateNumber, layout = "card" }: RevokeCertificateButtonProps) {
    const revokeMut = useRevokeCertificate();
    const [reason, setReason] = useState("");
    const [revokeError, setRevokeError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleRevoke = (e: React.MouseEvent) => {
        e.preventDefault();
        setRevokeError(null);

        if (reason.trim().length < 10) {
            setRevokeError("Le motif doit faire au moins 10 caractères.");
            return;
        }

        revokeMut.mutate(
            { id: certificateId, reason },
            {
                onSuccess: () => {
                    setIsOpen(false);
                },
                onError: (err: unknown) => {
                    const e = err as { message?: string };
                    setRevokeError(e.message ?? "Erreur lors de la révocation.");
                },
            }
        );
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger className={
                layout === "table"
                    ? "flex items-center justify-center h-8 w-8 border border-red-200 text-red-600 hover:bg-red-50 transition-colors outline-none cursor-pointer rounded-none"
                    : "flex w-full items-center justify-center gap-1.5 h-12 px-2 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors min-w-0 outline-none cursor-pointer"
            }>
                <ShieldOff className="h-4 w-4 shrink-0" />
                {layout === "card" && <span className="truncate font-bold text-sm">Révoquer</span>}
            </AlertDialogTrigger>

            <AlertDialogContent className="rounded-none">
                <AlertDialogHeader>
                    <AlertDialogTitle>Révoquer ce certificat ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Le certificat <strong>{certificateNumber}</strong> sera invalidé définitivement.
                        L'acheteur recevra un email et le scan indiquera qu'il est invalide.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-2 my-2">
                    <Label className="text-sm font-medium">Motif de révocation <span className="text-red-500">*</span></Label>
                    <Textarea
                        placeholder="Expliquez la raison (min. 10 caractères)…"
                        value={reason}
                        onChange={(e) => { setReason(e.target.value); setRevokeError(null); }}
                        rows={3}
                        className="resize-none text-sm rounded-none"
                    />
                    {revokeError && <p className="text-xs text-red-600">{revokeError}</p>}
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => { setReason(""); setRevokeError(null); }} className="rounded-none">
                        Annuler
                    </AlertDialogCancel>
                    <Button
                        onClick={handleRevoke}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-none"
                        disabled={revokeMut.isPending}
                    >
                        {revokeMut.isPending ? "Révocation…" : "Confirmer la révocation"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}