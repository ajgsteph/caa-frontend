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

  const buttonContent = (
    <Button
      className={cn(
        "flex items-center gap-2 px-5 py-6 h-10 bg-transparent border border-cert-terra rounded-none text-gray-900 font-bold hover:bg-cert-terra hover:text-white shadow-none transition-colors",
        className
      )}
      {...props}
    >
      {icon && iconPosition === "left" && icon}
      <span className={hiddenClass}>{text}</span>
      {icon && iconPosition === "right" && icon}
    </Button>
  );

  return href ? <Link href={href}>{buttonContent}</Link> : buttonContent;
}
