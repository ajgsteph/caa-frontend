// fallow-ignore-file unused-file
// Composant réservé : select personnalisé, prévu pour une future intégration.
import React from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


export interface CustomSelectProps {
    triggerClassName?: string;
    contentClassName?: string;
    groupClassName?: string;
    placeholder?: string;

    options: { value: string; label: React.ReactNode }[];
}

export default function CustomSelect({
    triggerClassName = "w-[47%] md:w-[200px] border-tikeo-primary rounded-xl bg-[#F9B11814] outline-none uppercase font-bold shadow-none focus:ring-0 data-[placeholder]:text-gray-900",
    contentClassName = "border-tikeo-primary bg-background rounded-xl",
    groupClassName = "uppercase",
    placeholder = "Catégories",
    options,
}: CustomSelectProps) {
    return (
        <Select>
            <SelectTrigger className={triggerClassName}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className={contentClassName}>
                <SelectGroup className={groupClassName}>
                    {options.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                            className="focus:bg-tikeo-primary focus:rounded-xl"
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
