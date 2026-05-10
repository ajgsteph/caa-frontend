"use client";

import type { ApiUser } from "@/types/auth";
// import { Badge } from "@/components/ui/badge";

// const ROLE_LABELS: Record<string, string> = {
//     artist: "Artiste",
//     admin: "Administrateur",
//     super_admin: "Super Admin",
// };

const STATUS_MAP = {
    ACTIVE: { label: "Actif", class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    INACTIVE: { label: "Inactif", class: "bg-gray-100 text-gray-500 border-gray-200" },
};

interface ProfileHeaderProps {
    user: ApiUser;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
    // const initials = [user.first_name[0], user.last_name[0]]
    //     .filter(Boolean)
    //     .join("")
    //     .toUpperCase();

    const status = STATUS_MAP[user.status] ?? STATUS_MAP.INACTIVE;
    const joinedAt = new Date(user.registered_at).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div
            className="relative rounded-none bg-white overflow-hidden border p-8">
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">

                {/* Infos */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h1
                            className="text-2xl font-semibold tracking-tight truncate">
                            {user.artist_name}
                        </h1>
                        <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${status.class}`}
                        >
                            {status.label}
                        </span>
                    </div>

                    <p className="text-sm mb-3">
                        {user.first_name} {user.last_name}
                    </p>

                    {/* <div className="flex flex-wrap gap-2">
                        {user.roles.map((role) => (
                            <Badge
                                key={role}
                                variant="outline"
                                className="text-xs border"
                                style={{
                                    borderColor: "rgba(201,147,46,0.4)",
                                    color: "var(--gold)",
                                    background: "rgba(201,147,46,0.08)",
                                }}
                            >
                                {ROLE_LABELS[role] ?? role}
                            </Badge>
                        ))}
                    </div> */}
                </div>

                {/* Membre depuis */}
                <div className="text-right hidden sm:block">
                    <p className="text-xs mb-0.5">
                        Membre depuis
                    </p>
                    <p className="text-sm font-medium">
                        {joinedAt}
                    </p>
                </div>
            </div>
        </div>
    );
}