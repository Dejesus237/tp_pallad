export default function FormFree() {
    return (
        /* Free Form */
        <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-indigo-500/20 via-sky-400/10 to-blue-500/10 blur-2xl" />
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30">
            
                <h2 className="text-lg font-semibold">Diagnostic cyber gratuit</h2>
                <p className="mt-1 text-sm text-white/75">
                    Recevez votre score, vos points forts/faibles et une checklist d’actions.
                </p>

                <form id="free" className="mt-6 space-y-4" action="#" method="post">
                    <div>
                        <label className="text-xs font-medium text-white/80">Nom de l’organisation</label>
                        <input
                            name="organization"
                            required
                            placeholder="Ex : ACME SAS"
                            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none ring-0 focus:border-white/25"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-white/80">Email professionnel</label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="prenom.nom@entreprise.fr"
                            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/25"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-white/80">Domaine principal (optionnel)</label>
                        <input
                            name="domain"
                            placeholder="entreprise.fr"
                            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/25"
                        />
                        <p className="mt-2 text-xs text-white/55">
                            Utile pour enrichir le diagnostic (surface exposée, marque, signaux publics).
                        </p>
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-white/90"
                    >
                        Lancer le diagnostic
                    </button>
                    <p className="text-xs text-white/55">
                        En lançant le diagnostic, vous acceptez d’être contacté pour un suivi et des recommandations.
                    </p>
                </form>

                <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                        <div className="text-xs text-white/60">Temps</div>
                        <div className="mt-1 text-sm font-semibold">&lt; 10 min</div>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                        <div className="text-xs text-white/60">Données</div>
                        <div className="mt-1 text-sm font-semibold">minimales</div>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                        <div className="text-xs text-white/60">Action</div>
                        <div className="mt-1 text-sm font-semibold">priorisée</div>
                    </div>
                </div>

            </div>
        </div >
    );
}