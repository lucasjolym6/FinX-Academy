export type CareerPath = "corp-finance" | "market-finance";

export type Job = {
  id: string;
  title: string;
  description: string;
  exampleQuestions: string[];
  careerPath: CareerPath;
  difficulty: "Étudiant" | "Junior" | "Expérimenté";
};

export const jobs: Job[] = [
  // Finance d'entreprise
  {
    id: "analyste-financier",
    title: "Analyste financier",
    description: "Analyse des états financiers, évaluation d'entreprises, recommandations d'investissement.",
    exampleQuestions: [
      "Comment évaluez-vous la santé financière d'une entreprise ?",
      "Quels ratios financiers utilisez-vous pour analyser une société ?",
      "Comment calculez-vous la valeur d'une entreprise ?",
    ],
    careerPath: "corp-finance",
    difficulty: "Junior",
  },
  {
    id: "controleur-gestion",
    title: "Contrôleur de gestion",
    description: "Pilotage de la performance, budgets, reporting, analyse des écarts.",
    exampleQuestions: [
      "Comment pilotez-vous un budget annuel ?",
      "Quels indicateurs utilisez-vous pour mesurer la performance ?",
      "Comment analysez-vous les écarts budgétaires ?",
    ],
    careerPath: "corp-finance",
    difficulty: "Junior",
  },
  {
    id: "analyste-ma",
    title: "Chargé d'affaires / Analyste M&A",
    description: "Évaluation d'opportunités de fusion-acquisition, due diligence, structuration d'opérations.",
    exampleQuestions: [
      "Comment évaluez-vous une cible d'acquisition ?",
      "Quels sont les critères clés dans une opération M&A ?",
      "Comment structurez-vous le financement d'une acquisition ?",
    ],
    careerPath: "corp-finance",
    difficulty: "Expérimenté",
  },
  {
    id: "analyste-pe",
    title: "Analyste en Private Equity",
    description: "Analyse d'opportunités d'investissement, valorisation, structuration de deals.",
    exampleQuestions: [
      "Comment évaluez-vous une opportunité en Private Equity ?",
      "Quels sont les critères de sélection d'une cible ?",
      "Comment calculez-vous le retour sur investissement attendu ?",
    ],
    careerPath: "corp-finance",
    difficulty: "Expérimenté",
  },
  {
    id: "auditeur-financier",
    title: "Auditeur financier",
    description: "Audit des comptes, vérification de la conformité, analyse des risques.",
    exampleQuestions: [
      "Comment procédez-vous à un audit financier ?",
      "Quels sont les risques principaux à identifier ?",
      "Comment vérifiez-vous la fiabilité des états financiers ?",
    ],
    careerPath: "corp-finance",
    difficulty: "Junior",
  },
  {
    id: "responsable-tresorerie",
    title: "Responsable trésorerie",
    description: "Gestion de la trésorerie, optimisation du BFR, gestion des risques de change.",
    exampleQuestions: [
      "Comment optimisez-vous la trésorerie d'une entreprise ?",
      "Quels instruments utilisez-vous pour gérer le BFR ?",
      "Comment couvrez-vous les risques de change ?",
    ],
    careerPath: "corp-finance",
    difficulty: "Junior",
  },
  // Finance de marché
  {
    id: "trader-junior",
    title: "Trader junior",
    description: "Exécution d'ordres, gestion de positions, analyse des marchés en temps réel.",
    exampleQuestions: [
      "Comment gérez-vous le risque d'une position ?",
      "Quels indicateurs suivez-vous pour prendre une décision de trading ?",
      "Comment évaluez-vous la liquidité d'un marché ?",
    ],
    careerPath: "market-finance",
    difficulty: "Junior",
  },
  {
    id: "sales-rm",
    title: "Sales / Relationship Manager",
    description: "Commercialisation de produits financiers, gestion de portefeuille clients, conseil.",
    exampleQuestions: [
      "Comment présentez-vous un produit financier à un client ?",
      "Comment adaptez-vous votre discours selon le profil du client ?",
      "Comment gérez-vous l'objection d'un client ?",
    ],
    careerPath: "market-finance",
    difficulty: "Junior",
  },
  {
    id: "analyste-risque-marche",
    title: "Analyste risque de marché",
    description: "Mesure et contrôle des risques de marché, VaR, stress testing.",
    exampleQuestions: [
      "Comment mesurez-vous le risque de marché d'un portefeuille ?",
      "Qu'est-ce que la VaR et comment la calculez-vous ?",
      "Comment évaluez-vous la sensibilité d'un portefeuille à une variation de taux ?",
    ],
    careerPath: "market-finance",
    difficulty: "Expérimenté",
  },
  {
    id: "asset-manager",
    title: "Gestionnaire d'actifs (Asset Manager)",
    description: "Gestion de portefeuilles, allocation d'actifs, stratégies d'investissement.",
    exampleQuestions: [
      "Comment construisez-vous un portefeuille d'actifs ?",
      "Quels critères utilisez-vous pour sélectionner des investissements ?",
      "Comment gérez-vous la diversification d'un portefeuille ?",
    ],
    careerPath: "market-finance",
    difficulty: "Expérimenté",
  },
  {
    id: "analyste-derives",
    title: "Analyste produits dérivés",
    description: "Analyse et valorisation de produits dérivés, stratégies de couverture.",
    exampleQuestions: [
      "Comment valorisez-vous une option ?",
      "Quels sont les risques associés aux produits dérivés ?",
      "Comment utilisez-vous les dérivés pour couvrir un portefeuille ?",
    ],
    careerPath: "market-finance",
    difficulty: "Expérimenté",
  },
  {
    id: "quant-junior",
    title: "Quant junior",
    description: "Modélisation quantitative, développement de stratégies algorithmiques, recherche.",
    exampleQuestions: [
      "Comment développez-vous un modèle quantitatif ?",
      "Quels outils mathématiques utilisez-vous pour la modélisation ?",
      "Comment validez-vous un modèle quantitatif ?",
    ],
    careerPath: "market-finance",
    difficulty: "Expérimenté",
  },
];

export function getJobsByCareerPath(careerPath: CareerPath): Job[] {
  return jobs.filter((job) => job.careerPath === careerPath);
}

export function getJobById(id: string): Job | undefined {
  return jobs.find((job) => job.id === id);
}

