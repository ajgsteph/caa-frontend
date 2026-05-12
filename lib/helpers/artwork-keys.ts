export const artworkKeys = {
    all: () => ["artworks"] as const,
    detail: (id: number) => ["artworks", id] as const,
};