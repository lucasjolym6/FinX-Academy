"use client";

import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { useLessonCompletion } from "@/hooks/useLessonCompletion";

type Lesson = {
  title: string;
  slug: string;
  type: "lesson" | "quiz" | "exam";
  xp: number;
  description: string;
  duration: string;
  order: number;
};

const lessons: Lesson[] = [
  {
    title: "Lecture analytique des états financiers",
    slug: "lecture-analytique-etats-financiers",
    type: "lesson",
    xp: 25,
    description: "Aller au-delà de la simple lecture du bilan et du compte de résultat, en repérant les signaux faibles et les ratios d'évolution.",
    duration: "30 min",
    order: 1,
  },
  {
    title: "Analyse des marges, rentabilités et structure de coûts",
    slug: "analyse-marges-rentabilites",
    type: "lesson",
    xp: 25,
    description: "Approfondir les ratios de rentabilité, la marge opérationnelle et l'effet de levier financier.",
    duration: "35 min",
    order: 2,
  },
  {
    title: "Structure financière, solvabilité et risque",
    slug: "structure-financiere-solvabilite",
    type: "lesson",
    xp: 25,
    description: "Mesurer la stabilité du financement et la capacité à supporter la dette avec des ratios avancés.",
    duration: "30 min",
    order: 3,
  },
  {
    title: "Flux de trésorerie et dynamique de liquidité",
    slug: "flux-tresorerie-dynamique-liquidite",
    type: "lesson",
    xp: 25,
    description: "Comprendre comment les flux de trésorerie traduisent la performance réelle et analyser le BFR.",
    duration: "35 min",
    order: 4,
  },
  {
    title: "Diagnostic global : performance, risque et liquidité",
    slug: "diagnostic-global",
    type: "lesson",
    xp: 25,
    description: "Combiner toutes les analyses pour rédiger un diagnostic synthétique avec un système de scoring.",
    duration: "30 min",
    order: 5,
  },
  {
    title: "Étude de cas intégrée",
    slug: "etude-cas-integree",
    type: "quiz",
    xp: 25,
    description: "Analyser un jeu de données d'entreprise sur 3 ans et produire un diagnostic complet avec recommandations.",
    duration: "40 min",
    order: 6,
  },
  {
    title: "Grand Cas d'Analyse Financière",
    slug: "examen-final",
    type: "exam",
    xp: 750,
    description: "Examen final pour valider l'ensemble des notions abordées dans le module d'analyse financière.",
    duration: "60 min",
    order: 7,
  },
];

const MODULE_ID = "finance-entreprise/analyse-financiere";

export default function ModuleAnalyseFinancierePage() {
  const { user, loading: userLoading } = useUser();
  const { isLessonUnlocked, isLessonCompleted, loading: completionLoading } = useLessonCompletion(
    user,
    MODULE_ID
  );

  const moduleTitle = "Analyse financière & diagnostic";
  const moduleLevel = "Intermédiaire";
  const moduleDescription =
    "Ce module vous permettra de maîtriser l'analyse financière approfondie, le diagnostic d'entreprise et la prise de décision stratégique basée sur les données financières.";
  
  // Attendre que les données soient chargées avant de calculer la progression
  const isLoading = userLoading || completionLoading;
  
  // Calculer la progression basée sur les leçons complétées
  // Ne calculer que si les données sont chargées
  const completedCount = isLoading ? 0 : lessons.filter((l) => isLessonCompleted(l.slug)).length;
  const progress = isLoading ? 0 : Math.round((completedCount / lessons.length) * 100);
  const totalXp = lessons.reduce((sum, l) => sum + l.xp, 0);

  return (
    <main className="bg-gray-50 min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/parcours" className="hover:text-[#0A2540] transition-colors">
              Parcours
            </Link>
            <span>/</span>
            <Link href="/parcours" className="hover:text-[#0A2540] transition-colors">
              Finance d&apos;entreprise
            </Link>
            <span>/</span>
            <span className="text-gray-400">Analyse financière</span>
          </div>
        </nav>

        {/* Header du module */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center rounded px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                  {moduleLevel}
                </span>
                <span className="text-sm text-gray-500">Module 2</span>
                <span className="text-sm text-gray-500">·</span>
                <span className="text-sm text-gray-500">{lessons.length} leçons</span>
                <span className="text-sm text-gray-500">·</span>
                <span className="text-sm text-gray-500">{totalXp} XP</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
                {moduleTitle}
              </h1>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl mb-6">
                {moduleDescription}
              </p>
            </div>
          </div>

          {/* Progression */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">Progression du module</span>
              <span className="text-sm font-semibold text-gray-900">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-[#F5B301] h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Bouton Commencer */}
          <Link
            href={`/modules/finance-entreprise/analyse-financiere/${lessons[0]?.slug || "#"}`}
            className="inline-flex items-center justify-center rounded-md bg-[#F5B301] px-6 py-3 text-sm font-semibold text-[#0A2540] hover:bg-[#e3a500] transition-colors"
          >
            Commencer ce module
          </Link>
        </div>

        {/* Liste des leçons */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Leçons du module</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lessons.map((lesson) => {
              const lessonUnlocked = isLessonUnlocked(lesson.order, lessons.map((l) => ({ order: l.order, slug: l.slug })));
              const lessonCompleted = isLessonCompleted(lesson.slug);

              return (
                <div
                  key={lesson.slug}
                  className={`block bg-white rounded-xl border ${
                    lessonUnlocked
                      ? "border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group"
                      : "border-gray-200 shadow-sm opacity-60 cursor-not-allowed"
                  }`}
                >
                  {lessonUnlocked ? (
                    <Link
                      href={`/modules/finance-entreprise/analyse-financiere/${lesson.slug}`}
                      className="block p-6"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded text-sm font-bold flex-shrink-0 ${
                              lessonCompleted
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {lesson.order}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#0A2540] transition-colors">
                              {lesson.title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {lesson.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">{lesson.duration}</span>
                          {lesson.type === "quiz" && (
                            <span className="text-xs text-gray-500">· Quiz</span>
                          )}
                          {lesson.type === "exam" && (
                            <span className="text-xs text-gray-500">· Examen</span>
                          )}
                          <span className="text-xs text-gray-400">+{lesson.xp} XP</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {lessonCompleted && (
                            <span className="text-green-600 text-sm">✓</span>
                          )}
                          <span className="text-xs font-medium text-[#0A2540] group-hover:underline">
                            Commencer →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div
                      className="p-6 cursor-not-allowed relative"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        alert("Cette leçon est verrouillée. Vous devez compléter la leçon précédente pour y accéder.");
                      }}
                      title="Cette leçon est verrouillée. Complétez la leçon précédente pour y accéder."
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-200 text-sm font-bold text-gray-500 flex-shrink-0">
                            {lesson.order}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-400 mb-2">
                              {lesson.title}
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                              {lesson.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400">{lesson.duration}</span>
                          {lesson.type === "quiz" && (
                            <span className="text-xs text-gray-400">· Quiz</span>
                          )}
                          {lesson.type === "exam" && (
                            <span className="text-xs text-gray-400">· Examen</span>
                          )}
                          <span className="text-xs text-gray-400">+{lesson.xp} XP</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-lg">🔒</span>
                          <span className="text-xs font-medium text-gray-400">
                            Verrouillée
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

