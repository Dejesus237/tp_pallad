"use client";

import { useState, useRef, useEffect, ComponentClass } from "react";
import { DnsRecordsCheckService } from "@/api";
import IconCheckmark from "../../../../components/icon-checkmark";
import IconWarning from "../../../../components/icon-warning";
import IconShield from "../../../../components/icon-shield";
import { ComponentType } from "react";

enum Warnings {
    DOMAIN_NOT_FOUND = 1,
    RECORD_NOT_FOUND = 2,
    MULTIPLE_RECORDS_FOUND = 3,
    DUPLICATE_RECORD_TERMS = 4,
    RECORD_SYNTAX_ERROR = 5,
    INVALID_DOMAIN = 7,
    LOOKUPS_LIMIT = 8,
}

type ColoredMsg = {
    status: Status;
    message: string;
}

type SpfResult = {
    warnings: Array<number>;
    v: string;
    all: string;
    raw: string;
}
type DmarcResult = {
    warnings: Array<number>;
    v: string;
    p: string;
    sp: string;
    raw: string;
}
type DkimSingleResult = {
    warnings: Array<number>;
    selector: string;
    v: string;
    k: string;
    p: string;
    raw: string;
}
type DkimResults = {
    warnings: Array<number>;
    results: Array<DkimSingleResult>;
}

type DnsResult = {
    warnings: Array<number>;
    spf: SpfResult;
    dmarc: DmarcResult;
    dkim: DkimResults;
    spf_lookup_count: number;
};


const StatusColors = {
    ok: {
        color: "green",
        css: "border-green-700 bg-green-800/20",
        cssText: "text-green-400"

    },
    warning: {
        color: "yellow",
        css: "border-yellow-700 bg-yellow-800/20",
        cssText: "text-yellow-400"

    },
    danger: {
        color: "red",
        css: "border-red-700 bg-red-800/20",
        cssText: "text-red-400"

    }
} as const;

type Status = keyof typeof StatusColors; // "ok" | "warning" | "danger"



// Composant Accordéon Natif avec comportement indépendant
const Accordion = ({ label, status, children }: { 
    label: string;
    status: Status;
    children: React.ReactNode 
}) => {

    const icons: Record<string, React.ComponentType<{ colorCss: string }>> = {
        ok: IconCheckmark,
        warning: IconWarning,
        danger: IconShield,
    };

const Icon = icons[status];

    return (
        <details className={`group border rounded-lg transition-all ${StatusColors[status].css}`}>
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none outline-none">
                <div className={`flex flex-row gap-2 ${StatusColors[status].cssText}`}>
                    <span className="text-xl font-bold uppercase mb-1 opacity-90">{label}</span>
                    <Icon colorCss={StatusColors[status].cssText} />
                </div>
                <div className="text-white transition-transform duration-200 group-open:rotate-180">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </summary>
            <div className="px-4 pb-4 text-gray-300 text-sm border-t border-white/10 pt-3">
                {children}
            </div>
        </details>
    );
};

export default function DnsCheckPage() {
    const [domainName, setDomainName] = useState("");
    const [results, setResults] = useState<DnsResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const resultsRef = useRef<HTMLDivElement>(null);

    const validateDomain = (domain: string) =>
        /^(?!-)[a-zA-Z0-9-]{1,63}(?<!-)\.[a-zA-Z]{2,63}$/.test(domain);

    useEffect(() => {
        if (results && resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [results]);

    const handleSubmit = async () => {
        setError("");
        setResults(null);
        const cleanDomain = domainName.trim();

        if (!validateDomain(cleanDomain)) {
            setError("Format de domaine invalide (ex: google.com).");
            return;
        }

        setLoading(true);
        try {
            const response = await DnsRecordsCheckService.dnscheckSubmitCreate({ domain: cleanDomain });
            setResults(response as DnsResult);
        } catch (err) {
            setError("Impossible de récupérer les données DNS.");
        } finally {
            setLoading(false);
        }
    };

    const findGenericWarnings = (rs:SpfResult|DmarcResult|DkimResults|DkimSingleResult): ColoredMsg[] => {
        let msg: ColoredMsg[] = [];

        if (rs.warnings.includes(Warnings.RECORD_NOT_FOUND)) msg.push(
            {status: "danger", message:"Enregistrement DNS introuvable."});
        if (rs.warnings.includes(Warnings.MULTIPLE_RECORDS_FOUND)) msg.push(
            {status: "danger", message:"Plusieurs enregistrements DNS trouvés."});
        if (rs.warnings.includes(Warnings.DUPLICATE_RECORD_TERMS)) msg.push(
            {status: "warning", message:"Plusieurs arguments identiques sont présents."});
        if (rs.warnings.includes(Warnings.RECORD_SYNTAX_ERROR)) msg.push(
            {status: "warning", message:"Erreur de syntaxe detectée."});

        return msg;
    }


    // Détermination des couleurs

    const getSpfWarnings = (): ColoredMsg[] => {
        let msg: ColoredMsg[] = [];
        if (results) {
            msg = msg.concat(findGenericWarnings(results.spf));
            
            if (results.warnings.includes(Warnings.DOMAIN_NOT_FOUND)) msg.push(
                {status: "danger", message:"Domaine introuvable."});
            if (results.warnings.includes(Warnings.LOOKUPS_LIMIT)) msg.push(
                {status: "danger", message:"Il y a plus de 10 règles lookup."});
            if (results.spf.all === "~") msg.push(
                {status: "warning", message:"Le paramètre all est peu sécurisé, des mails frauduleux peuvent être envoyés (~)."});
            if (results.spf.all === "?" || results.spf.all === "+") msg.push(
                {status: "danger", message:"Le paramètre all est dangereux, n'importe qui peut envoyer des mails avec votre nom de domaine (?/+)."});
        }
        return msg;
    };

    const getDmarcWarnings = (): ColoredMsg[] => {
        let msg: ColoredMsg[] = [];
        if (results) {
            msg = msg.concat(findGenericWarnings(results.dmarc));
            
            if (results.dmarc.p === "none") msg.push(
                {status: "danger", message:"Aucune action n'est prise contre les mails frauduleux (p=none)."});
            if (results.dmarc.p === "quarantine") msg.push(
                {status: "warning", message:"Les mails frauduleux seront envoyés en spam (p=quarantine)."});
            if (results.dmarc.sp === "none") msg.push(
                {status: "danger", message:"Aucune action n'est prise contre les mails frauduleux dans les sous-domaines (sp=none)."});
            if (results.dmarc.sp === "quarantine") msg.push(
                {status: "warning", message:"Les mails frauduleux provenant des sous-domaines seront envoyés en spam (sp=quarantine)."});
        }
        return msg;
    };

    const getDkimWarnings = (dkim:DkimSingleResult|DkimResults): ColoredMsg[] => {
        let msg: ColoredMsg[] = [];
        if (results) {
            msg = msg.concat(findGenericWarnings(dkim));
            if ("results" in dkim) {
                if (dkim.results.length == 0) msg.push({status: "danger", message:"Aucun sélécteur trouvé."})
            }
        }
        return msg;
    };

    const getWorstColor = (msgList: ColoredMsg[]): Status => {
        let worst: Status = "ok";
        msgList.forEach((msg: ColoredMsg) => {
            if (worst == "ok") {
                if (msg.status == "warning") worst = "warning";
                if (msg.status == "danger") worst = "danger";
            }
            else if (worst == "warning") {
                if (msg.status == "danger") worst = "danger";
            }
        });
        return worst;
    };

    const worstOfThreeColors = (color1: Status, color2: Status, color3: Status): Status => {
        if (color1 === "danger" || color2 === "danger" || color3 === "danger")
            return "danger";
        if (color1 === "warning" || color2 === "warning" || color3 === "warning")
            return "warning";
        return "ok";
    }

    const spfWarns: ColoredMsg[] = getSpfWarnings();
    const dmarcWarns: ColoredMsg[] = getDmarcWarnings();
    const dkimWarns: ColoredMsg[] = results ? getDkimWarnings(results.dkim) : [];
    // TODO cette variable ne contient que les warnings pour le conteneur des dkim, il faut faire une variable qui contient les warnings accumulés des dkim

    const spfWorst: Status = getWorstColor(spfWarns);
    const dmarcWorst: Status = getWorstColor(dmarcWarns);
    const dkimWorst: Status = getWorstColor(dkimWarns);

    const worstOfAll = worstOfThreeColors(spfWorst, dmarcWorst, dkimWorst);

    const dkimWorstEntryColor = results ?
        results.dkim.results.reduce((worst: Status, dkim): Status => {
            const wrn = getDkimWarnings(dkim);
            const clr = getWorstColor(wrn);
            
            if (worst === "danger" || clr === "danger") return "danger";
            if (worst === "warning" || clr === "warning") return "warning";
            return "ok";
        }, "ok")
    : "ok";


    return (
        <div className="min-h-screen text-white p-6 font-sans">
            <div className="max-w-6xl mx-auto space-y-16">
                
                {/* Formulaire */}
                <section className="max-w-md mx-auto bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl mt-10">
                    <h1 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Analyseur DNS
                    </h1>
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={domainName}
                            onChange={(e) => setDomainName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                            placeholder="Entrez un domaine..."
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white"
                        />
                        {error && <p className="text-red-400 text-sm pl-1">{error}</p>}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all disabled:opacity-50 active:scale-95"
                        >
                            {loading ? "Analyse en cours..." : "Vérifier"}
                        </button>
                    </div>
                </section>

                {/* Résultats */}
                {results && (
                    <div ref={resultsRef} className="pt-10 border-t border-gray-800 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <h2 className="text-3xl font-bold mb-10 text-center text-gray-200">
                            Rapport d'analyse : <span className="text-blue-400 font-mono">{domainName}</span>
                        </h2>

                        {/* Message Global */}
                        <div className="flex flex-col w-full mb-10 items-center text-center">
                            <p className="text-lg w-[70%]">
                                { results.warnings.includes(Warnings.DOMAIN_NOT_FOUND) ? (
                                    "Domaine introuvable."
                                ) : worstOfAll === "danger" ? (
                                    <span className="text-red-600">
                                        Attention ! Votre domaine est à risque d'arnaques et de spam.
                                    </span>

                                ) : worstOfAll === "warning" ? (
                                    <span className="text-yellow-600">
                                        Votre domaine contient des configurations non optimales.
                                    </span>
                                ) : (
                                    <span className="text-green-600">
                                        Tout semble bon !
                                    </span>
                                )}
                            </p>
                        </div>
                        

                        {  !results.warnings.includes(Warnings.DOMAIN_NOT_FOUND) &&
                        

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                            
                            {/* BLOC SPF */}
                            <Accordion 
                                label="SPF"
                                status={spfWorst}
                            >

                                {/* Avertissements */}
                                { spfWarns.length > 0 && (
                                    <>
                                        { spfWarns.map((wrn: ColoredMsg) => {
                                            return (
                                                <div key={wrn.message} className={`p-3 rounded-lg border ${StatusColors[wrn.status].css}`}>
                                                    <p className={`${StatusColors[wrn.status].cssText} font-bold`}>
                                                        { wrn.message }
                                                    </p>
                                                </div>

                                            )
                                        })}
                                    </>
                                )}

                                {/* Bloc de code */}
                                <p className="font-mono text-md break-all bg-black/60 p-2 rounded-md mb-4">
                                    { results.spf.raw }
                                </p>

                                {/* Explication */}
                                <p>Le mécanisme <strong>{results.spf.all}</strong> définit la rigueur avec laquelle les serveurs de réception doivent traiter les emails non authentifiés.</p>
                                <ul className="mt-2 list-disc list-inside opacity-80">
                                    <li>- : Fail (Strict)</li>
                                    <li>~ : SoftFail (Flexible)</li>
                                    <li>? : Neutral</li>
                                    <li>+ : AllowAll</li>
                                </ul>

                                {/* Quantité de lookups */}
                                <div className="p-3 my-3 bg-white/5 rounded-lg border border-white/10">
                                    <p className="text-xs uppercase font-bold text-gray-400 mb-1">Quantité de lookups</p>
                                    <p className="text-white font-mono text-lg">
                                        {`${results.spf_lookup_count} / 10` || "Non défini"}
                                    </p>
                                </div>


                            </Accordion>

                            {/* BLOC DMARC */}
                            <Accordion 
                                label="DMARC"
                                status={dmarcWorst}
                            >
                                <div className="space-y-4">

                                    {/* Avertissements */}
                                    { dmarcWarns.length > 0 && (
                                        <>
                                            { dmarcWarns.map((wrn: ColoredMsg) => {
                                                return (
                                                    <div key={wrn.message} className={`p-3 rounded-lg border ${StatusColors[wrn.status].css}`}>
                                                        <p className={`${StatusColors[wrn.status].cssText} font-bold`}>
                                                            { wrn.message }
                                                        </p>
                                                    </div>

                                                )
                                            })}
                                        </>
                                    )}

                                    {/* Bloc de code */}
                                    <p className="font-mono text-md break-all  bg-black/60 p-2 rounded-md mb-4">
                                        { results.dmarc.raw }
                                    </p>

                                    {/* Explication */}
                                    <p>Le mécanisme <strong>{results.dmarc.p}</strong> définit l'action à prendre lorsqu'un email non authentifié est détecté.</p>
                                    <ul className="mt-2 list-disc list-inside opacity-80">
                                        <li>reject : Suppression</li>
                                        <li>quarantine : Envoi en spam</li>
                                        <li>none : Envoi normal</li>
                                    </ul>

                                    {/* Règle P (Domaine Principal) */}
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                        <p className="text-xs uppercase font-bold text-gray-400 mb-1">Domaine Principal (P)</p>
                                        <p className="text-white font-mono">{results.dmarc.p || "Non défini"}</p>
                                    </div>

                                    {/* Règle SP (Sous-Domaines) */}
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                        <p className="text-xs uppercase font-bold text-gray-400 mb-1">Sous-domaines (SP)</p>
                                        <p className="text-white font-mono">{results.dmarc.sp || `Hérité (${results.dmarc.p})`}</p>
                                    </div>

                                </div>

                            </Accordion>

                            {/* BLOC DKIM */}
                            <Accordion 
                                label="DKIM"
                                status={dkimWorstEntryColor}
                            >
                                <div className="space-y-3">

                                    {/* Avertissements */}
                                    { dkimWarns.length > 0 && (
                                        <>
                                            { dkimWarns.map((wrn: ColoredMsg) => {
                                                return (
                                                    <div key={wrn.message} className={`p-3 rounded-lg border ${StatusColors[wrn.status].css}`}>
                                                        <p className={`${StatusColors[wrn.status].cssText} font-bold`}>
                                                            { wrn.message }
                                                        </p>
                                                    </div>

                                                )
                                            })}
                                        </>
                                    )}

                                    {/* Aucun sélécteur detecté */}
                                    { results.dkim.results.length == 0 && (
                                        <p className="mb-4">
                                            Nous n'avons détecté aucun sélécteur DKIM. Il se peut qu'ils existent bien mais ne figurent pas dans notre liste interne.
                                        </p>
                                    )}

                                    {/* Tout est bon */}
                                    { results.dkim.results.length >= 1 && (
                                        <>
                                            {`${ results.dkim.results.length } Sélecteur(s)`}
                                            <p className="mb-4">Détails des signatures numériques détectées :</p>
                                            { results.dkim.results.map((dkim) => {
                                                const wrn = getDkimWarnings(dkim);
                                                const clr = getWorstColor(wrn);
                                                return (
                                                    <div key={dkim.selector} className={`p-3 rounded-lg border ${StatusColors[clr].css}`}>
                                                        
                                                        {/* Avertissements */}
                                                        { wrn.length > 0 && (
                                                            <>
                                                                { wrn.map((w: ColoredMsg) => {
                                                                    return (
                                                                        <div key={w.message} className={`p-3 mb-3 rounded-lg border ${StatusColors[w.status].css}`}>
                                                                            <p className={`${StatusColors[w.status].cssText} font-bold`}>
                                                                                { w.message }
                                                                            </p>
                                                                        </div>

                                                                    )
                                                                })}
                                                            </>
                                                        )}

                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-mono font-bold text-white">{dkim.selector}</span>
                                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${StatusColors[clr].css} text-white`}>
                                                                {clr == "ok" ? "OK" : "Erreur"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    )}

                                </div>
                            </Accordion>

                        </div>
                        
                        }

                    </div>
                )}
            </div>
        </div>
    );
}