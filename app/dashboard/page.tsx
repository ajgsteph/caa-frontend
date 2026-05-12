"use client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    Plus,
    FileText,
    Image as ImageIcon,
    BarChart3,
    Radio,
    ChevronRight,
    AlertTriangle
} from "lucide-react"
import Link from "next/link"
import CustomButton from "@/components/custom-ui/custom-button"
import { useSession } from "next-auth/react"

export default function Dashboard() {
    const { data: session } = useSession()
    return (
        <div className="flex-1 space-y-4 pt-6">

            {/* ─── HEADER GREETING ─── */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Hello, {session?.user?.artistName}</h1>
                <p className="text-muted-foreground">Bienvenue sur votre espace artiste Certifa</p>
            </div>

            {/* ─── VERIFICATION ALERT ─── */}
            <Alert className="bg-[#FFF9EB] border-[#FDE68A] flex items-center justify-between p-4 rounded-none">
                <div className="flex items-center gap-4">
                    <div className="bg-[#FDE68A] p-2 rounded-full">
                        <AlertTriangle className="h-5 w-5 text-[#92400E]" />
                    </div>
                    <div>
                        <AlertTitle className="text-[#92400E] font-semibold mb-0">
                            Vérification d&apos;identité requise
                        </AlertTitle>
                        <AlertDescription className="text-[#B45309]">
                            Vérifiez votre identité pour pouvoir créer des certificats.
                        </AlertDescription>
                    </div>
                </div>
                <Button variant="outline" className="border-[#FDE68A] hover:bg-[#FEF3C7] text-[#92400E] rounded-none">
                    Vérifier
                </Button>
            </Alert>

            {/* ─── STATISTICS GRID ─── */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Oeuvres enregistrées" value="12" icon={<ImageIcon className="h-4 w-4" />} />
                <StatCard title="Certificats émis" value="8" icon={<FileText className="h-4 w-4" />} />
                <StatCard title="Scans totaux" value="156" icon={<Radio className="h-4 w-4" />} />
                <StatCard title="Scans (30 jours)" value="23" icon={<BarChart3 className="h-4 w-4" />} />
            </div>

            {/* ─── ACTION CARDS ─── */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Ajouter une oeuvre */}
                <Card className="shadow-none rounded-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle className="text-lg">Ajouter une oeuvre</CardTitle>
                            <CardDescription>Enregistrez une nouvelle oeuvre dans votre catalogue</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CustomButton
                            className="w-fit bg-cert-terra hover:bg-cert-terra/80 text-white"
                            text="Nouvelle oeuvre"
                            href="/dashboard/my-works/new"
                            icon={<Plus className="mr-2 h-4 w-4" />}
                        />
                    </CardContent>
                </Card>

                {/* Créer un certificat */}
                <Card className="shadow-none rounded-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle className="text-lg">Créer un certificat</CardTitle>
                            <CardDescription>Générez un certificat d&apos;authenticité pour une oeuvre</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4">
                        <CustomButton
                            className="flex-1! bg-transparent hover:bg-cert-terra text-cert-terra"
                            text="Nouveau certificat"
                            href="/dashboard/certificates/new"
                            icon={<FileText className="mr-2 h-4 w-4" />}
                        />
                        <Badge variant="secondary" className="bg-[#F3F4F6] text-[#6B7280] font-normal rounded-none">
                            KYC requis
                        </Badge>
                    </CardContent>
                </Card>
            </div>

            {/* ─── RECENT ACTIVITY ─── */}
            <div className="space-y-4">
                <div>
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold tracking-tight">Activité récente</h2>
                        <Link href="/dashboard/activity" className="text-sm font-medium flex items-center hover:underline">
                            Voir tout <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                    </div>
                    <p className="text-sm text-muted-foreground">Les derniers scans de vos certificats</p>
                </div>

                <div className="bg-white rounded-none border shadow-none divide-y">
                    <ActivityItem
                        title="Nature Morte #12"
                        location="Paris, France"
                        time="Il y a 2h"
                    />
                    <ActivityItem
                        title="Spleen de Dakar"
                        location="Dakar, Sénégal"
                        time="Il y a 5h"
                    />
                    <ActivityItem
                        title="Abstraction Ocre"
                        location="Berlin, Allemagne"
                        time="Hier"
                    />
                </div>
            </div>

        </div>
    )
}

// ─── PETITS COMPOSANTS INTERNES ───

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
    return (
        <Card className="shadow-none rounded-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <div className="p-2 bg-gray-50 rounded-md">
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{value}</div>
            </CardContent>
        </Card>
    )
}

function ActivityItem({ title, location, time }: { title: string, location: string, time: string }) {
    return (
        <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 rounded-lg border">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gray-100 rounded-lg text-gray-400">
                        <ImageIcon className="h-5 w-5" />
                    </AvatarFallback>
                </Avatar>
                <div>
                    <div className="font-semibold text-sm">{title}</div>
                    <div className="text-xs text-muted-foreground">{location}</div>
                </div>
            </div>
            <div className="text-xs text-muted-foreground">{time}</div>
        </div>
    )
}