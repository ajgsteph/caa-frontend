"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth.schema";
import { loginAction } from "@/actions/auth.actions";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import CustomButton from "../custom-ui/custom-button";

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormValues>({
    resolver: standardSchemaResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const onSubmit = (values: LoginFormValues) => {
    setServerError(null);
    startTransition(async () => {
      const result = await loginAction(values);
      if (!result.success) {
        setServerError(result.error);
      }
    });
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6">

        {/* Erreur globale serveur */}
        {serverError && (
          <div role="alert" className="rounded-lg bg-destructive/15 border border-destructive/30 px-4 py-3 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <div className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className={form.formState.errors.email ? "text-destructive" : ""}
            >
              Adresse email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              disabled={isPending}
              {...form.register("email")}
              aria-invalid={!!form.formState.errors.email}
              aria-describedby={form.formState.errors.email ? "email-error" : undefined}
              className={"rounded-none h-12" + (form.formState.errors.email ? "border-destructive focus-visible:ring-destructive" : "")}
              placeholder="vous@exemple.com"
            />
            {form.formState.errors.email && (
              <p id="email-error" className="text-[0.8rem] font-medium text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Mot de passe */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className={form.formState.errors.password ? "text-destructive" : ""}
            >
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              disabled={isPending}
              {...form.register("password")}
              aria-invalid={!!form.formState.errors.password}
              aria-describedby={form.formState.errors.password ? "password-error" : undefined}
              className={"rounded-none h-12" + (form.formState.errors.password ? "border-destructive focus-visible:ring-destructive" : "")}
              placeholder="••••••••"
            />
            {form.formState.errors.password && (
              <p id="password-error" className="text-[0.8rem] font-medium text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit */}
        <CustomButton
          text={isPending ? "Connexion en cours…" : "Se connecter"}
          disabled={isPending}
          className="w-full bg-caa-terra hover:bg-caa-terra-dark text-white"
          onClick={() => form.handleSubmit(onSubmit)()}
        />

        <p className="text-center text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link href="/auth/register" className="font-medium text-caa-terra hover:text-caa-terra-dark underline underline-offset-4">
            Créer un compte
          </Link>
        </p>
      </form>
    </div>
  );
}