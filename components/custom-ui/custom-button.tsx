import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  href?: string;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  hideTextBreakpoint?: "sm" | "md" | "lg" | "xl";
}

export default function CustomButton({
  text,
  href,
  className,
  icon,
  iconPosition = "left",
  hideTextBreakpoint,
  ...props
}: CustomButtonProps) {

  const hiddenClass =
    hideTextBreakpoint === "sm" ? "hidden sm:inline" :
      hideTextBreakpoint === "md" ? "hidden md:inline" :
        hideTextBreakpoint === "lg" ? "hidden lg:inline" :
          hideTextBreakpoint === "xl" ? "hidden xl:inline" : "";

  const baseClasses = "flex items-center justify-center gap-2 px-4 h-12 bg-transparent border border-cert-terra rounded-none text-gray-900 font-bold hover:bg-cert-terra hover:text-white shadow-none transition-colors";

  const content = (
    <>
      {icon && iconPosition === "left" && icon}
      {text && <span className={cn("truncate text-sm md:text-base", hiddenClass)}>{text}</span>}
      {icon && iconPosition === "right" && icon}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(baseClasses, className)}>
        {content}
      </Link>
    );
  }

  return (
    <Button className={cn(baseClasses, className)} {...props}>
      {content}
    </Button>
  );
}