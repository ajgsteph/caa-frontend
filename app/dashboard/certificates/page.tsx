import { CertificateList } from "@/components/certificates/certificate-list";
import type { Metadata } from "next";
import PageTitle from "@/components/shared/page-title";
import CustomButton from "@/components/custom-ui/custom-button";
import { PlusCircle } from "lucide-react";

export const metadata: Metadata = { title: "Mes certificats — CAA" };

export default function CertificatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title="Mes certificats" description="Suivez l'état de vos certificats d'authenticité émis." />
        <CustomButton
          text="Nouveau certificat"
          icon={<PlusCircle className="h-4 w-4 mr-2" />}
          href="/dashboard/certificates/new"
          className="bg-cert-terra text-white hover:bg-cert-terra/90"
        />
      </div>

      <CertificateList />
    </div>
  );
}