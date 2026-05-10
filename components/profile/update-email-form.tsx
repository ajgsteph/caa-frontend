"use client";

import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { updateEmailSchema, type UpdateEmailValues } from "@/lib/validations/profile.schema";
import { updateEmailAction } from "@/actions/profile.actions";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Mail, Lock } from "lucide-react";
import CustomButton from "../custom-ui/custom-button";

interface UpdateEmailFormProps {
    currentEmail: string;
}

export function UpdateEmailForm({ currentEmail }: UpdateEmailFormProps) {
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
    const [isPending, startTransition] = useTransition();

    const form = useForm<UpdateEmailValues>({
        resolver: standardSchemaResolver(updateEmailSchema),
        defaultValues: { email: currentEmail, current_password: "" },
    });

    const onSubmit = (values: UpdateEmailValues) => {
        setResult(null);
        startTransition(async () => {
            const res = await updateEmailAction(values);
            if (res.success) {
                setResult({ success: true, message: res.message ?? "Email mis à jour." });
                form.setValue("current_password", "");
            } else {
                setResult({ success: false, message: res.error });
                if (res.fieldErrors) {
                    Object.entries(res.fieldErrors).forEach(([field, messages]) => {
                        form.setError(field as keyof UpdateEmailValues, { message: messages[0] });
                    });
                }
            }
        });
    };

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

            <div className="space-y-1.5">
                <Label htmlFor="email" className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--ink)" }}>
                    <Mail className="h-3.5 w-3.5" style={{ color: "var(--terra)" }} />
                    Nouvel email
                </Label>
                <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    disabled={isPending}
                    {...form.register("email")}
                    className="rounded-none h-12"
                />
                {form.formState.errors.email && (
                    <p className="text-xs text-red-600">{form.formState.errors.email.message}</p>
                )}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="cp-email" className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--ink)" }}>
                    <Lock className="h-3.5 w-3.5" style={{ color: "var(--terra)" }} />
                    Mot de passe actuel
                </Label>
                <Input
                    id="cp-email"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Confirmer avec votre mot de passe"
                    disabled={isPending}
                    {...form.register("current_password")}
                    className="rounded-none h-12"
                />
                {form.formState.errors.current_password && (
                    <p className="text-xs text-red-600">{form.formState.errors.current_password.message}</p>
                )}
            </div>

            <CustomButton
                type="submit"
                disabled={isPending}
                className="w-fit font-medium transition-all bg-caa-terra text-white"
                text={isPending ? "Mise à jour…" : "Mettre à jour l'email"}
            />
        </form>
    );
}