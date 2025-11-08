"use client";

import TrackCard, { type Track } from "./TrackCard";

export type Theme = {
  id: string;
  title: string;
  description: string;
  icon: string;
  tracks: Track[];
};

interface ThemeSectionProps {
  theme: Theme;
  moduleCompletions: Record<string, boolean>;
}

export default function ThemeSection({ theme, moduleCompletions }: ThemeSectionProps) {
  // Mapping des IDs de tracks vers les course_id utilisés dans Supabase
  const trackToCourseId: Record<string, string> = {
    "corp-basics": "corp-basics",
    "corp-analysis": "corp-analysis",
    "corp-invest-financing": "corp-invest-financing",
    "markets-basics": "markets-basics",
    "markets-assets": "markets-assets",
    "markets-derivatives": "markets-derivatives",
  };

  // Déterminer quels modules sont verrouillés
  const isModuleLocked = (trackId: string, index: number): boolean => {
    // Le premier module est toujours débloqué (index 0)
    if (index === 0) return false;

    // Vérifier si le module précédent est complété
    const previousTrack = theme.tracks[index - 1];
    if (!previousTrack) return false;

    const previousCourseId = trackToCourseId[previousTrack.id];
    if (!previousCourseId) return false;

    // Le module est verrouillé si le module précédent n'est pas complété
    // Si l'utilisateur n'est pas connecté, seul le premier module est accessible
    return !moduleCompletions[previousCourseId];
  };

  const isPreviousModuleCompleted = (index: number): boolean => {
    if (index === 0) return true;

    const previousTrack = theme.tracks[index - 1];
    if (!previousTrack) return true;

    const previousCourseId = trackToCourseId[previousTrack.id];
    if (!previousCourseId) return true;

    return moduleCompletions[previousCourseId] || false;
  };

  return (
    <section className="mb-20">
      {/* Header du thème avec fond coloré */}
      <div className={`mb-8 rounded-lg px-6 py-6 md:px-8 md:py-7 ${
        theme.id === "corp-finance" 
          ? "bg-[#0A2540] text-white" 
          : "bg-[#F5B301] text-[#0A2540]"
      }`}>
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg flex-shrink-0 ${
            theme.id === "corp-finance" 
              ? "bg-white/10 text-white" 
              : "bg-[#0A2540]/10 text-[#0A2540]"
          }`}>
            <span className="text-lg font-bold">
              {theme.id === "corp-finance" ? "FE" : "FM"}
            </span>
          </div>
          <div className="flex-1">
            <h2 className={`text-2xl md:text-3xl font-bold tracking-tight mb-2 ${
              theme.id === "corp-finance" ? "text-white" : "text-[#0A2540]"
            }`}>
              {theme.title}
            </h2>
            <p className={`text-base md:text-lg max-w-3xl leading-relaxed ${
              theme.id === "corp-finance" ? "text-white/90" : "text-[#0A2540]/90"
            }`}>
              {theme.description}
            </p>
          </div>
        </div>
      </div>

      {/* Cards du parcours */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {theme.tracks.map((track, index) => {
          // Les modules "bientôt disponibles" ne sont jamais verrouillés par la logique de progression
          // mais sont désactivés par le flag comingSoon
          const isComingSoon = track.comingSoon === true;
          const isLocked = isComingSoon ? false : isModuleLocked(track.id, index);
          const previousCompleted = isPreviousModuleCompleted(index);

          return (
            <TrackCard
              key={track.id}
              track={track}
              index={index}
              isLocked={isLocked}
              previousModuleCompleted={previousCompleted}
            />
          );
        })}
      </div>
    </section>
  );
}

