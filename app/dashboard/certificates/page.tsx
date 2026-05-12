import { CertificateList } from "@/components/certificates/certificate-list";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mes certificats — CAA" };

export default function CertificatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Mes certificats
        </h1>
        <p className="text-sm mt-1">
          Suivez l'état de vos certificats d'authenticité émis.
        </p>
      </div>

      <CertificateList />
    </div>
  );
}