import { useQuery } from "@tanstack/react-query";
import { certificatesApi } from "@/lib/api/certificates.api";
import { useToken } from "@/lib/helpers/use-token";
import { certificateKeys } from "@/lib/helpers/certificate-keys";

export function useCertificates() {
    const token = useToken();
    return useQuery({
        queryKey: certificateKeys.all(),
        queryFn: () => certificatesApi.list(token!),
        enabled: !!token,
        select: (data) => data.data,
    });
}

/**
 * Détail d'un certificat. Pendant l'attente de paiement (`PENDING`), on
 * rafraîchit toutes les 3 s pour détecter le passage à `ACTIVE` déclenché par
 * le webhook KKiaPay.
 */
export function useCertificate(id: number, options?: { pollWhilePending?: boolean }) {
    const token = useToken();
    return useQuery({
        queryKey: certificateKeys.detail(id),
        queryFn: () => certificatesApi.get(token!, id),
        enabled: !!token && !!id,
        select: (data) => data.data,
        refetchInterval: (query) =>
            options?.pollWhilePending && query.state.data?.data.status === "PENDING"
                ? 3000
                : false,
    });
}

