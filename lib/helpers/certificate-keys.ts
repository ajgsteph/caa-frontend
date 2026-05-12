export const certificateKeys = {
    all: () => ["certificates"] as const,
    detail: (id: number) => ["certificates", id] as const,
};