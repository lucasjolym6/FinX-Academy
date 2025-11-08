export interface ExamCase {
  id: number;
  title: string;
  description: string;
  data: {
    // Données pour VAN/TRI
    investissementInitial?: number;
    fluxTresorerie?: number[]; // Flux de trésorerie sur plusieurs années
    coutCapital?: number; // WACC ou taux d'actualisation
    
    // Données pour structure du capital
    actifTotal?: number;
    capitauxPropres?: number;
    dettesFinancieres?: number;
    resultatNet?: number;
    resultatExploitation?: number;
    coutFondsPropres?: number;
    coutDette?: number;
    tauxImposition?: number;
    
    // Données pour valorisation DCF
    fcf?: number[]; // Free Cash Flow sur plusieurs années
    tauxCroissance?: number; // Taux de croissance à long terme
    detteNette?: number;
    
    // Données pour multiples
    ebitda?: number;
    chiffreAffaires?: number;
    multipleEVEBITDA?: number; // Multiple moyen du marché
    
    // Données pour M&A
    valeurStandalone?: number;
    valeurMarche?: number;
    prixPropose?: number;
    synergiesAttendues?: number;
  };
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
}

export const examCasesInvestissementValorisation: ExamCase[] = [
  {
    id: 1,
    title: "Cas 1 – Projet d'investissement TechCorp",
    description: "TechCorp envisage d'investir dans un nouveau projet technologique. Analysez la rentabilité du projet.",
    data: {
      investissementInitial: 500000,
      fluxTresorerie: [100000, 150000, 200000, 250000, 300000],
      coutCapital: 0.12,
    },
    questions: [
      {
        question: "Calculez la VAN (Valeur Actuelle Nette) du projet.",
        options: ["+150 000 €", "+175 000 €", "+180 000 €", "+200 000 €"],
        correctAnswer: "+180 000 €",
      },
      {
        question: "Le projet crée-t-il de la valeur ?",
        options: ["Oui, VAN > 0", "Non, VAN < 0", "Neutre, VAN = 0", "Impossible à déterminer"],
        correctAnswer: "Oui, VAN > 0",
      },
      {
        question: "Quel est approximativement le TRI (Taux de Rendement Interne) du projet ?",
        options: ["20%", "22%", "24%", "26%"],
        correctAnswer: "24%",
      },
      {
        question: "Faut-il investir dans ce projet selon le TRI ?",
        options: ["Oui, TRI > coût du capital (12%)", "Non, TRI < coût du capital", "Neutre, TRI = coût du capital", "Impossible à déterminer"],
        correctAnswer: "Oui, TRI > coût du capital (12%)",
      },
      {
        question: "Si le coût du capital était de 25%, le projet serait-il rentable ?",
        options: ["Oui, VAN > 0", "Non, VAN < 0", "Neutre, VAN = 0", "Impossible à déterminer"],
        correctAnswer: "Non, VAN < 0",
      },
    ],
  },
  {
    id: 2,
    title: "Cas 2 – Structure du capital FinX Industries",
    description: "FinX Industries souhaite optimiser sa structure du capital. Analysez l'impact de l'endettement sur la rentabilité.",
    data: {
      actifTotal: 10000000,
      capitauxPropres: 6000000,
      dettesFinancieres: 4000000,
      resultatNet: 800000,
      resultatExploitation: 1200000,
      coutFondsPropres: 0.14,
      coutDette: 0.06,
      tauxImposition: 0.25,
    },
    questions: [
      {
        question: "Calculez le ROA (Return on Assets).",
        options: ["8%", "10%", "12%", "15%"],
        correctAnswer: "8%",
      },
      {
        question: "Calculez le ROE (Return on Equity).",
        options: ["10%", "13.3%", "15%", "18%"],
        correctAnswer: "13.3%",
      },
      {
        question: "Calculez le WACC (Weighted Average Cost of Capital).",
        options: ["9.5%", "10.2%", "11.0%", "12.0%"],
        correctAnswer: "10.2%",
      },
      {
        question: "L'effet de levier financier est-il positif ?",
        options: ["Oui, ROA (8%) > coût de la dette (6%)", "Non, ROA < coût de la dette", "Neutre, ROA = coût de la dette", "Impossible à déterminer"],
        correctAnswer: "Oui, ROA (8%) > coût de la dette (6%)",
      },
      {
        question: "Si l'entreprise augmentait sa dette à 6 M€ (capitaux propres = 4 M€), quel serait le nouveau WACC ?",
        options: ["9.0%", "9.5%", "10.0%", "10.5%"],
        correctAnswer: "9.5%",
      },
    ],
  },
  {
    id: 3,
    title: "Cas 3 – Valorisation DCF PharmaBio",
    description: "Valorisez PharmaBio en utilisant la méthode DCF (Discounted Cash Flow).",
    data: {
      fcf: [5000000, 6000000, 7000000, 8000000, 9000000],
      coutCapital: 0.10,
      tauxCroissance: 0.03,
      detteNette: 20000000,
    },
    questions: [
      {
        question: "Calculez la valeur actuelle des flux de trésorerie sur 5 ans.",
        options: ["25,0 M€", "25,8 M€", "26,5 M€", "28,0 M€"],
        correctAnswer: "25,8 M€",
      },
      {
        question: "Calculez la valeur terminale (méthode de Gordon).",
        options: ["120 M€", "132,4 M€", "135 M€", "140 M€"],
        correctAnswer: "132,4 M€",
      },
      {
        question: "Calculez la valeur de l'entreprise (EV).",
        options: ["105 M€", "108 M€", "110 M€", "115 M€"],
        correctAnswer: "108 M€",
      },
      {
        question: "Calculez la valeur des capitaux propres.",
        options: ["85 M€", "88 M€", "90 M€", "95 M€"],
        correctAnswer: "88 M€",
      },
      {
        question: "Quelle part de la valeur totale représente la valeur terminale ?",
        options: ["70%", "75%", "76%", "80%"],
        correctAnswer: "76%",
      },
    ],
  },
  {
    id: 4,
    title: "Cas 4 – Valorisation par multiples RetailMax",
    description: "Valorisez RetailMax en utilisant la méthode des multiples.",
    data: {
      ebitda: 15000000,
      chiffreAffaires: 80000000,
      multipleEVEBITDA: 8.5,
      detteNette: 30000000,
    },
    questions: [
      {
        question: "Calculez la valeur de l'entreprise (EV) avec le multiple EV/EBITDA.",
        options: ["120 M€", "127,5 M€", "135 M€", "140 M€"],
        correctAnswer: "127,5 M€",
      },
      {
        question: "Calculez la valeur des capitaux propres.",
        options: ["90 M€", "97,5 M€", "105 M€", "110 M€"],
        correctAnswer: "97,5 M€",
      },
      {
        question: "Si le multiple EV/CA moyen du marché est de 1,5x, quelle serait la valeur de l'entreprise ?",
        options: ["110 M€", "120 M€", "130 M€", "140 M€"],
        correctAnswer: "120 M€",
      },
      {
        question: "Quelle méthode de valorisation est généralement préférée pour les valorisations détaillées ?",
        options: ["La méthode DCF", "La méthode des multiples", "La méthode des actifs", "La méthode des dividendes"],
        correctAnswer: "La méthode DCF",
      },
    ],
  },
  {
    id: 5,
    title: "Cas 5 – Opération M&A TechServices",
    description: "TechServices souhaite acquérir une entreprise cible. Analysez l'opération M&A.",
    data: {
      valeurStandalone: 50000000,
      valeurMarche: 50000000,
      prixPropose: 65000000,
      synergiesAttendues: 20000000,
    },
    questions: [
      {
        question: "Calculez la prime d'acquisition.",
        options: ["20%", "30%", "35%", "40%"],
        correctAnswer: "30%",
      },
      {
        question: "Calculez le prix maximum à payer.",
        options: ["60 M€", "70 M€", "75 M€", "80 M€"],
        correctAnswer: "70 M€",
      },
      {
        question: "L'opération crée-t-elle de la valeur pour l'acquéreur ?",
        options: ["Oui, synergies (20 M€) > prime (15 M€)", "Non, synergies < prime", "Neutre, synergies = prime", "Impossible à déterminer"],
        correctAnswer: "Oui, synergies (20 M€) > prime (15 M€)",
      },
      {
        question: "Quelle serait la valeur créée pour l'acquéreur si le prix payé était de 70 M€ ?",
        options: ["0 M€", "5 M€", "10 M€", "15 M€"],
        correctAnswer: "0 M€",
      },
      {
        question: "Quels sont les modes de financement possibles d'une opération M&A ?",
        options: ["Cash, actions, mixte, dette", "Cash uniquement", "Actions uniquement", "Dette uniquement"],
        correctAnswer: "Cash, actions, mixte, dette",
      },
    ],
  },
  {
    id: 6,
    title: "Cas 6 – Projet d'investissement EnergyGreen",
    description: "EnergyGreen envisage d'investir dans une nouvelle centrale solaire. Évaluez la rentabilité du projet.",
    data: {
      investissementInitial: 2000000,
      fluxTresorerie: [400000, 450000, 500000, 550000, 600000],
      coutCapital: 0.08,
    },
    questions: [
      {
        question: "Calculez la VAN du projet.",
        options: ["-30 000 €", "-35 000 €", "-40 000 €", "-45 000 €"],
        correctAnswer: "-35 000 €",
      },
      {
        question: "Quel est approximativement le TRI du projet ?",
        options: ["6%", "7%", "8%", "9%"],
        correctAnswer: "7%",
      },
      {
        question: "Faut-il investir dans ce projet ?",
        options: ["Non, VAN < 0 et TRI < WACC", "Oui, VAN > 0", "Neutre, VAN = 0", "Impossible à déterminer"],
        correctAnswer: "Non, VAN < 0 et TRI < WACC",
      },
      {
        question: "Si le coût du capital était de 15%, le projet serait-il rentable ?",
        options: ["Oui, VAN > 0", "Non, VAN < 0", "Neutre, VAN = 0", "Impossible à déterminer"],
        correctAnswer: "Non, VAN < 0",
      },
    ],
  },
  {
    id: 7,
    title: "Cas 7 – Structure du capital MediaStream",
    description: "MediaStream souhaite optimiser sa structure du capital. Analysez l'impact de l'endettement.",
    data: {
      actifTotal: 50000000,
      capitauxPropres: 30000000,
      dettesFinancieres: 20000000,
      resultatNet: 4500000,
      resultatExploitation: 7000000,
      coutFondsPropres: 0.13,
      coutDette: 0.05,
      tauxImposition: 0.25,
    },
    questions: [
      {
        question: "Calculez le ROA.",
        options: ["8%", "9%", "10%", "12%"],
        correctAnswer: "9%",
      },
      {
        question: "Calculez le ROE.",
        options: ["12%", "15%", "18%", "20%"],
        correctAnswer: "15%",
      },
      {
        question: "Calculez le WACC.",
        options: ["9.0%", "9.5%", "10.0%", "10.5%"],
        correctAnswer: "9.5%",
      },
      {
        question: "L'effet de levier financier est-il positif ?",
        options: ["Oui, ROA (9%) > coût de la dette (5%)", "Non, ROA < coût de la dette", "Neutre, ROA = coût de la dette", "Impossible à déterminer"],
        correctAnswer: "Oui, ROA (9%) > coût de la dette (5%)",
      },
    ],
  },
  {
    id: 8,
    title: "Cas 8 – Valorisation DCF ConstructionBuild",
    description: "Valorisez ConstructionBuild en utilisant la méthode DCF.",
    data: {
      fcf: [3000000, 3500000, 4000000, 4500000, 5000000],
      coutCapital: 0.11,
      tauxCroissance: 0.025,
      detteNette: 15000000,
    },
    questions: [
      {
        question: "Calculez la valeur actuelle des flux de trésorerie sur 5 ans.",
        options: ["14,0 M€", "14,4 M€", "15,0 M€", "16,0 M€"],
        correctAnswer: "14,4 M€",
      },
      {
        question: "Calculez la valeur terminale (méthode de Gordon).",
        options: ["55 M€", "60,3 M€", "65 M€", "70 M€"],
        correctAnswer: "60,3 M€",
      },
      {
        question: "Calculez la valeur de l'entreprise (EV).",
        options: ["48 M€", "50 M€", "52 M€", "55 M€"],
        correctAnswer: "50 M€",
      },
      {
        question: "Calculez la valeur des capitaux propres.",
        options: ["32 M€", "35 M€", "38 M€", "40 M€"],
        correctAnswer: "35 M€",
      },
    ],
  },
  {
    id: 9,
    title: "Cas 9 – Opération M&A LogisticsPro",
    description: "LogisticsPro souhaite acquérir une entreprise cible. Analysez l'opération M&A.",
    data: {
      valeurStandalone: 80000000,
      valeurMarche: 80000000,
      prixPropose: 100000000,
      synergiesAttendues: 25000000,
    },
    questions: [
      {
        question: "Calculez la prime d'acquisition.",
        options: ["20%", "25%", "30%", "35%"],
        correctAnswer: "25%",
      },
      {
        question: "Calculez le prix maximum à payer.",
        options: ["100 M€", "105 M€", "110 M€", "115 M€"],
        correctAnswer: "105 M€",
      },
      {
        question: "L'opération crée-t-elle de la valeur pour l'acquéreur ?",
        options: ["Oui, synergies (25 M€) > prime (20 M€)", "Non, synergies < prime", "Neutre, synergies = prime", "Impossible à déterminer"],
        correctAnswer: "Oui, synergies (25 M€) > prime (20 M€)",
      },
      {
        question: "Quelle serait la valeur créée pour l'acquéreur si le prix payé était de 105 M€ ?",
        options: ["0 M€", "5 M€", "10 M€", "15 M€"],
        correctAnswer: "0 M€",
      },
    ],
  },
  {
    id: 10,
    title: "Cas 10 – Valorisation complète FinanceHub",
    description: "Valorisez FinanceHub en utilisant à la fois la méthode DCF et la méthode des multiples.",
    data: {
      fcf: [8000000, 9000000, 10000000, 11000000, 12000000],
      coutCapital: 0.10,
      tauxCroissance: 0.03,
      detteNette: 40000000,
      ebitda: 20000000,
      multipleEVEBITDA: 9.0,
    },
    questions: [
      {
        question: "Calculez la valeur de l'entreprise (EV) avec la méthode DCF.",
        options: ["140 M€", "147 M€", "150 M€", "155 M€"],
        correctAnswer: "147 M€",
      },
      {
        question: "Calculez la valeur de l'entreprise (EV) avec la méthode des multiples (EV/EBITDA).",
        options: ["170 M€", "180 M€", "190 M€", "200 M€"],
        correctAnswer: "180 M€",
      },
      {
        question: "Calculez la valeur des capitaux propres avec la méthode DCF.",
        options: ["105 M€", "107 M€", "110 M€", "115 M€"],
        correctAnswer: "107 M€",
      },
      {
        question: "Quelle méthode de valorisation est généralement préférée pour les valorisations détaillées ?",
        options: ["La méthode DCF", "La méthode des multiples", "La méthode des actifs", "La méthode des dividendes"],
        correctAnswer: "La méthode DCF",
      },
      {
        question: "Pourquoi est-il important d'utiliser plusieurs méthodes de valorisation ?",
        options: [
          "Pour valider le résultat et identifier les écarts",
          "Pour choisir la valorisation la plus élevée",
          "Pour choisir la valorisation la plus faible",
          "Pour simplifier l'analyse",
        ],
        correctAnswer: "Pour valider le résultat et identifier les écarts",
      },
    ],
  },
];

/**
 * Sélectionne un cas d'examen aléatoirement
 */
export function getRandomExamCase(): ExamCase {
  if (examCasesInvestissementValorisation.length === 0) {
    throw new Error("Aucun cas d'examen disponible");
  }
  const randomIndex = Math.floor(Math.random() * examCasesInvestissementValorisation.length);
  return examCasesInvestissementValorisation[randomIndex];
}

