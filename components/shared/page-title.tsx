interface PageTitleProps {
    title: string;
    description?: string;
}

export default function PageTitle({ title, description }: PageTitleProps) {
    return (
        <div className="">
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">{title}</h1>
            {description && <p className="text-sm md:text-base text-muted-foreground">{description}</p>}
        </div>
    )
}
