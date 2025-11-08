export interface ExamCase {
  id: number;
  title: string;
  description: string;
  data: {
    chiffreAffaires: number;
    resultatNet: number;
    actifTotal: number;
    capitauxPropres: number;
    dettesFinancieres: number;
    tauxImposition: number;
    coutFondsPropres: number;
    coutDette: number;
    beta?: number;
  };
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
}

export const examCasesFinanceEntreprise: ExamCase[] = [
  {
    id: 1,
    title: "Cas 1 – FinX Auto SA",
    description: "FinX Auto est un constructeur automobile. Voici les données de l'année N.",
    data: {
      chiffreAffaires: 15000000,
      resultatNet: 1200000,
      actifTotal: 9000000,
      capitauxPropres: 4000000,
      dettesFinancieres: 3000000,
      tauxImposition: 0.25,
      coutFondsPropres: 0.12,
      coutDette: 0.06,
    },
    questions: [
      {
        question: "Calcule la marge nette de FinX Auto.",
        options: ["6%", "8%", "10%", "12%"],
        correctAnswer: "8%",
      },
      {
        question: "Calcule le ROA (Return on Assets).",
        options: ["10%", "13.3%", "15%", "18%"],
        correctAnswer: "13.3%",
      },
      {
        question: "Calcule le ROE (Return on Equity).",
        options: ["25%", "30%", "35%", "40%"],
        correctAnswer: "30%",
      },
      {
        question: "Calcule le WACC de l'entreprise.",
        options: ["7.5%", "8.79%", "9.5%", "10%"],
        correctAnswer: "8.79%",
      },
      {
        question: "Si le ROIC de l'entreprise est de 10%, l'entreprise crée-t-elle de la valeur ?",
        options: ["Oui, création de valeur", "Non, destruction de valeur", "Neutre", "Impossible à déterminer"],
        correctAnswer: "Oui, création de valeur",
      },
    ],
  },
  {
    id: 2,
    title: "Cas 2 – TechCorp Industries",
    description: "TechCorp est une entreprise technologique en croissance. Analysez sa situation financière.",
    data: {
      chiffreAffaires: 25000000,
      resultatNet: 2000000,
      actifTotal: 18000000,
      capitauxPropres: 10000000,
      dettesFinancieres: 5000000,
      tauxImposition: 0.25,
      coutFondsPropres: 0.15,
      coutDette: 0.05,
    },
    questions: [
      {
        question: "Calcule la marge nette de TechCorp.",
        options: ["6%", "8%", "10%", "12%"],
        correctAnswer: "8%",
      },
      {
        question: "Calcule le ROA.",
        options: ["9%", "11.1%", "13%", "15%"],
        correctAnswer: "11.1%",
      },
      {
        question: "Calcule le ROE.",
        options: ["15%", "20%", "25%", "30%"],
        correctAnswer: "20%",
      },
      {
        question: "Calcule le WACC.",
        options: ["10%", "11.25%", "12%", "13%"],
        correctAnswer: "11.25%",
      },
      {
        question: "Si le ROIC est de 12%, l'entreprise crée-t-elle de la valeur ?",
        options: ["Oui, création de valeur", "Non, destruction de valeur", "Neutre", "Impossible à déterminer"],
        correctAnswer: "Oui, création de valeur",
      },
    ],
  },
  {
    id: 3,
    title: "Cas 3 – RetailMax Distribution",
    description: "RetailMax est une chaîne de distribution. Évaluez sa performance financière.",
    data: {
      chiffreAffaires: 50000000,
      resultatNet: 3000000,
      actifTotal: 35000000,
      capitauxPropres: 20000000,
      dettesFinancieres: 10000000,
      tauxImposition: 0.25,
      coutFondsPropres: 0.10,
      coutDette: 0.04,
    },
    questions: [
      {
        question: "Calcule la marge nette de RetailMax.",
        options: ["4%", "6%", "8%", "10%"],
        correctAnswer: "6%",
      },
      {
        question: "Calcule le ROA.",
        options: ["7%", "8.6%", "10%", "12%"],
        correctAnswer: "8.6%",
      },
      {
        question: "Calcule le ROE.",
        options: ["12%", "15%", "18%", "20%"],
        correctAnswer: "15%",
      },
      {
        question: "Calcule le WACC.",
        options: ["7%", "7.7%", "8.5%", "9%"],
        correctAnswer: "7.7%",
      },
      {
        question: "Si le ROIC est de 9%, l'entreprise crée-t-elle de la valeur ?",
        options: ["Oui, création de valeur", "Non, destruction de valeur", "Neutre", "Impossible à déterminer"],
        correctAnswer: "Oui, création de valeur",
      },
    ],
  },
  {
    id: 4,
    title: "Cas 4 – PharmaBio Solutions",
    description: "PharmaBio est une entreprise pharmaceutique. Analysez sa structure financière.",
    data: {
      chiffreAffaires: 80000000,
      resultatNet: 10000000,
      actifTotal: 60000000,
      capitauxPropres: 35000000,
      dettesFinancieres: 20000000,
      tauxImposition: 0.25,
      coutFondsPropres: 0.12,
      coutDette: 0.05,
    },
    questions: [
      {
        question: "Calcule la marge nette de PharmaBio.",
        options: ["10%", "12.5%", "15%", "18%"],
        correctAnswer: "12.5%",
      },
      {
        question: "Calcule le ROA.",
        options: ["14%", "16.7%", "18%", "20%"],
        correctAnswer: "16.7%",
      },
      {
        question: "Calcule le ROE.",
        options: ["25%", "28.6%", "30%", "35%"],
        correctAnswer: "28.6%",
      },
      {
        question: "Calcule le WACC.",
        options: ["8%", "8.9%", "9.0%", "10%"],
        correctAnswer: "9.0%",
      },
      {
        question: "Si le ROIC est de 15%, l'entreprise crée-t-elle de la valeur ?",
        options: ["Oui, création de valeur", "Non, destruction de valeur", "Neutre", "Impossible à déterminer"],
        correctAnswer: "Oui, création de valeur",
      },
    ],
  },
  {
    id: 5,
    title: "Cas 5 – EnergyGreen Power",
    description: "EnergyGreen est une entreprise d'énergie renouvelable. Évaluez sa rentabilité.",
    data: {
      chiffreAffaires: 120000000,
      resultatNet: 15000000,
      actifTotal: 150000000,
      capitauxPropres: 80000000,
      dettesFinancieres: 60000000,
      tauxImposition: 0.25,
      coutFondsPropres: 0.11,
      coutDette: 0.04,
    },
    questions: [
      {
        question: "Calcule la marge nette d'EnergyGreen.",
        options: ["10%", "12.5%", "15%", "18%"],
        correctAnswer: "12.5%",
      },
      {
        question: "Calcule le ROA.",
        options: ["8%", "10%", "12%", "15%"],
        correctAnswer: "10%",
      },
      {
        question: "Calcule le ROE.",
        options: ["15%", "18.75%", "20%", "25%"],
        correctAnswer: "18.75%",
      },
      {
        question: "Calcule le WACC.",
        options: ["7%", "7.5%", "8%", "8.5%"],
        correctAnswer: "7.5%",
      },
      {
        question: "Si le ROIC est de 11%, l'entreprise crée-t-elle de la valeur ?",
        options: ["Oui, création de valeur", "Non, destruction de valeur", "Neutre", "Impossible à déterminer"],
        correctAnswer: "Oui, création de valeur",
      },
    ],
  },
  {
    id: 6,
    title: "Cas 6 – FoodService Group",
    description: "FoodService est un groupe de restauration. Analysez ses performances.",
    data: {
      chiffreAffaires: 30000000,
      resultatNet: 1800000,
      actifTotal: 22000000,
      capitauxPropres: 12000000,
      dettesFinancieres: 8000000,
      tauxImposition: 0.25,
      coutFondsPropres: 0.13,
      coutDette: 0.06,
    },
    questions: [
      {
        question: "Calcule la marge nette de FoodService.",
        options: ["4%", "6%", "8%", "10%"],
        correctAnswer: "6%",
      },
      {
        question: "Calcule le ROA.",
        options: ["6%", "8.2%", "10%", "12%"],
        correctAnswer: "8.2%",
      },
      {
        question: "Calcule le ROE.",
        options: ["12%", "15%", "18%", "20%"],
        correctAnswer: "15%",
      },
      {
        question: "Calcule le WACC.",
        options: ["8%", "9.3%", "9.6%", "10%"],
        correctAnswer: "9.6%",
      },
      {
        question: "Si le ROIC est de 8%, l'entreprise crée-t-elle de la valeur ?",
        options: ["Oui, création de valeur", "Non, destruction de valeur", "Neutre", "Impossible à déterminer"],
        correctAnswer: "Non, destruction de valeur",
      },
    ],
  },
  {
    id: 7,
    title: "Cas 7 – MediaStream Digital",
    description: "MediaStream est une entreprise de médias numériques. Évaluez sa situation.",
    data: {
      chiffreAffaires: 40000000,
      resultatNet: 5000000,
      actifTotal: 30000000,
      capitauxPropres: 18000000,
      dettesFinancieres: 10000000,
      tauxImposition: 0.25,
      coutFondsPropres: 0.14,
      coutDette: 0.05,
    },
    questions: [
      {
        question: "Calcule la marge nette de MediaStream.",
        options: ["10%", "12.5%", "15%", "18%"],
        correctAnswer: "12.5%",
      },
      {
        question: "Calcule le ROA.",
        options: ["14%", "16.7%", "18%", "20%"],
        correctAnswer: "16.7%",
      },
      {
        question: "Calcule le ROE.",
        options: ["25%", "27.8%", "30%", "35%"],
        correctAnswer: "27.8%",
      },
      {
        question: "Calcule le WACC.",
        options: ["9%", "10.1%", "11%", "12%"],
        correctAnswer: "10.1%",
      },
      {
        question: "Si le ROIC est de 17%, l'entreprise crée-t-elle de la valeur ?",
        options: ["Oui, création de valeur", "Non, destruction de valeur", "Neutre", "Impossible à déterminer"],
        correctAnswer: "Oui, création de valeur",
      },
    ],
  },
  {
    id: 8,
    title: "Cas 8 – ConstructionBuild SA",
    description: "ConstructionBuild est une entreprise de construction. Analysez sa rentabilité.",
    data: {
      chiffreAffaires: 60000000,
      resultatNet: 4200000,
      actifTotal: 45000000,
      capitauxPropres: 25000000,
      dettesFinancieres: 15000000,
      tauxImposition: 0.25,
      coutFondsPropres: 0.11,
      coutDette: 0.05,
    },
    questions: [
      {
        question: "Calcule la marge nette de ConstructionBuild.",
        options: ["5%", "7%", "8%", "10%"],
        correctAnswer: "7%",
      },
      {
        question: "Calcule le ROA.",
        options: ["8%", "9.3%", "10%", "12%"],
        correctAnswer: "9.3%",
      },
      {
        question: "Calcule le ROE.",
        options: ["14%", "16.8%", "18%", "20%"],
        correctAnswer: "16.8%",
      },
      {
        question: "Calcule le WACC.",
        options: ["7%", "8.1%", "9%", "10%"],
        correctAnswer: "8.1%",
      },
      {
        question: "Si le ROIC est de 9%, l'entreprise crée-t-elle de la valeur ?",
        options: ["Oui, création de valeur", "Non, destruction de valeur", "Neutre", "Impossible à déterminer"],
        correctAnswer: "Oui, création de valeur",
      },
    ],
  },
  {
    id: 9,
    title: "Cas 9 – LogisticsPro Transport",
    description: "LogisticsPro est une entreprise de logistique. Évaluez sa performance.",
    data: {
      chiffreAffaires: 70000000,
      resultatNet: 5600000,
      actifTotal: 50000000,
      capitauxPropres: 30000000,
      dettesFinancieres: 18000000,
      tauxImposition: 0.25,
      coutFondsPropres: 0.10,
      coutDette: 0.04,
    },
    questions: [
      {
        question: "Calcule la marge nette de LogisticsPro.",
        options: ["6%", "8%", "10%", "12%"],
        correctAnswer: "8%",
      },
      {
        question: "Calcule le ROA.",
        options: ["9%", "11.2%", "12%", "14%"],
        correctAnswer: "11.2%",
      },
      {
        question: "Calcule le ROE.",
        options: ["16%", "18.7%", "20%", "22%"],
        correctAnswer: "18.7%",
      },
      {
        question: "Calcule le WACC.",
        options: ["6.5%", "7.3%", "8%", "9%"],
        correctAnswer: "7.3%",
      },
      {
        question: "Si le ROIC est de 12%, l'entreprise crée-t-elle de la valeur ?",
        options: ["Oui, création de valeur", "Non, destruction de valeur", "Neutre", "Impossible à déterminer"],
        correctAnswer: "Oui, création de valeur",
      },
    ],
  },
  {
    id: 10,
    title: "Cas 10 – FinanceHub Services",
    description: "FinanceHub est une entreprise de services financiers. Analysez sa situation.",
    data: {
      chiffreAffaires: 90000000,
      resultatNet: 13500000,
      actifTotal: 80000000,
      capitauxPropres: 50000000,
      dettesFinancieres: 25000000,
      tauxImposition: 0.25,
      coutFondsPropres: 0.12,
      coutDette: 0.05,
    },
    questions: [
      {
        question: "Calcule la marge nette de FinanceHub.",
        options: ["12%", "15%", "18%", "20%"],
        correctAnswer: "15%",
      },
      {
        question: "Calcule le ROA.",
        options: ["14%", "16.9%", "18%", "20%"],
        correctAnswer: "16.9%",
      },
      {
        question: "Calcule le ROE.",
        options: ["24%", "27%", "30%", "35%"],
        correctAnswer: "27%",
      },
      {
        question: "Calcule le WACC.",
        options: ["8%", "8.8%", "9.5%", "10%"],
        correctAnswer: "8.8%",
      },
      {
        question: "Si le ROIC est de 18%, l'entreprise crée-t-elle de la valeur ?",
        options: ["Oui, création de valeur", "Non, destruction de valeur", "Neutre", "Impossible à déterminer"],
        correctAnswer: "Oui, création de valeur",
      },
    ],
  },
];

/**
 * Sélectionne un cas d'examen aléatoirement
 */
export function getRandomExamCase(): ExamCase {
  const randomIndex = Math.floor(Math.random() * examCasesFinanceEntreprise.length);
  return examCasesFinanceEntreprise[randomIndex];
}

