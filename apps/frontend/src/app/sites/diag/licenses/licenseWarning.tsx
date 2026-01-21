import { useState } from 'react';

type LicenseWarningProps = {
    id: string;
    title: string;
    expiry_date: string;
    days_left: number;
    periodicity: string; // "per Month" / "per Year"
    term: string;        // "Month" / "Year"
    isTrial: boolean;
    seats: number;
    autoRenew: boolean;
}

export default function LicenseWarning({ 
    id, title, expiry_date, days_left, periodicity, term, isTrial, seats, autoRenew 
}: LicenseWarningProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Mapping pour éviter la concaténation de classes Tailwind (problème de purge CSS)
    const statusConfig = {
        red: { bg: "bg-red-900/20", border: "border-red-500", text: "text-red-400" },
        orange: { bg: "bg-orange-900/20", border: "border-orange-500", text: "text-orange-400" },
        yellow: { bg: "bg-yellow-900/20", border: "border-yellow-500", text: "text-yellow-400" },
        green: { bg: "bg-green-900/20", border: "border-green-500", text: "text-green-400" },
    };

    let colorKey: keyof typeof statusConfig = "green";
    if (days_left <= 0) colorKey = "red";
    else if (days_left <= 7) colorKey = "orange";
    else if (days_left <= 30) colorKey = "yellow";

    const config = statusConfig[colorKey];

    return (
        <div className={`mb-4 overflow-hidden rounded-lg border-l-4 transition-all duration-300 ${config.bg} ${config.border}`}>
            {/* Header cliquable */}
            <button 
                className="flex w-full items-center justify-between p-4 text-left outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white">{title}</h3>
                        {isTrial && (
                            <span className="rounded bg-blue-500/30 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-300">
                                Essai
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-400">Expire le : {expiry_date}</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className={`text-right ${config.text}`}>
                        <span className="block text-lg font-bold leading-none">
                            {days_left <= 0 ? "Expiré" : `${days_left} j.`}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider opacity-80">
                            {days_left < 0 ? `Depuis ${-days_left} j.` :
                             days_left === 0 ? "Aujourd'hui" : "Restants"}
                        </span>
                    </div>
                    {/* Flèche SVG simple */}
                    <svg 
                        className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                        width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                        <path d="M6 9l6 6 6-6"/>
                    </svg>
                </div>
            </button>

            {/* Contenu dépliant avec animation de hauteur */}
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                <div className="border-t border-white/10 bg-black/20 p-4">
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 md:grid-cols-4">
                        
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-gray-500 font-semibold">Périodicité</span>
                            <span className="text-sm text-gray-200">{periodicity === "per Month" ? "Mensuel" : "Annuel"}</span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-gray-500 font-semibold">Engagement</span>
                            <span className="text-sm text-gray-200">{term === "per Month" ? "1 Mois" : "1 An"}</span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-gray-500 font-semibold">Sièges</span>
                            <span className="text-sm text-gray-200">{seats} utilisateur(s)</span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-gray-500 font-semibold">Auto-renouvellement</span>
                            <span className={`text-sm font-medium ${autoRenew ? "text-green-400" : "text-red-400"}`}>
                                {autoRenew ? "Activé" : "Désactivé"}
                            </span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}