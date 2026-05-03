export function Logo({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="0.5" />
            <g fill="currentColor">
                <circle cx="50" cy="6" r="1.2" />
                <circle cx="81" cy="19" r="1.2" />
                <circle cx="94" cy="50" r="1.2" />
                <circle cx="81" cy="81" r="1.2" />
                <circle cx="50" cy="94" r="1.2" />
                <circle cx="19" cy="81" r="1.2" />
                <circle cx="6" cy="50" r="1.2" />
                <circle cx="19" cy="19" r="1.2" />
            </g>
            <g stroke="currentColor" strokeWidth="0.8">
                <line x1="50" y1="10" x2="50" y2="14" />
                <line x1="50" y1="86" x2="50" y2="90" />
                <line x1="10" y1="50" x2="14" y2="50" />
                <line x1="86" y1="50" x2="90" y2="50" />
            </g>
            <text x="50" y="58" textAnchor="middle" className="font-serif italic font-medium text-2xl" fill="currentColor" letterSpacing="-1">Caa</text>
            <text x="50" y="75" textAnchor="middle" className="font-sans text-[5px] font-semibold" fill="currentColor" letterSpacing="3">CERTIFIÉ • AUTHENTIQUE</text>
        </svg>
    );
}