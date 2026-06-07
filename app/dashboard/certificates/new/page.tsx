import { CreateCertificateForm } from "@/components/certificates/create-certificate-form";
import PageTitle from "@/components/shared/page-title";

export default function NewCertificatePage() {
    return (
        <div className="max-w-4xl space-y-6">
            <PageTitle
                title="Générer un certificat"
                description="Créez un certificat d'authenticité inviolable et initiez le paiement."
            />
            <CreateCertificateForm />
        </div>
    );
}