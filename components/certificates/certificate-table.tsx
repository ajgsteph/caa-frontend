import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Certificate, CERTIFICATE_STATUS_LABELS } from "@/types/certificates";
import { ARTWORK_TYPE_LABELS } from "@/types/artworks";
import { useDownloadLink } from "@/lib/query/certificates.mutations";
import { RevokeCertificateButton } from "./revoke-certificate-button";

const STATUS_STYLES: Record<string, string> = {
    ACTIVE: "bg-emerald-500 hover:bg-emerald-600 text-white",
    PENDING: "bg-amber-500 hover:bg-amber-600 text-white",
    REVOKED: "bg-gray-800 hover:bg-gray-900 text-white",
};

export function CertificateTable({ certificates }: { certificates: Certificate[] }) {
    const downloadMut = useDownloadLink();

    return (
        <div className="bg-white border rounded-none">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">Œuvre</TableHead>
                        <TableHead>N° Certificat</TableHead>
                        <TableHead>Acheteur</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {certificates.map((cert) => {
                        const statusStyle = STATUS_STYLES[cert.status] ?? STATUS_STYLES.PENDING;
                        const createdAt = new Date(cert.created_at).toLocaleDateString("fr-FR", {
                            year: "numeric", month: "short", day: "numeric",
                        });

                        return (
                            <TableRow key={cert.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-none bg-gray-50 overflow-hidden flex-shrink-0">
                                            {cert.artwork.image_url && (
                                                <img src={cert.artwork.image_url} alt={cert.artwork.title} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="grid gap-0.5">
                                            <span className="font-medium text-sm truncate max-w-[200px]">{cert.artwork.title}</span>
                                            <span className="text-[11px] text-muted-foreground uppercase">{ARTWORK_TYPE_LABELS[cert.artwork.type]}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono text-xs">
                                    {cert.unique_number ? cert.unique_number : <span className="text-gray-400 italic">En attente</span>}
                                </TableCell>
                                <TableCell>
                                    <div className="grid gap-0.5">
                                        <span className="text-sm font-medium">{cert.client.first_name} {cert.client.last_name}</span>
                                        <span className="text-xs text-muted-foreground">{cert.client.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm">{createdAt}</TableCell>
                                <TableCell>
                                    <Badge className={`text-[10px] font-medium border-0 rounded-none shadow-sm ${statusStyle}`}>
                                        {CERTIFICATE_STATUS_LABELS[cert.status]}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {cert.status === "ACTIVE" ? (
                                            <>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-8 w-8 rounded-none border-[rgba(28,20,16,0.15)] text-cert-terra hover:bg-cert-terra hover:text-white"
                                                    onClick={() => downloadMut.mutate(cert.id)}
                                                    disabled={downloadMut.isPending}
                                                    title="Télécharger"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <RevokeCertificateButton certificateId={cert.id} certificateNumber={cert.unique_number} layout="table" />
                                            </>
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">-</span>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}