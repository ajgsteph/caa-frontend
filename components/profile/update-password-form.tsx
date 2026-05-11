"use client";

import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { updatePasswordSchema, type UpdatePasswordValues } from "@/lib/validations/profile.schema";
import { updatePasswordAction } from "@/actions/profile.actions";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Lock } from "lucide-react";
import CustomButton from "../custom-ui/custom-button";

export function UpdatePasswordForm() {
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
    const [isPending, startTransition] = useTransition();

    const form = useForm<UpdatePasswordValues>({
        resolver: standardSchemaResolver(updatePasswordSchema),
        defaultValues: { current_password: "", password: "", password_confirmation: "" },
    });

    const onSubmit = (values: UpdatePasswordValues) => {
        setResult(null);
        startTransition(async () => {
            const res = await updatePasswordAction(values);
            if (res.success) {
                setResult({ success: true, message: res.message ?? "Mot de passe mis à jour." });
                form.reset();
            } else {
                setResult({ success: false, message: res.error });
                if (res.fieldErrors) {
                    Object.entries(res.fieldErrors).forEach(([field, messages]) => {
                        form.setError(field as keyof UpdatePasswordValues, { message: messages[0] });
                    });
                }
            }
        });
    };

    const fields = [
        { name: "current_password" as const, label: "Mot de passe actuel", placeholder: "••••••••", autoComplete: "current-password" },
        { name: "password" as const, label: "Nouveau mot de passe", placeholder: "••••••••", autoComplete: "new-password" },
        { name: "password_confirmation" as const, label: "Confirmer le nouveau", placeholder: "••••••••", autoComplete: "new-password" },
    ];

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {result && (
                <div className={`flex items-start gap-2.5 rounded-lg px-4 py-3 text-sm border ${result.success
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-red-50 border-red-200 text-red-700"
                    }`}>
                    {result.success
                        ? <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        : <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                    {result.message}
                </div>
            )}

            {fields.map(({ name, label, placeholder, autoComplete }) => (
                <div key={name} className="space-y-1.5">
                    <Label htmlFor={name} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--ink)" }}>
                        <Lock className="h-3.5 w-3.5" style={{ color: "var(--terra)" }} />
                        {label}
                    </Label>
                    <Input
                        id={name}
                        type="password"
                        autoComplete={autoComplete}
                        placeholder={placeholder}
                        disabled={isPending}
                        {...form.register(name)}
                        className="rounded-none h-12"
                    />
                    {form.formState.errors[name] && (
                        <p className="text-xs text-red-600">{form.formState.errors[name]?.message}</p>
                    )}
                </div>
            ))}


            <CustomButton
                type="submit"
                disabled={isPending}
                className="w-fit font-medium transition-all bg-cert-terra text-white"
                text={isPending ? "Mise à jour…" : "Changer le mot de passe"}
            />


        </form>
    );
}