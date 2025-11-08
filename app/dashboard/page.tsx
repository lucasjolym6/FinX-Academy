'use client';

import { useMemo } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Briefcase, LineChart, Rocket } from "lucide-react";
import ProgressCard from "@/components/dashboard/ProgressCard";
import ParcoursCard from "@/components/dashboard/ParcoursCard";
import BadgesGrid from "@/components/dashboard/BadgesGrid";
import StatsPanel from "@/components/dashboard/StatsPanel";
import WalletSummaryCard from "@/components/dashboard/WalletSummaryCard";
import WalletTransactionsCard from "@/components/dashboard/WalletTransactionsCard";
import { useUser } from "@/hooks/useUser";
import { useProfile } from "@/hooks/useProfile";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import { useUserBadges } from "@/hooks/useUserBadges";
import { useWeeklyProgress } from "@/hooks/useWeeklyProgress";
import { themes } from "@/data/courses";
import { allBadges, badgeDefinitions } from "@/data/badges";
import { calculateLevel, xpToNextLevel } from "@/lib/gamification";

type DashboardParcours = {
  id: string;
  title: string;
  level: "Débutant" | "Intermédiaire" | "Avancé";
  description: string;
  progress: number;
  icon: ReactNode;
  href?: string;
  updatedAt: string;
};

function iconForTheme(themeId: string) {
  switch (themeId) {
    case "corp-finance":
      return <Briefcase className="h-6 w-6" />;
    case "market-finance":
      return <LineChart className="h-6 w-6" />;
    default:
      return <Rocket className="h-6 w-6" />;
  }
}

function formatBadgeDate(date: string | null | undefined) {
  if (!date) return undefined;
  try {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return undefined;
  }
}

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const { profile, loading: profileLoading } = useProfile(user);
  const { progress: courseProgress, loading: progressLoading } = useCourseProgress(user);
  const { badges: userBadges, loading: badgesLoading } = useUserBadges(user);
  const { completedThisWeek, weeklyGoal } = useWeeklyProgress(user);

  const trackCatalog = useMemo(() => {
    const map = new Map<
      string,
      {
        track: (typeof themes)[number]["tracks"][number];
        themeId: string;
      }
    >();
    themes.forEach((theme) => {
      theme.tracks.forEach((track) => {
        map.set(track.id, { track, themeId: theme.id });
      });
    });
    return map;
  }, []);

  const mappedCourses = useMemo<DashboardParcours[]>(() => {
    return courseProgress
      .map((entry) => {
        const catalogEntry = trackCatalog.get(entry.course_id);
        if (!catalogEntry) return null;
        const { track, themeId } = catalogEntry;
        const progressValue = Math.max(0, Math.round(entry.progress ?? 0));

        return {
          id: track.id,
          title: track.title,
          level: (track.difficulty ?? "Débutant") as DashboardParcours["level"],
          description: track.description ?? "",
          progress: progressValue,
          icon: iconForTheme(themeId),
          href: track.slug && track.slug !== "#" ? track.slug : `/parcours?focus=${track.id}`,
          updatedAt: entry.updated_at,
        };
      })
      .filter((item): item is DashboardParcours => Boolean(item));
  }, [courseProgress, trackCatalog]);

  const activeCourses = useMemo(() => {
    return mappedCourses
      .filter((course) => course.progress > 0)
      .sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 3);
  }, [mappedCourses]);

  const currentXp = profile?.xp ?? 0;
  const level = profile?.level ?? calculateLevel(currentXp);
  const xpRemaining = xpToNextLevel(currentXp);
  const nextLevelXp = currentXp + xpRemaining;
  const weeklyXp = completedThisWeek * 10; // estimation basée sur 10 XP par leçon

  const totalModules = mappedCourses.length;
  const completedModules = mappedCourses.filter((course) => course.progress >= 100).length;
  const inProgressModules = mappedCourses.filter(
    (course) => course.progress > 0 && course.progress < 100
  ).length;
  const averageProgress =
    totalModules > 0
      ? Math.round(
          mappedCourses.reduce((acc, course) => acc + course.progress, 0) /
            totalModules
        )
      : 0;

  const stats = [
    {
      label: "XP cette semaine",
      value: `+${weeklyXp}`,
      trend: `${completedThisWeek}/${weeklyGoal} leçons complétées`,
    },
    {
      label: "Modules complétés",
      value: `${completedModules}`,
      trend: inProgressModules
        ? `${inProgressModules} en cours`
        : totalModules
        ? "Continue sur ta lancée"
        : "Commence ton premier module",
    },
    {
      label: "Progression moyenne",
      value: totalModules ? `${averageProgress}%` : "—",
      trend: totalModules ? `${totalModules} modules actifs` : undefined,
    },
    {
      label: "XP total",
      value: `${currentXp.toLocaleString("fr-FR")} XP`,
      trend: `Niveau ${level}`,
    },
  ];

  const unlockedBadgeCodes = useMemo(
    () => new Set(userBadges.map((badge) => badge.badge_code)),
    [userBadges]
  );

  const recentBadges = useMemo(() => {
    const badges = userBadges
      .slice(0, 4)
      .map((badge) => {
        const definition = badgeDefinitions[badge.badge_code];
        return {
          id: badge.id ?? badge.badge_code,
          title: definition?.title ?? badge.badge_code,
          description: definition?.description ?? "Badge débloqué récemment.",
          obtainedAt: formatBadgeDate(badge.unlocked_at),
          unlocked: true,
        };
      });

    if (!badges.length) {
      return [
        {
          id: "start-badges",
          title: "Débloque ton premier badge",
          description: "Complète un module ou un quiz pour gagner tes premières récompenses.",
          unlocked: false,
        },
      ];
    }

    return badges;
  }, [userBadges]);

  const upcomingBadges = useMemo(() => {
    const remaining = allBadges
      .filter((badge) => !unlockedBadgeCodes.has(badge.code))
      .slice(0, 4)
      .map((badge) => ({
        id: badge.code,
        title: badge.title,
        description: badge.description,
        unlocked: false,
      }));

    if (!remaining.length) {
      return [
        {
          id: "all-badges-completed",
          title: "Tous les badges débloqués",
          description: "De nouvelles récompenses arrivent bientôt — reste à l'écoute.",
          unlocked: true,
        },
      ];
    }

    return remaining;
  }, [unlockedBadgeCodes]);

  const isLoadingCourses = userLoading || progressLoading;
  const shouldPromptLogin = !userLoading && !user;

  return (
    <div className="min-h-screen bg-[#F4F6FB] pb-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#E3ECFF_0%,transparent_55%)]" />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(135deg,#F8FAFF_0%,#EEF2FF_100%)]" />
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 pt-16">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-8">
            <ProgressCard
              level={level}
              currentXp={currentXp}
              nextLevelXp={nextLevelXp}
              weeklyXp={weeklyXp}
              streakDays={0}
            />

            <section className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-[#0B1728]">Mes parcours</h2>
                  <p className="text-sm text-[#64748B]">
                    Retrouve les modules que tu as déjà entamés et poursuis ta progression.
                  </p>
                </div>
                <Link
                  href="/parcours"
                  className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] px-4 py-2 text-sm font-semibold text-[#0B1728] transition-all hover:border-[#0B1728] hover:bg-[#0B1728]/5"
                >
                  Voir tout →
                </Link>
              </div>
              {shouldPromptLogin ? (
                <div className="rounded-3xl border border-[#E2E8F0] bg-[#F8FAFF] p-8 text-center text-sm text-[#4B5A6B]">
                  Connecte-toi pour retrouver tes parcours personnalisés et ta progression.
                </div>
              ) : isLoadingCourses ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {[0, 1, 2].map((index) => (
                    <div
                      key={index}
                      className="h-48 animate-pulse rounded-3xl border border-[#E2E8F0] bg-[#F8FAFF]"
                    />
                  ))}
                </div>
              ) : activeCourses.length ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {activeCourses.map((parcours) => (
                    <ParcoursCard key={parcours.id} parcours={parcours} />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-[#CBD5E1] bg-[#F8FAFF] p-8 text-sm text-[#4B5A6B]">
                  Tu n&apos;as pas encore commencé de parcours. Explore les modules corporate et marché
                  pour démarrer ton apprentissage.
                </div>
              )}
            </section>

            <BadgesGrid recentBadges={recentBadges} upcomingBadges={upcomingBadges} />

            <section className="rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-[0_35px_110px_-70px_rgba(15,23,42,0.5)]">
              <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <h3 className="text-2xl font-semibold text-[#0B1728]">Prêt à continuer ?</h3>
                  <p className="mt-2 text-sm text-[#64748B]">
                    Choisis ton prochain move : renforcer tes parcours ou lancer une nouvelle simulation IA.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/parcours"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3F76FF] to-[#7C4DFF] px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_-25px_rgba(63,118,255,0.7)] transition-transform hover:-translate-y-1"
                  >
                    Voir mes parcours
                  </Link>
                  <Link
                    href="/entretien-ia"
                    className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] px-6 py-3 text-sm font-semibold text-[#0B1728] transition-all hover:border-[#0B1728] hover:bg-[#0B1728]/5"
                  >
                    Lancer un entraînement IA
                  </Link>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <WalletSummaryCard />
            <StatsPanel headline="Gamification & IA" stats={stats} />

            <section className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-[0_30px_90px_-65px_rgba(15,23,42,0.45)]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#0B1728]">Mentors & Lives</h3>
                <button className="text-xs font-semibold text-[#3F76FF] transition-colors hover:text-[#1D4ED8]">
                  Voir tout
                </button>
              </div>
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFF] p-4">
                  <p className="text-sm font-semibold text-[#0B1728]">Session live : Structuration de deal LBO</p>
                  <p className="text-xs text-[#64748B]">Avec Amélie D., Directrice M&A • 17 octobre, 19h</p>
                </div>
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFF] p-4">
                  <p className="text-sm font-semibold text-[#0B1728]">Mentoring 1:1 confirmé</p>
                  <p className="text-xs text-[#64748B]">Coach IA + Mentor senior • Jeudi 09h30</p>
                </div>
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
                  <p className="text-sm font-semibold text-[#0B1728]">Rappel : uploader ton pitch deck</p>
                  <p className="text-xs text-[#64748B]">Deadline dans 2 jours</p>
                </div>
              </div>
            </section>

            <WalletTransactionsCard />
          </div>
        </div>
      </div>
    </div>
  );
}
