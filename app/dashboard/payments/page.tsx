"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, TrendingUp } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import PageTitle from "@/components/shared/page-title"

const transactions = [
  {
    id: 1,
    date: "15/01/2024",
    certificat: "CERT-2024-001-ABC",
    oeuvre: "Coucher de soleil sur la mer",
    montant: "10.00 EUR",
    statut: "Payé"
  },
  {
    id: 2,
    date: "10/01/2024",
    certificat: "CERT-2024-002-DEF",
    oeuvre: "Portrait abstrait #3",
    montant: "10.00 EUR",
    statut: "Payé"
  },
  {
    id: 3,
    date: "05/01/2024",
    certificat: "CERT-2024-003-GHI",
    oeuvre: "Nature morte aux fleurs",
    montant: "10.00 EUR",
    statut: "Payé"
  }
]

export default function PaymentsPage() {
  return (
    <div className="flex-1 space-y-8">

      {/* ─── HEADER ─── */}
      <PageTitle title="Paiements" description="Historique de vos paiements de certificats" />

      {/* ─── KPI GRID ─── */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-none rounded-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total dépense</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">30.00 EUR</div>
          </CardContent>
        </Card>

        <Card className="shadow-none rounded-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Certificats achetés</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>

      {/* ─── HISTORIQUE DES TRANSACTIONS ─── */}
      <Card className="shadow-none rounded-none border-border">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Historique des transactions</CardTitle>
          <CardDescription>Liste de tous vos achats de certificats</CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="rounded-none">
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-black">Date</TableHead>
                <TableHead className="font-semibold text-black">Certificat</TableHead>
                <TableHead className="font-semibold text-black">Oeuvre</TableHead>
                <TableHead className="font-semibold text-black">Montant</TableHead>
                <TableHead className="font-semibold text-black text-right">Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} className="border-b last:border-0">
                  <TableCell className="py-4">{transaction.date}</TableCell>
                  <TableCell className="py-4">{transaction.certificat}</TableCell>
                  <TableCell className="py-4">{transaction.oeuvre}</TableCell>
                  <TableCell className="py-4">{transaction.montant}</TableCell>
                  <TableCell className="py-4 text-right">
                    <Badge className="bg-[#1C1C1C] hover:bg-[#333] text-white font-medium rounded-md px-2.5 py-0.5">
                      {transaction.statut}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  )
}