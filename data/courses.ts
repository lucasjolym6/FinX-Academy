import type { Theme } from "@/components/ThemeSection";

export const themes: Theme[] = [
  {
    id: "corp-finance",
    title: "Finance d'entreprise",
    description:
      "Construis des bases solides en finance d'entreprise, analyse financière, décisions d'investissement et de financement.",
    icon: "💼",
    tracks: [
      {
        id: "corp-basics",
        title: "Fondamentaux de la finance d'entreprise",
        difficulty: "Débutant",
        slug: "/modules/finance-entreprise/fondamentaux",
        description:
          "Rôle de la finance d'entreprise, états financiers, cash-flow, création de valeur.",
      },
      {
        id: "corp-analysis",
        title: "Analyse financière & diagnostic",
        difficulty: "Intermédiaire",
        slug: "/modules/finance-entreprise/analyse-financiere",
        description:
          "Ratios clés, analyse de performance, solvabilité, structure financière, diagnostic complet.",
      },
      {
        id: "corp-invest-financing",
        title: "Investissement, financement & valorisation",
        difficulty: "Avancé",
        slug: "/modules/finance-entreprise/investissement-valorisation",
        description:
          "VAN, TRI, coût du capital, structure du capital, politique de dividende, introduction M&A.",
      },
      {
        id: "corp-ma-advanced",
        title: "M&A approfondi & stratégie d'acquisition",
        difficulty: "Avancé",
        slug: "#",
        description:
          "Stratégie d'acquisition, due diligence, structuration d'opérations, intégration post-fusion, financement LBO.",
        comingSoon: true,
      },
      {
        id: "corp-restructuring",
        title: "Restructuration & financement structuré",
        difficulty: "Avancé",
        slug: "#",
        description:
          "Restructuration financière, refinancement, financement structuré, dette mezzanine, financement de projets.",
        comingSoon: true,
      },
      {
        id: "corp-treasury",
        title: "Gestion de trésorerie avancée",
        difficulty: "Intermédiaire",
        slug: "#",
        description:
          "Optimisation de trésorerie, gestion du BFR, instruments de financement court terme, gestion des risques de change.",
        comingSoon: true,
      },
      {
        id: "corp-fundraising",
        title: "Financement d'entreprise & levée de fonds",
        difficulty: "Intermédiaire",
        slug: "#",
        description:
          "Levée de fonds, capital-risque, private equity, évaluation startup, négociation de levées, tableaux de bord investisseurs.",
        comingSoon: true,
      },
    ],
  },
  {
    id: "market-finance",
    title: "Finance de marché",
    description:
      "Comprends le fonctionnement des marchés, des produits financiers et de la gestion des risques.",
    icon: "📈",
    tracks: [
      {
        id: "markets-basics",
        title: "Fondamentaux des marchés financiers",
        difficulty: "Débutant",
        slug: "/parcours/finance-marche/fondamentaux",
        description:
          "Types de marchés, acteurs, ordres, indices boursiers, logiques de rendement et de risque.",
      },
      {
        id: "markets-assets",
        title: "Actions, obligations & portefeuille",
        difficulty: "Intermédiaire",
        slug: "/parcours/finance-marche/portefeuille",
        description:
          "Obligations, actions, rendement / risque, diversification, introduction à la gestion de portefeuille.",
      },
      {
        id: "markets-derivatives",
        title: "Dérivés & gestion des risques",
        difficulty: "Avancé",
        slug: "/parcours/finance-marche/derives-risque",
        description:
          "Options, futures, swaps, couverture des risques de marché, introduction aux produits structurés.",
      },
    ],
  },
];

/**
 * Convertit les thèmes en liste de parcours pour le dashboard et la page d'accueil
 */
export function getAvailableCourses() {
  return themes.map((theme) => ({
    id: theme.id,
    title: theme.title,
    description: theme.description,
    difficulty: theme.tracks[0]?.difficulty || ("Débutant" as const),
    icon: theme.icon,
    slug: theme.id,
  }));
}
