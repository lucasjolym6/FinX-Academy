"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import TrackCard from "@/components/TrackCard";
import { themes } from "@/data/courses";
import { useUser } from "@/hooks/useUser";
import { useAllModuleCompletions } from "@/hooks/useAllModuleCompletions";

const trackToCourseId = {
  "corp-basics": "corp-basics",
  "corp-analysis": "corp-analysis",
  "corp-invest-financing": "corp-invest-financing",
  "markets-basics": "markets-basics",
  "markets-assets": "markets-assets",
  "markets-derivatives": "markets-derivatives",
};

const tabs = [
  { id: "corp-finance", label: "Finance d'entreprise" },
  { id: "market-finance", label: "Finance de marché" },
];

export default function ParcoursPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("corp-finance");

  const allCourseIds = useMemo(() => {
    const ids = new Set();
    themes.forEach((theme) => {
      theme.tracks.forEach((track) => {
        const courseId = trackToCourseId[track.id];
        if (courseId) ids.add(courseId);
      });
    });
    return Array.from(ids);
  }, []);

  const { completions: moduleCompletions = {} } = useAllModuleCompletions(user, allCourseIds);

  const activeTheme = themes.find((theme) => theme.id === activeTab);
  const isCorpFinance = activeTab === "corp-finance";

  const isModuleLocked = (trackId, index, theme) => {
    if (index === 0) return false;
    const previousTrack = theme.tracks[index - 1];
    if (!previousTrack) return false;
    const previousCourseId = trackToCourseId[previousTrack.id];
    if (!previousCourseId) return false;
    return !moduleCompletions[previousCourseId];
  };

  const isPreviousModuleCompleted = (index, theme) => {
    if (index === 0) return true;
    const previousTrack = theme.tracks[index - 1];
    if (!previousTrack) return true;
    const previousCourseId = trackToCourseId[previousTrack.id];
    if (!previousCourseId) return true;
    return moduleCompletions[previousCourseId] || false;
  };

  return (
    <main className="relative min-h-screen bg-[#F4F6FB] pb-20">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(135deg,#F8FAFF_0%,#EEF2FF_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#E3ECFF_0%,transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl px-6 pt-16 space-y-12">
        <section className="space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[#0B1728]">Choisis ton univers</h2>
              <p className="text-sm text-[#64748B]">Switch instantanément entre finance d&apos;entreprise et finance de marché.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const activeClasses = isActive
                  ? "bg-gradient-to-r from-[#F5B700] to-[#F8CB3F] text-[#0B1728] shadow-[0_20px_45px_-25px_rgba(245,183,0,0.45)]"
                  : "border border-[#E2E8F0] bg-white text-[#0B1728] hover:border-[#0B1728]/20 hover:bg-[#0B1728]/5";

                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileTap={{ scale: 0.98 }}
                    className={`relative inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all ${activeClasses}`}
                  >
                    {tab.label}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {activeTheme && (
            <div className="space-y-10">
              <motion.section
                key={activeTheme.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`relative overflow-hidden rounded-3xl border ${
                  isCorpFinance
                    ? "border-white/10 bg-gradient-to-br from-[#050C1F] via-[#0D1F3F] to-[#151338] text-white"
                    : "border-[#F1B814]/50 bg-gradient-to-br from-[#F59E0B] via-[#F7B733] to-[#FACC15] text-[#0B1728]"
                } p-8 shadow-[0_45px_120px_-70px_rgba(15,23,42,0.65)]`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_60%)]" />
                <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="max-w-3xl space-y-3">
                    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
                      {isCorpFinance ? "Corporate Finance" : "Market Finance"}
                    </span>
                    <p className={`text-base md:text-lg leading-relaxed ${isCorpFinance ? "text-white/80" : "text-[#0B1728]/80"}`}>
                      {activeTheme.description}
                    </p>
                  </div>
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${isCorpFinance ? "border-white/20 bg-white/10 text-white" : "border-[#0B1728]/10 bg-white/50 text-[#0B1728]"} text-xl font-semibold`}>
                    {isCorpFinance ? "FE" : "FM"}
                  </div>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -120px" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-xl md:text-2xl font-semibold text-[#0B1728]">Modules disponibles</h3>
                  <p className="text-sm text-[#64748B]">Avance module par module, l&apos;IA déverrouille automatiquement les étapes suivantes.</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {activeTheme.tracks.map((track, index) => {
                    const isComingSoon = track.comingSoon === true;
                    const isLocked = isComingSoon ? false : isModuleLocked(track.id, index, activeTheme);
                    const previousCompleted = isPreviousModuleCompleted(index, activeTheme);

                    return (
                      <motion.div
                        key={track.id}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "0px 0px -80px" }}
                        transition={{ duration: 0.4, delay: index * 0.04 }}
                      >
                        <TrackCard
                          track={track}
                          index={index}
                          isLocked={isLocked}
                          previousModuleCompleted={previousCompleted}
                          variant="yellow"
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </motion.section>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}