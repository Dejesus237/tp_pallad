"use client";

import QcmQuestion from './qcm-question';

import { useState, useRef } from 'react';

export default function CyberAuditForm() {
    const [activeTab, setActiveTab] = useState(1);
    const [score, setScore] = useState<number | null>(null);
    // Référence pour le scroll automatique vers les résultats
    const resultRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        companyName: '',
        industry: '',
        q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '', q9: '', q10: '',
        q11: '', q12: '', q13: '', q14: '', q15: '', q16: '', q17: '', q18: '', q19: '',
        q20: '', q21: '', q22: '',
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        // 1. Validation : Vérifier que les 22 questions ont une réponse
        // On génère la liste des clés q1 à q22
        const questionKeys = Array.from({ length: 22 }, (_, i) => `q${i + 1}`);
        const missingAnswers = questionKeys.filter(key => formData[key as keyof typeof formData] === '');

        if (missingAnswers.length > 0) {
            alert(`Attention : Il reste ${missingAnswers.length} question(s) sans réponse. Veuillez compléter l'audit.`);
            return;
        }

        // 2. Calcul du score
        let totalScore = 0;
        // Mapping des points : a=0, b=1, c=2, d=3
        const pointsMap: { [key: string]: number } = { 'a': 0, 'b': 1, 'c': 2, 'd': 3 };

        questionKeys.forEach((key) => {
            const answer = formData[key as keyof typeof formData];
            // On ajoute les points correspondants (0 si valeur inconnue, ce qui ne devrait pas arriver avec la validation)
            totalScore += pointsMap[answer] || 0;
        });

        console.log("--- Données du formulaire soumises ---");
        console.log("Score calculé : ", totalScore, "/ 66");
        
        // Mise à jour de l'état du score
        setScore(totalScore);

        // 3. Scroll automatique vers la section de résultat
        // Le setTimeout permet de laisser le temps à React de faire le rendu de la div resultRef
        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };

    const nextTab = () => {
        window.scrollTo(0, 0);
        setActiveTab((prev) => Math.min(prev + 1, 3));
    }
    const prevTab = () => {
        window.scrollTo(0, 0);
        setActiveTab((prev) => Math.max(prev - 1, 1));
    }

    // Fonction utilitaire pour déterminer la couleur et le message du résultat
    const getResultFeedback = (score: number) => {
        const maxScore = 66;
        const percentage = (score / maxScore) * 100;

        if (percentage < 40) {
            return {
                color: 'text-red-500',
                borderColor: 'border-red-500',
                bgColor: 'bg-red-500',
                title: 'Maturité Faible',
                msg: "Votre organisation est vulnérable. Des actions immédiates et structurelles sont nécessaires pour garantir un niveau de sécurité minimal."
            };
        } else if (percentage < 75) {
            return {
                color: 'text-orange-400',
                borderColor: 'border-orange-400',
                bgColor: 'bg-orange-400',
                title: 'Maturité Moyenne',
                msg: "De bonnes bases sont présentes, mais des lacunes critiques subsistent. Il faut consolider les processus et l'infrastructure."
            };
        } else {
            return {
                color: 'text-green-400',
                borderColor: 'border-green-400',
                bgColor: 'bg-green-400',
                title: 'Maturité Élevée',
                msg: "Félicitations, votre posture de cybersécurité est robuste. Continuez la veille et les tests réguliers pour maintenir ce niveau."
            };
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto backdrop-blur rounded-xl shadow-2xl overflow-hidden my-10 relative">

            {/* En-tête du Quiz */}
            <div className="bg-slate-900 p-6 text-white">
                <h1 className="text-2xl font-bold">Audit de Maturité Cybernétique</h1>
                <p className="text-slate-400 text-sm mt-1">Évaluez la posture de sécurité de votre organisation.</p>
            </div>

            {/* Navigation des onglets */}
            <div className="flex border-b border-slate-500 bg-slate-800">
                {[1, 2, 3].map((tabIndex) => (
                    <button
                        key={tabIndex}
                        onClick={() => setActiveTab(tabIndex)}
                        className={`p-4 flex-1 py-4 text-sm font-medium transition-colors duration-200 hover:cursor-pointer
              ${activeTab === tabIndex
                                ? 'border-b-2 border-blue-600 text-blue-400 bg-blue-700/20'
                                : 'text-slate-300 hover:text-slate-200 hover:bg-slate-500/20'
                            }`}
                    >
                        {tabIndex === 1 && "1. Gouvernance & Normes"}
                        {tabIndex === 2 && "2. Infrastructure & Technique"}
                        {tabIndex === 3 && "3. Humain & Procédures"}
                    </button>
                ))}
            </div>

            {/* Contenu du Formulaire */}
            <form onSubmit={handleSubmit} className="p-8 min-h-[400px] bg-slate-800/50">

                {/* ONGLET 1 : Infos & Normes */}
                {activeTab === 1 && (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-xl font-semibold text-slate-300 mb-4">Informations Entreprise & Conformité</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Nom de l'entreprise</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-slate-600 text-slate-300 bg-slate-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    placeholder="Ex: Ma Société SAS"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Secteur d'activité</label>
                                <select
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-slate-600 text-slate-200 bg-slate-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                >
                                    <option value="" className="text-slate-400">Sélectionner...</option>
                                    <option value="tech">Technologie / SaaS</option>
                                    <option value="health">Santé</option>
                                    <option value="finance">Finance / Assurance</option>
                                    <option value="retail">Commerce / Retail</option>
                                    <option value="industry">Industrie</option>
                                </select>
                            </div>
                        </div>

                        <QcmQuestion id="1" formData={formData.q1} changeFunction={handleChange}
                            question="Quelle place occupe la cybersécurité dans la stratégie globale de l'entreprise ?"
                            answerA="Elle n'est pas considérée comme un sujet stratégique."
                            answerB="Elle est abordée uniquement en cas d'incident ou de demande client."
                            answerC="Elle fait l'objet de discussions régulières au niveau de la direction."
                            answerD="Elle est intégrée dès la conception des projets (Security by Design) et dispose d'un budget dédié."
                        />

                        <QcmQuestion id="2" formData={formData.q2} changeFunction={handleChange}
                            question="Disposez-vous d'une Politique de Sécurité des Systèmes d'Information (PSSI) écrite ?"
                            answerA="Non, aucune politique n'est formalisée."
                            answerB="Il existe quelques règles orales ou notes éparses."
                            answerC="Une charte informatique existe et est signée par les employés."
                            answerD="Une PSSI complète est rédigée, mise à jour régulièrement et communiquée."
                        />

                        <QcmQuestion id="3" formData={formData.q3} changeFunction={handleChange}
                            question="Comment gérez-vous la conformité réglementaire (RGPD, NIS2, etc.) ?"
                            answerA="Nous ne savons pas si nous sommes concernés."
                            answerB="Nous traitons le sujet uniquement sous l'angle administratif."
                            answerC="Nous avons identifié nos obligations et commencé la mise en conformité."
                            answerD="Un DPO pilote le sujet et des audits de conformité sont réalisés."
                        />

                        <QcmQuestion id="4" formData={formData.q4} changeFunction={handleChange}
                            question="Avez-vous souscrit à une cyber-assurance ?"
                            answerA="Non, cela ne nous semble pas utile ou trop cher."
                            answerB="Nous y réfléchissons."
                            answerC="Oui, nous avons une couverture de base."   
                            answerD="Oui, après un audit de nos risques, révisée annuellement."
                        />

                        <QcmQuestion id="5" formData={formData.q5} changeFunction={handleChange}
                            question="L'entreprise dispose-t-elle d'un inventaire à jour de ses actifs ?"
                            answerA="Non, nous ne savons pas exactement ce qui est connecté."
                            answerB="Un inventaire partiel existe (ex: Excel non mis à jour)."
                            answerC="L'inventaire matériel est suivi, mais pas les flux de données."
                            answerD="Cartographie précise et dynamique des actifs et flux."
                        />

                        <QcmQuestion id="6" formData={formData.q6} changeFunction={handleChange}
                            question="Comment sont gérés les risques liés aux tiers (fournisseurs) ?"
                            answerA="Nous ne vérifions pas la sécurité de nos prestataires."
                            answerB="Nous demandons simplement s'ils sont sécurisés."
                            answerC="Des clauses de sécurité sont incluses dans les contrats."
                            answerD="Nous auditons nos fournisseurs critiques et exigeons des certifications."
                        />
                    </div>
                )}

                {/* ONGLET 2 : Infrastructure */}
                {activeTab === 2 && (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-xl font-semibold text-slate-300 mb-4">Sécurité Technique & Infrastructure</h2>
                        
                        <QcmQuestion id="7" formData={formData.q7} changeFunction={handleChange}
                            question="Quelle est votre politique de gestion des mises à jour (patch management) ?"
                            answerA="Les mises à jour se font quand l'utilisateur y pense."
                            answerB="Uniquement lors de gros problèmes."
                            answerC="Les mises à jour critiques sont appliquées mensuellement."
                            answerD="Correctifs critiques déployés automatiquement sous 48h."
                        />

                        <QcmQuestion id="8" formData={formData.q8} changeFunction={handleChange}
                            question="Comment l'accès au réseau et aux applications est-il protégé ?"
                            answerA="Mots de passe simples, souvent partagés."
                            answerB="Mots de passe complexes exigés, sans MFA."
                            answerC="MFA activé pour les administrateurs uniquement."
                            answerD="MFA généralisé pour tous les accès distants et critiques."
                        />

                        <QcmQuestion id="9" formData={formData.q9} changeFunction={handleChange}
                            question="Quel niveau de protection est installé sur les postes de travail ?"
                            answerA="Aucun ou antivirus gratuit expiré."
                            answerB="Antivirus standard à jour."
                            answerC="Antivirus managé centralisé."
                            answerD="Solution EDR/XDR déployée et surveillée (SOC)."
                        />

                        <QcmQuestion id="10" formData={formData.q10} changeFunction={handleChange}
                            question="Comment sont gérées les sauvegardes des données ?"
                            answerA="Aucune sauvegarde systématique."
                            answerB="Sauvegardes auto sur NAS interne."
                            answerC="Sauvegardes externalisées régulières." 
                            answerD="Sauvegardes immuables, externalisées et testées annuellement."
                        />

                        <QcmQuestion id="11" formData={formData.q11} changeFunction={handleChange}
                            question="L'entreprise applique-t-elle le principe de moindre privilège ?"
                            answerA="Tout le monde est administrateur de son poste."
                            answerB="Droits par défaut selon le service."
                            answerC="Droits admin limités à l'équipe IT."
                            answerD="Accès strictes aux données nécessaires, comptes admin séparés."
                        />

                        <QcmQuestion id="12" formData={formData.q12} changeFunction={handleChange}
                            question="Comment est sécurisé l'accès distant (télétravail) ?"
                            answerA="Accès direct (RDP ouvert, TeamViewer non sécurisé)."
                            answerB="VPN classique."
                            answerC="VPN avec authentification forte."
                            answerD="Architecture Zero Trust ou VPN sécurisé sur postes maîtrisés."
                        />

                        <QcmQuestion id="13" formData={formData.q13} changeFunction={handleChange}
                            question="Existe-t-il un cloisonnement (segmentation) du réseau ?"
                            answerA="Non, réseau plat (tout le monde accède à tout)."
                            answerB="Séparation basique Wi-Fi invités / interne."
                            answerC="Segmentation par VLANs."
                            answerD="Segmentation fine et isolation des systèmes critiques."
                        />

                        <QcmQuestion id="14" formData={formData.q14} changeFunction={handleChange}
                            question="Que faites-vous des équipements en fin de vie ?"
                            answerA="Jetés ou donnés tels quels."
                            answerB="Effacement manuel des fichiers."
                            answerC="Formatage des disques."
                            answerD="Effacement certifié ou destruction physique."
                        />
                    </div>
                )}

                {/* ONGLET 3 : Actions Préventives */}
                {activeTab === 3 && (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-xl font-semibold text-slate-200 mb-4">Humain & Procédures</h2>
                        
                        <QcmQuestion id="15" formData={formData.q15} changeFunction={handleChange}
                            question="Quelle est la fréquence des actions de sensibilisation (phishing, hygiène informatique) ?"
                            answerA="Aucune action."
                            answerB="Une note de service par an."
                            answerC="Formation à l'arrivée des  nouveaux."
                            answerD="Campagnes régulières (phishing) et formation continue."
                        />

                        <QcmQuestion id="16" formData={formData.q16} changeFunction={handleChange}
                            question="Avez-vous une procédure de gestion des incidents de sécurité ?"
                            answerA="Non, improvisation totale."
                            answerB="On appelle le prestataire IT, sans procédure."
                            answerC="Procédure avec contacts d'urgence."
                            answerD="Processus formel (tech, juridique, comm) testé."
                        />

                        <QcmQuestion id="17" formData={formData.q17} changeFunction={handleChange}
                            question="Disposez-vous d'un Plan de Reprise (PRA) ou Continuité (PCA) ?"
                            answerA="Non."
                            answerB="Idée informelle des priorités."
                            answerC="Plan rédigé mais jamais testé."
                            answerD="Plan documenté, à jour et testé périodiquement."
                        />

                        <QcmQuestion id="18" formData={formData.q18} changeFunction={handleChange}
                            question="Réalisez-vous des audits de sécurité techniques (pentests / tests d'intrusion) ?"
                            answerA="Jamais."
                            answerB="Uniquement lors d'un nouveau gros logiciel."
                            answerC="Une fois tous les 2-3 ans."
                            answerD="Régulièrement (annuellement) et à chaque changement majeur."
                        />

                        <QcmQuestion id="19" formData={formData.q19}changeFunction={handleChange}
                            question={"Comment gérez-vous le \"Shadow IT\" (outils utilisés par les employés sans l'aval de l'IT) ?"}
                            answerA="Nous ignorons ce phénomène."
                            answerB="Interdit théoriquement mais sans contrôle."
                            answerC="Blocage de certains sites connus."
                            answerD="Surveillance des flux et proposition d'alternatives sécurisées."
                        />

                        <QcmQuestion id="20" formData={formData.q20} changeFunction={handleChange}
                            question="Quelle est votre capacité de détection d'une intrusion ?"
                            answerA="Uniquement si le système plante."
                            answerB="Analyse des logs après problème."
                            answerC="Alertes basiques sur serveurs critiques."  
                            answerD="Surveillance proactive (SIEM/SOC) en continu."
                        />

                        <QcmQuestion id="21" formData={formData.q21} changeFunction={handleChange}
                            question="La gestion des départs de collaborateurs est-elle sécurisée ?"
                            answerA="Comptes actifs longtemps après départ."
                            answerB="Comptes fermés avec retard."
                            answerC="Checklist de sortie suivie."   
                            answerD="Révocation immédiate et automatique des accès le jour J."
                        />

                        <QcmQuestion id="22" formData={formData.q22} changeFunction={handleChange}
                            question="Effectuez-vous une veille sur les menaces cyber ?"
                            answerA="Non."
                            answerB="Lecture occasionnelle de presse."
                            answerC="Abonnement bulletins CERT-FR."
                            answerD="Veille structurée alimentant la protection."
                        />
                    </div>
                )}

            </form>

            {/* Footer du composant (Boutons Navigation) */}
            <div className="bg-slate-700/20 p-6 border-t border-slate-400 flex justify-between">
                <button
                    onClick={prevTab}
                    disabled={activeTab === 1}
                    className={`px-6 py-2 rounded-md font-medium transition-colors
            ${activeTab === 1
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 cursor-pointer'}`}
                >
                    Précédent
                </button>

                {activeTab < 3 ? (
                    <button
                        onClick={nextTab}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                        Suivant
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors cursor-pointer shadow-sm"
                    >
                        Soumettre l'Audit
                    </button>
                )}
            </div>

            {/* SECTION RÉSULTATS */}
            <div ref={resultRef} className="scroll-mt-10">
                {score !== null && (
                    <div className="p-8 bg-slate-900 border-t-4 border-blue-500 animate-slideUp">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl font-bold text-white mb-2">Résultat de l'Audit</h2>
                            <p className="text-slate-400 mb-8">Analyse basée sur vos 22 réponses</p>

                            {/* Score Display */}
                            <div className="flex flex-col items-center justify-center mb-8">
                                <div className={`text-6xl font-extrabold mb-2 ${getResultFeedback(score).color}`}>
                                    {score} <span className="text-2xl text-slate-500">/ 66</span>
                                </div>
                                
                                {/* Progress Bar */}
                                <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden mt-4 shadow-inner">
                                    <div 
                                        className={`h-full transition-all duration-1000 ease-out ${getResultFeedback(score).bgColor}`}
                                        style={{ width: `${(score / 66) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Feedback Box */}
                            <div className={`p-6 rounded-xl border ${getResultFeedback(score).borderColor} bg-slate-800/50 backdrop-blur`}>
                                <h3 className={`text-xl font-bold mb-3 ${getResultFeedback(score).color}`}>
                                    {getResultFeedback(score).title}
                                </h3>
                                <p className="text-slate-200 text-lg">
                                    {getResultFeedback(score).msg}
                                </p>
                            </div>

                            <button 
                                onClick={() => window.print()}
                                className="mt-8 px-6 py-2 border border-slate-500 text-slate-300 hover:bg-slate-800 rounded-md transition-colors"
                            >
                                Imprimer ce rapport
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}