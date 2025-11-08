/**
 * Définition des badges disponibles dans FinX Academy
 */
export interface BadgeDefinition {
  code: string;
  icon: string;
  title: string;
  description: string;
}

export const badgeDefinitions: Record<string, BadgeDefinition> = {
  first_login: {
    code: "first_login",
    icon: "🎯",
    title: "Premier Pas",
    description: "Complétez votre première leçon",
  },
  first_lesson: {
    code: "first_lesson",
    icon: "🎯",
    title: "Premier Pas",
    description: "Complétez votre première leçon",
  },
  streak_7: {
    code: "streak_7",
    icon: "🔥",
    title: "Sérieuse",
    description: "7 jours consécutifs d'apprentissage",
  },
  explorer: {
    code: "explorer",
    icon: "🏆",
    title: "Explorateur",
    description: "Débloquez 3 modules différents",
  },
  perfectionist: {
    code: "perfectionist",
    icon: "⭐",
    title: "Perfectionniste",
    description: "Obtenez 100% sur 5 quiz",
  },
  master: {
    code: "master",
    icon: "👑",
    title: "Maître",
    description: "Complétez un parcours complet",
  },
  legend: {
    code: "legend",
    icon: "💎",
    title: "Légende",
    description: "Atteignez le niveau 10",
  },
  rocket: {
    code: "rocket",
    icon: "🚀",
    title: "Rocket",
    description: "1000 XP en une semaine",
  },
  expert: {
    code: "expert",
    icon: "🎓",
    title: "Expert",
    description: "Complétez 3 parcours",
  },
  analyste_junior: {
    code: "analyste_junior",
    icon: "🎓",
    title: "Analyste Junior",
    description: "Réussissez l'examen final du module 1 de finance d'entreprise",
  },
  analyste_confirme: {
    code: "analyste_confirme",
    icon: "🎓",
    title: "Analyste Confirmé",
    description: "Réussissez l'examen final du module 2 d'analyse financière",
  },
  expert_finance: {
    code: "expert_finance",
    icon: "🎓",
    title: "Expert Finance",
    description: "Réussissez l'examen final du module 3 d'investissement, financement et valorisation",
  },
};

/**
 * Liste de tous les badges (pour affichage dans l'UI)
 */
export const allBadges: BadgeDefinition[] = Object.values(badgeDefinitions);

