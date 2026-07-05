"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth.schema";
import { registerAction } from "@/actions/auth.actions";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomButton from "../custom-ui/custom-button";

type FieldName = keyof RegisterFormValues;

interface FormFieldConfig {
  name: FieldName;
  label: string;
  type: string;
  placeholder: string;
  autoComplete?: string;
  required?: boolean;
}

// 1. Définition des étapes et des champs associés
const STEPS = [
  {
    id: 1,
    title: "Identité",
    fields: ["last_name", "first_name", "artist_name"] as FieldName[],
  },
  {
    id: 2,
    title: "Contact",
    fields: ["email", "phone"] as FieldName[],
  },
  {
    id: 3,
    title: "Sécurité",
    fields: ["password", /*"password_confirmation"*/] as FieldName[],
  },
];

const ALL_FIELDS: FormFieldConfig[] = [
  { name: "last_name", label: "Nom", type: "text", placeholder: "Diop", autoComplete: "family-name", required: true },
  { name: "first_name", label: "Prénom", type: "text", placeholder: "Awa", autoComplete: "given-name", required: true },
  { name: "artist_name", label: "Nom d'artiste", type: "text", placeholder: "AWA-D", required: true },
  { name: "email", label: "Email", type: "email", placeholder: "awa@exemple.com", autoComplete: "email", required: true },
  { name: "phone", label: "Téléphone", type: "tel", placeholder: "+221770000000", autoComplete: "tel" },
  { name: "password", label: "Mot de passe", type: "password", placeholder: "••••••••", autoComplete: "new-password", required: true },
  // { name: "password_confirmation", label: "Confirmer le mot de passe", type: "password", placeholder: "••••••••", autoComplete: "new-password", required: true },
];

export function RegisterForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterFormValues>({
    resolver: standardSchemaResolver(registerSchema),
    defaultValues: {
      last_name: "", first_name: "", artist_name: "",
      email: "", password: "", /*password_confirmation: "",*/ phone: "",
    },
    mode: "onTouched",
  });

  const nextStep = async () => {
    const fieldsToValidate = STEPS[currentStep - 1].fields;
    const isStepValid = await form.trigger(fieldsToValidate);

    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = (values: RegisterFormValues) => {
    setServerError(null);
    setFieldErrors({});
    
    startTransition(async () => {
      const result = await registerAction(values);
      if (!result.success) {
        setServerError(result.error);
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      }
    });
  };

  const currentFieldsConfig = ALL_FIELDS.filter((field) => 
    STEPS[currentStep - 1].fields.includes(field.name)
  );

  return (
    <div className="w-full max-w-md mx-auto space-y-6 rounded-none">
      
      {/* Barre de progression */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-muted-foreground">Étape {currentStep} sur {STEPS.length}</span>
          {/* <span className="text-foreground">{STEPS[currentStep - 1].title}</span> */}
        </div>
        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-cert-terra transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6">

        {serverError && (
          <div role="alert" className="rounded-lg bg-destructive/15 border border-destructive/30 px-4 py-3 text-sm text-destructive">
            {serverError}
          </div>
        )}

        {/* Affichage des champs de l'étape en cours */}
        <div className="space-y-4 min-h-[220px]">
          {currentFieldsConfig.map(({ name, label, type, placeholder, autoComplete, required }) => {
            const rhfError = form.formState.errors[name]?.message;
            const serverFieldError = fieldErrors[name]?.[0];
            const error = rhfError ?? serverFieldError;
            const errorId = `${name}-error`;

            return (
              <div key={name} className="space-y-2">
                <Label htmlFor={name} className={error ? "text-destructive" : ""}>
                  {label}
                  {!required && <span className="ml-1 text-xs text-muted-foreground font-normal">(optionnel)</span>}
                </Label>
                
                <Input
                  id={name}
                  type={type}
                  autoComplete={autoComplete}
                  placeholder={placeholder}
                  disabled={isPending}
                  {...form.register(name)}
                  aria-invalid={!!error}
                  aria-describedby={error ? errorId : undefined}
                  className={"rounded-none h-12" + (error ? "border-destructive focus-visible:ring-destructive" : "")}
                />
                
                {error && (
                  <p id={errorId} className="text-[0.8rem] font-medium text-destructive">
                    {error}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation multi-étape */}
        <div className="flex flex-col md:flex-row gap-4 pt-2 justify-between">
          {currentStep > 1 && (
            <CustomButton 
              text="Précédent"
              onClick={prevStep}
              disabled={isPending}
              className="w-fit"
            />
          )}
          
          {currentStep < STEPS.length ? (
            <CustomButton 
              text="Suivant"
              onClick={nextStep}
              disabled={isPending}
              className={"bg-cert-terra hover:bg-cert-terra/80 text-white" + (currentStep === 1 ? " w-full" : " w-fit")}
            />
          ) : (
            <CustomButton 
              text={isPending ? "Création en cours…" : "Créer mon compte"}
              onClick={form.handleSubmit(onSubmit)}
              disabled={isPending}
              className="w-fit bg-cert-terra hover:bg-cert-terra/80 text-white"
            />
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <Link href="/auth/login" className="font-medium text-cert-terra hover:text-cert-terra/80 underline underline-offset-4">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  );
}