import FormFree from "../../../../components/form-free";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Hero */}
      <main>
        <section className="mx-auto max-w-6xl px-4 pt-12 pb-10 md:pt-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/80 ring-1 ring-white/10">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Diagnostic cyber express + monitoring en continu
              </div>
              <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Réduisez votre risque cyber en <span className="text-white">moins de 10 minutes</span>.
              </h1>
              <p className="mt-4 text-base leading-relaxed text-white/80 md:text-lg">
                Obtenez un mini diagnostic gratuit pour votre organisation (surface exposée, bonnes pratiques,
                signaux faibles) puis passez au monitoring de marque, fuites de mots de passe et alertes.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#free"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-white/90"
                >
                  Faire le diagnostic gratuit
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/5"
                >
                  Découvrir les fonctionnalités
                </a>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">✓</span>
                  Sans carte bancaire
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">✓</span>
                  Résultats immédiats
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">✓</span>
                  RGPD-friendly
                </div>
              </div>
            </div>

            <FormFree />

          </div>

          {/* Social proof */}
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-white/75">
                Conçu pour les PME/ETI qui veulent une visibilité immédiate et un monitoring continu, sans équipe SOC.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Alertes marque",
                  "Fuites d’identifiants",
                  "Surveillance surface exposée",
                  "Rapports exécutifs",
                  "Checklist actionnable",
                ].map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/75 ring-1 ring-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-12">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">De la photo instantanée au monitoring continu</h2>
            <p className="mt-3 text-white/75">
              Le Freemium vous donne un point de départ. Les offres payantes ajoutent l’automatisation, les alertes et
              une visibilité continue sur votre marque et vos identifiants.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Diagnostic gratuit",
                desc: "Score, recommandations prioritaires, checklist rapide. Données minimales : email + organisation.",
              },
              {
                title: "Monitoring de marque",
                desc: "Détection d’usurpations, mentions à risque, signaux faibles. Alertes et historique.",
              },
              {
                title: "Fuites & mots de passe",
                desc: "Surveillance d’identifiants exposés, corrélation, alertes et actions recommandées.",
              },
              {
                title: "Automatisation",
                desc: "Scans planifiés, relances, priorisation, et suivi des corrections dans le temps.",
              },
              {
                title: "Rapports exécutifs",
                desc: "Synthèses claires pour direction/DSI : tendances, risques, et progrès mensuels.",
              },
              {
                title: "Multi-organisation",
                desc: "Idéal MSP/Groupes : espaces, rôles, périmètres, et consolidations.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20"
              >
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <a
              href="#free"
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-white/90"
            >
              Démarrer avec le gratuit
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/5"
            >
              Comparer Pro vs Entreprise
            </a>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-6xl px-4 py-12">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Tarifs simples (Freemium → Pro → Entreprise)</h2>
            <p className="mt-3 text-white/75">
              Commencez gratuitement, puis choisissez le niveau de monitoring et d’automatisation adapté.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {/* Free */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Freemium</h3>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/75 ring-1 ring-white/10">Gratuit</span>
              </div>
              <p className="mt-2 text-sm text-white/75">Mini diagnostic + checklist</p>
              <div className="mt-6 space-y-2 text-sm text-white/80">
                <p>• Score & recommandations prioritaires</p>
                <p>• Export PDF basique</p>
                <p>• 1 organisation</p>
              </div>
              <a
                href="#free"
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-white/90"
              >
                Lancer le gratuit
              </a>
              <p className="mt-3 text-xs text-white/55">Idéal pour commencer et évaluer rapidement.</p>
            </div>

            {/* Pro */}
            <div className="rounded-3xl border border-white/15 bg-white/7 p-6 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Pro</h3>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-200 ring-1 ring-emerald-300/20">
                  Le plus populaire
                </span>
              </div>
              <p className="mt-2 text-sm text-white/75">Monitoring continu pour PME</p>
              <div className="mt-4 text-3xl font-semibold">Sur devis</div>
              <div className="mt-6 space-y-2 text-sm text-white/80">
                <p>• Tout Freemium</p>
                <p>• Monitoring de marque & alertes</p>
                <p>• Surveillance fuites d’identifiants</p>
                <p>• Scans planifiés & historique</p>
              </div>
              <a
                href="#free"
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-white/90"
              >
                Tester via le gratuit
              </a>
              <p className="mt-3 text-xs text-white/55">Passez en Pro après le diagnostic si besoin.</p>
            </div>

            {/* Enterprise */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Entreprise</h3>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/75 ring-1 ring-white/10">Avancé</span>
              </div>
              <p className="mt-2 text-sm text-white/75">Groupes, MSP, besoins sur-mesure</p>
              <div className="mt-4 text-3xl font-semibold">Sur devis</div>
              <div className="mt-6 space-y-2 text-sm text-white/80">
                <p>• Tout Pro</p>
                <p>• Multi-organisation & RBAC</p>
                <p>• Intégrations (SIEM, ticketing)</p>
                <p>• SLA, rapports avancés, accompagnement</p>
              </div>
              <a
                href="#free"
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/5"
              >
                Faire le diagnostic d’abord
              </a>
              <p className="mt-3 text-xs text-white/55">On dimensionne ensemble votre périmètre.</p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-base font-semibold">Besoin d’un POC rapide ?</h3>
                <p className="mt-1 text-sm text-white/75">
                  Faites le diagnostic gratuit puis on active le monitoring sur vos domaines/marques.
                </p>
              </div>
              <a
                href="#free"
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-white/90"
              >
                Démarrer maintenant
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-6xl px-4 py-12">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">FAQ</h2>
            <p className="mt-3 text-white/75">Quelques réponses rapides pour lever les frictions avant le test.</p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {[
              {
                q: "Quelles infos sont nécessaires pour le diagnostic gratuit ?",
                a: "Email pro + nom d’organisation. Le domaine est optionnel mais améliore l’analyse (surface exposée, marque, signaux publics).",
              },
              {
                q: "Faut-il une carte bancaire ?",
                a: "Non. Le Freemium est sans carte. Vous décidez ensuite si vous activez Pro ou Entreprise.",
              },
              {
                q: "En quoi consiste le monitoring ?",
                a: "Alertes sur marque/usurpations, détection d’identifiants exposés, suivi dans le temps et recommandations priorisées.",
              },
              {
                q: "Puis-je gérer plusieurs entités ?",
                a: "Oui avec l’offre Entreprise : multi-organisation, rôles, périmètres et consolidations.",
              },
            ].map((item) => (
              <div key={item.q} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-sm font-semibold">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
