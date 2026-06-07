import Image from "next/image";

export function Logo({ className = "w-auto h-10 object-cover" }: { className?: string }) {
    return (
        <Image src="/images/logo-certifa-marron.png" alt="Logo" className={className} width={150} height={40} />
    );
}