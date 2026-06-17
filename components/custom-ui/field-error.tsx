// Message d'erreur de champ de formulaire, mutualisé pour éviter la répétition
// du motif `{errors.x && <p …>…</p>}` dans tous les formulaires.

export function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="text-xs text-red-600">{message}</p>;
}
