import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getServerProfile } from "@/actions/profile.actions";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileInfoCard } from "@/components/profile/profile-info-card";
import { UpdateEmailForm } from "@/components/profile/update-email-form";
import { UpdatePasswordForm } from "@/components/profile/update-password-form";
import { UpdatePhoneForm } from "@/components/profile/update-phone-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, Phone } from "lucide-react";
import type { Metadata } from "next";
import DecorativeCorners from "@/components/custom-ui/decorative-corners";

export const metadata: Metadata = {
    title: "Mon profil — Certifa",
};

export default async function ProfilePage() {
    const session = await auth();
    if (!session) redirect("/auth/login");

    const user = await getServerProfile();
    if (!user) redirect("/auth/login");

    return (
        <div className="max-w-3xl space-y-4">

            <div className="space-y-1">
                <h2 className="text-2xl font-bold">Mon profil</h2>
                <p className="text-sm text-muted-foreground">Gérez vos informations personnelles</p>
            </div>

            {/* Hero profil */}
            <ProfileHeader user={user} />

            {/* Formulaires de modification */}
            <Card className="relative border shadow-none rounded-none">
                <DecorativeCorners />
                <CardHeader className="pb-4">
                    <CardTitle
                        className="text-xl font-bold">
                        Modifier mes informations
                    </CardTitle>
                    <CardDescription>
                        Les modifications sont appliquées immédiatement.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="email">
                        <TabsList
                            className="w-full mb-6 h-auto py-6 px-2 rounded-none"
                        >
                            <TabsTrigger
                                value="email"
                                className="flex-1 flex items-center gap-1.5 text-xs font-medium data-[state=active]:bg-cert-terra rounded-none py-4">
                                <Mail className="h-3.5 w-3.5" />
                                Email
                            </TabsTrigger>
                            <TabsTrigger
                                value="password"
                                className="flex-1 flex items-center gap-1.5 text-xs font-medium data-[state=active]:bg-cert-terra rounded-none py-4">
                                <Lock className="h-3.5 w-3.5" />
                                Mot de passe
                            </TabsTrigger>
                            <TabsTrigger
                                value="phone"
                                className="flex-1 flex items-center gap-1.5 text-xs font-medium data-[state=active]:bg-cert-terra rounded-none py-4">
                                <Phone className="h-3.5 w-3.5" />
                                Téléphone
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="email" className="mt-0">
                            <UpdateEmailForm currentEmail={user.email} />
                        </TabsContent>

                        <TabsContent value="password" className="mt-0">
                            <UpdatePasswordForm />
                        </TabsContent>

                        <TabsContent value="phone" className="mt-0">
                            <UpdatePhoneForm currentPhone={user.phone} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}