import { useQuery } from "@tanstack/react-query";
import { artworksApi } from "@/lib/api/artworks.api";
import { useToken } from "../helpers/use-token";
import { artworkKeys } from "../helpers/artwork-keys";


export function useArtworks() {
    const token = useToken();
    return useQuery({
        queryKey: artworkKeys.all(),
        queryFn: () => artworksApi.list(token!),
        enabled: !!token,
        select: (data) => data.data,
    });
}

export function useArtwork(id: number) {
    const token = useToken();
    return useQuery({
        queryKey: artworkKeys.detail(id),
        queryFn: () => artworksApi.get(token!, id),
        enabled: !!token && !!id,
        select: (data) => data.data,
    });
}