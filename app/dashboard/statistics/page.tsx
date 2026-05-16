"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QrCode, Eye, MapPin, MousePointerClick, TrendingUp } from "lucide-react"

const fakeStats = [
  { id: 1, title: "Nature Morte #12", totalScans: 45, uniqueVisitors: 30, topLocation: "Paris, France", status: "Très actif" },
  { id: 2, title: "Spleen de Dakar", totalScans: 32, uniqueVisitors: 25, topLocation: "Dakar, Sénégal", status: "Actif" },
  { id: 3, title: "Abstraction Ocre", totalScans: 28, uniqueVisitors: 20, topLocation: "Berlin, Allemagne", status: "Actif" },
  { id: 4, title: "Les Tisserandes", totalScans: 15, uniqueVisitors: 12, topLocation: "Montréal, Canada", status: "Modéré" },
  { id: 5, title: "Lumière d'Hiver", totalScans: 5, uniqueVisitors: 4, topLocation: "Lyon, France", status: "Nouveau" },
]

export default function StatisticsPage() {
  return (
    <div className="flex-1 space-y-8">

      {/* ─── HEADER ─── */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Statistiques</h1>
        <p className="text-muted-foreground">Performances et consultations de vos œuvres certifiées.</p>
      </div>

      {/* ─── KPI GRID ─── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-none rounded-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Scans Totaux</CardTitle>
            <div className="p-2 bg-gray-50 rounded-md">
              <QrCode className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">156</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1 font-medium">
              <TrendingUp className="h-3 w-3 mr-1" /> +12 scans cette semaine
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none rounded-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Visiteurs Uniques</CardTitle>
            <div className="p-2 bg-gray-50 rounded-md">
              <Eye className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">98</div>
            <p className="text-xs text-muted-foreground mt-1">Personnes ayant scanné un certificat</p>
          </CardContent>
        </Card>

        <Card className="shadow-none rounded-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Localisation</CardTitle>
            <div className="p-2 bg-gray-50 rounded-md">
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Dakar</div>
            <p className="text-xs text-muted-foreground mt-1">42% de vos scans totaux</p>
          </CardContent>
        </Card>
      </div>

      {/* ─── LISTE DÉTAILLÉE ─── */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Détails par œuvre</h2>

        <div className="bg-white rounded-none border shadow-none divide-y">
          {fakeStats.map((stat) => (
            <div key={stat.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50 transition-colors">

              <div className="mb-4 sm:mb-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{stat.title}</p>
                  <Badge variant="secondary" className="bg-[#F3F4F6] text-[#6B7280] font-normal text-[10px] px-1.5 py-0">
                    {stat.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" /> Principalement scanné à : {stat.topLocation}
                </p>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-sm font-bold flex items-center justify-end gap-1.5">
                    {stat.uniqueVisitors} <Eye className="h-4 w-4 text-muted-foreground" />
                  </p>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Visiteurs</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold flex items-center justify-end gap-1.5">
                    {stat.totalScans} <QrCode className="h-4 w-4 text-muted-foreground" />
                  </p>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Scans</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  )
}