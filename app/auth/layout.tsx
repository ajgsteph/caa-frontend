"use client";

import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-caa-primary h-16">
        <div className="container flex items-center h-full">
            <span onClick={() => router.push('/')} className="cursor-pointer"> ← Retour à l'accueil</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}