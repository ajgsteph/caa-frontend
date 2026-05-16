import { CertificateList } from "@/components/certificates/certificate-list";
import type { Metadata } from "next";
import PageTitle from "@/components/shared/page-title";

export const metadata: Metadata = { title: "Mes certificats — CAA" };

export default function CertificatesPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Mes certificats" description="Suivez l'état de vos certificats d'authenticité émis." />

      <CertificateList />
    </div>
  );
}