import type { ArtworkFormValues } from "../validations/artwork.schema";
import { useToken } from "../helpers/use-token";
import { useQueryClient } from "@tanstack/react-query";
import { artworkKeys } from "../helpers/artwork-keys";
import { artworksApi } from "../api/artworks.api";
import { useMutation } from "@tanstack/react-query";

function buildFormData(values: ArtworkFormValues, image?: File | null): FormData {
    const fd = new FormData();
    fd.append("title", values.title);
    fd.append("type", values.type);
    if (values.technique) fd.append("technique", values.technique);
    if (values.dimensions) fd.append("dimensions", values.dimensions);
    if (values.year) fd.append("year", String(values.year));
    if (values.description) fd.append("description", values.description);
    if (values.signature) fd.append("signature", values.signature);
    if (image) fd.append("image", image);
    return fd;
}

export function useCreateArtwork() {
    const token = useToken();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ values, image }: { values: ArtworkFormValues; image?: File | null }) =>
            artworksApi.create(token!, buildFormData(values, image)),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: artworkKeys.all() });
        },
    });
}

export function useUpdateArtwork(id: number) {
    const token = useToken();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ values, image }: { values: Partial<ArtworkFormValues>; image?: File | null }) => {
            const fd = new FormData();
            if (values.title) fd.append("title", values.title);
            if (values.type) fd.append("type", values.type);
            if (values.technique) fd.append("technique", values.technique);
            if (values.dimensions) fd.append("dimensions", values.dimensions);
            if (values.year) fd.append("year", String(values.year));
            if (values.description) fd.append("description", values.description);
            if (values.signature) fd.append("signature", values.signature);
            if (image) fd.append("image", image);
            return artworksApi.update(token!, id, fd);
        },

        onSuccess: (data) => {
            qc.invalidateQueries({ queryKey: artworkKeys.all() });
            qc.setQueryData(artworkKeys.detail(id), data);
        },
    });
}

export function useDeleteArtwork() {
    const token = useToken();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => artworksApi.delete(token!, id),

        onSuccess: (_, id) => {
            qc.invalidateQueries({ queryKey: artworkKeys.all() });
            qc.removeQueries({ queryKey: artworkKeys.detail(id) });
        },
    });
}