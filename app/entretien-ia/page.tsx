"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getJobsByCareerPath } from "@/data/jobs";
import type { CareerPath, Job } from "@/data/jobs";
import TrackCard from "@/components/TrackCard";

const tabs: Array<{ id: CareerPath; label: string }> = [
  { id: "corp-finance", label: "Finance d'entreprise" },
  { id: "market-finance", label: "Finance de marché" },
];

const summaries: Record<CareerPath, { title: string; description: string; highlights: string[] }> = {
  "corp-finance": {
    title: "Finance d'entreprise",
    description:
      "Analyse financière, contrôle de gestion, M&A, Private Equity… Choisis ton métier cible et prépare-toi sur des cas concrets.",
    highlights: ["Recommandations IA personnalisées", "Feedback structuré", "Questions types d'entretien"],
  },
  "market-finance": {
    title: "Finance de marché",
    description:
      "Trading, gestion d'actifs, dérivés, risques… Entraîne-toi sur des simulations proches des desks pour gagner en confiance.",
    highlights: ["Analyse technique & comportementale", "Questions niveau marché", "Suivi de progression"],
  },
};

export default function EntretienIAPage() {
  const [activePath, setActivePath] = useState<CareerPath>("corp-finance");

  const jobs = useMemo(() => getJobsByCareerPath(activePath), [activePath]);
  const summary = summaries[activePath];

  return (
    <main className="relative min-h-screen bg-[#F4F6FB] pb-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#E3ECFF_0%,transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl px-6 pt-16 space-y-12">
        <section className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-[#0B1728]">Entraînements IA</h1>
              <p className="text-sm text-[#64748B]">Sélectionne un univers pour afficher les métiers disponibles.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              {tabs.map((tab) => {
                const isActive = activePath === tab.id;
                return (
            <motion.button
                    key={tab.id}
                    onClick={() => setActivePath(tab.id)}
                    whileTap={{ scale: 0.97 }}
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                      isActive
                        ? tab.id === "corp-finance"
                          ? "bg-gradient-to-r from-[#3F76FF] to-[#7C4DFF] text-white shadow-[0_20px_45px_-25px_rgba(63,118,255,0.6)]"
                          : "bg-gradient-to-r from-[#F5B700] to-[#F8CB3F] text-[#0B1728] shadow-[0_20px_45px_-25px_rgba(245,183,0,0.45)]"
                        : "border border-[#E2E8F0] bg-white text-[#0B1728] hover:border-[#0B1728]/20 hover:bg-[#0B1728]/5"
                    }`}
                  >
                    {tab.label}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <motion.section
            key={activePath}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ durée: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`relative overflow-hidden rounded-3xl border ${
              activePath === "corp-finance"
                ? "border-white/10 bg-gradient-to-br from-[#050C1F] via-[#0D1F3F] to-[#151338] text-white"
                : "border-[#F1B814]/50 bg-gradient-to-br from-[#F59E0B] via-[#F7B733] to-[#FACC15] text-[#0B1728]"
            } p-8 shadow-[0_45px_120px_-70px_rgba(15,23,42,0.65)]`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_60%)]" />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-3xl space-y-3">
                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
                  {summary.title}
                </span>
                <p className={`text-base md:text-lg leading-relaxed ${activePath === "corp-finance" ? "text-white/80" : "text-[#0B1728]/80"}`}>
                  {summary.description}
                </p>
              </div>
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${
                activePath === "corp-finance" ? "border-white/20 bg-white/10 text-white" : "border-[#0B1728]/10 bg-white/50 text-[#0B1728]"
              } text-xl font-semibold`}>
                {activePath === "corp-finance" ? "FE" : "FM"}
              </div>
            </div>
          </motion.section>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#0B1728]">Métiers disponibles</h3>
            <p className="text-xs uppercase tracking-[0.3em] text-[#64748B]">{jobs.length} métiers</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -80px" }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
              >
                <TrackCard
                  track={{
                    id: job.id,
                    title: job.title,
                    difficulty: job.difficulty,
                    description: `${job.description} Exemple : ${job.exampleQuestions[0]}`,
                    slug: `/entretien-ia/simulation?career=${job.careerPath}&job=${job.id}`,
                    comingSoon: false,
                  }}
                  index={index}
                  isLocked={false}
                  previousModuleCompleted
                  variant="yellow"
                  label="Métier IA"
                  ctaLabel="Lancer la simulation"
                  showStepIndicator={false}
                  showDifficultyBadge={false}
                />
              </motion.div>
            ))}
          </div>
        </section>
        </div>
    </main>
  );
}

