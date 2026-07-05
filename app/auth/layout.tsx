"use client";

import { useRouter } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import CustomButton from "@/components/custom-ui/custom-button";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <header className="flex items-center justify-between mx-auto w-full border-b border-gray-400 h-16 px-4">
        <div onClick={() => router.push('/')} className="flex items-center h-full cursor-pointer w-1/2">
          <Logo />
          {/* <span onClick={() => router.push('/')} className="cursor-pointer"> ← Retour à l'accueil</span> */}
        </div>
        <div className="flex justify-end w-1/2">
          {
            pathname !== '/auth/login' ?

              <CustomButton
                href="/auth/login"
                text="Se connecter"
                className=" w-fit"
              />
              :
              <CustomButton
                href="/auth/register"
                text="S'inscrire"
                className=" w-fit"
              />
          }
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}