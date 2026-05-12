import type { CreateCertificateValues } from "@/lib/validations/certificate.schema";
import { useToken } from "@/lib/helpers/use-token";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { certificatesApi } from "@/lib/api/certificates.api";
import { certificateKeys } from "@/lib/helpers/certificate-keys";
import { artworkKeys } from "../helpers/artwork-keys";

export function useCreateCertificate() {
    const token = useToken();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCertificateValues) =>
            certificatesApi.create(token!, data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: certificateKeys.all() });
            qc.invalidateQueries({ queryKey: artworkKeys.all() });
        },
    });
}

export function useRevokeCertificate() {
    const token = useToken();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, reason }: { id: number; reason: string }) =>
            certificatesApi.revoke(token!, id, reason),

        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: certificateKeys.all() });
            qc.invalidateQueries({ queryKey: certificateKeys.detail(id) });
        },
    });
}

export function useDownloadLink() {
    const token = useToken();

    return useMutation({
        mutationFn: (id: number) => certificatesApi.getDownloadLink(token!, id),
        onSuccess: (data) => {
            window.open(data.url, "_blank", "noopener,noreferrer");
        },
    });
}