'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import FeaturesSection from "@/components/FeaturesSection";
import { themes } from "@/data/courses";

const heroHighlights = [
  {
    value: "97%",
    label: "d&apos;apprenants recommandent FinX",
    accent: "bg-[#F5B700]",
  },
  {
    value: "18k+",
    label: "questions analysées par l&apos;IA",
    accent: "bg-[#00B4D8]",
  },
  {
    value: "120+",
    label: "cas & modules corporate",
    accent: "bg-[#F5B700]",
  },
];

const immersionHighlights = [
  {
    title: "IA conversationnelle",
    description:
      "Analyse chaque réponse orale avec une précision de coach senior. Whisper transcrit, GPT-4o structure et FinX t&apos;oriente.",
    bullets: [
      "Feedback vocal & écrit instantané",
      "Radar de compétences personnalisé",
      "Recommandations de modules à revoir",
    ],
  },
  {
    title: "Learning Hub sur-mesure",
    description:
      "Un workspace modulable où les parcours, quiz et cas s&apos;alignent sur tes objectifs carrière.",
    bullets: [
      "Leçons verrouillées pour suivre le rythme",
      "Cas réels corporate & marchés",
      "Suivi multi-appareils synchronisé",
    ],
  },
  {
    title: "Gamification premium",
    description:
      "Ton avancée se matérialise par des XP cards holographiques, des badges animés et une timeline de progression.",
    bullets: [
      "Barre d&apos;XP temps réel",
      "Badges à collectionner",
      "Streak hebdomadaire boosté",
    ],
  },
];

const statMetrics = [
  {
    label: "XP moyenne / semaine",
    value: "1 250",
    detail: "+32% vs. cohort",
  },
  {
    label: "Temps moyen sur cas",
    value: "48 min",
    detail: "Immersion guidée",
  },
  {
    label: "Score d&apos;entretien",
    value: "4.6/5",
    detail: "Coaching IA",
  },
  {
    label: "Modules complétés",
    value: "3.2",
    detail: "/ mois par apprenant",
  },
];

const platformHighlights = [
  {
    title: "Analyse augmentée",
    items: [
      "Détection automatique des soft skills clés",
      "Suggestions de réponses de niveau expert",
      "Synthèse des forces et axes d&apos;amélioration",
    ],
  },
  {
    title: "Suivi intelligent",
    items: [
      "Historique complet des sessions d&apos;entraînement",
      "Scores normalisés par métier ciblé",
      "Recommandations de modules à retravailler",
    ],
  },
  {
    title: "Expérience collaborative",
    items: [
      "Partage de sessions avec ton mentor ou ton équipe",
      "Commentaires contextualisés sur chaque question",
      "Exports PDF pour préparer tes entretiens",
    ],
  },
];

export default function Home() {
  const displayedThemes = themes.slice(0, 2);

  return (
    <div className="relative bg-white text-gray-900 scroll-smooth">
      <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#050C1F] via-[#07142B] to-[#040911] text-white">
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%2311223a' stop-opacity='0.7'/%3E%3Cstop offset='1' stop-color='%231b2f4a' stop-opacity='0.2'/%3E%3C/linearGradient%3E%3Cpattern id='grid' width='160' height='160' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'%3E%3Cpath d='M 0 160 L 160 160 160 0' fill='none' stroke='url(%23a)' stroke-width='0.8'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
          }}></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-280px] right-[-160px] h-[560px] w-[560px] rounded-full bg-[#00B4D8]/20 blur-[180px]"></div>
          <div className="absolute bottom-[-260px] left-[-160px] h-[520px] w-[520px] rounded-full bg-[#F5B700]/25 blur-[200px]"></div>
          <div className="absolute inset-y-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent opacity-40"></div>
        </div>
        <div className="relative z-10">
          <div className="max-w-6xl mx-auto min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center px-6 pt-28 pb-32">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center text-center space-y-10"
            >
              <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-2 font-semibold text-white/80">
                <span className="h-2 w-2 rounded-full bg-[#00B4D8]"></span>
                <span>Finance augmentée par l&apos;IA</span>
              </div>
              <h1 className="px-2 sm:px-0 text-[2.5rem] sm:text-[3.4rem] md:text-[3.9rem] lg:text-[4.4rem] font-semibold tracking-tight leading-[1.05] max-w-5xl">
                <span className="block">Forme-toi, pratique et performe</span>
                <span className="block">en finance grâce à l&apos;IA.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/75 max-w-3xl leading-relaxed">
                FinX Academy réunit parcours corporate, IA d&apos;entretien et progression gamifiée dans un espace premium.
                Deviens l&apos;expert financier que recherchent les directions financières.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href="/parcours"
                  className="inline-flex items-center justify-center rounded-full bg-[#F5B700] px-9 py-4 text-base font-semibold text-[#0B1728] shadow-[0_20px_45px_-20px_rgba(245,183,0,0.8)] transition-transform hover:-translate-y-1 hover:shadow-[0_24px_60px_-18px_rgba(245,183,0,0.75)]"
                >
                  Découvrir les parcours
                </Link>
                <Link
                  href="/entretien-ia"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-9 py-4 text-base font-semibold text-white backdrop-blur transition-all hover:bg-white/10 hover:border-white/40"
                >
                  Commencer l&apos;entraînement IA
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 w-full max-w-4xl">
                {heroHighlights.map((highlight) => (
                  <motion.div
                    key={highlight.label}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-6 py-6 backdrop-blur-xl text-left"
                  >
                    <div className={`absolute -top-10 -right-6 h-20 w-20 rounded-full ${highlight.accent} opacity-40 blur-3xl`}></div>
                    <p className="text-3xl font-semibold text-white">{highlight.value}</p>
                    <p className="mt-2 text-sm text-white/70 leading-relaxed">{highlight.label}</p>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-14 flex items-center gap-3 text-sm text-white/60"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 animate-bounce-slow">
                  ↓
                </span>
                <span>Glisse pour explorer la plateforme</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <FeaturesSection />

      {/* Parcours Section */}
      <section id="parcours" className="relative py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8FBFF] via-white to-[#EEF4FF]"></div>
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Des parcours structurés et évolutifs
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Du diagnostic financier à la valorisation, chaque module est pensé pour être actionnable. Les prochaines briques (M&A, financement structuré, trésorerie avancée) arrivent très vite.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {displayedThemes.map((theme) => (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-[32px] border border-[#E3E9F5] shadow-[0_40px_90px_-60px_rgba(11,23,40,0.7)] overflow-hidden"
              >
                <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-br from-primary/10 via-white to-transparent">
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold mb-4">
                    <span className="text-2xl">{theme.icon}</span>
                    <span>{theme.title}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{theme.description}</p>
                </div>
                <div className="px-8 py-6 space-y-6">
                  {theme.tracks.slice(0, 3).map((track) => (
                    <div key={track.id} className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-1">{track.difficulty}</p>
                        <p className="text-lg font-semibold text-gray-900">{track.title}</p>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{track.description}</p>
                      </div>
                      <Link
                        href={track.slug}
                        className={`text-primary font-semibold text-sm hover:underline transition-all ${track.comingSoon ? "opacity-50 cursor-not-allowed" : "hover:text-primary/70"}`}
                      >
                        {track.comingSoon ? "Bientôt" : "Accéder"}
                      </Link>
                    </div>
                  ))}
                  <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl px-6 py-5 text-sm text-gray-600">
                    <p className="font-semibold text-primary mb-1">À venir</p>
                    <p>
                      {theme.tracks.filter((track) => track.comingSoon).length} modules supplémentaires arrivent bientôt : M&A approfondi, restructuration, trésorerie avancée...
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Highlights */}
      <section id="ia-entretien" className="relative py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F6FAFF] to-white"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary font-semibold rounded-full mb-4">
                Entretien IA &amp; Feedback en continu
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Prépare-toi comme en salle d&apos;entretien.
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Choisis ton métier, enregistre tes réponses, laisse l&apos;IA analyser ton oral et repars avec un plan d&apos;action précis. Whisper transcrit, GPT-4o analyse, FinX te propose les ressources à retravailler.
              </p>
              <div className="space-y-5">
                {platformHighlights.map((highlight) => (
                  <motion.div
                    key={highlight.title}
                    whileHover={{ y: -6 }}
                    className="bg-white/80 border border-[#E0E6F5] rounded-[28px] p-6 shadow-[0_30px_60px_-40px_rgba(11,23,40,0.7)] backdrop-blur"
                  >
                    <h3 className="text-lg font-semibold text-primary mb-3">{highlight.title}</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {highlight.items.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-gradient-to-br from-[#00B4D8] to-[#F5B700] rounded-full"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative overflow-hidden rounded-[36px] border border-[#D8E1F2] bg-gradient-to-br from-white/70 via-white to-[#F3F7FF] p-10 shadow-[0_50px_120px_-70px_rgba(11,23,40,0.8)]"
            >
              <div className="absolute -top-28 right-[-120px] h-72 w-72 rounded-full bg-[#00B4D8]/20 blur-[100px]"></div>
              <div className="absolute -bottom-20 left-[-140px] h-64 w-64 rounded-full bg-[#F5B700]/20 blur-[120px]"></div>
              <div className="relative">
                <h3 className="text-xl font-semibold text-primary mb-4">Ce que tu obtiens :</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-primary">•</span>
                    <span>Transcriptions détaillées de chaque réponse orale.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-primary">•</span>
                    <span>Feedback structuré (forces, points à travailler, recommandations).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-primary">•</span>
                    <span>Graphique radar des compétences + score global.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-primary">•</span>
                    <span>Suggestions personnalisées vers les modules et leçons FinX.</span>
                  </li>
                </ul>
                <Link
                  href="/entretien-ia"
                  className="mt-8 inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#0B1728] text-white font-semibold transition-transform hover:-translate-y-1"
                >
                  Explorer l&apos;entraînement IA
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1728] to-[#040B18]"></div>
        <div className="relative max-w-7xl mx-auto text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
            <div className="max-w-xl">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center px-4 py-2 bg-white/10 text-white font-semibold rounded-full"
              >
                Metrics en temps réel
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-6 text-3xl md:text-4xl font-bold"
              >
                Mesure chaque progression avec précision.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-4 text-lg text-white/70"
              >
                Suis les KPIs clés de ta montée en puissance. Notre cockpit transforme les insights IA en actions concrètes.
              </motion.p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
              {statMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-[30px] border border-white/10 bg-white/5 px-6 py-7 backdrop-blur-xl"
                >
                  <p className="text-sm uppercase tracking-[0.25em] text-white/50">{metric.label}</p>
                  <p className="mt-3 text-3xl font-semibold">{metric.value}</p>
                  <p className="mt-2 text-sm text-white/70">{metric.detail}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA finale */}
      <section className="relative py-32 px-6 bg-gradient-to-br from-[#0B1728] via-[#07142B] to-[#02060F] text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='360' height='360'%3E%3Cdefs%3E%3ClinearGradient id='b' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%2300B4D8' stop-opacity='0.45'/%3E%3Cstop offset='1' stop-color='%23F5B700' stop-opacity='0.08'/%3E%3C/linearGradient%3E%3Cpattern id='mesh' width='180' height='180' patternUnits='userSpaceOnUse' patternTransform='rotate(30)'%3E%3Cpath d='M 0 180 L 180 180 180 0' fill='none' stroke='url(%23b)' stroke-width='0.7' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23mesh)'/%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="absolute top-[-200px] left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#00B4D8]/15 blur-[160px]"></div>
        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold"
          >
            Prêt à accélérer ta progression en finance ?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-white/80"
          >
            Rejoins FinX Academy, débloque les modules corporate finance, lance des simulations d&apos;entretien IA et construis un profil qui fait la différence.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-semibold rounded-full transition-transform hover:-translate-y-1"
            >
              Accéder à mon espace
            </Link>
            <Link
              href="/profil"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-full border border-white/20 transition-transform hover:-translate-y-1"
            >
              Voir le profil joueur
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-white/10 bg-gradient-to-br from-[#02060F] to-[#040A16] px-6 py-12 text-white/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-[0.35em] uppercase text-white/70">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00B4D8] to-[#F5B700] text-[#050C1F] font-bold">
                FX
              </span>
              FinX Academy
            </Link>
            <p className="mt-3 max-w-sm text-sm text-white/50">
              Finance meets AI. Construis ta maîtrise corporate avec une plateforme pensée pour la précision, la performance et l&apos;impact.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <p className="font-semibold text-white">Produit</p>
              <Link href="#parcours" className="block text-white/60 transition-colors hover:text-white">Parcours</Link>
              <Link href="#ia-entretien" className="block text-white/60 transition-colors hover:text-white">Entretien IA</Link>
              <Link href="#stats" className="block text-white/60 transition-colors hover:text-white">Tableau de bord</Link>
            </div>
            <div className="space-y-3">
              <p className="font-semibold text-white">Ressources</p>
              <Link href="/blog" className="block text-white/60 transition-colors hover:text-white">Blog</Link>
              <Link href="/webinars" className="block text-white/60 transition-colors hover:text-white">Live sessions</Link>
              <Link href="/support" className="block text-white/60 transition-colors hover:text-white">Support</Link>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <p className="font-semibold text-white">Reste informé</p>
            <p className="text-white/50">Recevoir les nouveautés FinX Academy.</p>
            <form className="relative flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
              <input
                type="email"
                placeholder="Email professionnel"
                className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
              />
              <button type="submit" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0B1728] text-sm font-semibold">
                →
              </button>
            </form>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} FinX Academy. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <Link href="/legal" className="hover:text-white">Mentions légales</Link>
            <Link href="/privacy" className="hover:text-white">Confidentialité</Link>
            <Link href="/cookies" className="hover:text-white">Cookies</Link>
          </div>
        </div>
      </footer>

      </main>
    </div>
  );
}
