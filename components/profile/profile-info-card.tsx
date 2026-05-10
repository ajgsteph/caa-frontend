import type { ApiUser } from "@/types/auth";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, Calendar, Hash } from "lucide-react";
import DecorativeCorners from "../custom-ui/decorative-corners";

interface InfoRowProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
    return (
        <div className="flex items-start gap-3 py-3">
            <div
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
                style={{ background: "rgba(184,74,37,0.08)" }}
            >
                <span style={{ color: "var(--terra)" }}>{icon}</span>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide mb-0.5" style={{ color: "var(--muted)" }}>
                    {label}
                </p>
                <p className="text-sm font-medium truncate" style={{ color: "var(--ink)" }}>
                    {value || <span style={{ color: "var(--muted)", fontStyle: "italic" }}>Non renseigné</span>}
                </p>
            </div>
        </div>
    );
}

interface ProfileInfoCardProps {
    user: ApiUser;
}

export function ProfileInfoCard({ user }: ProfileInfoCardProps) {
    const registeredAt = new Date(user.registered_at).toLocaleDateString("fr-FR", {
        year: "numeric", month: "long", day: "numeric",
    });

    return (
        <Card className="relative border shadow-sm" style={{ borderColor: "rgba(28,20,16,0.1)", background: "var(--cream)" }}>
            <DecorativeCorners />
            <CardHeader className="pb-2">
                <CardTitle
                    className="text-base font-semibold"
                    style={{ color: "var(--ink)", fontFamily: "Fraunces, serif" }}
                >
                    Informations du profil
                </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
                <InfoRow icon={<User className="h-4 w-4" />} label="Nom complet" value={`${user.first_name} ${user.last_name}`} />
                <Separator style={{ background: "rgba(28,20,16,0.06)" }} />
                <InfoRow icon={<Hash className="h-4 w-4" />} label="Nom d'artiste" value={user.artist_name} />
                <Separator style={{ background: "rgba(28,20,16,0.06)" }} />
                <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={user.email} />
                <Separator style={{ background: "rgba(28,20,16,0.06)" }} />
                <InfoRow icon={<Phone className="h-4 w-4" />} label="Téléphone" value={user.phone ?? ""} />
                <Separator style={{ background: "rgba(28,20,16,0.06)" }} />
                <InfoRow icon={<Calendar className="h-4 w-4" />} label="Membre depuis" value={registeredAt} />
            </CardContent>
        </Card>
    );
}