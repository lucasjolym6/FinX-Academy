export interface ExamCase {
  id: number;
  title: string;
  description: string;
  data: {
    chiffreAffaires: number[]; // [N-2, N-1, N]
    resultatNet: number[]; // [N-2, N-1, N]
    actifTotal: number[]; // [N-2, N-1, N]
    capitauxPropres: number[]; // [N-2, N-1, N]
    dettesFinancieres: number[]; // [N-2, N-1, N]
    fluxTresorerieExploitation: number[]; // [N-2, N-1, N]
    fluxTresorerieInvestissement: number[]; // [N-2, N-1, N]
    fluxTresorerieFinancement: number[]; // [N-2, N-1, N]
    resultatExploitation: number[]; // [N-2, N-1, N]
    amortissements: number[]; // [N-2, N-1, N]
  };
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
}

export const examCasesAnalyseFinanciere: ExamCase[] = [
  {
    id: 1,
    title: "Cas 1 – FinX Manufacturing",
    description: "FinX Manufacturing est une entreprise industrielle spécialisée dans la production de composants électroniques. Analysez l'évolution de sa situation financière sur 3 ans (N-2, N-1, N).",
    data: {
      chiffreAffaires: [20000000, 24000000, 30000000],
      resultatNet: [2000000, 2200000, 2100000],
      actifTotal: [25000000, 30000000, 38000000],
      capitauxPropres: [15000000, 16000000, 18000000],
      dettesFinancieres: [8000000, 12000000, 18000000],
      fluxTresorerieExploitation: [4500000, 4200000, 3900000],
      fluxTresorerieInvestissement: [-2500000, -3000000, -3500000],
      fluxTresorerieFinancement: [-500000, 1000000, 2000000],
      resultatExploitation: [5000000, 5500000, 5800000],
      amortissements: [1500000, 2000000, 2500000],
    },
    questions: [
      {
        question: "Quelle est l'évolution de la marge opérationnelle entre N-2 et N ?",
        options: ["Amélioration (25% → 19,3%)", "Dégradation (25% → 19,3%)", "Stabilité", "Impossible à déterminer"],
        correctAnswer: "Dégradation (25% → 19,3%)",
      },
      {
        question: "Quel est le ratio d'endettement global en N ?",
        options: ["0,8", "1,0", "1,2", "1,5"],
        correctAnswer: "1,0",
      },
      {
        question: "Quelle est la capacité de remboursement en N (en années) ?",
        options: ["2,5 ans", "3,1 ans", "3,5 ans", "4,0 ans"],
        correctAnswer: "3,1 ans",
      },
      {
        question: "Quel est le ratio de couverture de la dette par l'EBITDA en N ?",
        options: ["1,8 ans", "2,2 ans", "2,5 ans", "3,0 ans"],
        correctAnswer: "2,2 ans",
      },
      {
        question: "Comment évolue le flux de trésorerie d'exploitation sur 3 ans ?",
        options: ["En hausse constante", "En baisse constante", "Stable", "Irrégulier"],
        correctAnswer: "En baisse constante",
      },
      {
        question: "Quel est le ROE (Return on Equity) en N ?",
        options: ["10,5%", "11,7%", "12,5%", "13,3%"],
        correctAnswer: "11,7%",
      },
      {
        question: "Quel est le ROA (Return on Assets) en N ?",
        options: ["4,5%", "5,5%", "6,5%", "7,5%"],
        correctAnswer: "5,5%",
      },
      {
        question: "Quelle est la capacité d'autofinancement (CAF) en N ?",
        options: ["4,0 M€", "4,6 M€", "5,0 M€", "5,5 M€"],
        correctAnswer: "4,6 M€",
      },
      {
        question: "Quel est le taux de croissance du chiffre d'affaires entre N-1 et N ?",
        options: ["20%", "25%", "30%", "35%"],
        correctAnswer: "25%",
      },
      {
        question: "Quelle est la conclusion sur la solidité financière de l'entreprise ?",
        options: [
          "Solidité financière excellente et en amélioration",
          "Solidité financière bonne mais en dégradation",
          "Solidité financière faible et en dégradation",
          "Solidité financière stable",
        ],
        correctAnswer: "Solidité financière bonne mais en dégradation",
      },
    ],
  },
  {
    id: 2,
    title: "Cas 2 – TechServices SA",
    description: "TechServices est une entreprise de services informatiques. Analysez l'évolution de sa situation financière sur 3 ans (N-2, N-1, N).",
    data: {
      chiffreAffaires: [15000000, 18000000, 22000000],
      resultatNet: [1500000, 1800000, 2000000],
      actifTotal: [20000000, 24000000, 30000000],
      capitauxPropres: [12000000, 14000000, 17000000],
      dettesFinancieres: [6000000, 8000000, 11000000],
      fluxTresorerieExploitation: [3500000, 4000000, 4500000],
      fluxTresorerieInvestissement: [-1500000, -2000000, -2500000],
      fluxTresorerieFinancement: [-1000000, -500000, 500000],
      resultatExploitation: [3000000, 3600000, 4200000],
      amortissements: [1000000, 1200000, 1500000],
    },
    questions: [
      {
        question: "Quelle est l'évolution de la marge nette entre N-2 et N ?",
        options: ["Amélioration (10% → 9,1%)", "Dégradation (10% → 9,1%)", "Stabilité", "Impossible à déterminer"],
        correctAnswer: "Dégradation (10% → 9,1%)",
      },
      {
        question: "Quel est le ratio d'autonomie financière en N ?",
        options: ["45%", "52%", "57%", "65%"],
        correctAnswer: "57%", // 56.7% arrondi à 57%
      },
      {
        question: "Quelle est la capacité de remboursement en N (en années) ?",
        options: ["2,0 ans", "2,6 ans", "3,0 ans", "3,5 ans"],
        correctAnswer: "2,6 ans",
      },
      {
        question: "Comment évolue le flux de trésorerie d'exploitation sur 3 ans ?",
        options: ["En hausse constante", "En baisse constante", "Stable", "Irrégulier"],
        correctAnswer: "En hausse constante",
      },
      {
        question: "Quel est le ratio de couverture de la dette par l'EBITDA en N ?",
        options: ["1,5 ans", "1,9 ans", "2,2 ans", "2,5 ans"],
        correctAnswer: "1,9 ans",
      },
      {
        question: "Quel est le ROE (Return on Equity) en N ?",
        options: ["10,5%", "11,8%", "12,5%", "13,3%"],
        correctAnswer: "11,8%",
      },
      {
        question: "Quelle est la capacité d'autofinancement (CAF) en N ?",
        options: ["3,0 M€", "3,5 M€", "4,0 M€", "4,5 M€"],
        correctAnswer: "3,5 M€",
      },
      {
        question: "Comment évolue le flux de trésorerie d'investissement (FTI) sur 3 ans ?",
        options: ["En hausse constante", "En baisse constante", "Stable", "Irrégulier"],
        correctAnswer: "En baisse constante",
      },
      {
        question: "Quelle est la conclusion sur la solidité financière de l'entreprise ?",
        options: [
          "Solidité financière excellente et en amélioration",
          "Solidité financière bonne mais en légère dégradation",
          "Solidité financière faible et en dégradation",
          "Solidité financière stable",
        ],
        correctAnswer: "Solidité financière bonne mais en légère dégradation",
      },
    ],
  },
  {
    id: 3,
    title: "Cas 3 – RetailCorp",
    description: "RetailCorp est une chaîne de distribution. Analysez l'évolution de sa situation financière sur 3 ans (N-2, N-1, N).",
    data: {
      chiffreAffaires: [50000000, 55000000, 60000000],
      resultatNet: [3000000, 2800000, 2400000],
      actifTotal: [40000000, 45000000, 52000000],
      capitauxPropres: [20000000, 21000000, 22000000],
      dettesFinancieres: [15000000, 18000000, 24000000],
      fluxTresorerieExploitation: [6000000, 5500000, 4800000],
      fluxTresorerieInvestissement: [-3000000, -3500000, -4000000],
      fluxTresorerieFinancement: [-2000000, 1000000, 3000000],
      resultatExploitation: [5000000, 4800000, 4200000],
      amortissements: [2000000, 2200000, 2400000],
    },
    questions: [
      {
        question: "Quelle est l'évolution de la marge nette entre N-2 et N ?",
        options: ["Amélioration (6% → 4%)", "Dégradation (6% → 4%)", "Stabilité", "Impossible à déterminer"],
        correctAnswer: "Dégradation (6% → 4%)",
      },
      {
        question: "Quel est le ratio d'endettement global en N ?",
        options: ["0,9", "1,1", "1,3", "1,5"],
        correctAnswer: "1,1", // 1.09 arrondi à 1.1
      },
      {
        question: "Quelle est la capacité de remboursement en N (en années) ?",
        options: ["4,0 ans", "5,0 ans", "5,7 ans", "6,0 ans"],
        correctAnswer: "5,7 ans",
      },
      {
        question: "Comment évolue le flux de trésorerie d'exploitation sur 3 ans ?",
        options: ["En hausse constante", "En baisse constante", "Stable", "Irrégulier"],
        correctAnswer: "En baisse constante",
      },
      {
        question: "Quel est le ratio d'autonomie financière en N ?",
        options: ["38%", "42%", "45%", "50%"],
        correctAnswer: "42%",
      },
      {
        question: "Quel est le ROA (Return on Assets) en N ?",
        options: ["4,0%", "4,6%", "5,0%", "5,5%"],
        correctAnswer: "4,6%",
      },
      {
        question: "Quelle est la capacité d'autofinancement (CAF) en N ?",
        options: ["4,0 M€", "4,8 M€", "5,0 M€", "5,5 M€"],
        correctAnswer: "4,8 M€",
      },
      {
        question: "Quel est le taux de croissance du résultat net entre N-2 et N ?",
        options: ["-20%", "-10%", "0%", "+10%"],
        correctAnswer: "-20%",
      },
      {
        question: "Quelle est la conclusion sur la solidité financière de l'entreprise ?",
        options: [
          "Solidité financière excellente et en amélioration",
          "Solidité financière acceptable mais en dégradation",
          "Solidité financière faible et en dégradation",
          "Solidité financière stable",
        ],
        correctAnswer: "Solidité financière acceptable mais en dégradation",
      },
    ],
  },
  {
    id: 4,
    title: "Cas 4 – PharmaBio",
    description: "PharmaBio est une entreprise pharmaceutique. Analysez l'évolution de sa situation financière sur 3 ans (N-2, N-1, N).",
    data: {
      chiffreAffaires: [80000000, 95000000, 115000000],
      resultatNet: [12000000, 14250000, 17250000],
      actifTotal: [100000000, 120000000, 145000000],
      capitauxPropres: [60000000, 72000000, 87000000],
      dettesFinancieres: [30000000, 38000000, 50000000],
      fluxTresorerieExploitation: [20000000, 24000000, 29000000],
      fluxTresorerieInvestissement: [-12000000, -15000000, -18000000],
      fluxTresorerieFinancement: [-5000000, -3000000, -2000000],
      resultatExploitation: [16000000, 19000000, 23000000],
      amortissements: [8000000, 10000000, 12000000],
    },
    questions: [
      {
        question: "Quelle est l'évolution de la marge opérationnelle entre N-2 et N ?",
        options: ["Amélioration (20% → 20%)", "Dégradation (20% → 20%)", "Stabilité", "Impossible à déterminer"],
        correctAnswer: "Stabilité",
      },
      {
        question: "Quel est le ratio d'endettement global en N ?",
        options: ["0,5", "0,57", "0,6", "0,65"],
        correctAnswer: "0,57",
      },
      {
        question: "Quelle est la capacité de remboursement en N (en années) ?",
        options: ["2,0 ans", "2,2 ans", "2,5 ans", "3,0 ans"],
        correctAnswer: "2,2 ans",
      },
      {
        question: "Comment évolue le flux de trésorerie d'exploitation sur 3 ans ?",
        options: ["En hausse constante", "En baisse constante", "Stable", "Irrégulier"],
        correctAnswer: "En hausse constante",
      },
      {
        question: "Quel est le ratio d'autonomie financière en N ?",
        options: ["55%", "60%", "65%", "70%"],
        correctAnswer: "60%",
      },
      {
        question: "Quel est le ROE (Return on Equity) en N ?",
        options: ["18,5%", "19,8%", "20,5%", "21,2%"],
        correctAnswer: "19,8%",
      },
      {
        question: "Quelle est la capacité d'autofinancement (CAF) en N ?",
        options: ["28,5 M€", "29,25 M€", "30,0 M€", "31,0 M€"],
        correctAnswer: "29,25 M€",
      },
      {
        question: "Quel est le taux de croissance du chiffre d'affaires entre N-2 et N ?",
        options: ["35%", "43,75%", "50%", "55%"],
        correctAnswer: "43,75%",
      },
      {
        question: "Quelle est la conclusion sur la solidité financière de l'entreprise ?",
        options: [
          "Solidité financière excellente et en amélioration",
          "Solidité financière bonne mais en dégradation",
          "Solidité financière faible et en dégradation",
          "Solidité financière stable",
        ],
        correctAnswer: "Solidité financière excellente et en amélioration",
      },
    ],
  },
  {
    id: 5,
    title: "Cas 5 – ConstructionPlus",
    description: "ConstructionPlus est une entreprise de BTP. Analysez l'évolution de sa situation financière sur 3 ans (N-2, N-1, N).",
    data: {
      chiffreAffaires: [30000000, 33000000, 36000000],
      resultatNet: [1800000, 1650000, 1440000],
      actifTotal: [35000000, 38000000, 42000000],
      capitauxPropres: [15000000, 16000000, 17000000],
      dettesFinancieres: [18000000, 20000000, 23000000],
      fluxTresorerieExploitation: [3200000, 2800000, 2400000],
      fluxTresorerieInvestissement: [-2000000, -2200000, -2500000],
      fluxTresorerieFinancement: [500000, 1000000, 1500000],
      resultatExploitation: [3000000, 2800000, 2600000],
      amortissements: [1500000, 1600000, 1800000],
    },
    questions: [
      {
        question: "Quelle est l'évolution de la marge nette entre N-2 et N ?",
        options: ["Amélioration (6% → 4%)", "Dégradation (6% → 4%)", "Stabilité", "Impossible à déterminer"],
        correctAnswer: "Dégradation (6% → 4%)",
      },
      {
        question: "Quel est le ratio d'endettement global en N ?",
        options: ["1,2", "1,35", "1,5", "1,65"],
        correctAnswer: "1,35",
      },
      {
        question: "Quelle est la capacité de remboursement en N (en années) ?",
        options: ["7,5 ans", "8,8 ans", "9,5 ans", "10,0 ans"],
        correctAnswer: "8,8 ans",
      },
      {
        question: "Comment évolue le flux de trésorerie d'exploitation sur 3 ans ?",
        options: ["En hausse constante", "En baisse constante", "Stable", "Irrégulier"],
        correctAnswer: "En baisse constante",
      },
      {
        question: "Quel est le ratio d'autonomie financière en N ?",
        options: ["38%", "40%", "42%", "45%"],
        correctAnswer: "40%",
      },
      {
        question: "Quel est le ROA (Return on Assets) en N ?",
        options: ["3,0%", "3,4%", "3,8%", "4,2%"],
        correctAnswer: "3,4%",
      },
      {
        question: "Quel est le ROE (Return on Equity) en N ?",
        options: ["7,5%", "8,5%", "9,5%", "10,5%"],
        correctAnswer: "8,5%",
      },
      {
        question: "Quelle est la capacité d'autofinancement (CAF) en N ?",
        options: ["2,5 M€", "3,0 M€", "3,24 M€", "3,5 M€"],
        correctAnswer: "3,24 M€",
      },
      {
        question: "Quelle est la conclusion sur la solidité financière de l'entreprise ?",
        options: [
          "Solidité financière excellente et en amélioration",
          "Solidité financière acceptable mais en dégradation",
          "Solidité financière faible et en dégradation",
          "Solidité financière stable",
        ],
        correctAnswer: "Solidité financière faible et en dégradation",
      },
    ],
  },
  {
    id: 6,
    title: "Cas 6 – EnergySolutions",
    description: "EnergySolutions est une entreprise du secteur de l'énergie. Analysez l'évolution de sa situation financière sur 3 ans (N-2, N-1, N).",
    data: {
      chiffreAffaires: [120000000, 135000000, 150000000],
      resultatNet: [15000000, 16200000, 18000000],
      actifTotal: [150000000, 165000000, 180000000],
      capitauxPropres: [90000000, 99000000, 108000000],
      dettesFinancieres: [50000000, 58000000, 65000000],
      fluxTresorerieExploitation: [35000000, 38000000, 42000000],
      fluxTresorerieInvestissement: [-25000000, -28000000, -30000000],
      fluxTresorerieFinancement: [-8000000, -7000000, -6000000],
      resultatExploitation: [25000000, 27000000, 30000000],
      amortissements: [15000000, 16000000, 18000000],
    },
    questions: [
      {
        question: "Quelle est l'évolution de la marge opérationnelle entre N-2 et N ?",
        options: ["Amélioration (20,8% → 20%)", "Dégradation (20,8% → 20%)", "Stabilité", "Impossible à déterminer"],
        correctAnswer: "Stabilité",
      },
      {
        question: "Quel est le ratio d'endettement global en N ?",
        options: ["0,55", "0,6", "0,65", "0,7"],
        correctAnswer: "0,6",
      },
      {
        question: "Quelle est la capacité de remboursement en N (en années) ?",
        options: ["2,0 ans", "2,2 ans", "2,5 ans", "3,0 ans"],
        correctAnswer: "2,2 ans",
      },
      {
        question: "Comment évolue le flux de trésorerie d'exploitation sur 3 ans ?",
        options: ["En hausse constante", "En baisse constante", "Stable", "Irrégulier"],
        correctAnswer: "En hausse constante",
      },
      {
        question: "Quel est le ratio d'autonomie financière en N ?",
        options: ["55%", "60%", "65%", "70%"],
        correctAnswer: "60%",
      },
      {
        question: "Quel est le ROE (Return on Equity) en N ?",
        options: ["15,5%", "16,7%", "17,5%", "18,5%"],
        correctAnswer: "16,7%",
      },
      {
        question: "Quelle est la capacité d'autofinancement (CAF) en N ?",
        options: ["34,0 M€", "36,0 M€", "38,0 M€", "40,0 M€"],
        correctAnswer: "36,0 M€",
      },
      {
        question: "Quel est le taux de croissance du résultat net entre N-2 et N ?",
        options: ["+15%", "+20%", "+25%", "+30%"],
        correctAnswer: "+20%",
      },
      {
        question: "Quelle est la conclusion sur la solidité financière de l'entreprise ?",
        options: [
          "Solidité financière excellente et en amélioration",
          "Solidité financière bonne mais en dégradation",
          "Solidité financière faible et en dégradation",
          "Solidité financière stable",
        ],
        correctAnswer: "Solidité financière excellente et en amélioration",
      },
    ],
  },
  {
    id: 7,
    title: "Cas 7 – FoodService Group",
    description: "FoodService Group est une entreprise de restauration collective. Analysez l'évolution de sa situation financière sur 3 ans (N-2, N-1, N).",
    data: {
      chiffreAffaires: [40000000, 42000000, 44000000],
      resultatNet: [2000000, 1890000, 1760000],
      actifTotal: [30000000, 32000000, 35000000],
      capitauxPropres: [12000000, 12800000, 14000000],
      dettesFinancieres: [15000000, 16000000, 18000000],
      fluxTresorerieExploitation: [3500000, 3300000, 3100000],
      fluxTresorerieInvestissement: [-1800000, -2000000, -2200000],
      fluxTresorerieFinancement: [-500000, 500000, 1000000],
      resultatExploitation: [3000000, 2900000, 2800000],
      amortissements: [1200000, 1300000, 1400000],
    },
    questions: [
      {
        question: "Quelle est l'évolution de la marge nette entre N-2 et N ?",
        options: ["Amélioration (5% → 4%)", "Dégradation (5% → 4%)", "Stabilité", "Impossible à déterminer"],
        correctAnswer: "Dégradation (5% → 4%)",
      },
      {
        question: "Quel est le ratio d'endettement global en N ?",
        options: ["1,15", "1,29", "1,35", "1,5"],
        correctAnswer: "1,29",
      },
      {
        question: "Quelle est la capacité de remboursement en N (en années) ?",
        options: ["5,5 ans", "6,0 ans", "6,4 ans", "7,0 ans"],
        correctAnswer: "6,4 ans",
      },
      {
        question: "Comment évolue le flux de trésorerie d'exploitation sur 3 ans ?",
        options: ["En hausse constante", "En baisse constante", "Stable", "Irrégulier"],
        correctAnswer: "En baisse constante",
      },
      {
        question: "Quel est le ratio d'autonomie financière en N ?",
        options: ["38%", "40%", "42%", "45%"],
        correctAnswer: "40%",
      },
      {
        question: "Quel est le ROA (Return on Assets) en N ?",
        options: ["4,5%", "5,0%", "5,5%", "6,0%"],
        correctAnswer: "5,0%",
      },
      {
        question: "Quelle est la capacité d'autofinancement (CAF) en N ?",
        options: ["2,8 M€", "3,16 M€", "3,5 M€", "4,0 M€"],
        correctAnswer: "3,16 M€",
      },
      {
        question: "Quel est le taux de croissance du résultat net entre N-2 et N ?",
        options: ["-10%", "-12%", "-15%", "-18%"],
        correctAnswer: "-12%",
      },
      {
        question: "Quelle est la conclusion sur la solidité financière de l'entreprise ?",
        options: [
          "Solidité financière excellente et en amélioration",
          "Solidité financière acceptable mais en dégradation",
          "Solidité financière faible et en dégradation",
          "Solidité financière stable",
        ],
        correctAnswer: "Solidité financière acceptable mais en dégradation",
      },
    ],
  },
  {
    id: 8,
    title: "Cas 8 – MediaGroup",
    description: "MediaGroup est une entreprise de médias et communication. Analysez l'évolution de sa situation financière sur 3 ans (N-2, N-1, N).",
    data: {
      chiffreAffaires: [60000000, 66000000, 72000000],
      resultatNet: [4800000, 5280000, 5760000],
      actifTotal: [50000000, 55000000, 60000000],
      capitauxPropres: [30000000, 33000000, 36000000],
      dettesFinancieres: [15000000, 17000000, 19000000],
      fluxTresorerieExploitation: [10000000, 11000000, 12000000],
      fluxTresorerieInvestissement: [-5000000, -5500000, -6000000],
      fluxTresorerieFinancement: [-3000000, -2500000, -2000000],
      resultatExploitation: [8000000, 8800000, 9600000],
      amortissements: [4000000, 4400000, 4800000],
    },
    questions: [
      {
        question: "Quelle est l'évolution de la marge opérationnelle entre N-2 et N ?",
        options: ["Amélioration (13,3% → 13,3%)", "Dégradation (13,3% → 13,3%)", "Stabilité", "Impossible à déterminer"],
        correctAnswer: "Stabilité",
      },
      {
        question: "Quel est le ratio d'endettement global en N ?",
        options: ["0,48", "0,53", "0,58", "0,63"],
        correctAnswer: "0,53",
      },
      {
        question: "Quelle est la capacité de remboursement en N (en années) ?",
        options: ["1,8 ans", "2,0 ans", "2,2 ans", "2,5 ans"],
        correctAnswer: "2,0 ans",
      },
      {
        question: "Comment évolue le flux de trésorerie d'exploitation sur 3 ans ?",
        options: ["En hausse constante", "En baisse constante", "Stable", "Irrégulier"],
        correctAnswer: "En hausse constante",
      },
      {
        question: "Quel est le ratio d'autonomie financière en N ?",
        options: ["55%", "60%", "65%", "70%"],
        correctAnswer: "60%",
      },
      {
        question: "Quel est le ROE (Return on Equity) en N ?",
        options: ["15,5%", "16,0%", "16,5%", "17,0%"],
        correctAnswer: "16,0%",
      },
      {
        question: "Quelle est la capacité d'autofinancement (CAF) en N ?",
        options: ["10,0 M€", "10,56 M€", "11,0 M€", "11,5 M€"],
        correctAnswer: "10,56 M€",
      },
      {
        question: "Comment évolue le flux de trésorerie de financement (FTF) sur 3 ans ?",
        options: ["En hausse constante", "En baisse constante", "Stable", "Irrégulier"],
        correctAnswer: "En baisse constante",
      },
      {
        question: "Quelle est la conclusion sur la solidité financière de l'entreprise ?",
        options: [
          "Solidité financière excellente et en amélioration",
          "Solidité financière bonne mais en dégradation",
          "Solidité financière faible et en dégradation",
          "Solidité financière stable",
        ],
        correctAnswer: "Solidité financière excellente et en amélioration",
      },
    ],
  },
  {
    id: 9,
    title: "Cas 9 – LogisticsPro",
    description: "LogisticsPro est une entreprise de logistique et transport. Analysez l'évolution de sa situation financière sur 3 ans (N-2, N-1, N).",
    data: {
      chiffreAffaires: [70000000, 77000000, 84000000],
      resultatNet: [3500000, 3465000, 3360000],
      actifTotal: [60000000, 66000000, 72000000],
      capitauxPropres: [25000000, 27000000, 29000000],
      dettesFinancieres: [30000000, 34000000, 38000000],
      fluxTresorerieExploitation: [8000000, 7500000, 7000000],
      fluxTresorerieInvestissement: [-4000000, -4500000, -5000000],
      fluxTresorerieFinancement: [1000000, 2000000, 3000000],
      resultatExploitation: [7000000, 7000000, 7000000],
      amortissements: [3000000, 3200000, 3500000],
    },
    questions: [
      {
        question: "Quelle est l'évolution de la marge nette entre N-2 et N ?",
        options: ["Amélioration (5% → 4%)", "Dégradation (5% → 4%)", "Stabilité", "Impossible à déterminer"],
        correctAnswer: "Dégradation (5% → 4%)",
      },
      {
        question: "Quel est le ratio d'endettement global en N ?",
        options: ["1,2", "1,31", "1,4", "1,5"],
        correctAnswer: "1,31",
      },
      {
        question: "Quelle est la capacité de remboursement en N (en années) ?",
        options: ["4,3 ans", "5,0 ans", "5,4 ans", "6,0 ans"],
        correctAnswer: "5,4 ans",
      },
      {
        question: "Comment évolue le flux de trésorerie d'exploitation sur 3 ans ?",
        options: ["En hausse constante", "En baisse constante", "Stable", "Irrégulier"],
        correctAnswer: "En baisse constante",
      },
      {
        question: "Quel est le ratio d'autonomie financière en N ?",
        options: ["38%", "40%", "42%", "45%"],
        correctAnswer: "40%",
      },
      {
        question: "Quel est le ROA (Return on Assets) en N ?",
        options: ["4,5%", "4,7%", "5,0%", "5,5%"],
        correctAnswer: "4,7%",
      },
      {
        question: "Quelle est la capacité d'autofinancement (CAF) en N ?",
        options: ["6,0 M€", "6,86 M€", "7,0 M€", "7,5 M€"],
        correctAnswer: "6,86 M€",
      },
      {
        question: "Comment évolue le flux de trésorerie d'investissement (FTI) sur 3 ans ?",
        options: ["En hausse constante", "En baisse constante", "Stable", "Irrégulier"],
        correctAnswer: "En baisse constante",
      },
      {
        question: "Quelle est la conclusion sur la solidité financière de l'entreprise ?",
        options: [
          "Solidité financière excellente et en amélioration",
          "Solidité financière acceptable mais en dégradation",
          "Solidité financière faible et en dégradation",
          "Solidité financière stable",
        ],
        correctAnswer: "Solidité financière acceptable mais en dégradation",
      },
    ],
  },
  {
    id: 10,
    title: "Cas 10 – GreenTech Innovations",
    description: "GreenTech Innovations est une entreprise technologique spécialisée dans les énergies renouvelables. Analysez l'évolution de sa situation financière sur 3 ans (N-2, N-1, N).",
    data: {
      chiffreAffaires: [25000000, 30000000, 36000000],
      resultatNet: [2500000, 3000000, 3600000],
      actifTotal: [35000000, 42000000, 50000000],
      capitauxPropres: [20000000, 24000000, 29000000],
      dettesFinancieres: [12000000, 15000000, 18000000],
      fluxTresorerieExploitation: [5000000, 6000000, 7200000],
      fluxTresorerieInvestissement: [-3000000, -3600000, -4300000],
      fluxTresorerieFinancement: [-1000000, -500000, 0],
      resultatExploitation: [4000000, 4800000, 5760000],
      amortissements: [2000000, 2400000, 2880000],
    },
    questions: [
      {
        question: "Quelle est l'évolution de la marge opérationnelle entre N-2 et N ?",
        options: ["Amélioration (16% → 16%)", "Dégradation (16% → 16%)", "Stabilité", "Impossible à déterminer"],
        correctAnswer: "Stabilité",
      },
      {
        question: "Quel est le ratio d'endettement global en N ?",
        options: ["0,55", "0,62", "0,68", "0,75"],
        correctAnswer: "0,62",
      },
      {
        question: "Quelle est la capacité de remboursement en N (en années) ?",
        options: ["3,0 ans", "3,1 ans", "3,5 ans", "4,0 ans"],
        correctAnswer: "3,1 ans",
      },
      {
        question: "Comment évolue le flux de trésorerie d'exploitation sur 3 ans ?",
        options: ["En hausse constante", "En baisse constante", "Stable", "Irrégulier"],
        correctAnswer: "En hausse constante",
      },
      {
        question: "Quel est le ratio d'autonomie financière en N ?",
        options: ["55%", "58%", "60%", "65%"],
        correctAnswer: "58%",
      },
      {
        question: "Quel est le ROE (Return on Equity) en N ?",
        options: ["11,5%", "12,4%", "13,0%", "13,5%"],
        correctAnswer: "12,4%",
      },
      {
        question: "Quelle est la capacité d'autofinancement (CAF) en N ?",
        options: ["6,0 M€", "6,48 M€", "7,0 M€", "7,5 M€"],
        correctAnswer: "6,48 M€",
      },
      {
        question: "Quel est le taux de croissance du chiffre d'affaires entre N-2 et N ?",
        options: ["40%", "44%", "50%", "55%"],
        correctAnswer: "44%",
      },
      {
        question: "Comment évolue le flux de trésorerie d'investissement (FTI) sur 3 ans ?",
        options: ["En hausse constante", "En baisse constante", "Stable", "Irrégulier"],
        correctAnswer: "En baisse constante",
      },
      {
        question: "Quelle est la conclusion sur la solidité financière de l'entreprise ?",
        options: [
          "Solidité financière excellente et en amélioration",
          "Solidité financière bonne mais en dégradation",
          "Solidité financière faible et en dégradation",
          "Solidité financière stable",
        ],
        correctAnswer: "Solidité financière excellente et en amélioration",
      },
    ],
  },
];

export function getRandomExamCase(): ExamCase {
  if (examCasesAnalyseFinanciere.length === 0) {
    throw new Error("Aucun cas d'examen disponible");
  }
  const randomIndex = Math.floor(Math.random() * examCasesAnalyseFinanciere.length);
  return examCasesAnalyseFinanciere[randomIndex];
}
