"use client";

import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import Quiz from "@/components/Quiz";
import MathFormula from "@/components/MathFormula";
import ModuleExam from "@/components/ModuleExam";
import XPAnimation from "@/components/XPAnimation";
import { getRandomExamCase } from "@/data/examCasesAnalyseFinanciere";
import type { ExamCase as ExamCaseAnalyse } from "@/data/examCasesAnalyseFinanciere";
import { useUser } from "@/hooks/useUser";
import { useProfile } from "@/hooks/useProfile";
import { useState, useEffect } from "react";
import { useLessonCompletion } from "@/hooks/useLessonCompletion";
import { useQuizResult } from "@/hooks/useQuizResult";
import { completeLessonForUser } from "@/lib/progress";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  order: number;
  objective?: string;
  content: {
    sections: Array<{
      title: string;
      content: string;
      items?: Array<string | { type: "formula"; formula: string; explanation?: string }>;
    }>;
    keyPoints: string[];
    miniQuiz?: Array<{
      question: string;
      answer: string;
    }>;
    quiz?: Array<{
      question: string;
      options: string[];
      correctAnswer: string;
    }>;
  };
}

// Données des leçons du Module 2
const lessons: Lesson[] = [
  {
    id: "lecture-analytique-etats-financiers",
    title: "Lecture analytique des états financiers",
    description: "Aller au-delà de la simple lecture du bilan et du compte de résultat, en repérant les signaux faibles et les ratios d'évolution.",
    duration: "30 min",
    order: 1,
    objective: "Maîtriser la lecture analytique des états financiers pour repérer les signaux faibles, analyser les évolutions et comprendre la performance réelle de l'entreprise.",
    content: {
      sections: [
        {
          title: "Pourquoi une lecture analytique ?",
          content: "La simple lecture des états financiers ne suffit pas pour comprendre la santé réelle d'une entreprise.\n\nUne lecture analytique permet de :",
          items: [
            "Repérer les signaux faibles avant qu'ils ne deviennent des problèmes majeurs",
            "Comprendre les évolutions et les tendances",
            "Relier les différents documents financiers pour avoir une vision globale",
            "Identifier les incohérences ou les points d'attention",
          ],
        },
        {
          title: "Les ratios d'évolution : mesurer le changement",
          content: "Les ratios d'évolution permettent de mesurer la croissance ou la décroissance des indicateurs clés. Ils sont essentiels pour comprendre les tendances et anticiper les évolutions futures.",
          items: [
            {
              type: "formula",
              formula: "\\text{Taux de croissance du CA} = \\frac{\\text{CA}_N - \\text{CA}_{N-1}}{\\text{CA}_{N-1}} \\times 100",
              explanation: "Mesure l'évolution du chiffre d'affaires d'une année sur l'autre. Un taux positif indique une croissance, un taux négatif une décroissance.",
            },
            {
              type: "formula",
              formula: "\\text{Taux de croissance du résultat net} = \\frac{\\text{Résultat net}_N - \\text{Résultat net}_{N-1}}{\\text{Résultat net}_{N-1}} \\times 100",
              explanation: "Mesure l'évolution de la rentabilité. Permet de voir si l'entreprise améliore ou détériore sa performance.",
            },
            {
              type: "formula",
              formula: "\\text{Taux de croissance des capitaux propres} = \\frac{\\text{CP}_N - \\text{CP}_{N-1}}{\\text{CP}_{N-1}} \\times 100",
              explanation: "Mesure l'évolution de la structure financière. Indique si l'entreprise renforce ses fonds propres ou s'endette davantage.",
            },
          ],
        },
        {
          title: "Repérer les signaux faibles",
          content: "Les signaux faibles sont des indicateurs qui peuvent annoncer des difficultés futures. Il est crucial de les identifier tôt pour anticiper les problèmes et prendre les mesures correctives nécessaires.",
          items: [
            "Détérioration progressive de la marge nette sur plusieurs exercices",
            "Augmentation rapide de l'endettement sans croissance correspondante du CA",
            "Dégradation du besoin en fonds de roulement (BFR) qui consomme de la trésorerie",
            "Divergence entre le résultat net et le cash-flow d'exploitation",
            "Augmentation des créances clients ou des stocks sans justification commerciale",
            "Réduction des investissements alors que le secteur est en croissance",
          ],
        },
        {
          title: "Relier le compte de résultat et le bilan",
          content: "Le compte de résultat et le bilan sont indissociables. Une analyse complète nécessite de comprendre les liens entre ces deux documents financiers.",
          items: [
            "Le résultat net du compte de résultat se retrouve dans les capitaux propres du bilan",
            "Les amortissements du compte de résultat réduisent la valeur des actifs au bilan",
            "Les provisions pour risques et charges apparaissent au passif du bilan",
            "Les stocks et créances clients du bilan impactent le résultat d'exploitation",
            "La variation du BFR (actif courant - passif courant) explique la différence entre résultat net et cash-flow",
          ],
        },
        {
          title: "Exemple : analyse d'évolution sur 3 ans",
          content: "L'entreprise TechCorp présente les données suivantes :",
          items: [
            "Année N-2 : CA = 10 M€, Résultat net = 1 M€, Capitaux propres = 8 M€",
            "Année N-1 : CA = 12 M€ (+20%), Résultat net = 1,2 M€ (+20%), Capitaux propres = 9 M€ (+12,5%)",
            "Année N : CA = 15 M€ (+25%), Résultat net = 1,1 M€ (-8,3%), Capitaux propres = 9,5 M€ (+5,6%)",
          ],
        },
        {
          title: "Analyse de l'exemple TechCorp",
          content: "Analyse des données de TechCorp :",
          items: [
            "Le CA croît régulièrement (+20%, +25%), signe positif",
            "Mais le résultat net baisse en N malgré la croissance du CA → la marge nette se détériore (de 10% à 7,3%)",
            "Les capitaux propres croissent moins vite que le CA → l'entreprise s'endette probablement pour financer sa croissance",
            "Signal faible : détérioration de la rentabilité malgré la croissance",
          ],
        },
        {
          title: "Les ratios de structure d'évolution",
          content: "Analyser l'évolution de la structure financière permet de comprendre les choix stratégiques de l'entreprise et d'identifier les changements dans sa politique de financement.",
          items: [
            {
              type: "formula",
              formula: "\\text{Part des dettes dans le passif} = \\frac{\\text{Dettes totales}}{\\text{Passif total}} \\times 100",
              explanation: "Si ce ratio augmente, l'entreprise s'endette davantage. Cela peut indiquer une stratégie de croissance financée par la dette.",
            },
            {
              type: "formula",
              formula: "\\text{Part des investissements dans l'actif} = \\frac{\\text{Immobilisations}}{\\text{Actif total}} \\times 100",
              explanation: "Si ce ratio augmente, l'entreprise investit dans son outil de production. Cela peut indiquer une stratégie de développement des capacités.",
            },
          ],
        },
      ],
      keyPoints: [
        "La lecture analytique va au-delà des chiffres bruts pour repérer les tendances et les signaux faibles.",
        "Les ratios d'évolution mesurent le changement et permettent de comparer les performances dans le temps.",
        "Relier le compte de résultat et le bilan est essentiel pour comprendre la performance réelle.",
        "Une croissance du CA ne garantit pas une amélioration de la rentabilité.",
      ],
      miniQuiz: [
        {
          question: "Qu'est-ce qu'un signal faible ?",
          answer: "Un indicateur qui peut annoncer des difficultés futures avant qu'elles ne deviennent majeures.",
        },
        {
          question: "Si le CA augmente de 20% mais le résultat net baisse de 5%, que cela indique-t-il ?",
          answer: "Une détérioration de la marge nette, signe d'une baisse de rentabilité.",
        },
        {
          question: "Comment le résultat net du compte de résultat se retrouve-t-il au bilan ?",
          answer: "Il s'ajoute aux capitaux propres dans le bilan.",
        },
      ],
      quiz: [
        {
          question: "Qu'est-ce qu'un signal faible dans l'analyse financière ?",
          options: [
            "Un indicateur qui peut annoncer des difficultés futures",
            "Un ratio financier toujours négatif",
            "Un chiffre d'affaires en baisse",
            "Un résultat net négatif",
          ],
          correctAnswer: "Un indicateur qui peut annoncer des difficultés futures",
        },
        {
          question: "Si le CA augmente de 20% mais le résultat net baisse de 5%, que cela indique-t-il ?",
          options: [
            "Une détérioration de la marge nette",
            "Une amélioration de la rentabilité",
            "Une stabilité de la performance",
            "Une augmentation de l'endettement",
          ],
          correctAnswer: "Une détérioration de la marge nette",
        },
        {
          question: "Comment le résultat net du compte de résultat se retrouve-t-il au bilan ?",
          options: [
            "Il s'ajoute aux capitaux propres",
            "Il s'ajoute aux dettes",
            "Il s'ajoute aux actifs",
            "Il n'apparaît pas au bilan",
          ],
          correctAnswer: "Il s'ajoute aux capitaux propres",
        },
        {
          question: "Quel ratio permet de mesurer l'évolution du chiffre d'affaires ?",
          options: [
            "Taux de croissance du CA = (CA_N - CA_N-1) / CA_N-1 × 100",
            "Marge nette = Résultat net / CA × 100",
            "ROE = Résultat net / Capitaux propres × 100",
            "Liquidité générale = Actif courant / Passif courant",
          ],
          correctAnswer: "Taux de croissance du CA = (CA_N - CA_N-1) / CA_N-1 × 100",
        },
        {
          question: "Qu'est-ce qu'un signal faible typique à surveiller ?",
          options: [
            "Détérioration progressive de la marge nette sur plusieurs exercices",
            "Augmentation régulière du chiffre d'affaires",
            "Stabilité des capitaux propres",
            "Réduction des investissements en période de récession",
          ],
          correctAnswer: "Détérioration progressive de la marge nette sur plusieurs exercices",
        },
      ],
    },
  },
  {
    id: "analyse-marges-rentabilites",
    title: "Analyse des marges, rentabilités et structure de coûts",
    description: "Approfondir les ratios de rentabilité, la marge opérationnelle et l'effet de levier financier.",
    duration: "35 min",
    order: 2,
    objective: "Maîtriser l'analyse approfondie des marges et rentabilités, comprendre l'effet de levier financier et analyser la structure de coûts pour évaluer la performance opérationnelle.",
    content: {
      sections: [
        {
          title: "Les marges : mesurer la performance opérationnelle",
          content: "Les marges permettent de mesurer la performance opérationnelle à différents niveaux du compte de résultat.\n\nElles indiquent combien l'entreprise conserve de chaque euro de chiffre d'affaires après déduction des coûts.",
        },
        {
          title: "La marge opérationnelle (ou marge d'exploitation)",
          content: "La marge opérationnelle mesure la rentabilité de l'activité principale, avant les charges financières et les impôts. C'est un indicateur clé de l'efficacité opérationnelle de l'entreprise.",
          items: [
            {
              type: "formula",
              formula: "\\text{Marge opérationnelle} = \\frac{\\text{Résultat d'exploitation}}{\\text{Chiffre d'affaires}} \\times 100",
              explanation: "Indique le pourcentage de bénéfice généré par l'activité principale. Une marge opérationnelle élevée signifie que l'entreprise est efficace dans son cœur de métier.",
            },
          ],
        },
        {
          title: "Exemple de marge opérationnelle",
          content: "Exemple concret :",
          items: [
            "Si le CA = 10 M€ et le résultat d'exploitation = 1,5 M€",
            "Alors la marge opérationnelle = 15 %",
            "Interprétation : L'entreprise conserve 15 centimes de bénéfice d'exploitation pour chaque euro de vente",
          ],
        },
        {
          title: "La marge nette : performance globale",
          content: "La marge nette mesure la rentabilité finale, après toutes les charges (financières, exceptionnelles, impôts). C'est la marge la plus complète car elle reflète la performance réelle de l'entreprise.",
          items: [
            {
              type: "formula",
              formula: "\\text{Marge nette} = \\frac{\\text{Résultat net}}{\\text{Chiffre d'affaires}} \\times 100",
              explanation: "Indique le pourcentage de bénéfice net généré par l'activité. C'est la marge la plus complète car elle inclut toutes les charges.",
            },
          ],
        },
        {
          title: "Relation entre marge opérationnelle et marge nette",
          content: "La marge nette est liée à la marge opérationnelle par la relation suivante :",
          items: [
            "Marge nette = Marge opérationnelle - (Charges financières + Impôts) / CA",
            "Si la marge nette est très inférieure à la marge opérationnelle, cela peut indiquer un endettement élevé ou des charges exceptionnelles importantes",
            "L'écart entre ces deux marges révèle l'impact des charges financières et fiscales sur la rentabilité",
          ],
        },
        {
          title: "L'effet de levier financier",
          content: "L'effet de levier financier explique la relation entre ROA (Return on Assets), ROE (Return on Equity) et l'endettement. Il permet de comprendre comment l'endettement peut influencer la rentabilité des actionnaires.",
          items: [
            {
              type: "formula",
              formula: "\\text{ROE} = \\text{ROA} + (\\text{ROA} - \\text{Coût de la dette}) \\times \\frac{\\text{Dettes}}{\\text{Capitaux propres}}",
              explanation: "Le ROE peut être supérieur au ROA si l'entreprise s'endette à un coût inférieur à sa rentabilité des actifs. C'est l'effet de levier financier.",
            },
          ],
        },
        {
          title: "Comprendre l'effet de levier",
          content: "L'effet de levier peut être positif ou négatif selon la situation :",
          items: [
            "Si ROA > Coût de la dette : l'endettement augmente le ROE (effet de levier positif)",
            "Si ROA < Coût de la dette : l'endettement réduit le ROE (effet de levier négatif)",
          ],
        },
        {
          title: "Exemple d'effet de levier positif",
          content: "Exemple concret :",
          items: [
            "Une entreprise a un ROA de 10 %, un coût de dette de 5 %, et un ratio dettes/capitaux propres de 1",
            "ROE = 10% + (10% - 5%) × 1 = 15%",
            "L'endettement permet d'augmenter le ROE de 10% à 15%",
            "L'effet de levier est positif car le ROA (10%) est supérieur au coût de la dette (5%)",
          ],
        },
        {
          title: "Analyse de la structure de coûts",
          content: "Analyser la structure de coûts permet de comprendre la composition des charges et d'identifier les leviers d'amélioration.",
          items: [
            {
              type: "formula",
              formula: "\\text{Part des coûts variables} = \\frac{\\text{Coûts variables}}{\\text{Chiffre d'affaires}} \\times 100",
              explanation: "Les coûts variables évoluent avec le CA (matières premières, commissions, etc.).",
            },
            {
              type: "formula",
              formula: "\\text{Part des coûts fixes} = \\frac{\\text{Coûts fixes}}{\\text{Chiffre d'affaires}} \\times 100",
              explanation: "Les coûts fixes sont indépendants du CA (salaires, loyers, amortissements, etc.).",
            },
            "Une entreprise avec beaucoup de coûts fixes est plus risquée en cas de baisse du CA, mais bénéficie d'un effet de levier opérationnel en cas de croissance.",
          ],
        },
        {
          title: "Exemple : analyse de rentabilité sur 3 ans",
          content: "L'entreprise FinX Manufacturing présente les données suivantes :",
        },
        {
          title: "Données FinX Manufacturing - Année N-2",
          content: "Année N-2 :",
          items: [
            "CA : 20 M€",
            "Résultat d'exploitation : 3 M€ (marge opérationnelle : 15%)",
            "Résultat net : 2 M€ (marge nette : 10%)",
            "Actif total : 25 M€ (ROA : 8%)",
            "Capitaux propres : 15 M€ (ROE : 13,3%)",
            "Dettes : 10 M€",
            "Coût de la dette : 4%",
          ],
        },
        {
          title: "Données FinX Manufacturing - Année N-1",
          content: "Année N-1 :",
          items: [
            "CA : 24 M€ (+20%)",
            "Résultat d'exploitation : 3,6 M€ (marge opérationnelle : 15%)",
            "Résultat net : 2,2 M€ (marge nette : 9,2%)",
            "Actif total : 30 M€ (ROA : 7,3%)",
            "Capitaux propres : 16 M€ (ROE : 13,8%)",
            "Dettes : 14 M€",
            "Coût de la dette : 5%",
          ],
        },
        {
          title: "Données FinX Manufacturing - Année N",
          content: "Année N :",
          items: [
            "CA : 30 M€ (+25%)",
            "Résultat d'exploitation : 4,2 M€ (marge opérationnelle : 14%)",
            "Résultat net : 2,1 M€ (marge nette : 7%)",
            "Actif total : 38 M€ (ROA : 5,5%)",
            "Capitaux propres : 18 M€ (ROE : 11,7%)",
            "Dettes : 20 M€",
            "Coût de la dette : 6%",
          ],
        },
        {
          title: "Analyse de l'exemple FinX Manufacturing",
          content: "Analyse des données de FinX Manufacturing sur 3 ans :",
          items: [
            "La marge opérationnelle se maintient autour de 14-15%, signe que l'activité principale reste rentable",
            "Mais la marge nette baisse (10% → 9,2% → 7%) car l'endettement augmente et son coût aussi",
            "Le ROA baisse (8% → 7,3% → 5,5%), signe que les actifs sont moins efficaces",
            "Le ROE baisse aussi (13,3% → 13,8% → 11,7%) car l'effet de levier devient négatif (ROA < Coût de la dette)",
            "Signal d'alerte : l'entreprise s'endette pour croître, mais la rentabilité se détériore",
          ],
        },
        {
          title: "Les ratios de rentabilité complémentaires",
          content: "D'autres ratios permettent d'affiner l'analyse de rentabilité :",
          items: [
            {
              type: "formula",
              formula: "\\text{EBITDA margin} = \\frac{\\text{EBITDA}}{\\text{Chiffre d'affaires}} \\times 100",
              explanation: "EBITDA = Résultat d'exploitation + Amortissements. Mesure la rentabilité avant amortissements et intérêts.",
            },
            {
              type: "formula",
              formula: "\\text{Marge brute} = \\frac{\\text{Chiffre d'affaires} - \\text{Coût des ventes}}{\\text{Chiffre d'affaires}} \\times 100",
              explanation: "Mesure la rentabilité après coûts directs de production, avant frais généraux.",
            },
          ],
        },
      ],
      keyPoints: [
        "La marge opérationnelle mesure la rentabilité de l'activité principale avant charges financières.",
        "L'effet de levier financier peut augmenter le ROE si le ROA est supérieur au coût de la dette.",
        "Analyser la structure de coûts permet d'identifier les leviers d'amélioration de la rentabilité.",
        "Une analyse sur plusieurs années révèle les tendances et les signaux faibles.",
      ],
      miniQuiz: [
        {
          question: "Qu'est-ce que la marge opérationnelle ?",
          answer: "Le pourcentage de bénéfice d'exploitation généré par chaque euro de chiffre d'affaires.",
        },
        {
          question: "Quand l'effet de levier financier est-il positif ?",
          answer: "Quand le ROA est supérieur au coût de la dette.",
        },
        {
          question: "Si la marge nette est très inférieure à la marge opérationnelle, que cela indique-t-il ?",
          answer: "Un endettement élevé ou des charges exceptionnelles importantes.",
        },
      ],
      quiz: [
        {
          question: "Qu'est-ce que la marge opérationnelle ?",
          options: [
            "Le pourcentage de bénéfice d'exploitation généré par chaque euro de chiffre d'affaires",
            "Le pourcentage de bénéfice net généré par chaque euro de chiffre d'affaires",
            "Le pourcentage de coûts fixes dans le chiffre d'affaires",
            "Le pourcentage de dettes dans le passif",
          ],
          correctAnswer: "Le pourcentage de bénéfice d'exploitation généré par chaque euro de chiffre d'affaires",
        },
        {
          question: "Quand l'effet de levier financier est-il positif ?",
          options: [
            "Quand le ROA est supérieur au coût de la dette",
            "Quand le ROA est inférieur au coût de la dette",
            "Quand l'entreprise n'a pas de dettes",
            "Quand la marge nette est élevée",
          ],
          correctAnswer: "Quand le ROA est supérieur au coût de la dette",
        },
        {
          question: "Si la marge nette est très inférieure à la marge opérationnelle, que cela indique-t-il ?",
          options: [
            "Un endettement élevé ou des charges exceptionnelles importantes",
            "Une excellente performance opérationnelle",
            "Une faible rentabilité des actifs",
            "Un faible besoin en fonds de roulement",
          ],
          correctAnswer: "Un endettement élevé ou des charges exceptionnelles importantes",
        },
        {
          question: "Quelle est la formule de l'effet de levier financier ?",
          options: [
            "ROE = ROA + (ROA - Coût de la dette) × (Dettes / Capitaux propres)",
            "ROE = ROA × (Dettes / Capitaux propres)",
            "ROE = ROA - Coût de la dette",
            "ROE = Marge nette / Capitaux propres",
          ],
          correctAnswer: "ROE = ROA + (ROA - Coût de la dette) × (Dettes / Capitaux propres)",
        },
        {
          question: "Qu'est-ce que l'EBITDA margin ?",
          options: [
            "Le pourcentage de rentabilité avant amortissements et intérêts",
            "Le pourcentage de bénéfice net",
            "Le pourcentage de coûts variables",
            "Le pourcentage de dettes",
          ],
          correctAnswer: "Le pourcentage de rentabilité avant amortissements et intérêts",
        },
        {
          question: "Si une entreprise a un ROA de 12% et un coût de dette de 4%, avec un ratio dettes/capitaux propres de 0,5, quel est le ROE ?",
          options: [
            "14%",
            "12%",
            "10%",
            "16%",
          ],
          correctAnswer: "14%",
        },
      ],
    },
  },
  {
    id: "structure-financiere-solvabilite",
    title: "Structure financière, solvabilité et risque",
    description: "Mesurer la stabilité du financement et la capacité d'endettement pour évaluer la solvabilité de l'entreprise.",
    duration: "30 min",
    order: 3,
    objective: "Maîtriser l'analyse de la structure financière et de la solvabilité pour évaluer la capacité d'endettement et le risque financier de l'entreprise.",
    content: {
      sections: [
        {
          title: "Pourquoi analyser la structure financière ?",
          content: "La structure financière détermine la stabilité et la capacité d'endettement d'une entreprise. Une analyse approfondie permet de :",
          items: [
            "Évaluer la solvabilité à long terme",
            "Mesurer la capacité de remboursement",
            "Identifier les risques financiers",
            "Comprendre l'équilibre entre dettes et capitaux propres",
          ],
        },
        {
          title: "Le ratio d'autonomie financière",
          content: "Le ratio d'autonomie financière mesure la part des capitaux propres dans le financement total. Il indique le degré d'indépendance financière de l'entreprise.",
          items: [
            {
              type: "formula",
              formula: "\\text{Ratio d'autonomie financière} = \\frac{\\text{Capitaux propres}}{\\text{Passif total}} \\times 100",
              explanation: "Indique le pourcentage de financement apporté par les actionnaires. Un ratio élevé signifie une plus grande autonomie financière.",
            },
          ],
        },
        {
          title: "Interprétation du ratio d'autonomie",
          content: "Interprétation du ratio d'autonomie financière :",
          items: [
            "Ratio > 50% : structure financière solide, faible dépendance aux créanciers",
            "Ratio entre 30% et 50% : structure équilibrée",
            "Ratio < 30% : structure fragile, forte dépendance à l'endettement",
          ],
        },
        {
          title: "Exemple de ratio d'autonomie",
          content: "Exemple concret :",
          items: [
            "Si les capitaux propres = 8 M€ et le passif total = 20 M€",
            "Alors le ratio d'autonomie = 40%",
            "Interprétation : Structure équilibrée avec une autonomie modérée",
          ],
        },
        {
          title: "La capacité de remboursement",
          content: "La capacité de remboursement mesure la capacité de l'entreprise à rembourser ses dettes avec son résultat d'exploitation. C'est un indicateur clé de la solvabilité à long terme.",
          items: [
            {
              type: "formula",
              formula: "\\text{Capacité de remboursement} = \\frac{\\text{Dettes financières}}{\\text{Résultat d'exploitation}}",
              explanation: "Indique le nombre d'années nécessaires pour rembourser les dettes avec le résultat d'exploitation. Un ratio faible signifie une meilleure capacité de remboursement.",
            },
          ],
        },
        {
          title: "Interprétation de la capacité de remboursement",
          content: "Interprétation de la capacité de remboursement :",
          items: [
            "Ratio < 3 ans : capacité de remboursement excellente",
            "Ratio entre 3 et 5 ans : capacité acceptable",
            "Ratio > 5 ans : capacité de remboursement faible, risque élevé",
          ],
        },
        {
          title: "Exemple de capacité de remboursement",
          content: "Exemple concret :",
          items: [
            "Si les dettes financières = 10 M€ et le résultat d'exploitation = 2 M€",
            "Alors la capacité de remboursement = 5 ans",
            "Interprétation : Capacité acceptable mais à surveiller",
          ],
        },
        {
          title: "Le ratio de couverture de la dette par l'EBITDA",
          content: "Le ratio de couverture de la dette par l'EBITDA mesure la capacité de remboursement en utilisant l'EBITDA. C'est un indicateur plus précis que la capacité de remboursement classique.",
          items: [
            {
              type: "formula",
              formula: "\\text{Ratio de couverture de la dette} = \\frac{\\text{Dettes financières}}{\\text{EBITDA}}",
              explanation: "Indique le nombre d'années nécessaires pour rembourser les dettes avec l'EBITDA. Plus précis que la capacité de remboursement car l'EBITDA exclut les amortissements.",
            },
            {
              type: "formula",
              formula: "\\text{EBITDA} = \\text{Résultat d'exploitation} + \\text{Amortissements}",
              explanation: "L'EBITDA représente la capacité de génération de cash-flow opérationnel. Il mesure la capacité réelle de l'entreprise à générer du cash.",
            },
          ],
        },
        {
          title: "Interprétation du ratio de couverture",
          content: "Interprétation du ratio de couverture de la dette :",
          items: [
            "Ratio < 3 : excellente capacité de remboursement",
            "Ratio entre 3 et 5 : capacité acceptable",
            "Ratio > 5 : capacité de remboursement faible",
          ],
        },
        {
          title: "Exemple de ratio de couverture",
          content: "Exemple concret :",
          items: [
            "Si les dettes financières = 15 M€ et l'EBITDA = 4 M€",
            "Alors le ratio de couverture = 3,75 ans",
            "Interprétation : Capacité acceptable mais proche de la limite",
          ],
        },
        {
          title: "Le ratio d'endettement global",
          content: "Le ratio d'endettement global mesure le poids des dettes par rapport aux capitaux propres. Il permet d'évaluer le niveau d'endettement de l'entreprise.",
          items: [
            {
              type: "formula",
              formula: "\\text{Ratio d'endettement global} = \\frac{\\text{Dettes totales}}{\\text{Capitaux propres}}",
              explanation: "Indique le niveau d'endettement par rapport aux fonds propres. Un ratio élevé signifie un endettement important.",
            },
          ],
        },
        {
          title: "Interprétation du ratio d'endettement",
          content: "Interprétation du ratio d'endettement global :",
          items: [
            "Ratio < 1 : endettement modéré, structure financière solide",
            "Ratio entre 1 et 2 : endettement équilibré",
            "Ratio > 2 : endettement élevé, risque financier important",
          ],
        },
        {
          title: "Exemple de ratio d'endettement",
          content: "Exemple concret :",
          items: [
            "Si les dettes totales = 12 M€ et les capitaux propres = 8 M€",
            "Alors le ratio d'endettement = 1,5",
            "Interprétation : Endettement équilibré",
          ],
        },
        {
          title: "Le ratio de liquidité générale",
          content: "Le ratio de liquidité générale mesure la capacité de l'entreprise à rembourser ses dettes à court terme avec ses actifs courants. C'est un indicateur clé de la solvabilité à court terme.",
          items: [
            {
              type: "formula",
              formula: "\\text{Ratio de liquidité générale} = \\frac{\\text{Actif courant}}{\\text{Passif courant}}",
              explanation: "Indique la capacité de remboursement à court terme. Un ratio > 1 signifie que l'entreprise peut rembourser ses dettes courantes.",
            },
          ],
        },
        {
          title: "Interprétation du ratio de liquidité",
          content: "Interprétation du ratio de liquidité générale :",
          items: [
            "Ratio > 1,5 : liquidité excellente",
            "Ratio entre 1 et 1,5 : liquidité acceptable",
            "Ratio < 1 : liquidité insuffisante, risque de défaut de paiement",
          ],
        },
        {
          title: "Exemple de ratio de liquidité",
          content: "Exemple concret :",
          items: [
            "Si l'actif courant = 6 M€ et le passif courant = 4 M€",
            "Alors le ratio de liquidité = 1,5",
            "Interprétation : Liquidité excellente",
          ],
        },
        {
          title: "Exemple : diagnostic de solvabilité",
          content: "L'entreprise FinX Services présente les données suivantes :",
        },
        {
          title: "Données FinX Services - Bilan",
          content: "Bilan (en M€) :",
          items: [
            "Actif total : 50 M€",
            "Actif courant : 15 M€",
            "Passif total : 50 M€",
            "Passif courant : 10 M€",
            "Capitaux propres : 20 M€",
            "Dettes financières : 20 M€",
          ],
        },
        {
          title: "Données FinX Services - Compte de résultat",
          content: "Compte de résultat (en M€) :",
          items: [
            "Chiffre d'affaires : 40 M€",
            "Résultat d'exploitation : 6 M€",
            "Amortissements : 2 M€",
            "Résultat net : 3 M€",
          ],
        },
        {
          title: "Calculs des ratios FinX Services",
          content: "Calculs des ratios de solvabilité :",
          items: [
            "Ratio d'autonomie financière = 20 / 50 = 40%",
            "Ratio d'endettement global = 20 / 20 = 1",
            "Capacité de remboursement = 20 / 6 = 3,3 ans",
            "EBITDA = 6 + 2 = 8 M€",
            "Ratio de couverture de la dette = 20 / 8 = 2,5 ans",
            "Ratio de liquidité générale = 15 / 10 = 1,5",
          ],
        },
        {
          title: "Diagnostic FinX Services",
          content: "Diagnostic de la solvabilité de FinX Services :",
          items: [
            "Structure financière équilibrée (autonomie à 40%, endettement modéré)",
            "Capacité de remboursement acceptable (3,3 ans avec le résultat d'exploitation, 2,5 ans avec l'EBITDA)",
            "Liquidité excellente (ratio de 1,5)",
            "Risque financier modéré",
            "Conclusion : L'entreprise présente une structure financière saine avec une capacité de remboursement correcte et une bonne liquidité",
          ],
        },
        {
          title: "Les signaux d'alerte",
          content: "Certains indicateurs peuvent signaler des difficultés financières :",
          items: [
            "Ratio d'autonomie financière < 20% : dépendance excessive à l'endettement",
            "Capacité de remboursement > 7 ans : risque de défaut de paiement",
            "Ratio de couverture de la dette > 6 : capacité de remboursement insuffisante",
            "Ratio d'endettement global > 3 : endettement excessif",
            "Ratio de liquidité générale < 0,8 : risque de défaut de paiement à court terme",
            "Dégradation continue de ces ratios sur plusieurs exercices : signal d'alerte majeur",
          ],
        },
      ],
      keyPoints: [
        "Le ratio d'autonomie financière mesure la part des capitaux propres dans le financement total.",
        "La capacité de remboursement et le ratio de couverture de la dette mesurent la capacité à rembourser les dettes.",
        "Le ratio d'endettement global mesure le poids des dettes par rapport aux capitaux propres.",
        "Le ratio de liquidité générale mesure la capacité de remboursement à court terme.",
        "Une analyse combinée de ces ratios permet d'évaluer la solvabilité et le risque financier.",
      ],
      miniQuiz: [
        {
          question: "Qu'est-ce que le ratio d'autonomie financière ?",
          answer: "Le pourcentage de financement apporté par les actionnaires (capitaux propres / passif total).",
        },
        {
          question: "Que mesure la capacité de remboursement ?",
          answer: "Le nombre d'années nécessaires pour rembourser les dettes avec le résultat d'exploitation.",
        },
        {
          question: "Qu'est-ce que l'EBITDA ?",
          answer: "Le résultat d'exploitation plus les amortissements, représentant la capacité de génération de cash-flow opérationnel.",
        },
      ],
      quiz: [
        {
          question: "Qu'est-ce que le ratio d'autonomie financière ?",
          options: [
            "Le pourcentage de financement apporté par les actionnaires",
            "Le pourcentage de dettes dans le passif total",
            "Le ratio entre les dettes et les capitaux propres",
            "Le ratio entre l'actif courant et le passif courant",
          ],
          correctAnswer: "Le pourcentage de financement apporté par les actionnaires",
        },
        {
          question: "Que mesure la capacité de remboursement ?",
          options: [
            "Le nombre d'années nécessaires pour rembourser les dettes avec le résultat d'exploitation",
            "Le pourcentage de dettes dans le passif total",
            "Le ratio entre les capitaux propres et les dettes",
            "Le ratio entre l'EBITDA et les dettes",
          ],
          correctAnswer: "Le nombre d'années nécessaires pour rembourser les dettes avec le résultat d'exploitation",
        },
        {
          question: "Qu'est-ce que l'EBITDA ?",
          options: [
            "Le résultat d'exploitation plus les amortissements",
            "Le résultat net après impôts",
            "Le résultat d'exploitation moins les charges financières",
            "Le résultat net plus les amortissements",
          ],
          correctAnswer: "Le résultat d'exploitation plus les amortissements",
        },
        {
          question: "Quelle est la formule du ratio de couverture de la dette par l'EBITDA ?",
          options: [
            "Dettes financières / EBITDA",
            "EBITDA / Dettes financières",
            "Capitaux propres / Dettes financières",
            "Résultat d'exploitation / Dettes financières",
          ],
          correctAnswer: "Dettes financières / EBITDA",
        },
        {
          question: "Si le ratio d'autonomie financière est de 30%, que cela indique-t-il ?",
          options: [
            "Une structure financière équilibrée mais avec une dépendance modérée à l'endettement",
            "Une structure financière très solide",
            "Une structure financière fragile",
            "Une liquidité insuffisante",
          ],
          correctAnswer: "Une structure financière équilibrée mais avec une dépendance modérée à l'endettement",
        },
        {
          question: "Si la capacité de remboursement est de 8 ans, que cela indique-t-il ?",
          options: [
            "Un risque de défaut de paiement élevé",
            "Une excellente capacité de remboursement",
            "Une structure financière très solide",
            "Une liquidité excellente",
          ],
          correctAnswer: "Un risque de défaut de paiement élevé",
        },
        {
          question: "Quelle est la formule du ratio d'endettement global ?",
          options: [
            "Dettes totales / Capitaux propres",
            "Capitaux propres / Dettes totales",
            "Dettes totales / Passif total",
            "Capitaux propres / Passif total",
          ],
          correctAnswer: "Dettes totales / Capitaux propres",
        },
      ],
    },
  },
  {
    id: "flux-tresorerie-dynamique-liquidite",
    title: "Flux de trésorerie et dynamique de liquidité",
    description: "Comprendre comment les flux de trésorerie reflètent la performance réelle et analyser la dynamique de liquidité de l'entreprise.",
    duration: "35 min",
    order: 4,
    objective: "Maîtriser l'analyse des flux de trésorerie pour comprendre la performance réelle de l'entreprise et évaluer sa dynamique de liquidité.",
    content: {
      sections: [
        {
          title: "Pourquoi analyser les flux de trésorerie ?",
          content: "Les flux de trésorerie reflètent la performance réelle de l'entreprise, indépendamment des règles comptables. Une analyse approfondie permet de :",
          items: [
            "Comprendre comment l'entreprise génère et utilise son cash",
            "Évaluer la capacité d'autofinancement",
            "Identifier les risques de liquidité",
            "Relier les flux de trésorerie à la performance opérationnelle",
          ],
        },
        {
          title: "Les trois types de flux de trésorerie",
          content: "Le tableau des flux de trésorerie distingue trois types de flux :",
          items: [
            "Flux de trésorerie d'exploitation (FTE) : cash généré par l'activité principale",
            "Flux de trésorerie d'investissement (FTI) : cash utilisé pour investir ou généré par la cession d'actifs",
            "Flux de trésorerie de financement (FTF) : cash provenant ou allant vers les investisseurs et créanciers",
          ],
        },
        {
          title: "Le flux de trésorerie d'exploitation (FTE)",
          content: "Le flux de trésorerie d'exploitation mesure le cash généré par l'activité principale de l'entreprise. C'est un indicateur clé de la performance opérationnelle réelle.",
          items: [
            {
              type: "formula",
              formula: "\\text{FTE} = \\text{Résultat d'exploitation} + \\text{Amortissements} - \\text{Variation du BFR}",
              explanation: "Le FTE représente le cash réellement généré par l'activité, après prise en compte des variations du besoin en fonds de roulement.",
            },
            {
              type: "formula",
              formula: "\\text{FTE} = \\text{EBITDA} - \\text{Variation du BFR}",
              explanation: "L'EBITDA représente la capacité de génération de cash avant variation du BFR. C'est une mesure plus précise que le résultat d'exploitation seul.",
            },
          ],
        },
        {
          title: "Interprétation du FTE",
          content: "Interprétation du flux de trésorerie d'exploitation :",
          items: [
            "FTE > 0 : l'entreprise génère du cash avec son activité",
            "FTE < 0 : l'entreprise consomme du cash, risque de liquidité",
          ],
        },
        {
          title: "Exemple de FTE",
          content: "Exemple concret :",
          items: [
            "Si l'EBITDA = 5 M€ et la variation du BFR = +1 M€",
            "Alors le FTE = 4 M€",
            "Interprétation : L'entreprise génère 4 M€ de cash avec son activité",
          ],
        },
        {
          title: "Le flux de trésorerie d'investissement (FTI)",
          content: "Le flux de trésorerie d'investissement mesure le cash utilisé pour investir ou généré par la cession d'actifs. Il reflète la stratégie d'investissement de l'entreprise.",
          items: [
            {
              type: "formula",
              formula: "\\text{FTI} = -\\text{Investissements} + \\text{Cessions d'actifs}",
              explanation: "Le FTI est généralement négatif car les investissements consomment du cash. Les cessions d'actifs génèrent du cash.",
            },
          ],
        },
        {
          title: "Interprétation du FTI",
          content: "Interprétation du flux de trésorerie d'investissement :",
          items: [
            "FTI < 0 : l'entreprise investit dans son outil de production",
            "FTI > 0 : l'entreprise cède des actifs, peut indiquer une stratégie de désinvestissement",
          ],
        },
        {
          title: "Exemple de FTI",
          content: "Exemple concret :",
          items: [
            "Si les investissements = 3 M€ et les cessions = 0,5 M€",
            "Alors le FTI = -2,5 M€",
            "Interprétation : L'entreprise investit 2,5 M€ net dans son outil de production",
          ],
        },
        {
          title: "Le flux de trésorerie de financement (FTF)",
          content: "Le flux de trésorerie de financement mesure le cash provenant ou allant vers les investisseurs et créanciers. Il reflète la stratégie de financement de l'entreprise.",
          items: [
            {
              type: "formula",
              formula: "\\text{FTF} = \\text{Emprunts} - \\text{Remboursements} - \\text{Dividendes}",
              explanation: "Le FTF représente les mouvements de cash liés au financement de l'entreprise. Il inclut les emprunts, remboursements et distributions aux actionnaires.",
            },
          ],
        },
        {
          title: "Interprétation du FTF",
          content: "Interprétation du flux de trésorerie de financement :",
          items: [
            "FTF > 0 : l'entreprise lève des fonds (emprunts, augmentation de capital)",
            "FTF < 0 : l'entreprise rembourse ses dettes ou distribue des dividendes",
          ],
        },
        {
          title: "Exemple de FTF",
          content: "Exemple concret :",
          items: [
            "Si les emprunts = 2 M€, les remboursements = 1 M€ et les dividendes = 0,5 M€",
            "Alors le FTF = +0,5 M€",
            "Interprétation : L'entreprise lève 0,5 M€ net de fonds",
          ],
        },
        {
          title: "La capacité d'autofinancement (CAF)",
          content: "La capacité d'autofinancement mesure la capacité de l'entreprise à financer ses investissements et son développement avec ses propres ressources. C'est un indicateur clé de l'autonomie financière.",
          items: [
            {
              type: "formula",
              formula: "\\text{CAF} = \\text{Résultat net} + \\text{Amortissements}",
              explanation: "La CAF représente le cash disponible après déduction de toutes les charges, y compris les amortissements.",
            },
            {
              type: "formula",
              formula: "\\text{CAF} = \\text{EBITDA} - \\text{Charges financières} - \\text{Impôts}",
              explanation: "La CAF peut aussi être calculée à partir de l'EBITDA en déduisant les charges financières et les impôts. Cette méthode est plus précise car elle part de la capacité de génération de cash.",
            },
          ],
        },
        {
          title: "Interprétation de la CAF",
          content: "Interprétation de la capacité d'autofinancement :",
          items: [
            "CAF > Investissements : l'entreprise peut financer ses investissements avec ses propres ressources",
            "CAF < Investissements : l'entreprise doit s'endetter ou lever des fonds",
          ],
        },
        {
          title: "Exemple de CAF",
          content: "Exemple concret :",
          items: [
            "Si le résultat net = 2 M€ et les amortissements = 1,5 M€",
            "Alors la CAF = 3,5 M€",
            "Interprétation : L'entreprise génère 3,5 M€ de cash disponible",
          ],
        },
        {
          title: "Le besoin en fonds de roulement (BFR)",
          content: "Le besoin en fonds de roulement mesure le cash immobilisé dans le cycle d'exploitation. C'est un indicateur clé de la gestion opérationnelle.",
          items: [
            {
              type: "formula",
              formula: "\\text{BFR} = \\text{Stocks} + \\text{Créances clients} - \\text{Dettes fournisseurs}",
              explanation: "Le BFR représente le cash nécessaire pour financer le cycle d'exploitation (achat, production, vente, encaissement).",
            },
          ],
        },
        {
          title: "Interprétation du BFR",
          content: "Interprétation du besoin en fonds de roulement :",
          items: [
            "BFR > 0 : l'entreprise doit financer son cycle d'exploitation (cas le plus fréquent)",
            "BFR < 0 : l'entreprise est financée par ses fournisseurs (cas favorable mais rare)",
          ],
        },
        {
          title: "Variation du BFR",
          content: "La variation du BFR impacte directement les flux de trésorerie :",
          items: [
            "Variation > 0 : consommation de cash (augmentation des stocks ou créances)",
            "Variation < 0 : génération de cash (réduction des stocks ou créances)",
          ],
        },
        {
          title: "Exemple de BFR",
          content: "Exemple concret :",
          items: [
            "Si les stocks = 2 M€, les créances clients = 3 M€ et les dettes fournisseurs = 1,5 M€",
            "Alors le BFR = 3,5 M€",
            "Interprétation : L'entreprise doit financer 3,5 M€ pour son cycle d'exploitation",
          ],
        },
        {
          title: "Exemple : calcul des flux de trésorerie à partir d'un bilan simplifié",
          content: "L'entreprise FinX Retail présente les données suivantes :",
        },
        {
          title: "Données FinX Retail - Bilan N-1",
          content: "Bilan N-1 (en M€) :",
          items: [
            "Stocks : 1,5 M€",
            "Créances clients : 2 M€",
            "Dettes fournisseurs : 1 M€",
            "BFR N-1 = 1,5 + 2 - 1 = 2,5 M€",
          ],
        },
        {
          title: "Données FinX Retail - Bilan N",
          content: "Bilan N (en M€) :",
          items: [
            "Stocks : 2 M€",
            "Créances clients : 2,5 M€",
            "Dettes fournisseurs : 1,2 M€",
            "BFR N = 2 + 2,5 - 1,2 = 3,3 M€",
          ],
        },
        {
          title: "Données FinX Retail - Compte de résultat N",
          content: "Compte de résultat N (en M€) :",
          items: [
            "Chiffre d'affaires : 20 M€",
            "Résultat d'exploitation : 3 M€",
            "Amortissements : 1 M€",
            "Charges financières : 0,5 M€",
            "Impôts : 0,6 M€",
            "Résultat net : 0,9 M€",
          ],
        },
        {
          title: "Calculs FinX Retail",
          content: "Calculs des flux de trésorerie :",
          items: [
            "EBITDA = 3 + 1 = 4 M€",
            "Variation du BFR = 3,3 - 2,5 = +0,8 M€",
            "FTE = 4 - 0,8 = 3,2 M€",
            "CAF = 0,9 + 1 = 1,9 M€",
          ],
        },
        {
          title: "Analyse FinX Retail",
          content: "Analyse des flux de trésorerie de FinX Retail :",
          items: [
            "L'entreprise génère 3,2 M€ de cash avec son activité (FTE positif)",
            "Mais la variation du BFR consomme 0,8 M€ de cash (augmentation des stocks et créances)",
            "La CAF (1,9 M€) est inférieure au FTE (3,2 M€) car elle inclut les charges financières et les impôts",
            "Conclusion : L'entreprise génère du cash avec son activité, mais doit financer l'augmentation de son BFR",
          ],
        },
        {
          title: "La dynamique de liquidité",
          content: "La dynamique de liquidité analyse l'évolution de la trésorerie nette sur plusieurs exercices. C'est un indicateur clé de la santé financière à court terme.",
          items: [
            {
              type: "formula",
              formula: "\\text{Trésorerie nette} = \\text{Trésorerie} - \\text{Découverts bancaires}",
              explanation: "La trésorerie nette représente le cash disponible après déduction des découverts bancaires. C'est la liquidité réelle de l'entreprise.",
            },
            {
              type: "formula",
              formula: "\\text{Trésorerie nette N} = \\text{Trésorerie nette N-1} + \\text{FTE} + \\text{FTI} + \\text{FTF}",
              explanation: "L'évolution de la trésorerie nette dépend des trois flux de trésorerie : exploitation, investissement et financement.",
            },
          ],
        },
        {
          title: "Interprétation de la dynamique de liquidité",
          content: "Interprétation de l'évolution de la trésorerie nette :",
          items: [
            "Trésorerie nette > 0 et en hausse : situation de liquidité confortable",
            "Trésorerie nette < 0 ou en baisse : risque de liquidité",
          ],
        },
        {
          title: "Exemple de dynamique de liquidité",
          content: "Exemple concret :",
          items: [
            "Si la trésorerie nette N-1 = 1 M€, le FTE = 3 M€, le FTI = -2 M€ et le FTF = -0,5 M€",
            "Alors la trésorerie nette N = 1 + 3 - 2 - 0,5 = 1,5 M€",
            "Interprétation : La trésorerie nette augmente de 0,5 M€, situation confortable",
          ],
        },
        {
          title: "Les signaux d'alerte",
          content: "Certains indicateurs peuvent signaler des difficultés de liquidité :",
          items: [
            "FTE négatif sur plusieurs exercices : l'entreprise consomme du cash avec son activité",
            "Variation du BFR très positive : immobilisation excessive de cash dans le cycle d'exploitation",
            "Trésorerie nette négative ou en baisse continue : risque de défaut de paiement",
            "CAF < Investissements sur plusieurs exercices : dépendance excessive à l'endettement",
            "FTF très positif (emprunts élevés) : l'entreprise finance sa croissance par la dette",
            "Dégradation continue de ces indicateurs : signal d'alerte majeur",
          ],
        },
      ],
      keyPoints: [
        "Le flux de trésorerie d'exploitation mesure le cash généré par l'activité principale.",
        "Le besoin en fonds de roulement mesure le cash immobilisé dans le cycle d'exploitation.",
        "La capacité d'autofinancement mesure la capacité à financer les investissements avec ses propres ressources.",
        "La dynamique de liquidité analyse l'évolution de la trésorerie nette sur plusieurs exercices.",
        "Une analyse combinée des flux de trésorerie permet d'évaluer la performance réelle et les risques de liquidité.",
      ],
      miniQuiz: [
        {
          question: "Qu'est-ce que le flux de trésorerie d'exploitation ?",
          answer: "Le cash généré par l'activité principale, calculé comme EBITDA moins la variation du BFR.",
        },
        {
          question: "Qu'est-ce que le besoin en fonds de roulement ?",
          answer: "Le cash immobilisé dans le cycle d'exploitation, calculé comme Stocks + Créances clients - Dettes fournisseurs.",
        },
        {
          question: "Qu'est-ce que la capacité d'autofinancement ?",
          answer: "Le cash disponible après déduction de toutes les charges, calculé comme Résultat net + Amortissements.",
        },
      ],
      quiz: [
        {
          question: "Qu'est-ce que le flux de trésorerie d'exploitation ?",
          options: [
            "Le cash généré par l'activité principale, calculé comme EBITDA moins la variation du BFR",
            "Le cash utilisé pour investir dans les actifs",
            "Le cash provenant des emprunts",
            "Le cash distribué aux actionnaires",
          ],
          correctAnswer: "Le cash généré par l'activité principale, calculé comme EBITDA moins la variation du BFR",
        },
        {
          question: "Qu'est-ce que le besoin en fonds de roulement ?",
          options: [
            "Le cash immobilisé dans le cycle d'exploitation, calculé comme Stocks + Créances clients - Dettes fournisseurs",
            "Le cash disponible en trésorerie",
            "Le cash généré par les investissements",
            "Le cash provenant des emprunts",
          ],
          correctAnswer: "Le cash immobilisé dans le cycle d'exploitation, calculé comme Stocks + Créances clients - Dettes fournisseurs",
        },
        {
          question: "Qu'est-ce que la capacité d'autofinancement ?",
          options: [
            "Le cash disponible après déduction de toutes les charges, calculé comme Résultat net + Amortissements",
            "Le cash généré par l'activité principale",
            "Le cash utilisé pour investir",
            "Le cash distribué aux actionnaires",
          ],
          correctAnswer: "Le cash disponible après déduction de toutes les charges, calculé comme Résultat net + Amortissements",
        },
        {
          question: "Quelle est la formule du flux de trésorerie d'exploitation ?",
          options: [
            "FTE = EBITDA - Variation du BFR",
            "FTE = Résultat net + Amortissements",
            "FTE = Investissements - Cessions",
            "FTE = Emprunts - Remboursements",
          ],
          correctAnswer: "FTE = EBITDA - Variation du BFR",
        },
        {
          question: "Si la variation du BFR est positive, que cela indique-t-il ?",
          options: [
            "Consommation de cash (augmentation des stocks ou créances)",
            "Génération de cash (réduction des stocks ou créances)",
            "Stabilité de la trésorerie",
            "Augmentation de la rentabilité",
          ],
          correctAnswer: "Consommation de cash (augmentation des stocks ou créances)",
        },
        {
          question: "Si le FTE est négatif sur plusieurs exercices, que cela indique-t-il ?",
          options: [
            "L'entreprise consomme du cash avec son activité, risque de liquidité",
            "L'entreprise génère beaucoup de cash",
            "L'entreprise investit massivement",
            "L'entreprise distribue beaucoup de dividendes",
          ],
          correctAnswer: "L'entreprise consomme du cash avec son activité, risque de liquidité",
        },
        {
          question: "Quelle est la formule de la capacité d'autofinancement ?",
          options: [
            "CAF = Résultat net + Amortissements",
            "CAF = EBITDA - Variation du BFR",
            "CAF = Investissements - Cessions",
            "CAF = Emprunts - Remboursements",
          ],
          correctAnswer: "CAF = Résultat net + Amortissements",
        },
      ],
    },
  },
  {
    id: "diagnostic-global",
    title: "Diagnostic global : performance, risque et liquidité",
    description: "Combiner toutes les analyses pour établir un diagnostic financier complet et proposer une grille d'interprétation qualitative.",
    duration: "30 min",
    order: 5,
    objective: "Maîtriser l'établissement d'un diagnostic financier complet en combinant l'analyse de performance, de risque et de liquidité pour évaluer la solidité financière globale de l'entreprise.",
    content: {
      sections: [
        {
          title: "Pourquoi un diagnostic global ?",
          content: "Un diagnostic global combine toutes les analyses (performance, risque, liquidité) pour avoir une vision complète de la santé financière de l'entreprise. Un diagnostic approfondi permet de :",
          items: [
            "Synthétiser les analyses de rentabilité, solvabilité et liquidité",
            "Identifier les forces et faiblesses de l'entreprise",
            "Proposer des recommandations stratégiques",
            "Évaluer la solidité financière globale",
          ],
        },
        {
          title: "La grille d'analyse : performance, risque et liquidité",
          content: "Une grille d'analyse permet d'évaluer trois dimensions clés :",
          items: [
            "Performance : rentabilité, efficacité opérationnelle, création de valeur",
            "Risque : structure financière, solvabilité, capacité d'endettement",
            "Liquidité : flux de trésorerie, capacité d'autofinancement, trésorerie nette",
          ],
        },
        {
          title: "L'analyse de performance",
          content: "L'analyse de performance évalue la rentabilité et l'efficacité opérationnelle de l'entreprise. C'est la première dimension du diagnostic global. Les indicateurs clés sont : marge opérationnelle, marge nette, ROA, ROE, ROIC.",
        },
        {
          title: "Indicateurs de performance",
          content: "Indicateurs clés de l'analyse de performance :",
          items: [
            "Marge opérationnelle",
            "Marge nette",
            "ROA (Return on Assets)",
            "ROE (Return on Equity)",
            "ROIC (Return on Invested Capital)",
          ],
        },
        {
          title: "Interprétation de la performance",
          content: "Interprétation de la performance :",
          items: [
            "Performance excellente : marges élevées (> 15%), ROE > 15%, ROIC > WACC",
            "Performance acceptable : marges modérées (5-15%), ROE 8-15%, ROIC proche du WACC",
            "Performance faible : marges faibles (< 5%), ROE < 8%, ROIC < WACC",
          ],
        },
        {
          title: "Exemple de performance",
          content: "Exemple concret :",
          items: [
            "Une entreprise avec une marge opérationnelle de 18%, un ROE de 16% et un ROIC de 12% (WACC = 9%)",
            "Interprétation : Performance excellente (marges élevées, ROE > 15%, ROIC > WACC)",
          ],
        },
        {
          title: "L'analyse de risque",
          content: "L'analyse de risque évalue la structure financière et la capacité d'endettement de l'entreprise. C'est la deuxième dimension du diagnostic global. Les indicateurs clés sont : autonomie financière, endettement global, capacité de remboursement, couverture de la dette.",
        },
        {
          title: "Indicateurs de risque",
          content: "Indicateurs clés de l'analyse de risque :",
          items: [
            "Ratio d'autonomie financière",
            "Ratio d'endettement global",
            "Capacité de remboursement",
            "Ratio de couverture de la dette par l'EBITDA",
          ],
        },
        {
          title: "Interprétation du risque",
          content: "Interprétation du risque :",
          items: [
            "Risque faible : autonomie > 50%, endettement < 1, capacité de remboursement < 3 ans",
            "Risque modéré : autonomie 30-50%, endettement 1-2, capacité de remboursement 3-5 ans",
            "Risque élevé : autonomie < 30%, endettement > 2, capacité de remboursement > 5 ans",
          ],
        },
        {
          title: "Exemple de risque",
          content: "Exemple concret :",
          items: [
            "Une entreprise avec une autonomie de 45%, un endettement de 1,2 et une capacité de remboursement de 3,5 ans",
            "Interprétation : Risque modéré (autonomie 30-50%, endettement 1-2, capacité de remboursement 3-5 ans)",
          ],
        },
        {
          title: "L'analyse de liquidité",
          content: "L'analyse de liquidité évalue la capacité de l'entreprise à générer du cash et à faire face à ses obligations à court terme. C'est la troisième dimension du diagnostic global. Les indicateurs clés sont : FTE, CAF, liquidité générale, trésorerie nette.",
        },
        {
          title: "Indicateurs de liquidité",
          content: "Indicateurs clés de l'analyse de liquidité :",
          items: [
            "Flux de trésorerie d'exploitation (FTE)",
            "Capacité d'autofinancement (CAF)",
            "Ratio de liquidité générale",
            "Trésorerie nette",
          ],
        },
        {
          title: "Interprétation de la liquidité",
          content: "Interprétation de la liquidité :",
          items: [
            "Liquidité excellente : FTE > 0, CAF > Investissements, liquidité > 1,5, trésorerie nette > 0",
            "Liquidité acceptable : FTE > 0, CAF proche des Investissements, liquidité 1-1,5, trésorerie nette proche de 0",
            "Liquidité faible : FTE < 0, CAF < Investissements, liquidité < 1, trésorerie nette < 0",
          ],
        },
        {
          title: "Exemple de liquidité",
          content: "Exemple concret :",
          items: [
            "Une entreprise avec un FTE de 4 M€, une CAF de 3,5 M€ (Investissements = 2,5 M€), une liquidité de 1,6 et une trésorerie nette de 1,2 M€",
            "Interprétation : Liquidité excellente (FTE > 0, CAF > Investissements, liquidité > 1,5, trésorerie nette > 0)",
          ],
        },
        {
          title: "La grille de notation financière",
          content: "Une grille de notation permet d'évaluer la solidité financière globale de l'entreprise. Elle combine les trois dimensions avec des poids pour obtenir un score global.",
          items: [
            {
              type: "formula",
              formula: "\\text{Score} = \\text{Poids}_P \\times \\text{Note}_P + \\text{Poids}_R \\times \\text{Note}_R + \\text{Poids}_L \\times \\text{Note}_L",
              explanation: "Le score financier combine les trois dimensions avec des poids (par exemple : 40% performance, 30% risque, 30% liquidité). P = Performance, R = Risque, L = Liquidité.",
            },
          ],
        },
        {
          title: "Échelle de notation",
          content: "Échelle de notation pour chaque dimension :",
          items: [
            "Note 4 : Excellent (indicateurs très favorables)",
            "Note 3 : Bon (indicateurs favorables)",
            "Note 2 : Acceptable (indicateurs moyens)",
            "Note 1 : Faible (indicateurs défavorables)",
            "Note 0 : Très faible (indicateurs très défavorables)",
          ],
        },
        {
          title: "Interprétation du score financier",
          content: "Interprétation du score financier global :",
          items: [
            "Score > 3,5 : solidité financière excellente",
            "Score 2,5-3,5 : solidité financière bonne",
            "Score 1,5-2,5 : solidité financière acceptable",
            "Score < 1,5 : solidité financière faible",
          ],
        },
        {
          title: "Exemple de grille de notation",
          content: "Exemple concret :",
          items: [
            "Une entreprise avec une note de 4 en performance, 3 en risque et 4 en liquidité",
            "Poids : 40% performance, 30% risque, 30% liquidité",
            "Score = 0,4 × 4 + 0,3 × 3 + 0,3 × 4 = 3,7",
            "Interprétation : Excellente solidité financière (score > 3,5)",
          ],
        },
        {
          title: "Exemple : diagnostic global sur 3 ans",
          content: "L'entreprise FinX Manufacturing présente les données suivantes :",
        },
        {
          title: "Diagnostic FinX Manufacturing - Année N-2",
          content: "Année N-2 :",
          items: [
            "Performance : marge opérationnelle 16%, ROE 14%, ROIC 11% (WACC 8%) → Note 4",
            "Risque : autonomie 45%, endettement 1,2, capacité de remboursement 3,2 ans → Note 3",
            "Liquidité : FTE 4,5 M€, CAF 3,8 M€ (Investissements 2,5 M€), liquidité 1,6 → Note 4",
            "Score global : 0,4 × 4 + 0,3 × 3 + 0,3 × 4 = 3,7",
            "Interprétation : Excellente solidité financière",
          ],
        },
        {
          title: "Diagnostic FinX Manufacturing - Année N-1",
          content: "Année N-1 :",
          items: [
            "Performance : marge opérationnelle 14%, ROE 12%, ROIC 9% (WACC 8%) → Note 3",
            "Risque : autonomie 40%, endettement 1,5, capacité de remboursement 4 ans → Note 2",
            "Liquidité : FTE 3,5 M€, CAF 3 M€ (Investissements 3 M€), liquidité 1,4 → Note 3",
            "Score global : 0,4 × 3 + 0,3 × 2 + 0,3 × 3 = 2,7",
            "Interprétation : Bonne solidité financière",
          ],
        },
        {
          title: "Diagnostic FinX Manufacturing - Année N",
          content: "Année N :",
          items: [
            "Performance : marge opérationnelle 12%, ROE 10%, ROIC 7% (WACC 8%) → Note 2",
            "Risque : autonomie 35%, endettement 1,9, capacité de remboursement 5,5 ans → Note 1",
            "Liquidité : FTE 2,5 M€, CAF 2,2 M€ (Investissements 3,5 M€), liquidité 1,2 → Note 2",
            "Score global : 0,4 × 2 + 0,3 × 1 + 0,3 × 2 = 1,7",
            "Interprétation : Solidité financière acceptable mais en baisse",
          ],
        },
        {
          title: "Analyse de l'évolution FinX Manufacturing",
          content: "Analyse de l'évolution sur 3 ans :",
          items: [
            "Dégradation progressive de la performance (marges en baisse, ROIC < WACC en N)",
            "Augmentation du risque (autonomie en baisse, endettement en hausse, capacité de remboursement dégradée)",
            "Détérioration de la liquidité (FTE en baisse, CAF < Investissements en N)",
            "Score global en baisse : 3,7 → 2,7 → 1,7",
            "Conclusion : L'entreprise présente une solidité financière acceptable mais en dégradation",
            "Recommandations : améliorer la rentabilité opérationnelle, réduire l'endettement, optimiser le BFR",
          ],
        },
        {
          title: "Les recommandations stratégiques",
          content: "Selon le diagnostic, différentes recommandations peuvent être proposées :",
        },
        {
          title: "Recommandations si performance faible",
          content: "Si la performance est faible :",
          items: [
            "Améliorer la marge opérationnelle (réduction des coûts, optimisation des prix)",
            "Augmenter l'efficacité des actifs (rotation des stocks, réduction des créances)",
            "Réinvestir dans les projets rentables (ROIC > WACC)",
          ],
        },
        {
          title: "Recommandations si risque élevé",
          content: "Si le risque est élevé :",
          items: [
            "Réduire l'endettement (remboursement anticipé, augmentation de capital)",
            "Améliorer l'autonomie financière (augmentation des capitaux propres)",
            "Renégocier les conditions d'emprunt (taux, échéances)",
          ],
        },
        {
          title: "Recommandations si liquidité faible",
          content: "Si la liquidité est faible :",
          items: [
            "Améliorer le flux de trésorerie d'exploitation (optimisation du BFR)",
            "Réduire les investissements non essentiels",
            "Augmenter la capacité d'autofinancement (amélioration de la rentabilité)",
          ],
        },
        {
          title: "Les limites du diagnostic",
          content: "Le diagnostic financier présente certaines limites :",
          items: [
            "Données historiques : le diagnostic se base sur des données passées, pas sur l'avenir",
            "Secteur d'activité : les ratios doivent être comparés aux références sectorielles",
            "Contexte économique : la situation macroéconomique peut influencer les performances",
            "Qualité des données : la fiabilité du diagnostic dépend de la qualité des états financiers",
            "Vision partielle : le diagnostic financier ne couvre pas tous les aspects de l'entreprise (stratégie, marché, etc.)",
          ],
        },
      ],
      keyPoints: [
        "Un diagnostic global combine l'analyse de performance, de risque et de liquidité.",
        "Une grille de notation permet d'évaluer la solidité financière globale de l'entreprise.",
        "L'analyse de performance évalue la rentabilité et l'efficacité opérationnelle.",
        "L'analyse de risque évalue la structure financière et la capacité d'endettement.",
        "L'analyse de liquidité évalue la capacité à générer du cash et à faire face aux obligations.",
        "Un diagnostic sur plusieurs années révèle les tendances et les signaux d'alerte.",
      ],
      miniQuiz: [
        {
          question: "Quelles sont les trois dimensions d'un diagnostic global ?",
          answer: "Performance, risque et liquidité.",
        },
        {
          question: "Qu'est-ce qu'une grille de notation financière ?",
          answer: "Un outil qui combine les trois dimensions (performance, risque, liquidité) avec des poids pour évaluer la solidité financière globale.",
        },
        {
          question: "Quels sont les indicateurs clés de l'analyse de performance ?",
          answer: "Marge opérationnelle, marge nette, ROA, ROE, ROIC.",
        },
      ],
      quiz: [
        {
          question: "Quelles sont les trois dimensions d'un diagnostic global ?",
          options: [
            "Performance, risque et liquidité",
            "Rentabilité, solvabilité et trésorerie",
            "Marge, endettement et cash-flow",
            "ROE, ROA et WACC",
          ],
          correctAnswer: "Performance, risque et liquidité",
        },
        {
          question: "Qu'est-ce qu'une grille de notation financière ?",
          options: [
            "Un outil qui combine les trois dimensions (performance, risque, liquidité) avec des poids pour évaluer la solidité financière globale",
            "Un tableau qui liste tous les ratios financiers",
            "Un graphique qui montre l'évolution des performances",
            "Un rapport qui décrit la situation financière",
          ],
          correctAnswer: "Un outil qui combine les trois dimensions (performance, risque, liquidité) avec des poids pour évaluer la solidité financière globale",
        },
        {
          question: "Quels sont les indicateurs clés de l'analyse de performance ?",
          options: [
            "Marge opérationnelle, marge nette, ROA, ROE, ROIC",
            "Ratio d'autonomie, ratio d'endettement, capacité de remboursement",
            "FTE, CAF, ratio de liquidité, trésorerie nette",
            "Stocks, créances clients, dettes fournisseurs",
          ],
          correctAnswer: "Marge opérationnelle, marge nette, ROA, ROE, ROIC",
        },
        {
          question: "Quels sont les indicateurs clés de l'analyse de risque ?",
          options: [
            "Ratio d'autonomie financière, ratio d'endettement global, capacité de remboursement, ratio de couverture de la dette",
            "Marge opérationnelle, marge nette, ROA, ROE",
            "FTE, CAF, ratio de liquidité, trésorerie nette",
            "Stocks, créances clients, dettes fournisseurs",
          ],
          correctAnswer: "Ratio d'autonomie financière, ratio d'endettement global, capacité de remboursement, ratio de couverture de la dette",
        },
        {
          question: "Quels sont les indicateurs clés de l'analyse de liquidité ?",
          options: [
            "Flux de trésorerie d'exploitation, capacité d'autofinancement, ratio de liquidité générale, trésorerie nette",
            "Marge opérationnelle, marge nette, ROA, ROE",
            "Ratio d'autonomie, ratio d'endettement, capacité de remboursement",
            "Stocks, créances clients, dettes fournisseurs",
          ],
          correctAnswer: "Flux de trésorerie d'exploitation, capacité d'autofinancement, ratio de liquidité générale, trésorerie nette",
        },
        {
          question: "Si une entreprise a un score financier de 3,7, que cela indique-t-il ?",
          options: [
            "Excellente solidité financière",
            "Bonne solidité financière",
            "Solidité financière acceptable",
            "Solidité financière faible",
          ],
          correctAnswer: "Excellente solidité financière",
        },
        {
          question: "Quelle recommandation stratégique proposer si la performance est faible ?",
          options: [
            "Améliorer la marge opérationnelle, augmenter l'efficacité des actifs, réinvestir dans les projets rentables",
            "Réduire l'endettement, améliorer l'autonomie financière, renégocier les conditions d'emprunt",
            "Améliorer le flux de trésorerie d'exploitation, réduire les investissements non essentiels, augmenter la capacité d'autofinancement",
            "Augmenter les stocks, réduire les créances clients, augmenter les dettes fournisseurs",
          ],
          correctAnswer: "Améliorer la marge opérationnelle, augmenter l'efficacité des actifs, réinvestir dans les projets rentables",
        },
      ],
    },
  },
  {
    id: "etude-cas-integree",
    title: "Étude de cas intégrée + mini-quiz",
    description: "Analyser un cas d'entreprise complet sur 3 ans, calculer les ratios clés, interpréter les évolutions et proposer des recommandations stratégiques.",
    duration: "40 min",
    order: 6,
    objective: "Maîtriser l'analyse financière complète d'une entreprise en combinant toutes les compétences acquises : calcul des ratios, interprétation des évolutions, diagnostic global et recommandations stratégiques.",
    content: {
      sections: [
        {
          title: "Cas d'entreprise : FinX Tech Solutions",
          content: "FinX Tech Solutions est une entreprise de services informatiques spécialisée dans le développement de logiciels pour les entreprises. Vous allez analyser la situation financière de cette entreprise sur 3 ans (N-2, N-1, N) en :",
          items: [
            "Calculant les ratios clés de performance, risque et liquidité",
            "Interprétant les évolutions",
            "Établissant un diagnostic global",
            "Proposant des recommandations stratégiques",
          ],
        },
        {
          title: "Données financières sur 3 ans",
          content: "Voici les données financières de FinX Tech Solutions :",
        },
        {
          title: "Bilan FinX Tech Solutions - Année N-2",
          content: "Bilan (en M€) - Année N-2 :",
          items: [
            "Actif total : 30 M€",
            "Actif courant : 8 M€",
            "Passif total : 30 M€",
            "Passif courant : 4 M€",
            "Capitaux propres : 18 M€",
            "Dettes financières : 8 M€",
            "Stocks : 0,5 M€",
            "Créances clients : 3 M€",
            "Dettes fournisseurs : 1,5 M€",
            "Trésorerie : 2 M€",
          ],
        },
        {
          title: "Bilan FinX Tech Solutions - Année N-1",
          content: "Bilan (en M€) - Année N-1 :",
          items: [
            "Actif total : 38 M€",
            "Actif courant : 12 M€",
            "Passif total : 38 M€",
            "Passif courant : 6 M€",
            "Capitaux propres : 20 M€",
            "Dettes financières : 12 M€",
            "Stocks : 0,8 M€",
            "Créances clients : 4,5 M€",
            "Dettes fournisseurs : 2,2 M€",
            "Trésorerie : 1,5 M€",
          ],
        },
        {
          title: "Bilan FinX Tech Solutions - Année N",
          content: "Bilan (en M€) - Année N :",
          items: [
            "Actif total : 48 M€",
            "Actif courant : 16 M€",
            "Passif total : 48 M€",
            "Passif courant : 8 M€",
            "Capitaux propres : 22 M€",
            "Dettes financières : 18 M€",
            "Stocks : 1,2 M€",
            "Créances clients : 6,5 M€",
            "Dettes fournisseurs : 3,2 M€",
            "Trésorerie : 0,8 M€",
          ],
        },
        {
          title: "Compte de résultat FinX Tech Solutions - Année N-2",
          content: "Compte de résultat (en M€) - Année N-2 :",
          items: [
            "Chiffre d'affaires : 25 M€",
            "Résultat d'exploitation : 5 M€",
            "Amortissements : 1,5 M€",
            "Charges financières : 0,4 M€",
            "Impôts : 1,2 M€",
            "Résultat net : 1,9 M€",
          ],
        },
        {
          title: "Compte de résultat FinX Tech Solutions - Année N-1",
          content: "Compte de résultat (en M€) - Année N-1 :",
          items: [
            "Chiffre d'affaires : 32 M€",
            "Résultat d'exploitation : 5,5 M€",
            "Amortissements : 2 M€",
            "Charges financières : 0,6 M€",
            "Impôts : 1,4 M€",
            "Résultat net : 1,5 M€",
          ],
        },
        {
          title: "Compte de résultat FinX Tech Solutions - Année N",
          content: "Compte de résultat (en M€) - Année N :",
          items: [
            "Chiffre d'affaires : 42 M€",
            "Résultat d'exploitation : 5,8 M€",
            "Amortissements : 2,5 M€",
            "Charges financières : 1 M€",
            "Impôts : 1,1 M€",
            "Résultat net : 1,2 M€",
          ],
        },
        {
          title: "Calcul des ratios de performance",
          content: "Calculons les ratios de performance pour chaque année :\n\n**Année N-2** :\n• Marge opérationnelle = 5 / 25 = 20%\n• Marge nette = 1,9 / 25 = 7,6%\n• ROA = 1,9 / 30 = 6,3%\n• ROE = 1,9 / 18 = 10,6%\n• EBITDA = 5 + 1,5 = 6,5 M€\n• EBITDA margin = 6,5 / 25 = 26%\n\n**Année N-1** :\n• Marge opérationnelle = 5,5 / 32 = 17,2%\n• Marge nette = 1,5 / 32 = 4,7%\n• ROA = 1,5 / 38 = 3,9%\n• ROE = 1,5 / 20 = 7,5%\n• EBITDA = 5,5 + 2 = 7,5 M€\n• EBITDA margin = 7,5 / 32 = 23,4%\n\n**Année N** :\n• Marge opérationnelle = 5,8 / 42 = 13,8%\n• Marge nette = 1,2 / 42 = 2,9%\n• ROA = 1,2 / 48 = 2,5%\n• ROE = 1,2 / 22 = 5,5%\n• EBITDA = 5,8 + 2,5 = 8,3 M€\n• EBITDA margin = 8,3 / 42 = 19,8%\n\n**Analyse** :\n• Dégradation progressive de la marge opérationnelle (20% → 17,2% → 13,8%)\n• Dégradation plus marquée de la marge nette (7,6% → 4,7% → 2,9%)\n• Baisse significative du ROA (6,3% → 3,9% → 2,5%)\n• Baisse significative du ROE (10,6% → 7,5% → 5,5%)\n• Baisse de l'EBITDA margin (26% → 23,4% → 19,8%)\n\n👉 Signal d'alerte : la rentabilité se détériore malgré la croissance du CA.",
        },
        {
          title: "Calcul des ratios de risque",
          content: "Calculons les ratios de risque pour chaque année :\n\n**Année N-2** :\n• Ratio d'autonomie financière = 18 / 30 = 60%\n• Ratio d'endettement global = 8 / 18 = 0,44\n• Capacité de remboursement = 8 / 5 = 1,6 ans\n• EBITDA = 6,5 M€\n• Ratio de couverture de la dette = 8 / 6,5 = 1,2 ans\n• Ratio de liquidité générale = 8 / 4 = 2\n\n**Année N-1** :\n• Ratio d'autonomie financière = 20 / 38 = 52,6%\n• Ratio d'endettement global = 12 / 20 = 0,6\n• Capacité de remboursement = 12 / 5,5 = 2,2 ans\n• EBITDA = 7,5 M€\n• Ratio de couverture de la dette = 12 / 7,5 = 1,6 ans\n• Ratio de liquidité générale = 12 / 6 = 2\n\n**Année N** :\n• Ratio d'autonomie financière = 22 / 48 = 45,8%\n• Ratio d'endettement global = 18 / 22 = 0,82\n• Capacité de remboursement = 18 / 5,8 = 3,1 ans\n• EBITDA = 8,3 M€\n• Ratio de couverture de la dette = 18 / 8,3 = 2,2 ans\n• Ratio de liquidité générale = 16 / 8 = 2\n\n**Analyse** :\n• Baisse de l'autonomie financière (60% → 52,6% → 45,8%)\n• Augmentation de l'endettement (0,44 → 0,6 → 0,82)\n• Dégradation de la capacité de remboursement (1,6 ans → 2,2 ans → 3,1 ans)\n• Dégradation du ratio de couverture de la dette (1,2 ans → 1,6 ans → 2,2 ans)\n• Liquidité générale stable (2)\n\n👉 Signal d'alerte : l'entreprise s'endette pour financer sa croissance, mais la capacité de remboursement se dégrade.",
        },
        {
          title: "Calcul des ratios de liquidité",
          content: "Calculons les ratios de liquidité pour chaque année :\n\n**Année N-2** :\n• BFR = 0,5 + 3 - 1,5 = 2 M€\n• FTE = 6,5 - 0 = 6,5 M€ (pas de variation du BFR en N-2)\n• CAF = 1,9 + 1,5 = 3,4 M€\n• Investissements (approximatif) = 2 M€\n• Trésorerie nette = 2 M€\n\n**Année N-1** :\n• BFR N-1 = 0,8 + 4,5 - 2,2 = 3,1 M€\n• Variation du BFR = 3,1 - 2 = +1,1 M€\n• FTE = 7,5 - 1,1 = 6,4 M€\n• CAF = 1,5 + 2 = 3,5 M€\n• Investissements (approximatif) = 3 M€\n• Trésorerie nette = 1,5 M€\n\n**Année N** :\n• BFR N = 1,2 + 6,5 - 3,2 = 4,5 M€\n• Variation du BFR = 4,5 - 3,1 = +1,4 M€\n• FTE = 8,3 - 1,4 = 6,9 M€\n• CAF = 1,2 + 2,5 = 3,7 M€\n• Investissements (approximatif) = 4 M€\n• Trésorerie nette = 0,8 M€\n\n**Analyse** :\n• Augmentation du BFR (2 M€ → 3,1 M€ → 4,5 M€)\n• Variation du BFR positive et croissante (+1,1 M€ → +1,4 M€)\n• FTE stable mais légèrement en hausse (6,5 M€ → 6,4 M€ → 6,9 M€)\n• CAF en légère hausse (3,4 M€ → 3,5 M€ → 3,7 M€)\n• Investissements en hausse (2 M€ → 3 M€ → 4 M€)\n• CAF < Investissements en N (3,7 M€ < 4 M€)\n• Trésorerie nette en baisse (2 M€ → 1,5 M€ → 0,8 M€)\n\n👉 Signal d'alerte : l'augmentation du BFR consomme du cash, et la trésorerie nette baisse.",
        },
        {
          title: "Diagnostic global",
          content: "Établissons un diagnostic global en notant chaque dimension :\n\n**Année N-2** :\n• Performance : Note 4 (marges élevées, ROE > 10%)\n• Risque : Note 4 (autonomie > 50%, endettement faible, capacité de remboursement excellente)\n• Liquidité : Note 4 (FTE élevé, CAF > Investissements, trésorerie nette positive)\n• Score global : 0,4 × 4 + 0,3 × 4 + 0,3 × 4 = 4,0 (excellente solidité financière)\n\n**Année N-1** :\n• Performance : Note 3 (marges modérées, ROE 7-10%)\n• Risque : Note 3 (autonomie 50%, endettement modéré, capacité de remboursement acceptable)\n• Liquidité : Note 3 (FTE élevé, CAF proche des Investissements, trésorerie nette positive)\n• Score global : 0,4 × 3 + 0,3 × 3 + 0,3 × 3 = 3,0 (bonne solidité financière)\n\n**Année N** :\n• Performance : Note 2 (marges faibles, ROE < 8%)\n• Risque : Note 2 (autonomie < 50%, endettement modéré, capacité de remboursement acceptable)\n• Liquidité : Note 2 (FTE élevé mais CAF < Investissements, trésorerie nette faible)\n• Score global : 0,4 × 2 + 0,3 × 2 + 0,3 × 2 = 2,0 (solidité financière acceptable)\n\n**Analyse globale** :\n• Dégradation progressive du score global (4,0 → 3,0 → 2,0)\n• Performance en baisse (Note 4 → 3 → 2)\n• Risque en légère hausse (Note 4 → 3 → 2)\n• Liquidité en baisse (Note 4 → 3 → 2)\n• Tendance préoccupante : la solidité financière se dégrade malgré la croissance du CA\n\n👉 Conclusion : L'entreprise présente une solidité financière acceptable mais en dégradation. La croissance du CA ne se traduit pas par une amélioration de la rentabilité, et l'endettement augmente pour financer cette croissance.",
        },
        {
          title: "Recommandations stratégiques",
          content: "Proposons des recommandations stratégiques pour améliorer la situation financière :\n\n**1. Améliorer la rentabilité opérationnelle** :\n• Analyser la structure de coûts pour identifier les postes à optimiser\n• Renégocier les contrats avec les fournisseurs\n• Augmenter les prix si possible (positionnement premium)\n• Objectif : remonter la marge opérationnelle à 18-20%\n\n**2. Optimiser le besoin en fonds de roulement** :\n• Réduire les délais de paiement clients (facturation plus rapide, relances)\n• Négocier des délais de paiement fournisseurs plus longs\n• Optimiser la gestion des stocks (juste-à-temps si possible)\n• Objectif : réduire le BFR de 4,5 M€ à 3 M€\n\n**3. Réduire l'endettement** :\n• Utiliser le cash généré (FTE) pour rembourser les dettes\n• Éviter de nouveaux emprunts si possible\n• Objectif : ramener le ratio d'endettement à 0,5-0,6\n\n**4. Améliorer la capacité d'autofinancement** :\n• Augmenter la rentabilité pour générer plus de CAF\n• Réduire les investissements non essentiels\n• Objectif : CAF > Investissements\n\n**5. Surveiller la trésorerie** :\n• Éviter que la trésorerie nette ne devienne négative\n• Maintenir une réserve de sécurité (minimum 1 M€)\n• Objectif : trésorerie nette > 1 M€",
        },
      ],
      keyPoints: [
        "L'analyse financière complète combine les ratios de performance, risque et liquidité.",
        "L'analyse sur plusieurs années révèle les tendances et les signaux d'alerte.",
        "Un diagnostic global permet d'évaluer la solidité financière globale.",
        "Les recommandations stratégiques doivent être adaptées aux faiblesses identifiées.",
        "La croissance du CA ne garantit pas une amélioration de la rentabilité.",
      ],
      miniQuiz: [
        {
          question: "Quels sont les trois types de ratios à analyser dans une étude de cas complète ?",
          answer: "Les ratios de performance, de risque et de liquidité.",
        },
        {
          question: "Que révèle une analyse sur plusieurs années ?",
          answer: "Les tendances et les signaux d'alerte, permettant d'identifier les dégradations ou améliorations.",
        },
        {
          question: "Quelle est la première étape d'un diagnostic global ?",
          answer: "Calculer les ratios clés de performance, risque et liquidité pour chaque année.",
        },
      ],
      quiz: [
        {
          question: "Quels sont les trois types de ratios à analyser dans une étude de cas complète ?",
          options: [
            "Les ratios de performance, de risque et de liquidité",
            "Les ratios de rentabilité, de solvabilité et de trésorerie",
            "Les ratios de marge, d'endettement et de cash-flow",
            "Les ratios de ROE, ROA et WACC",
          ],
          correctAnswer: "Les ratios de performance, de risque et de liquidité",
        },
        {
          question: "Que révèle une analyse sur plusieurs années ?",
          options: [
            "Les tendances et les signaux d'alerte, permettant d'identifier les dégradations ou améliorations",
            "La situation financière actuelle uniquement",
            "Les prévisions pour l'avenir",
            "Les performances du secteur",
          ],
          correctAnswer: "Les tendances et les signaux d'alerte, permettant d'identifier les dégradations ou améliorations",
        },
        {
          question: "Quelle est la première étape d'un diagnostic global ?",
          options: [
            "Calculer les ratios clés de performance, risque et liquidité pour chaque année",
            "Proposer des recommandations stratégiques",
            "Analyser les tendances du secteur",
            "Évaluer la qualité de la direction",
          ],
          correctAnswer: "Calculer les ratios clés de performance, risque et liquidité pour chaque année",
        },
        {
          question: "Si la marge opérationnelle baisse de 20% à 13,8% sur 3 ans, que cela indique-t-il ?",
          options: [
            "Une détérioration de la rentabilité opérationnelle malgré la croissance du CA",
            "Une amélioration de la rentabilité opérationnelle",
            "Une stabilité de la rentabilité opérationnelle",
            "Une augmentation de l'endettement",
          ],
          correctAnswer: "Une détérioration de la rentabilité opérationnelle malgré la croissance du CA",
        },
        {
          question: "Si le ratio d'endettement global augmente de 0,44 à 0,82 sur 3 ans, que cela indique-t-il ?",
          options: [
            "L'entreprise s'endette davantage pour financer sa croissance",
            "L'entreprise réduit son endettement",
            "L'entreprise maintient son niveau d'endettement",
            "L'entreprise améliore sa liquidité",
          ],
          correctAnswer: "L'entreprise s'endette davantage pour financer sa croissance",
        },
        {
          question: "Si la variation du BFR est positive et croissante (+1,1 M€ → +1,4 M€), que cela indique-t-il ?",
          options: [
            "Consommation croissante de cash pour financer le cycle d'exploitation",
            "Génération croissante de cash",
            "Stabilité de la trésorerie",
            "Amélioration de la rentabilité",
          ],
          correctAnswer: "Consommation croissante de cash pour financer le cycle d'exploitation",
        },
        {
          question: "Si le score global baisse de 4,0 à 2,0 sur 3 ans, que cela indique-t-il ?",
          options: [
            "Dégradation progressive de la solidité financière",
            "Amélioration progressive de la solidité financière",
            "Stabilité de la solidité financière",
            "Amélioration de la rentabilité",
          ],
          correctAnswer: "Dégradation progressive de la solidité financière",
        },
        {
          question: "Quelle recommandation stratégique proposer si la marge opérationnelle baisse ?",
          options: [
            "Analyser la structure de coûts, renégocier les contrats, augmenter les prix si possible",
            "Réduire l'endettement, améliorer l'autonomie financière",
            "Optimiser le BFR, réduire les créances clients",
            "Augmenter les investissements",
          ],
          correctAnswer: "Analyser la structure de coûts, renégocier les contrats, augmenter les prix si possible",
        },
        {
          question: "Quelle recommandation stratégique proposer si le BFR augmente ?",
          options: [
            "Réduire les délais de paiement clients, négocier des délais fournisseurs plus longs, optimiser les stocks",
            "Augmenter l'endettement",
            "Réduire les investissements",
            "Augmenter les prix",
          ],
          correctAnswer: "Réduire les délais de paiement clients, négocier des délais fournisseurs plus longs, optimiser les stocks",
        },
        {
          question: "Pourquoi la croissance du CA ne garantit pas une amélioration de la rentabilité ?",
          options: [
            "Parce que les coûts peuvent augmenter plus vite que le CA, ou que la structure de coûts se dégrade",
            "Parce que le CA n'est pas un indicateur de rentabilité",
            "Parce que la rentabilité dépend uniquement de l'endettement",
            "Parce que la rentabilité dépend uniquement de la liquidité",
          ],
          correctAnswer: "Parce que les coûts peuvent augmenter plus vite que le CA, ou que la structure de coûts se dégrade",
        },
      ],
    },
  },
  {
    id: "examen-final",
    title: "Grand Cas d'Analyse Financière",
    description: "Examen final du module : analysez un cas d'entreprise complet sur 3 ans, calculez les ratios clés, interprétez les évolutions et établissez un diagnostic global.",
    duration: "60 min",
    order: 7,
    objective: "Valider toutes les compétences acquises en analyse financière : calcul des ratios, interprétation des évolutions, diagnostic global et conclusion sur la solidité financière.",
    content: {
      sections: [
        {
          title: "Instructions pour l'examen",
          content: "Cet examen final évalue votre maîtrise de l'analyse financière complète.\n\nVous devrez :\n• analyser un cas d'entreprise sur 3 ans (N-2, N-1, N),\n• calculer les ratios clés de performance, risque et liquidité,\n• interpréter les évolutions,\n• établir un diagnostic global,\n• conclure sur la solidité financière de l'entreprise.\n\n**Critères de réussite** :\n• Score minimum : 70%\n• Badge obtenu : \"Analyste Confirmé\" 🎓\n• XP gagné : +750 XP",
        },
      ],
      keyPoints: [
        "L'examen final évalue toutes les compétences acquises dans le module.",
        "Chaque tentative présente un cas d'entreprise différent tiré aléatoirement.",
        "Un score de 70% ou plus est requis pour valider l'examen.",
        "La réussite de l'examen débloque le badge \"Analyste Confirmé\" et +750 XP.",
      ],
    },
  },
];

interface PageProps {
  params: {
    lessonSlug: string;
  };
}

const MODULE_ID = "finance-entreprise/analyse-financiere";

// Mapping des leçons vers leur XP
const lessonXP: Record<string, number> = {
  "lecture-analytique-etats-financiers": 25,
  "analyse-marges-rentabilites": 25,
  "structure-financiere-solvabilite": 25,
  "flux-tresorerie-dynamique-liquidite": 25,
  "diagnostic-global": 25,
  "etude-cas-integree": 25,
  "examen-final": 750,
};

export default function LessonPage({ params }: PageProps) {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { profile } = useProfile(user);
  const { isLessonUnlocked, completeLesson, isLessonCompleted, loading: completionLoading } = useLessonCompletion(
    user,
    MODULE_ID
  );

  const currentLesson = lessons.find((lesson) => lesson.id === params.lessonSlug);
  
  // Vérifier si le quiz de la leçon actuelle est réussi (si la leçon a un quiz)
  const hasQuiz = currentLesson?.content.quiz && currentLesson.content.quiz.length > 0;
  const { quizPassed: quizPassedFromHook, loading: quizResultLoading } = useQuizResult(
    user,
    hasQuiz ? currentLesson?.id : undefined,
    MODULE_ID
  );
  
  // État local pour suivre si le quiz est réussi (mis à jour en temps réel)
  const [quizPassed, setQuizPassed] = useState<boolean | null>(quizPassedFromHook);
  
  // État pour contrôler l'affichage de l'animation XP
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [xpEarnedForAnimation, setXpEarnedForAnimation] = useState(0);
  
  // Mettre à jour l'état local quand le hook change
  useEffect(() => {
    setQuizPassed(quizPassedFromHook);
  }, [quizPassedFromHook]);
  
  // Fixer le cas d'examen sélectionné pour éviter qu'il change à chaque re-render
  const [examCase, setExamCase] = useState<ExamCaseAnalyse | null>(null);

  // État pour suivre si l'examen final est réussi
  const [examPassed, setExamPassed] = useState(false);

  useEffect(() => {
    // Initialiser le cas d'examen uniquement si on est sur la leçon d'examen final
    if (currentLesson?.id === "examen-final" && !examCase) {
      setExamCase(getRandomExamCase());
    }
    
    // Réinitialiser si on change de leçon (pas l'examen final)
    if (currentLesson?.id !== "examen-final" && examCase) {
      setExamCase(null);
      setExamPassed(false);
    }
    
    // Vérifier si l'examen est déjà réussi dans localStorage
    if (currentLesson?.id === "examen-final" && examCase) {
      const savedResult = localStorage.getItem(`exam-result-${examCase.id}`);
      if (savedResult) {
        try {
          const parsed = JSON.parse(savedResult);
          if (parsed.examCaseId === examCase.id && parsed.hasPassed) {
            setExamPassed(true);
          }
        } catch (error) {
          console.error("Erreur lors du chargement du résultat de l'examen:", error);
        }
      }
    }
  }, [currentLesson?.id, examCase]);

  if (!currentLesson) {
    notFound();
  }

  const currentLessonIndex = lessons.findIndex((l) => l.id === params.lessonSlug);
  const previousLesson = currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < lessons.length - 1 ? lessons[currentLessonIndex + 1] : null;

  // Vérifier si la leçon est débloquée
  const isUnlocked = isLessonUnlocked(currentLesson.order, lessons.map((l) => ({ order: l.order, slug: l.id })));
  const isCompleted = isLessonCompleted(currentLesson.id);

  // Calculer la progression du module
  const moduleProgress = Math.round(((currentLessonIndex + 1) / lessons.length) * 100);

  const handleNextLesson = async () => {
    // Vérifier si la leçon a un quiz et si le quiz est réussi
    if (hasQuiz && quizPassed !== true) {
      alert("Vous devez réussir le quiz (score ≥ 70%) pour passer à la leçon suivante.");
      return;
    }

    // Marquer la leçon comme complétée et attribuer l'XP si ce n'est pas déjà fait
    if (user && !isCompleted) {
      try {
        // 1. Marquer la leçon comme complétée dans lesson_completion
        await completeLesson(currentLesson.id);

        // 2. Attribuer l'XP et mettre à jour la gamification
        const xpEarned = lessonXP[currentLesson.id] || 25;
        
        const result = await completeLessonForUser({
          user,
          courseId: "corp-analysis",
          lessonId: currentLesson.id,
          lessonIndex: currentLesson.order,
          totalLessons: lessons.length,
          xpEarned,
        });

        if (result.success) {
          console.log(`Leçon complétée ! +${result.xpEarned} XP`);
          if (result.levelUp) {
            console.log(`Niveau ${result.oldLevel} → ${result.newLevel} !`);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la complétion de la leçon:", error);
      }
    }
    
    // Rediriger vers la leçon suivante ou la page du module si c'est la dernière
    if (nextLesson) {
      // Attendre un peu pour que la base de données soit mise à jour
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push(`/modules/finance-entreprise/analyse-financiere/${nextLesson.id}`);
    } else {
      // Attendre un peu pour que la base de données soit mise à jour
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push("/modules/finance-entreprise/analyse-financiere");
      // Forcer le rafraîchissement de la page du module
      router.refresh();
    }
  };

  // Si la leçon n'est pas débloquée, afficher un message
  if (!userLoading && !completionLoading && !isUnlocked) {
    return (
      <main className="bg-gray-50 min-h-screen py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Leçon verrouillée</h1>
            <p className="text-gray-600 mb-6">
              Vous devez compléter la leçon précédente pour accéder à cette leçon.
            </p>
            <Link
              href="/modules/finance-entreprise/analyse-financiere"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#F5B301] text-[#0A2540] font-semibold rounded-md hover:bg-[#e3a500] transition-colors"
            >
              Retour au module
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-12 px-6">
      {/* Animation XP */}
      {showXPAnimation && profile && (
        <XPAnimation
          xpEarned={xpEarnedForAnimation}
          currentXP={profile.xp || 0}
          onComplete={() => {
            setShowXPAnimation(false);
          }}
        />
      )}

      <div className="max-w-7xl mx-auto">
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
            <Link
              href="/modules/finance-entreprise/analyse-financiere"
              className="hover:text-[#0A2540] transition-colors"
            >
              Analyse financière
            </Link>
            <span>/</span>
            <span className="text-gray-400">{currentLesson.title}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche : Contenu de la leçon */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header de la leçon */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center rounded px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                  Intermédiaire
                </span>
                <span className="text-sm text-gray-500">Leçon {currentLesson.order}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{currentLesson.duration}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
                {currentLesson.title}
              </h1>
              <p className="text-base text-gray-700 leading-relaxed mb-4">
                {currentLesson.description}
              </p>
            </div>

            {/* Objectif pédagogique */}
            {currentLesson.objective && (
              <div className="bg-gradient-to-r from-[#0A2540] to-[#12335f] rounded-xl border border-gray-200 p-6 shadow-sm text-white">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <h2 className="text-lg font-bold mb-2">Objectif pédagogique</h2>
                    <p className="text-base leading-relaxed text-white/90">{currentLesson.objective}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Contenu de la leçon */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-10 shadow-sm">
              <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                {currentLesson.content.sections.map((section, index) => (
                  <div key={index} className={`${index > 0 ? 'mt-12' : ''} ${index < currentLesson.content.sections.length - 1 ? 'pb-12 border-b border-gray-200' : ''}`}>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                      {index + 1}. {section.title}
                    </h2>
                    {section.content && (
                      <div className="mb-6 whitespace-pre-line text-gray-800 leading-relaxed text-base md:text-lg">
                        {section.content.split("\n").map((line, lineIndex) => {
                          if (line.includes("→")) {
                            const parts = line.split("→");
                            return (
                              <p key={lineIndex} className="mb-4">
                                <strong className="font-semibold text-gray-900">{parts[0]}</strong>
                                {parts[1]}
                              </p>
                            );
                          }
                          if (line.startsWith("•")) {
                            return (
                              <p key={lineIndex} className="mb-3 ml-6 text-gray-700">
                                {line}
                              </p>
                            );
                          }
                          if (line.trim() === "") {
                            return <br key={lineIndex} />;
                          }
                          return (
                            <p key={lineIndex} className="mb-5 leading-relaxed">
                              {line}
                            </p>
                          );
                        })}
                      </div>
                    )}
                    {section.items && section.items.length > 0 && (
                      <div className="mt-6 space-y-4">
                        {section.items.map((item, itemIndex) => {
                          // Si l'item est un objet avec type "formula", afficher la formule dans un bloc séparé
                          if (typeof item === "object" && item !== null && "type" in item && item.type === "formula") {
                            return (
                              <div key={itemIndex} className="bg-gray-50 rounded-lg p-5 border border-gray-200 my-4">
                                <div className="mb-3">
                                  <MathFormula formula={item.formula} />
                                </div>
                                {item.explanation && (
                                  <p className="text-sm md:text-base text-gray-700 italic mt-3 pt-3 border-t border-gray-200">
                                    {item.explanation}
                                  </p>
                                )}
                              </div>
                            );
                          }
                          
                          // Sinon, afficher l'item comme texte simple dans une liste
                          return (
                            <div key={itemIndex} className="flex items-start gap-3 py-2">
                              <span className="text-[#0A2540] font-bold mt-1 flex-shrink-0">•</span>
                              <p className="text-gray-800 leading-relaxed text-base md:text-lg flex-1">
                                {typeof item === "string" ? item : String(item)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Points clés */}
            <div className="bg-blue-50 border-l-4 border-[#0A2540] rounded-r-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">À retenir</h3>
              <ul className="space-y-2">
                {currentLesson.content.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-800">
                    <span className="text-[#0A2540] mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quiz */}
            {currentLesson.content.quiz && currentLesson.content.quiz.length > 0 && (
              <Quiz
                questions={currentLesson.content.quiz}
                passingScore={70}
                lessonId={currentLesson.id}
                moduleId={MODULE_ID}
                onQuizPassed={(passed) => {
                  setQuizPassed(passed);
                  // Afficher l'animation XP si le quiz est réussi
                  if (passed) {
                    const xpEarned = lessonXP[currentLesson.id] || 25;
                    setXpEarnedForAnimation(xpEarned);
                    setShowXPAnimation(true);
                  }
                }}
              />
            )}

            {/* Examen final */}
            {currentLesson.id === "examen-final" && examCase && (
              <div className="mt-8">
                <ModuleExam
                  examCase={examCase}
                  moduleId={MODULE_ID}
                  onComplete={async (score, passed) => {
                    // Mettre à jour l'état local
                    setExamPassed(passed);
                    
                    // Afficher l'animation XP si l'examen est réussi
                    if (passed) {
                      const xpEarned = lessonXP[currentLesson.id] || 750;
                      setXpEarnedForAnimation(xpEarned);
                      setShowXPAnimation(true);
                    }
                    
                    if (passed && user && !isCompleted) {
                      try {
                        await completeLesson(currentLesson.id);
                        const xpEarned = lessonXP[currentLesson.id] || 750;
                        const result = await completeLessonForUser({
                          user,
                          courseId: "corp-analysis",
                          lessonId: currentLesson.id,
                          lessonIndex: currentLesson.order,
                          totalLessons: lessons.length,
                          xpEarned,
                        });
                        if (result.success) {
                          console.log(`Examen complété ! +${result.xpEarned} XP`);
                        }
                      } catch (error) {
                        console.error("Erreur lors de la complétion de l'examen:", error);
                      }
                    }
                  }}
                  onReset={() => {
                    // Supprimer tous les résultats d'examen sauvegardés pour ce module
                    if (user) {
                      // Supprimer de localStorage tous les résultats d'examen
                      Object.keys(localStorage).forEach((key) => {
                        if (key.startsWith("exam-result-")) {
                          localStorage.removeItem(key);
                        }
                      });
                    }
                    
                    // Régénérer un nouveau cas d'examen aléatoirement
                    // On s'assure de ne pas avoir le même cas en vérifiant l'ID
                    let newCase = getRandomExamCase();
                    let attempts = 0;
                    while (newCase.id === examCase?.id && attempts < 10) {
                      newCase = getRandomExamCase();
                      attempts++;
                    }
                    
                    setExamCase(newCase);
                    setExamPassed(false);
                  }}
                />
              </div>
            )}

            {/* Boutons de navigation */}
            <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              {previousLesson ? (
                <Link
                  href={`/modules/finance-entreprise/analyse-financiere/${previousLesson.id}`}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#0A2540] transition-colors"
                >
                  ← Leçon précédente
                </Link>
              ) : (
                <div></div>
              )}
              {nextLesson ? (
                // Si la leçon a un quiz, vérifier qu'il est réussi avant de permettre de passer à la suivante
                hasQuiz && quizPassed !== true ? (
                  <div className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-500 font-semibold rounded-md cursor-not-allowed">
                    Réussissez le quiz pour continuer
                  </div>
                ) : (
                  <button
                    onClick={handleNextLesson}
                    className="flex items-center gap-2 px-6 py-3 bg-[#F5B301] text-[#0A2540] font-semibold rounded-md hover:bg-[#e3a500] transition-colors"
                  >
                    Leçon suivante →
                  </button>
                )
              ) : currentLesson.id === "examen-final" ? (
                // Pour l'examen final, le bouton n'est disponible que si l'examen est réussi
                examPassed ? (
                  <button
                    onClick={async () => {
                      // Marquer la leçon comme complétée et attribuer l'XP si ce n'est pas déjà fait
                      if (user && !isCompleted) {
                        try {
                          await completeLesson(currentLesson.id);
                          const xpEarned = lessonXP[currentLesson.id] || 750;
                          const result = await completeLessonForUser({
                            user,
                            courseId: "corp-analysis",
                            lessonId: currentLesson.id,
                            lessonIndex: currentLesson.order,
                            totalLessons: lessons.length,
                            xpEarned,
                          });
                          if (result.success) {
                            console.log(`Examen complété ! +${result.xpEarned} XP`);
                          }
                        } catch (error) {
                          console.error("Erreur lors de la complétion de l'examen:", error);
                        }
                      }
                      // Attendre un peu pour que la base de données soit mise à jour
                      await new Promise((resolve) => setTimeout(resolve, 500));
                      router.push("/modules/finance-entreprise/analyse-financiere");
                      // Forcer le rafraîchissement de la page du module
                      router.refresh();
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-[#F5B301] text-[#0A2540] font-semibold rounded-md hover:bg-[#e3a500] transition-colors"
                  >
                    Terminer le module
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-500 font-semibold rounded-md cursor-not-allowed">
                    Réussissez l&apos;examen pour terminer le module
                  </div>
                )
              ) : (
                <button
                  onClick={async () => {
                    // Marquer la leçon comme complétée et attribuer l'XP si ce n'est pas déjà fait
                    if (user && !isCompleted) {
                      try {
                        await completeLesson(currentLesson.id);
                        const xpEarned = lessonXP[currentLesson.id] || 25;
                        const result = await completeLessonForUser({
                          user,
                          courseId: "corp-analysis",
                          lessonId: currentLesson.id,
                          lessonIndex: currentLesson.order,
                          totalLessons: lessons.length,
                          xpEarned,
                        });
                        if (result.success) {
                          console.log(`Leçon complétée ! +${result.xpEarned} XP`);
                        }
                      } catch (error) {
                        console.error("Erreur lors de la complétion de la leçon:", error);
                      }
                    }
                    // Attendre un peu pour que la base de données soit mise à jour
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    router.push("/modules/finance-entreprise/analyse-financiere");
                    // Forcer le rafraîchissement de la page du module
                    router.refresh();
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-[#F5B301] text-[#0A2540] font-semibold rounded-md hover:bg-[#e3a500] transition-colors"
                >
                  Terminer le module
                </button>
              )}
            </div>
          </div>

          {/* Colonne droite : Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Progression du module */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Progression du module</h3>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">Progression</span>
                    <span className="text-sm font-semibold text-gray-900">{moduleProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-[#F5B301] h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${moduleProgress}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {currentLessonIndex + 1} / {lessons.length} leçons complétées
                </p>
              </div>

              {/* Liste des leçons */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Leçons du module</h3>
                <div className="space-y-2">
                  {lessons.map((lesson) => {
                    const isActive = lesson.id === currentLesson.id;
                    const lessonCompleted = isLessonCompleted(lesson.id);
                    const lessonUnlocked = isLessonUnlocked(lesson.order, lessons.map((l) => ({ order: l.order, slug: l.id })));
                    
                    return (
                      <div
                        key={lesson.id}
                        className={`block p-3 rounded-lg transition-all ${
                          !lessonUnlocked
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                            : isActive
                            ? "bg-[#0A2540] text-white"
                            : lessonCompleted
                            ? "bg-green-50 text-gray-900 hover:bg-green-100"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {lessonUnlocked ? (
                          <Link
                            href={`/modules/finance-entreprise/analyse-financiere/${lesson.id}`}
                            className="flex items-center gap-3"
                          >
                            <div
                              className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold flex-shrink-0 ${
                                isActive
                                  ? "bg-white/20 text-white"
                                  : lessonCompleted
                                  ? "bg-green-200 text-green-800"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {lesson.order}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium truncate ${
                                  isActive ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {lesson.title}
                              </p>
                              <p
                                className={`text-xs mt-1 ${
                                  isActive ? "text-white/80" : "text-gray-500"
                                }`}
                              >
                                {lesson.duration}
                              </p>
                            </div>
                            {lessonCompleted && !isActive && (
                              <span className="text-green-600 text-sm">✓</span>
                            )}
                          </Link>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded text-xs font-bold flex-shrink-0 bg-gray-300 text-gray-500">
                              {lesson.order}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate text-gray-400">
                                {lesson.title}
                              </p>
                              <p className="text-xs mt-1 text-gray-400">
                                {lesson.duration}
                              </p>
                            </div>
                            <span className="text-gray-400 text-sm">🔒</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

