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

export function useCertificate(id: number) {
    const token = useToken();
    return useQuery({
        queryKey: certificateKeys.detail(id),
        queryFn: () => certificatesApi.get(token!, id),
        enabled: !!token && !!id,
        select: (data) => data.data,
    });
}

