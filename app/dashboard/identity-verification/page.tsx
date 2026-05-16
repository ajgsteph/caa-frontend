"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Shield, Upload, Eye } from "lucide-react"
import CustomButton from "@/components/custom-ui/custom-button"
import PageTitle from "@/components/shared/page-title"

export default function IdentityVerificationPage() {
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  return (
    <div className="flex-1 space-y-6 max-w-3xl">

      {/* ─── HEADER ─── */}
      <PageTitle title="Vérification d&apos;identité" description="Vérifiez votre identité pour créer des certificats d&apos;authenticité" />

      {/* ─── STATUT EN ATTENTE ─── */}
      <Card className="bg-[#FFF9EB] border-[#FDE68A] shadow-none rounded-none">
        <CardContent className="flex items-start gap-4 px-6 py-2">
          <Clock className="h-6 w-6 text-[#D97706] mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[#D97706]">Statut : En attente</h3>
              <Badge variant="secondary" className="bg-[#FDE68A]/50 text-[#D97706] hover:bg-[#FDE68A]/50 font-normal">
                En attente
              </Badge>
            </div>
            <p className="text-sm text-[#92400E]">
              Votre vérification d&apos;identité n&apos;a pas encore été soumise.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ─── POURQUOI VÉRIFIER ─── */}
      <Card className="shadow-none rounded-none">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Pourquoi vérifier votre identité ?
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-4">
          <p>
            La vérification d&apos;identité permet de garantir l&apos;authenticité de vos certificats et de protéger les acheteurs contre la fraude.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Renforce la confiance des acheteurs</li>
            <li>Protège contre l&apos;usurpation d&apos;identité</li>
            <li>Augmente la valeur de vos certificats</li>
            <li>Requis pour émettre des certificats</li>
          </ul>
        </CardContent>
      </Card>

      {/* ─── SOUMETTRE UN DOCUMENT ─── */}
      <Card className="shadow-none rounded-none">
        <CardHeader>
          <CardTitle className="text-base">Soumettre un document</CardTitle>
          <CardDescription>
            Téléchargez une pièce d&apos;identité valide (carte d&apos;identité, passeport ou permis de conduire)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="space-y-2">
            <label className="text-sm font-medium">Document d&apos;identité</label>

            <div
              className="border-2 border-dashed border-gray-200 rounded-none p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 text-muted-foreground mb-3" />
              {file ? (
                <p className="text-sm font-medium">{file.name}</p>
              ) : (
                <>
                  <p className="text-sm font-medium">Cliquez pour télécharger</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG ou PDF (max. 10MB)</p>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-none p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Eye className="h-4 w-4" />
              Votre document doit :
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 pl-6 list-none">
              <li className="relative before:content-['-'] before:absolute before:-left-3">Être lisible et non floue</li>
              <li className="relative before:content-['-'] before:absolute before:-left-3">Montrer votre photo et vos informations</li>
              <li className="relative before:content-['-'] before:absolute before:-left-3">Être en cours de validité</li>
              <li className="relative before:content-['-'] before:absolute before:-left-3">Ne pas être recadré ou modifié</li>
            </ul>
          </div>

          <CustomButton
            text="Soumettre pour vérification"
            onClick={() => {}}
            className="bg-cert-terra hover:bg-cert-terra/90 text-white"
            disabled={!file}
          />

        </CardContent>
      </Card>

    </div>
  )
}