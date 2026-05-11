"use client";

import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { updatePhoneSchema, type UpdatePhoneValues } from "@/lib/validations/profile.schema";
import { updatePhoneAction } from "@/actions/profile.actions";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Phone } from "lucide-react";
import CustomButton from "../custom-ui/custom-button";

interface UpdatePhoneFormProps {
    currentPhone: string | null;
}

export function UpdatePhoneForm({ currentPhone }: UpdatePhoneFormProps) {
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
    const [isPending, startTransition] = useTransition();

    const form = useForm<UpdatePhoneValues>({
        resolver: standardSchemaResolver(updatePhoneSchema),
        defaultValues: { phone: currentPhone ?? "" },
    });

    const onSubmit = (values: UpdatePhoneValues) => {
        setResult(null);
        startTransition(async () => {
            const res = await updatePhoneAction(values);
            if (res.success) {
                setResult({ success: true, message: res.message ?? "Téléphone mis à jour." });
            } else {
                setResult({ success: false, message: res.error });
                if (res.fieldErrors) {
                    Object.entries(res.fieldErrors).forEach(([field, messages]) => {
                        form.setError(field as keyof UpdatePhoneValues, { message: messages[0] });
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
                <Label htmlFor="phone" className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--ink)" }}>
                    <Phone className="h-3.5 w-3.5" style={{ color: "var(--terra)" }} />
                    Numéro de téléphone
                </Label>
                <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+22901020304"
                    disabled={isPending}
                    {...form.register("phone")}
                    className="rounded-none h-12"
                />
                {form.formState.errors.phone && (
                    <p className="text-xs text-red-600">{form.formState.errors.phone.message}</p>
                )}
                <p className="text-xs">
                    Format international recommandé : +229 01 02 03 04
                </p>
            </div>

            <CustomButton
                type="submit"
                disabled={isPending}
                className="w-fit font-medium transition-all bg-cert-terra text-white"
                text={isPending ? "Mise à jour…" : "Mettre à jour le téléphone"}
            />
        </form>
    );
}