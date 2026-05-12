import { ArtworkList } from "@/components/artworks/artwork-list";
import { PlusCircle } from "lucide-react";
import type { Metadata } from "next";
import CustomButton from "@/components/custom-ui/custom-button";

export const metadata: Metadata = { title: "Mes œuvres — Certifa" };

export default function MyWorksPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Mes œuvres
          </h1>
          <p className="text-sm mt-1">
            Gérez et certifiez vos créations artistiques.
          </p>
        </div>
        <CustomButton
          text="Nouvelle œuvre"
          icon={<PlusCircle className="h-4 w-4 mr-2" />}
          href="/dashboard/my-works/new"
          className="bg-cert-terra text-white hover:bg-cert-terra/90"
        />
      </div>

      {/* Liste */}
      <ArtworkList />
    </div>
  );
}