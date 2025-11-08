"use client";

import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import Quiz from "@/components/Quiz";
import MathFormula from "@/components/MathFormula";
import ModuleExam from "@/components/ModuleExam";
import XPAnimation from "@/components/XPAnimation";
import { getRandomExamCase } from "@/data/examCasesInvestissementValorisation";
import type { ExamCase } from "@/data/examCasesInvestissementValorisation";
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

// Données des leçons du Module 3
const lessons: Lesson[] = [
  {
    id: "van-tri-criteres-investissement",
    title: "VAN et TRI : critères de décision d'investissement",
    description: "Maîtriser la Valeur Actuelle Nette (VAN) et le Taux de Rendement Interne (TRI) pour évaluer les projets d'investissement.",
    duration: "35 min",
    order: 1,
    objective: "Comprendre et maîtriser les critères de décision d'investissement : la Valeur Actuelle Nette (VAN) et le Taux de Rendement Interne (TRI), pour évaluer la rentabilité des projets d'investissement.",
    content: {
      sections: [
        {
          title: "Pourquoi évaluer les projets d'investissement ?",
          content: "Toute entreprise doit prendre des décisions d'investissement : investir dans une nouvelle machine, lancer un nouveau produit, acquérir une entreprise, etc.\n\nCes décisions engagent l'entreprise sur le long terme et nécessitent une évaluation rigoureuse pour maximiser la création de valeur.\n\nLes critères d'évaluation permettent de :",
          items: [
            "Comparer différents projets d'investissement",
            "Déterminer si un projet crée ou détruit de la valeur",
            "Prioriser les investissements selon leur rentabilité",
            "Prendre des décisions éclairées basées sur des critères objectifs",
          ],
        },
        {
          title: "La Valeur Actuelle Nette (VAN)",
          content: "La VAN est le critère de référence pour évaluer un projet d'investissement. Elle mesure la valeur créée par un projet en actualisant les flux de trésorerie futurs.\n\nPrincipe : un euro aujourd'hui vaut plus qu'un euro demain (valeur temps de l'argent).",
          items: [
            {
              type: "formula",
              formula: "\\text{VAN} = -I_0 + \\sum_{t=1}^{n} \\frac{\\text{CF}_t}{(1 + k)^t}",
              explanation: "Où I₀ est l'investissement initial, CFₜ sont les flux de trésorerie de l'année t, k est le taux d'actualisation (coût du capital), et n est la durée du projet.",
            },
            {
              type: "formula",
              formula: "\\text{VAN} = -I_0 + \\frac{\\text{CF}_1}{(1 + k)} + \\frac{\\text{CF}_2}{(1 + k)^2} + \\ldots + \\frac{\\text{CF}_n}{(1 + k)^n}",
              explanation: "Formule développée de la VAN. Chaque flux de trésorerie est actualisé à sa date d'occurrence.",
            },
          ],
        },
        {
          title: "Interprétation de la VAN",
          content: "La VAN permet de déterminer si un projet crée ou détruit de la valeur :",
          items: [
            "VAN > 0 : le projet crée de la valeur → il faut investir",
            "VAN < 0 : le projet détruit de la valeur → il ne faut pas investir",
            "VAN = 0 : le projet est neutre → indifférent",
            "Entre deux projets, choisir celui avec la VAN la plus élevée",
          ],
        },
        {
          title: "Exemple : calcul de la VAN",
          content: "Une entreprise envisage d'investir 100 000 € dans un projet qui générera :\n\n• Année 1 : 30 000 €\n• Année 2 : 40 000 €\n• Année 3 : 50 000 €\n\nLe coût du capital (taux d'actualisation) est de 10%.",
          items: [
            {
              type: "formula",
              formula: "\\text{VAN} = -100\\,000 + \\frac{30\\,000}{(1 + 0,10)} + \\frac{40\\,000}{(1 + 0,10)^2} + \\frac{50\\,000}{(1 + 0,10)^3}",
            },
            {
              type: "formula",
              formula: "\\text{VAN} = -100\\,000 + 27\\,273 + 33\\,058 + 37\\,566 = -2\\,103",
            },
            "La VAN est négative (-2 103 €) → le projet détruit de la valeur → il ne faut pas investir.",
          ],
        },
        {
          title: "Le Taux de Rendement Interne (TRI)",
          content: "Le TRI est le taux d'actualisation qui annule la VAN. Il représente le taux de rentabilité interne du projet.\n\nLe TRI est le taux de rendement que génère le projet sur sa durée de vie.",
          items: [
            {
              type: "formula",
              formula: "\\text{VAN} = 0 = -I_0 + \\sum_{t=1}^{n} \\frac{\\text{CF}_t}{(1 + \\text{TRI})^t}",
              explanation: "Le TRI est le taux k tel que la VAN = 0. Il faut résoudre cette équation pour trouver le TRI.",
            },
            {
              type: "formula",
              formula: "\\text{TRI} = k \\text{ tel que } -I_0 + \\sum_{t=1}^{n} \\frac{\\text{CF}_t}{(1 + k)^t} = 0",
              explanation: "Le TRI est généralement calculé par itération ou à l'aide d'un tableur (fonction TRI dans Excel).",
            },
          ],
        },
        {
          title: "Interprétation du TRI",
          content: "Le TRI permet de comparer la rentabilité du projet au coût du capital :",
          items: [
            "TRI > coût du capital : le projet crée de la valeur → il faut investir",
            "TRI < coût du capital : le projet détruit de la valeur → il ne faut pas investir",
            "TRI = coût du capital : le projet est neutre → indifférent",
            "Entre deux projets, choisir celui avec le TRI le plus élevé (si les montants investis sont comparables)",
          ],
        },
        {
          title: "Exemple : calcul du TRI",
          content: "Reprenons l'exemple précédent : investissement de 100 000 € avec des flux de 30 000 €, 40 000 € et 50 000 €.\n\nOn cherche le TRI tel que :",
          items: [
            {
              type: "formula",
              formula: "0 = -100\\,000 + \\frac{30\\,000}{(1 + \\text{TRI})} + \\frac{40\\,000}{(1 + \\text{TRI})^2} + \\frac{50\\,000}{(1 + \\text{TRI})^3}",
            },
            "Par itération, on trouve TRI ≈ 8,5%",
            "Le TRI (8,5%) est inférieur au coût du capital (10%) → le projet détruit de la valeur → il ne faut pas investir.",
            "Conclusion cohérente avec la VAN négative.",
          ],
        },
        {
          title: "VAN vs TRI : avantages et inconvénients",
          content: "Les deux critères sont complémentaires mais présentent des avantages et des inconvénients :",
          items: [
            "VAN : mesure la valeur créée en euros, permet de comparer des projets de tailles différentes, mais nécessite de connaître le coût du capital",
            "TRI : exprime la rentabilité en pourcentage, intuitif, mais peut donner des résultats multiples ou absurdes dans certains cas",
            "En général, la VAN est préférée car elle mesure directement la création de valeur",
            "Le TRI est utile pour communiquer la rentabilité d'un projet de manière simple",
          ],
        },
        {
          title: "Cas particuliers : TRI multiple",
          content: "Dans certains cas, le TRI peut avoir plusieurs valeurs (TRI multiple) ou aucune valeur. Cela se produit quand les flux de trésorerie changent de signe plusieurs fois.",
          items: [
            "Exemple : investissement initial négatif, puis flux positifs, puis flux négatif (démantèlement coûteux)",
            "Dans ce cas, la VAN est plus fiable que le TRI",
            "Il faut toujours vérifier la cohérence entre VAN et TRI",
          ],
        },
        {
          title: "Critères de décision combinés",
          content: "Pour une décision optimale, il faut combiner plusieurs critères :",
          items: [
            "VAN > 0 et TRI > coût du capital → investir",
            "VAN < 0 et TRI < coût du capital → ne pas investir",
            "Si VAN et TRI sont en contradiction, privilégier la VAN",
            "Prendre en compte d'autres facteurs : risque, stratégie, contraintes budgétaires",
          ],
        },
      ],
      keyPoints: [
        "La VAN mesure la valeur créée par un projet en actualisant les flux de trésorerie futurs.",
        "VAN > 0 signifie que le projet crée de la valeur et qu'il faut investir.",
        "Le TRI est le taux de rendement interne du projet, calculé en annulant la VAN.",
        "TRI > coût du capital signifie que le projet crée de la valeur.",
        "La VAN est généralement préférée au TRI car elle mesure directement la création de valeur en euros.",
        "Il faut toujours vérifier la cohérence entre VAN et TRI avant de prendre une décision.",
      ],
      miniQuiz: [
        {
          question: "Qu'est-ce que la VAN ?",
          answer: "La Valeur Actuelle Nette mesure la valeur créée par un projet en actualisant les flux de trésorerie futurs.",
        },
        {
          question: "Que signifie une VAN positive ?",
          answer: "Une VAN positive signifie que le projet crée de la valeur et qu'il faut investir.",
        },
        {
          question: "Qu'est-ce que le TRI ?",
          answer: "Le Taux de Rendement Interne est le taux d'actualisation qui annule la VAN. Il représente le taux de rentabilité interne du projet.",
        },
        {
          question: "Quand faut-il investir selon le TRI ?",
          answer: "Il faut investir si le TRI est supérieur au coût du capital.",
        },
      ],
      quiz: [
        {
          question: "Qu'est-ce que la VAN (Valeur Actuelle Nette) ?",
          options: [
            "La valeur créée par un projet en actualisant les flux de trésorerie futurs",
            "Le taux de rendement interne du projet",
            "Le montant total des flux de trésorerie du projet",
            "Le coût du capital du projet",
          ],
          correctAnswer: "La valeur créée par un projet en actualisant les flux de trésorerie futurs",
        },
        {
          question: "Que signifie une VAN positive ?",
          options: [
            "Le projet crée de la valeur et il faut investir",
            "Le projet détruit de la valeur et il ne faut pas investir",
            "Le projet est neutre",
            "Le projet est indifférent",
          ],
          correctAnswer: "Le projet crée de la valeur et il faut investir",
        },
        {
          question: "Qu'est-ce que le TRI (Taux de Rendement Interne) ?",
          options: [
            "Le taux d'actualisation qui annule la VAN",
            "Le coût du capital du projet",
            "Le taux de croissance des flux de trésorerie",
            "Le taux d'inflation",
          ],
          correctAnswer: "Le taux d'actualisation qui annule la VAN",
        },
        {
          question: "Quand faut-il investir selon le TRI ?",
          options: [
            "Quand TRI > coût du capital",
            "Quand TRI < coût du capital",
            "Quand TRI = coût du capital",
            "Quand TRI = 0",
          ],
          correctAnswer: "Quand TRI > coût du capital",
        },
        {
          question: "Un projet a une VAN de -5 000 €. Que faut-il faire ?",
          options: [
            "Ne pas investir car le projet détruit de la valeur",
            "Investir car le projet crée de la valeur",
            "Le projet est neutre",
            "Il faut calculer le TRI pour décider",
          ],
          correctAnswer: "Ne pas investir car le projet détruit de la valeur",
        },
        {
          question: "Un projet a un TRI de 12% et un coût du capital de 10%. Que faut-il faire ?",
          options: [
            "Investir car le TRI > coût du capital",
            "Ne pas investir car le TRI < coût du capital",
            "Le projet est neutre",
            "Il faut calculer la VAN pour décider",
          ],
          correctAnswer: "Investir car le TRI > coût du capital",
        },
        {
          question: "Quel critère est généralement préféré entre VAN et TRI ?",
          options: [
            "La VAN car elle mesure directement la création de valeur en euros",
            "Le TRI car il est plus intuitif",
            "Les deux sont équivalents",
            "Cela dépend du projet",
          ],
          correctAnswer: "La VAN car elle mesure directement la création de valeur en euros",
        },
        {
          question: "Pourquoi faut-il actualiser les flux de trésorerie futurs ?",
          options: [
            "Parce qu'un euro aujourd'hui vaut plus qu'un euro demain (valeur temps de l'argent)",
            "Parce que les flux futurs sont incertains",
            "Parce que l'inflation réduit la valeur de l'argent",
            "Parce que les projets ont une durée limitée",
          ],
          correctAnswer: "Parce qu'un euro aujourd'hui vaut plus qu'un euro demain (valeur temps de l'argent)",
        },
      ],
    },
  },
  {
    id: "structure-capital-effet-levier",
    title: "Structure du capital et effet de levier",
    description: "Comprendre l'impact de la structure du capital sur la valeur de l'entreprise et l'effet de levier financier.",
    duration: "35 min",
    order: 2,
    objective: "Comprendre comment la structure du capital (dette vs capitaux propres) influence la valeur de l'entreprise et maîtriser l'effet de levier financier.",
    content: {
      sections: [
        {
          title: "Qu'est-ce que la structure du capital ?",
          content: "La structure du capital désigne la répartition entre les dettes financières et les capitaux propres utilisés pour financer l'entreprise.\n\nCette structure a un impact direct sur :",
          items: [
            "Le coût du capital (WACC)",
            "La valeur de l'entreprise",
            "Le risque financier",
            "La rentabilité pour les actionnaires",
          ],
        },
        {
          title: "Les deux sources de financement",
          content: "Une entreprise peut se financer de deux manières :",
          items: [
            "Capitaux propres : apportés par les actionnaires, rémunérés par les dividendes et les plus-values",
            "Dette : emprunts bancaires ou obligations, rémunérés par les intérêts",
            "Chaque source a un coût différent et un impact différent sur la valeur de l'entreprise",
          ],
        },
        {
          title: "L'effet de levier financier",
          content: "L'effet de levier financier mesure l'impact de l'endettement sur la rentabilité des actionnaires (ROE).\n\nQuand une entreprise s'endette, elle peut augmenter son ROE si le rendement des actifs (ROA) est supérieur au coût de la dette.",
          items: [
            {
              type: "formula",
              formula: "\\text{ROE} = \\text{ROA} + (\\text{ROA} - r_d) \\times \\frac{D}{E}",
              explanation: "Où ROE est le Return on Equity, ROA est le Return on Assets, r_d est le coût de la dette, D est la dette, et E sont les capitaux propres.",
            },
            {
              type: "formula",
              formula: "\\text{Effet de levier} = (\\text{ROA} - r_d) \\times \\frac{D}{E}",
              explanation: "L'effet de levier est positif si ROA > r_d (le rendement des actifs est supérieur au coût de la dette).",
            },
          ],
        },
        {
          title: "Interprétation de l'effet de levier",
          content: "L'effet de levier peut être positif ou négatif :",
          items: [
            "Effet de levier positif : ROA > coût de la dette → l'endettement augmente le ROE",
            "Effet de levier négatif : ROA < coût de la dette → l'endettement diminue le ROE",
            "Effet de levier neutre : ROA = coût de la dette → l'endettement n'a pas d'impact sur le ROE",
            "Plus le ratio D/E est élevé, plus l'effet de levier est important",
          ],
        },
        {
          title: "Exemple : effet de levier positif",
          content: "Une entreprise a :\n\n• Actifs : 1 000 000 €\n• Capitaux propres : 500 000 €\n• Dette : 500 000 €\n• Résultat net : 80 000 €\n• Coût de la dette : 5%\n\nCalculons le ROA et le ROE :",
          items: [
            {
              type: "formula",
              formula: "\\text{ROA} = \\frac{80\\,000}{1\\,000\\,000} = 8\\%",
            },
            {
              type: "formula",
              formula: "\\text{ROE} = \\frac{80\\,000}{500\\,000} = 16\\%",
            },
            "Le ROE (16%) est supérieur au ROA (8%) grâce à l'effet de levier.",
            {
              type: "formula",
              formula: "\\text{Effet de levier} = (8\\% - 5\\%) \\times \\frac{500\\,000}{500\\,000} = 3\\%",
            },
            "L'effet de levier ajoute 3% au ROE, ce qui explique que ROE = ROA + effet de levier = 8% + 3% = 11%...",
            "En fait, le calcul exact montre que ROE = 16% car le résultat net est déjà après intérêts.",
          ],
        },
        {
          title: "Exemple : effet de levier négatif",
          content: "Reprenons l'exemple précédent mais avec un coût de la dette de 10% :",
          items: [
            "ROA = 8% (inchangé)",
            "Coût de la dette = 10%",
            {
              type: "formula",
              formula: "\\text{Effet de levier} = (8\\% - 10\\%) \\times \\frac{500\\,000}{500\\,000} = -2\\%",
            },
            "L'effet de levier est négatif (-2%) → l'endettement diminue le ROE.",
            "Dans ce cas, il vaut mieux financer avec des capitaux propres plutôt qu'avec de la dette.",
          ],
        },
        {
          title: "La structure optimale du capital",
          content: "La structure optimale du capital maximise la valeur de l'entreprise en minimisant le WACC.\n\nSelon la théorie de Modigliani-Miller (sans impôts), la structure du capital n'a pas d'impact sur la valeur de l'entreprise. Mais avec les impôts, la dette a un avantage fiscal.",
          items: [
            {
              type: "formula",
              formula: "\\text{WACC} = \\frac{E}{E + D} \\times r_e + \\frac{D}{E + D} \\times r_d \\times (1 - T)",
              explanation: "Le WACC diminue quand la part de la dette augmente (grâce à l'avantage fiscal), mais le coût des fonds propres augmente avec l'endettement (risque financier).",
            },
            "Il existe une structure optimale qui minimise le WACC.",
            "Cette structure optimale dépend du secteur, de la taille de l'entreprise, et de sa capacité à supporter la dette.",
          ],
        },
        {
          title: "Les avantages de la dette",
          content: "La dette présente plusieurs avantages :",
          items: [
            "Avantage fiscal : les intérêts sont déductibles des impôts",
            "Coût généralement inférieur au coût des fonds propres",
            "Pas de dilution du capital (contrairement à une augmentation de capital)",
            "Effet de levier positif si ROA > coût de la dette",
          ],
        },
        {
          title: "Les inconvénients de la dette",
          content: "La dette présente aussi des inconvénients :",
          items: [
            "Risque financier : obligation de rembourser les intérêts et le principal",
            "Contraintes financières : covenants, restrictions sur les dividendes",
            "Coût des fonds propres augmente avec l'endettement (risque financier)",
            "Effet de levier négatif si ROA < coût de la dette",
          ],
        },
        {
          title: "Le trade-off entre dette et capitaux propres",
          content: "Le choix entre dette et capitaux propres est un arbitrage :",
          items: [
            "Plus de dette → WACC plus faible (avantage fiscal) mais risque financier plus élevé",
            "Plus de capitaux propres → WACC plus élevé mais risque financier plus faible",
            "La structure optimale équilibre ces deux effets",
            "Il n'existe pas de structure universelle : elle dépend de chaque entreprise",
          ],
        },
        {
          title: "Facteurs influençant la structure du capital",
          content: "Plusieurs facteurs influencent la structure optimale du capital :",
          items: [
            "Secteur d'activité : certains secteurs supportent mieux l'endettement",
            "Taille de l'entreprise : les grandes entreprises ont généralement plus de dette",
            "Stabilité des flux de trésorerie : plus les flux sont stables, plus l'endettement est supportable",
            "Croissance : les entreprises en croissance ont souvent moins de dette",
            "Fiscalité : plus le taux d'imposition est élevé, plus la dette est avantageuse",
          ],
        },
      ],
      keyPoints: [
        "La structure du capital désigne la répartition entre dette et capitaux propres.",
        "L'effet de levier financier mesure l'impact de l'endettement sur le ROE.",
        "L'effet de levier est positif si ROA > coût de la dette.",
        "La structure optimale du capital minimise le WACC.",
        "La dette a un avantage fiscal mais augmente le risque financier.",
        "Il n'existe pas de structure universelle : elle dépend de chaque entreprise.",
      ],
      miniQuiz: [
        {
          question: "Qu'est-ce que l'effet de levier financier ?",
          answer: "L'effet de levier financier mesure l'impact de l'endettement sur la rentabilité des actionnaires (ROE).",
        },
        {
          question: "Quand l'effet de levier est-il positif ?",
          answer: "L'effet de levier est positif quand le ROA est supérieur au coût de la dette.",
        },
        {
          question: "Quel est l'avantage principal de la dette ?",
          answer: "L'avantage fiscal : les intérêts sont déductibles des impôts.",
        },
        {
          question: "Qu'est-ce que la structure optimale du capital ?",
          answer: "La structure optimale du capital maximise la valeur de l'entreprise en minimisant le WACC.",
        },
      ],
      quiz: [
        {
          question: "Qu'est-ce que la structure du capital ?",
          options: [
            "La répartition entre dette et capitaux propres",
            "Le montant total des actifs de l'entreprise",
            "Le ratio d'endettement",
            "Le coût du capital",
          ],
          correctAnswer: "La répartition entre dette et capitaux propres",
        },
        {
          question: "Qu'est-ce que l'effet de levier financier ?",
          options: [
            "L'impact de l'endettement sur le ROE",
            "L'impact de l'endettement sur le ROA",
            "L'impact de l'endettement sur le WACC",
            "L'impact de l'endettement sur le résultat net",
          ],
          correctAnswer: "L'impact de l'endettement sur le ROE",
        },
        {
          question: "Quand l'effet de levier est-il positif ?",
          options: [
            "Quand ROA > coût de la dette",
            "Quand ROA < coût de la dette",
            "Quand ROA = coût de la dette",
            "Quand ROE > ROA",
          ],
          correctAnswer: "Quand ROA > coût de la dette",
        },
        {
          question: "Quel est l'avantage principal de la dette ?",
          options: [
            "L'avantage fiscal (intérêts déductibles)",
            "Le coût inférieur aux capitaux propres",
            "Pas de dilution du capital",
            "Tous les avantages ci-dessus",
          ],
          correctAnswer: "Tous les avantages ci-dessus",
        },
        {
          question: "Quel est l'inconvénient principal de la dette ?",
          options: [
            "Le risque financier (obligation de rembourser)",
            "Le coût supérieur aux capitaux propres",
            "La dilution du capital",
            "L'absence d'avantage fiscal",
          ],
          correctAnswer: "Le risque financier (obligation de rembourser)",
        },
        {
          question: "Qu'est-ce que la structure optimale du capital ?",
          options: [
            "La structure qui minimise le WACC",
            "La structure qui maximise le ROE",
            "La structure qui minimise le risque",
            "La structure qui maximise la dette",
          ],
          correctAnswer: "La structure qui minimise le WACC",
        },
        {
          question: "Selon Modigliani-Miller (avec impôts), quel est l'impact de la dette sur la valeur de l'entreprise ?",
          options: [
            "La dette augmente la valeur grâce à l'avantage fiscal",
            "La dette diminue la valeur à cause du risque",
            "La dette n'a pas d'impact sur la valeur",
            "Cela dépend du secteur",
          ],
          correctAnswer: "La dette augmente la valeur grâce à l'avantage fiscal",
        },
        {
          question: "Quel facteur influence le plus la structure optimale du capital ?",
          options: [
            "La stabilité des flux de trésorerie",
            "Le secteur d'activité",
            "La taille de l'entreprise",
            "Tous les facteurs ci-dessus",
          ],
          correctAnswer: "Tous les facteurs ci-dessus",
        },
      ],
    },
  },
  {
    id: "politique-dividende-distribution",
    title: "Politique de dividende et distribution",
    description: "Analyser les politiques de dividende et leur impact sur la valeur actionnariale et la croissance.",
    duration: "30 min",
    order: 3,
    objective: "Comprendre les différentes politiques de dividende, leur impact sur la valeur de l'entreprise et les facteurs influençant les décisions de distribution.",
    content: {
      sections: [
        {
          title: "Qu'est-ce qu'une politique de dividende ?",
          content: "La politique de dividende définit la part du bénéfice net qui sera distribuée aux actionnaires sous forme de dividendes, par opposition à la part qui sera réinvestie dans l'entreprise.\n\nCette politique a un impact direct sur :",
          items: [
            "La valeur de l'entreprise",
            "La croissance future",
            "La satisfaction des actionnaires",
            "L'image de l'entreprise sur les marchés financiers",
          ],
        },
        {
          title: "Les deux utilisations du bénéfice net",
          content: "Le bénéfice net peut être utilisé de deux manières :",
          items: [
            "Distribution aux actionnaires : dividendes",
            "Réinvestissement dans l'entreprise : autofinancement",
            "Ces deux utilisations sont complémentaires : plus on distribue, moins on réinvestit, et vice versa",
          ],
        },
        {
          title: "La théorie de Modigliani-Miller sur les dividendes",
          content: "Selon la théorie de Modigliani-Miller (sans impôts ni coûts de transaction), la politique de dividende n'a pas d'impact sur la valeur de l'entreprise.\n\nPrincipe : un dividende élevé réduit la valeur de l'action (ex-dividende), mais l'actionnaire reçoit le dividende, donc sa richesse totale reste inchangée.",
          items: [
            {
              type: "formula",
              formula: "\\text{Valeur action} = \\text{Valeur action ex-dividende} + \\text{Dividende}",
              explanation: "La valeur de l'action avant distribution du dividende est égale à la valeur après distribution plus le dividende.",
            },
            "En théorie, la politique de dividende est neutre : elle n'affecte pas la valeur totale de l'entreprise",
            "En pratique, d'autres facteurs (impôts, coûts de transaction, signaux) peuvent influencer la valeur",
          ],
        },
        {
          title: "Les différents types de politiques de dividende",
          content: "Il existe plusieurs types de politiques de dividende :",
          items: [
            "Politique stable : dividende constant ou en croissance régulière",
            "Politique résiduelle : distribuer uniquement ce qui reste après les investissements nécessaires",
            "Politique variable : dividende qui varie selon les résultats",
            "Politique de non-distribution : réinvestir tout le bénéfice",
          ],
        },
        {
          title: "Politique stable : avantages et inconvénients",
          content: "La politique stable consiste à distribuer un dividende constant ou en croissance régulière, indépendamment des résultats annuels.",
          items: [
            "Avantages : prévisibilité pour les actionnaires, signe de stabilité financière, attractif pour les investisseurs recherchant des revenus réguliers",
            "Inconvénients : peut nécessiter de s'endetter en cas de résultat insuffisant, peut limiter les investissements en période de croissance",
            "Adaptée aux entreprises matures avec des flux de trésorerie stables",
          ],
        },
        {
          title: "Politique résiduelle : avantages et inconvénients",
          content: "La politique résiduelle consiste à distribuer uniquement ce qui reste après avoir financé tous les investissements nécessaires.",
          items: [
            {
              type: "formula",
              formula: "\\text{Dividende} = \\text{Bénéfice net} - \\text{Investissements nécessaires}",
              explanation: "Le dividende est égal au bénéfice net moins les investissements nécessaires pour maintenir et développer l'entreprise.",
            },
            "Avantages : maximise les investissements, optimise la croissance, cohérent avec la théorie de Modigliani-Miller",
            "Inconvénients : dividende variable, peut décevoir les actionnaires recherchant des revenus réguliers",
            "Adaptée aux entreprises en croissance avec de nombreuses opportunités d'investissement",
          ],
        },
        {
          title: "L'effet signal des dividendes",
          content: "Les dividendes peuvent servir de signal aux investisseurs sur la santé financière de l'entreprise.",
          items: [
            "Une augmentation du dividende peut signaler une confiance dans les résultats futurs",
            "Une réduction du dividende peut signaler des difficultés financières",
            "Les investisseurs interprètent souvent les changements de dividende comme des signaux sur la performance future",
            "Cet effet signal peut influencer le cours de l'action",
          ],
        },
        {
          title: "Les facteurs influençant la politique de dividende",
          content: "Plusieurs facteurs influencent la politique de dividende d'une entreprise :",
          items: [
            "Opportunités d'investissement : plus il y a d'opportunités, moins on distribue",
            "Stabilité des flux de trésorerie : plus les flux sont stables, plus on peut distribuer",
            "Contraintes financières : dettes, covenants peuvent limiter les distributions",
            "Préférences des actionnaires : certains préfèrent les dividendes, d'autres les plus-values",
            "Fiscalité : l'imposition des dividendes vs plus-values peut influencer la politique",
            "Secteur d'activité : certains secteurs distribuent plus que d'autres",
          ],
        },
        {
          title: "Dividende vs rachat d'actions",
          content: "Une entreprise peut retourner de la valeur aux actionnaires de deux manières :",
          items: [
            "Dividende : distribution directe de cash aux actionnaires",
            "Rachat d'actions : racheter ses propres actions sur le marché",
            "Les deux méthodes ont des implications fiscales et financières différentes",
            "Le rachat d'actions peut être plus flexible que le dividende",
          ],
        },
        {
          title: "Exemple : politique de dividende stable",
          content: "Une entreprise mature distribue 2 € par action chaque année, indépendamment des résultats.\n\n• Année N : bénéfice net = 3 €/action → dividende = 2 €/action → réinvestissement = 1 €/action\n• Année N+1 : bénéfice net = 2,5 €/action → dividende = 2 €/action → réinvestissement = 0,5 €/action\n• Année N+2 : bénéfice net = 1,5 €/action → dividende = 2 €/action → déficit = -0,5 €/action (nécessite de puiser dans les réserves ou de s'endetter)",
          items: [
            "Cette politique offre une prévisibilité aux actionnaires",
            "Mais peut nécessiter de s'endetter en cas de résultat insuffisant",
            "Adaptée aux entreprises avec des flux de trésorerie stables",
          ],
        },
        {
          title: "Exemple : politique résiduelle",
          content: "Une entreprise en croissance a besoin de 5 M€ pour financer ses investissements.\n\n• Année N : bénéfice net = 8 M€ → investissements = 5 M€ → dividende = 3 M€ (37,5% du bénéfice)\n• Année N+1 : bénéfice net = 10 M€ → investissements = 7 M€ → dividende = 3 M€ (30% du bénéfice)\n• Année N+2 : bénéfice net = 12 M€ → investissements = 10 M€ → dividende = 2 M€ (16,7% du bénéfice)",
          items: [
            "Cette politique maximise les investissements et la croissance",
            "Mais le dividende est variable, ce qui peut décevoir certains actionnaires",
            "Adaptée aux entreprises en croissance avec de nombreuses opportunités d'investissement",
          ],
        },
        {
          title: "L'impact fiscal sur la politique de dividende",
          content: "La fiscalité peut influencer la politique de dividende :",
          items: [
            "Si les dividendes sont plus imposés que les plus-values, les actionnaires préfèrent les plus-values",
            "Si les dividendes sont moins imposés que les plus-values, les actionnaires préfèrent les dividendes",
            "Dans certains pays, les dividendes bénéficient d'un crédit d'impôt",
            "La fiscalité peut inciter les entreprises à privilégier le rachat d'actions plutôt que les dividendes",
          ],
        },
        {
          title: "La politique de dividende et la valeur de l'entreprise",
          content: "En théorie (Modigliani-Miller), la politique de dividende n'affecte pas la valeur de l'entreprise. En pratique, plusieurs facteurs peuvent influencer la valeur :",
          items: [
            "L'effet signal : les changements de dividende peuvent signaler des changements dans la performance future",
            "Les préférences des investisseurs : certains investisseurs préfèrent les dividendes, d'autres les plus-values",
            "Les contraintes financières : une politique de dividende trop élevée peut limiter les investissements et réduire la croissance",
            "La fiscalité : l'imposition différente des dividendes et des plus-values peut influencer la valeur",
          ],
        },
      ],
      keyPoints: [
        "La politique de dividende définit la part du bénéfice distribuée aux actionnaires.",
        "Selon Modigliani-Miller, la politique de dividende est neutre en théorie.",
        "En pratique, plusieurs facteurs (signaux, préférences, fiscalité) peuvent influencer la valeur.",
        "La politique stable offre une prévisibilité mais peut limiter les investissements.",
        "La politique résiduelle maximise les investissements mais rend le dividende variable.",
        "Les dividendes peuvent servir de signal aux investisseurs sur la santé financière.",
      ],
      miniQuiz: [
        {
          question: "Qu'est-ce qu'une politique de dividende ?",
          answer: "La politique de dividende définit la part du bénéfice net qui sera distribuée aux actionnaires sous forme de dividendes.",
        },
        {
          question: "Selon Modigliani-Miller, quel est l'impact de la politique de dividende sur la valeur de l'entreprise ?",
          answer: "En théorie, la politique de dividende est neutre : elle n'affecte pas la valeur de l'entreprise.",
        },
        {
          question: "Qu'est-ce qu'une politique résiduelle ?",
          answer: "Une politique résiduelle consiste à distribuer uniquement ce qui reste après avoir financé tous les investissements nécessaires.",
        },
        {
          question: "Quel est l'effet signal des dividendes ?",
          answer: "Les dividendes peuvent servir de signal aux investisseurs sur la santé financière de l'entreprise.",
        },
      ],
      quiz: [
        {
          question: "Qu'est-ce qu'une politique de dividende ?",
          options: [
            "La part du bénéfice net distribuée aux actionnaires",
            "Le montant total des dividendes versés",
            "Le ratio dividende/bénéfice net",
            "Le taux de distribution",
          ],
          correctAnswer: "La part du bénéfice net distribuée aux actionnaires",
        },
        {
          question: "Selon Modigliani-Miller, quel est l'impact de la politique de dividende sur la valeur de l'entreprise ?",
          options: [
            "La politique de dividende est neutre en théorie",
            "La politique de dividende augmente toujours la valeur",
            "La politique de dividende diminue toujours la valeur",
            "Cela dépend du secteur",
          ],
          correctAnswer: "La politique de dividende est neutre en théorie",
        },
        {
          question: "Qu'est-ce qu'une politique résiduelle ?",
          options: [
            "Distribuer uniquement ce qui reste après les investissements nécessaires",
            "Distribuer un dividende constant chaque année",
            "Distribuer tout le bénéfice net",
            "Ne jamais distribuer de dividende",
          ],
          correctAnswer: "Distribuer uniquement ce qui reste après les investissements nécessaires",
        },
        {
          question: "Quel est l'avantage principal d'une politique de dividende stable ?",
          options: [
            "Prévisibilité pour les actionnaires",
            "Maximise les investissements",
            "Optimise la croissance",
            "Minimise les impôts",
          ],
          correctAnswer: "Prévisibilité pour les actionnaires",
        },
        {
          question: "Quel est l'avantage principal d'une politique résiduelle ?",
          options: [
            "Maximise les investissements et la croissance",
            "Prévisibilité pour les actionnaires",
            "Signale la stabilité financière",
            "Minimise les impôts",
          ],
          correctAnswer: "Maximise les investissements et la croissance",
        },
        {
          question: "Quel est l'effet signal des dividendes ?",
          options: [
            "Les dividendes peuvent signaler la santé financière de l'entreprise",
            "Les dividendes augmentent toujours le cours de l'action",
            "Les dividendes diminuent toujours le cours de l'action",
            "Les dividendes n'ont pas d'effet signal",
          ],
          correctAnswer: "Les dividendes peuvent signaler la santé financière de l'entreprise",
        },
        {
          question: "Quel facteur influence le plus la politique de dividende ?",
          options: [
            "Les opportunités d'investissement",
            "Le cours de l'action",
            "Le secteur d'activité",
            "Tous les facteurs ci-dessus",
          ],
          correctAnswer: "Tous les facteurs ci-dessus",
        },
        {
          question: "Quelle alternative au dividende peut retourner de la valeur aux actionnaires ?",
          options: [
            "Le rachat d'actions",
            "L'augmentation de capital",
            "L'émission d'obligations",
            "L'investissement dans de nouveaux projets",
          ],
          correctAnswer: "Le rachat d'actions",
        },
      ],
    },
  },
  {
    id: "valorisation-entreprise-dcf-multiples",
    title: "Valorisation d'entreprise : DCF et multiples",
    description: "Maîtriser les méthodes de valorisation d'entreprise : Discounted Cash Flow (DCF) et méthode des multiples.",
    duration: "40 min",
    order: 4,
    objective: "Comprendre et maîtriser les principales méthodes de valorisation d'entreprise : la méthode DCF (Discounted Cash Flow) et la méthode des multiples, pour évaluer la valeur d'une entreprise.",
    content: {
      sections: [
        {
          title: "Pourquoi valoriser une entreprise ?",
          content: "La valorisation d'entreprise est essentielle dans de nombreuses situations :\n\n• Fusions-acquisitions : déterminer le prix d'achat ou de vente\n• Introduction en bourse : fixer le prix d'introduction\n• Augmentation de capital : déterminer le prix d'émission\n• Évaluation pour les investisseurs : estimer la valeur d'une participation\n• Planification stratégique : évaluer les opportunités d'investissement",
          items: [
            "La valorisation permet de déterminer la valeur juste d'une entreprise",
            "Elle sert de référence pour les transactions financières",
            "Elle aide à prendre des décisions stratégiques",
          ],
        },
        {
          title: "La méthode DCF (Discounted Cash Flow)",
          content: "La méthode DCF est la méthode de valorisation la plus utilisée. Elle consiste à actualiser les flux de trésorerie futurs de l'entreprise pour déterminer sa valeur actuelle.\n\nPrincipe : la valeur d'une entreprise est égale à la somme des flux de trésorerie futurs actualisés.",
          items: [
            {
              type: "formula",
              formula: "\\text{Valeur de l'entreprise} = \\sum_{t=1}^{n} \\frac{\\text{FCF}_t}{(1 + \\text{WACC})^t} + \\frac{\\text{Valeur terminale}}{(1 + \\text{WACC})^n}",
              explanation: "Où FCFₜ sont les flux de trésorerie disponibles (Free Cash Flow) de l'année t, WACC est le coût moyen pondéré du capital, et n est la période de prévision.",
            },
            {
              type: "formula",
              formula: "\\text{FCF} = \\text{EBITDA} - \\text{Impôts} - \\text{Investissements} - \\text{Variation du BFR}",
              explanation: "Le Free Cash Flow est égal à l'EBITDA moins les impôts, les investissements et la variation du besoin en fonds de roulement.",
            },
          ],
        },
        {
          title: "Les étapes de la méthode DCF",
          content: "La méthode DCF se décompose en plusieurs étapes :",
          items: [
            "1. Prévoir les flux de trésorerie futurs sur une période (généralement 5 à 10 ans)",
            "2. Calculer la valeur terminale (valeur de l'entreprise au-delà de la période de prévision)",
            "3. Actualiser les flux de trésorerie et la valeur terminale au coût du capital (WACC)",
            "4. Soustraire la dette nette pour obtenir la valeur des capitaux propres",
            {
              type: "formula",
              formula: "\\text{Valeur des capitaux propres} = \\text{Valeur de l'entreprise} - \\text{Dette nette}",
              explanation: "La valeur des capitaux propres est égale à la valeur de l'entreprise moins la dette nette (dette financière - trésorerie).",
            },
          ],
        },
        {
          title: "La valeur terminale",
          content: "La valeur terminale représente la valeur de l'entreprise au-delà de la période de prévision. Elle peut être calculée de deux manières :",
          items: [
            {
              type: "formula",
              formula: "\\text{Valeur terminale (Gordon)} = \\frac{\\text{FCF}_{n+1}}{\\text{WACC} - g}",
              explanation: "Méthode de Gordon : la valeur terminale est égale au flux de trésorerie de l'année n+1 divisé par (WACC - taux de croissance g).",
            },
            {
              type: "formula",
              formula: "\\text{Valeur terminale (Multiples)} = \\text{FCF}_n \\times \\text{Multiple}",
              explanation: "Méthode des multiples : la valeur terminale est égale au flux de trésorerie de l'année n multiplié par un multiple (généralement EV/EBITDA).",
            },
            "La méthode de Gordon est généralement préférée car elle est plus cohérente avec le modèle DCF",
          ],
        },
        {
          title: "Exemple : valorisation DCF",
          content: "Une entreprise a les flux de trésorerie suivants (en M€) :\n\n• Année 1 : FCF = 10 M€\n• Année 2 : FCF = 12 M€\n• Année 3 : FCF = 14 M€\n• Année 4 : FCF = 16 M€\n• Année 5 : FCF = 18 M€\n\nWACC = 10%, taux de croissance à long terme g = 3%, dette nette = 50 M€.\n\nCalculons la valeur de l'entreprise :",
          items: [
            {
              type: "formula",
              formula: "\\text{Valeur actuelle des FCF} = \\frac{10}{1,10} + \\frac{12}{1,10^2} + \\frac{14}{1,10^3} + \\frac{16}{1,10^4} + \\frac{18}{1,10^5} = 50,2 \\text{ M€}",
            },
            {
              type: "formula",
              formula: "\\text{Valeur terminale} = \\frac{18 \\times 1,03}{0,10 - 0,03} = \\frac{18,54}{0,07} = 264,9 \\text{ M€}",
            },
            {
              type: "formula",
              formula: "\\text{Valeur terminale actualisée} = \\frac{264,9}{1,10^5} = 164,4 \\text{ M€}",
            },
            {
              type: "formula",
              formula: "\\text{Valeur de l'entreprise} = 50,2 + 164,4 = 214,6 \\text{ M€}",
            },
            {
              type: "formula",
              formula: "\\text{Valeur des capitaux propres} = 214,6 - 50 = 164,6 \\text{ M€}",
            },
          ],
        },
        {
          title: "La méthode des multiples",
          content: "La méthode des multiples consiste à valoriser une entreprise en la comparant à des entreprises similaires (comparables) sur la base de multiples de valorisation.\n\nPrincipe : si des entreprises similaires valent X fois leur EBITDA, alors l'entreprise à valoriser devrait valoir X fois son EBITDA.",
          items: [
            "Les multiples les plus utilisés sont : EV/EBITDA, EV/CA, P/E (Price/Earnings)",
            "EV = Enterprise Value (valeur de l'entreprise)",
            "P = Price (cours de l'action × nombre d'actions)",
            "Cette méthode est plus simple que le DCF mais moins précise",
          ],
        },
        {
          title: "Les multiples les plus utilisés",
          content: "Les multiples les plus utilisés pour valoriser une entreprise sont :",
          items: [
            {
              type: "formula",
              formula: "\\text{EV/EBITDA} = \\frac{\\text{Valeur de l'entreprise}}{\\text{EBITDA}}",
              explanation: "Multiple le plus utilisé. Permet de comparer des entreprises indépendamment de leur structure financière.",
            },
            {
              type: "formula",
              formula: "\\text{EV/CA} = \\frac{\\text{Valeur de l'entreprise}}{\\text{Chiffre d'affaires}}",
              explanation: "Utile pour les entreprises en croissance ou non rentables. Moins précis que EV/EBITDA.",
            },
            {
              type: "formula",
              formula: "\\text{P/E} = \\frac{\\text{Cours de l'action}}{\\text{Bénéfice par action}}",
              explanation: "Multiple de marché. Utile pour comparer les valorisations boursières.",
            },
            {
              type: "formula",
              formula: "\\text{P/BV} = \\frac{\\text{Cours de l'action}}{\\text{Valeur comptable par action}}",
              explanation: "Price to Book Value. Utile pour les entreprises avec beaucoup d'actifs tangibles.",
            },
          ],
        },
        {
          title: "Exemple : valorisation par multiples",
          content: "Une entreprise a un EBITDA de 20 M€. Les entreprises comparables ont un multiple EV/EBITDA moyen de 8x.\n\nCalculons la valeur de l'entreprise :",
          items: [
            {
              type: "formula",
              formula: "\\text{Valeur de l'entreprise} = 20 \\times 8 = 160 \\text{ M€}",
            },
            "Si la dette nette est de 40 M€, alors :",
            {
              type: "formula",
              formula: "\\text{Valeur des capitaux propres} = 160 - 40 = 120 \\text{ M€}",
            },
          ],
        },
        {
          title: "DCF vs Multiples : avantages et inconvénients",
          content: "Les deux méthodes ont leurs avantages et leurs inconvénients :",
          items: [
            "DCF : plus précise, basée sur les flux de trésorerie futurs, mais nécessite des hypothèses sur la croissance et le WACC",
            "Multiples : plus simple, basée sur le marché, mais moins précise et dépendante de la qualité des comparables",
            "En pratique, les deux méthodes sont souvent utilisées ensemble pour valider la valorisation",
            "La méthode DCF est généralement préférée pour les valorisations détaillées",
          ],
        },
        {
          title: "Les hypothèses clés de la valorisation",
          content: "La valorisation dépend de plusieurs hypothèses clés :",
          items: [
            "Taux de croissance : hypothèse sur la croissance future des flux de trésorerie",
            "WACC : coût du capital utilisé pour actualiser les flux futurs",
            "Valeur terminale : hypothèse sur la valeur de l'entreprise au-delà de la période de prévision",
            "Multiples : choix des entreprises comparables et des multiples utilisés",
            "Ces hypothèses sont sensibles et peuvent influencer significativement la valorisation",
          ],
        },
        {
          title: "La sensibilité de la valorisation",
          content: "La valorisation est très sensible aux hypothèses. Une petite variation du WACC ou du taux de croissance peut avoir un impact important sur la valeur.",
          items: [
            "Exemple : une variation de 1% du WACC peut changer la valorisation de 10 à 20%",
            "Il est donc important de faire une analyse de sensibilité",
            "L'analyse de sensibilité permet de voir l'impact des différentes hypothèses sur la valorisation",
            "Elle aide à identifier les hypothèses les plus critiques",
          ],
        },
        {
          title: "Les erreurs courantes en valorisation",
          content: "Plusieurs erreurs sont courantes en valorisation :",
          items: [
            "Utiliser un WACC inadapté : le WACC doit refléter le risque de l'entreprise",
            "Sous-estimer la valeur terminale : la valeur terminale représente souvent 50 à 70% de la valeur totale",
            "Choisir de mauvais comparables : les comparables doivent être vraiment similaires",
            "Ignorer la dette nette : il faut soustraire la dette nette pour obtenir la valeur des capitaux propres",
            "Ne pas faire d'analyse de sensibilité : la valorisation est très sensible aux hypothèses",
          ],
        },
      ],
      keyPoints: [
        "La méthode DCF valorise une entreprise en actualisant ses flux de trésorerie futurs.",
        "La valeur terminale représente souvent 50 à 70% de la valeur totale.",
        "La méthode des multiples compare l'entreprise à des entreprises similaires.",
        "Les multiples les plus utilisés sont EV/EBITDA, EV/CA, P/E.",
        "La valorisation est très sensible aux hypothèses (WACC, croissance, multiples).",
        "Il est important de faire une analyse de sensibilité pour valider la valorisation.",
      ],
      miniQuiz: [
        {
          question: "Qu'est-ce que la méthode DCF ?",
          answer: "La méthode DCF (Discounted Cash Flow) valorise une entreprise en actualisant ses flux de trésorerie futurs.",
        },
        {
          question: "Qu'est-ce que la valeur terminale ?",
          answer: "La valeur terminale représente la valeur de l'entreprise au-delà de la période de prévision.",
        },
        {
          question: "Quel est le multiple le plus utilisé pour valoriser une entreprise ?",
          answer: "Le multiple EV/EBITDA est le plus utilisé car il permet de comparer des entreprises indépendamment de leur structure financière.",
        },
        {
          question: "Pourquoi la valorisation est-elle sensible aux hypothèses ?",
          answer: "La valorisation dépend de plusieurs hypothèses (WACC, croissance, multiples) qui peuvent influencer significativement la valeur.",
        },
      ],
      quiz: [
        {
          question: "Qu'est-ce que la méthode DCF ?",
          options: [
            "Une méthode de valorisation basée sur l'actualisation des flux de trésorerie futurs",
            "Une méthode de valorisation basée sur les multiples",
            "Une méthode de valorisation basée sur les actifs",
            "Une méthode de valorisation basée sur les dividendes",
          ],
          correctAnswer: "Une méthode de valorisation basée sur l'actualisation des flux de trésorerie futurs",
        },
        {
          question: "Qu'est-ce que la valeur terminale ?",
          options: [
            "La valeur de l'entreprise au-delà de la période de prévision",
            "La valeur de l'entreprise à la fin de la période de prévision",
            "La valeur de l'entreprise au début de la période de prévision",
            "La valeur de l'entreprise à l'infini",
          ],
          correctAnswer: "La valeur de l'entreprise au-delà de la période de prévision",
        },
        {
          question: "Quel est le multiple le plus utilisé pour valoriser une entreprise ?",
          options: [
            "EV/EBITDA",
            "EV/CA",
            "P/E",
            "P/BV",
          ],
          correctAnswer: "EV/EBITDA",
        },
        {
          question: "Comment calcule-t-on la valeur des capitaux propres avec la méthode DCF ?",
          options: [
            "Valeur de l'entreprise - Dette nette",
            "Valeur de l'entreprise + Dette nette",
            "Valeur de l'entreprise × Dette nette",
            "Valeur de l'entreprise / Dette nette",
          ],
          correctAnswer: "Valeur de l'entreprise - Dette nette",
        },
        {
          question: "Quelle est la formule de la valeur terminale selon la méthode de Gordon ?",
          options: [
            "FCF_{n+1} / (WACC - g)",
            "FCF_n / (WACC - g)",
            "FCF_{n+1} / (WACC + g)",
            "FCF_n / (WACC + g)",
          ],
          correctAnswer: "FCF_{n+1} / (WACC - g)",
        },
        {
          question: "Pourquoi la valorisation est-elle sensible aux hypothèses ?",
          options: [
            "Parce que de petites variations du WACC ou de la croissance peuvent avoir un impact important",
            "Parce que les flux de trésorerie sont incertains",
            "Parce que les multiples varient beaucoup",
            "Parce que la dette nette est difficile à estimer",
          ],
          correctAnswer: "Parce que de petites variations du WACC ou de la croissance peuvent avoir un impact important",
        },
        {
          question: "Quelle méthode de valorisation est généralement préférée pour les valorisations détaillées ?",
          options: [
            "La méthode DCF",
            "La méthode des multiples",
            "La méthode des actifs",
            "La méthode des dividendes",
          ],
          correctAnswer: "La méthode DCF",
        },
        {
          question: "Quelle est l'erreur courante en valorisation ?",
          options: [
            "Sous-estimer la valeur terminale",
            "Sur-estimer la valeur terminale",
            "Ignorer les flux de trésorerie",
            "Utiliser trop de comparables",
          ],
          correctAnswer: "Sous-estimer la valeur terminale",
        },
      ],
    },
  },
  {
    id: "introduction-fusions-acquisitions",
    title: "Introduction aux fusions-acquisitions (M&A)",
    description: "Comprendre les enjeux stratégiques et financiers des opérations de fusions-acquisitions.",
    duration: "35 min",
    order: 5,
    objective: "Comprendre les différents types d'opérations de fusions-acquisitions, leurs motivations stratégiques et financières, et les mécanismes de valorisation et de financement.",
    content: {
      sections: [
        {
          title: "Qu'est-ce qu'une opération M&A ?",
          content: "Les opérations de fusions-acquisitions (M&A) consistent à combiner deux entreprises ou à acquérir une entreprise par une autre.\n\nCes opérations sont essentielles pour :",
          items: [
            "Croître rapidement et accéder à de nouveaux marchés",
            "Réaliser des synergies et améliorer la rentabilité",
            "Renforcer la position concurrentielle",
            "Diversifier les activités ou se concentrer sur le cœur de métier",
          ],
        },
        {
          title: "Les différents types d'opérations M&A",
          content: "Il existe plusieurs types d'opérations M&A :",
          items: [
            "Fusion : deux entreprises se combinent pour former une nouvelle entité",
            "Acquisition : une entreprise (acquéreur) rachète une autre entreprise (cible)",
            "Acquisition partielle : rachat d'une participation minoritaire ou majoritaire",
            "Joint-venture : création d'une entreprise commune par deux entreprises",
            "LBO (Leveraged Buyout) : acquisition financée principalement par la dette",
          ],
        },
        {
          title: "Les motivations stratégiques des M&A",
          content: "Les opérations M&A sont motivées par plusieurs objectifs stratégiques :",
          items: [
            "Croissance : accéder rapidement à de nouveaux marchés ou clients",
            "Synergies : réaliser des économies d'échelle ou des complémentarités",
            "Diversification : réduire le risque en diversifiant les activités",
            "Concentration : renforcer la position sur un marché existant",
            "Accès à des technologies ou compétences : acquérir des savoir-faire spécifiques",
            "Défense : se protéger contre une acquisition hostile",
          ],
        },
        {
          title: "Les synergies dans les opérations M&A",
          content: "Les synergies sont les gains de valeur créés par la combinaison de deux entreprises. Elles peuvent être de plusieurs types :",
          items: [
            "Synergies opérationnelles : économies d'échelle, partage de ressources, optimisation des coûts",
            "Synergies financières : amélioration du coût du capital, optimisation fiscale, meilleur accès au financement",
            "Synergies stratégiques : complémentarité des produits, accès à de nouveaux marchés, renforcement de la position concurrentielle",
            {
              type: "formula",
              formula: "\\text{Valeur créée} = \\text{Valeur combinée} - (\\text{Valeur acquéreur} + \\text{Valeur cible})",
              explanation: "La valeur créée par une opération M&A est égale à la valeur de l'entreprise combinée moins la somme des valeurs des entreprises séparées.",
            },
          ],
        },
        {
          title: "La prime d'acquisition",
          content: "La prime d'acquisition est la différence entre le prix payé et la valeur de marché de la cible avant l'annonce de l'opération.",
          items: [
            {
              type: "formula",
              formula: "\\text{Prime d'acquisition} = \\frac{\\text{Prix payé} - \\text{Valeur de marché avant annonce}}{\\text{Valeur de marché avant annonce}} \\times 100",
              explanation: "La prime d'acquisition est généralement de 20 à 40% de la valeur de marché avant annonce.",
            },
            "Cette prime reflète la valeur des synergies attendues",
            "Elle doit être justifiée par les synergies pour que l'opération crée de la valeur pour l'acquéreur",
            "Une prime trop élevée peut détruire de la valeur pour l'acquéreur",
          ],
        },
        {
          title: "Exemple : calcul de la prime d'acquisition",
          content: "Une entreprise cible vaut 100 M€ avant l'annonce de l'opération. L'acquéreur propose 130 M€ pour l'acquérir.\n\nCalculons la prime d'acquisition :",
          items: [
            {
              type: "formula",
              formula: "\\text{Prime d'acquisition} = \\frac{130 - 100}{100} \\times 100 = 30\\%",
            },
            "L'acquéreur paie une prime de 30% par rapport à la valeur de marché",
            "Pour que l'opération crée de la valeur, les synergies doivent être supérieures à 30 M€",
            "Si les synergies sont de 40 M€, l'opération crée 10 M€ de valeur pour l'acquéreur",
          ],
        },
        {
          title: "Le financement des opérations M&A",
          content: "Les opérations M&A peuvent être financées de plusieurs manières :",
          items: [
            "Cash : paiement en espèces (nécessite de la trésorerie ou un emprunt)",
            "Actions : paiement en actions de l'acquéreur (échange d'actions)",
            "Mixte : combinaison de cash et d'actions",
            "Dette : financement par emprunt (LBO)",
            "Chaque mode de financement a des implications différentes sur la structure du capital et la dilution",
          ],
        },
        {
          title: "Financement en cash vs actions",
          content: "Le choix entre financement en cash et en actions a des implications importantes :",
          items: [
            "Cash : pas de dilution du capital, mais nécessite de la trésorerie ou un emprunt, impact sur la structure du capital",
            "Actions : pas de besoin de trésorerie, mais dilution du capital, partage des synergies avec les actionnaires de la cible",
            "Le choix dépend de la situation financière de l'acquéreur et de la valorisation relative des deux entreprises",
            "En général, le financement en cash est préféré si l'acquéreur est sous-valorisé",
          ],
        },
        {
          title: "La valorisation dans les opérations M&A",
          content: "La valorisation est cruciale dans les opérations M&A. Elle détermine le prix à payer et la création de valeur.",
          items: [
            "L'acquéreur doit valoriser la cible pour déterminer le prix maximum à payer",
            "La valorisation doit prendre en compte les synergies attendues",
            {
              type: "formula",
              formula: "\\text{Prix maximum} = \\text{Valeur standalone de la cible} + \\text{Synergies attendues}",
              explanation: "Le prix maximum que l'acquéreur peut payer est égal à la valeur standalone de la cible plus les synergies attendues.",
            },
            "Si le prix payé est supérieur au prix maximum, l'opération détruit de la valeur pour l'acquéreur",
          ],
        },
        {
          title: "Les risques des opérations M&A",
          content: "Les opérations M&A présentent plusieurs risques :",
          items: [
            "Risque de surpayer : payer une prime trop élevée par rapport aux synergies",
            "Risque d'intégration : difficultés à intégrer les deux entreprises",
            "Risque culturel : incompatibilité des cultures d'entreprise",
            "Risque financier : sur-endettement ou dilution excessive",
            "Risque opérationnel : perte de clients ou de talents clés",
            "Risque réglementaire : opposition des autorités de la concurrence",
          ],
        },
        {
          title: "Le processus d'une opération M&A",
          content: "Une opération M&A suit généralement plusieurs étapes :",
          items: [
            "1. Identification de la cible : recherche et sélection de la cible",
            "2. Due diligence : analyse approfondie de la cible (financière, juridique, opérationnelle)",
            "3. Valorisation : évaluation de la valeur de la cible et des synergies",
            "4. Négociation : discussion du prix et des conditions",
            "5. Financement : organisation du financement de l'opération",
            "6. Clôture : finalisation de la transaction",
            "7. Intégration : fusion des deux entreprises",
          ],
        },
        {
          title: "Les indicateurs de succès d'une opération M&A",
          content: "Plusieurs indicateurs permettent d'évaluer le succès d'une opération M&A :",
          items: [
            "Création de valeur : augmentation de la valeur de l'entreprise combinée",
            "Réalisation des synergies : atteinte des synergies prévues",
            "Performance financière : amélioration de la rentabilité et de la croissance",
            "Performance boursière : évolution du cours de l'action après l'opération",
            "Intégration réussie : absence de problèmes majeurs d'intégration",
          ],
        },
        {
          title: "Exemple : opération M&A réussie",
          content: "Une entreprise A (valeur : 200 M€) acquiert une entreprise B (valeur : 100 M€) pour 130 M€.\n\n• Prime d'acquisition : 30%\n• Synergies attendues : 40 M€\n• Valeur combinée : 200 + 100 + 40 = 340 M€\n• Prix payé : 130 M€\n• Valeur créée pour A : 340 - 200 - 130 = 10 M€",
          items: [
            "L'opération crée 10 M€ de valeur pour l'acquéreur",
            "Les synergies (40 M€) sont supérieures à la prime payée (30 M€)",
            "L'opération est donc rentable pour l'acquéreur",
          ],
        },
        {
          title: "Exemple : opération M&A ratée",
          content: "Une entreprise A (valeur : 200 M€) acquiert une entreprise B (valeur : 100 M€) pour 150 M€.\n\n• Prime d'acquisition : 50%\n• Synergies attendues : 30 M€\n• Valeur combinée : 200 + 100 + 30 = 330 M€\n• Prix payé : 150 M€\n• Valeur créée pour A : 330 - 200 - 150 = -20 M€",
          items: [
            "L'opération détruit 20 M€ de valeur pour l'acquéreur",
            "Les synergies (30 M€) sont inférieures à la prime payée (50 M€)",
            "L'opération n'est donc pas rentable pour l'acquéreur",
          ],
        },
      ],
      keyPoints: [
        "Les opérations M&A consistent à combiner ou acquérir des entreprises.",
        "Les synergies sont les gains de valeur créés par la combinaison de deux entreprises.",
        "La prime d'acquisition doit être justifiée par les synergies pour créer de la valeur.",
        "Le financement peut se faire en cash, en actions, ou de manière mixte.",
        "Le prix maximum à payer est égal à la valeur standalone plus les synergies attendues.",
        "Les opérations M&A présentent plusieurs risques (surpayer, intégration, culturel, financier).",
      ],
      miniQuiz: [
        {
          question: "Qu'est-ce qu'une opération M&A ?",
          answer: "Une opération de fusion-acquisition consiste à combiner deux entreprises ou à acquérir une entreprise par une autre.",
        },
        {
          question: "Qu'est-ce que les synergies ?",
          answer: "Les synergies sont les gains de valeur créés par la combinaison de deux entreprises.",
        },
        {
          question: "Qu'est-ce que la prime d'acquisition ?",
          answer: "La prime d'acquisition est la différence entre le prix payé et la valeur de marché de la cible avant l'annonce de l'opération.",
        },
        {
          question: "Quel est le prix maximum à payer dans une opération M&A ?",
          answer: "Le prix maximum est égal à la valeur standalone de la cible plus les synergies attendues.",
        },
      ],
      quiz: [
        {
          question: "Qu'est-ce qu'une opération M&A ?",
          options: [
            "Une opération de fusion-acquisition consistant à combiner ou acquérir des entreprises",
            "Une opération de financement par emprunt",
            "Une opération de distribution de dividendes",
            "Une opération de rachat d'actions",
          ],
          correctAnswer: "Une opération de fusion-acquisition consistant à combiner ou acquérir des entreprises",
        },
        {
          question: "Qu'est-ce que les synergies dans une opération M&A ?",
          options: [
            "Les gains de valeur créés par la combinaison de deux entreprises",
            "Les économies réalisées sur les coûts",
            "Les revenus supplémentaires générés",
            "Les réductions d'impôts",
          ],
          correctAnswer: "Les gains de valeur créés par la combinaison de deux entreprises",
        },
        {
          question: "Qu'est-ce que la prime d'acquisition ?",
          options: [
            "La différence entre le prix payé et la valeur de marché avant annonce",
            "Le prix payé pour acquérir une entreprise",
            "La valeur de marché de la cible",
            "Les synergies attendues",
          ],
          correctAnswer: "La différence entre le prix payé et la valeur de marché avant annonce",
        },
        {
          question: "Quel est le prix maximum à payer dans une opération M&A ?",
          options: [
            "Valeur standalone de la cible + Synergies attendues",
            "Valeur standalone de la cible - Synergies attendues",
            "Valeur de marché de la cible",
            "Valeur combinée des deux entreprises",
          ],
          correctAnswer: "Valeur standalone de la cible + Synergies attendues",
        },
        {
          question: "Quels sont les modes de financement d'une opération M&A ?",
          options: [
            "Cash, actions, mixte, dette",
            "Cash uniquement",
            "Actions uniquement",
            "Dette uniquement",
          ],
          correctAnswer: "Cash, actions, mixte, dette",
        },
        {
          question: "Quel est l'avantage du financement en cash ?",
          options: [
            "Pas de dilution du capital",
            "Pas de besoin de trésorerie",
            "Partage des synergies avec les actionnaires de la cible",
            "Amélioration de la structure du capital",
          ],
          correctAnswer: "Pas de dilution du capital",
        },
        {
          question: "Quel est le risque principal d'une opération M&A ?",
          options: [
            "Surpayer la cible par rapport aux synergies",
            "Sous-payer la cible",
            "Ne pas réaliser les synergies",
            "Tous les risques ci-dessus",
          ],
          correctAnswer: "Tous les risques ci-dessus",
        },
        {
          question: "Quelle est la première étape d'une opération M&A ?",
          options: [
            "Identification de la cible",
            "Due diligence",
            "Valorisation",
            "Négociation",
          ],
          correctAnswer: "Identification de la cible",
        },
      ],
    },
  },
  {
    id: "synthese-mini-quiz-final",
    title: "Synthèse et mini-quiz final",
    description: "Révision complète des notions abordées dans le module avec un quiz de synthèse.",
    duration: "30 min",
    order: 6,
    objective: "Faire le point sur l'ensemble des connaissances acquises dans le module : VAN, TRI, structure du capital, politique de dividende, valorisation d'entreprise et fusions-acquisitions.",
    content: {
      sections: [
        {
          title: "Vision d'ensemble du module",
          content: "Ce module vous a permis de maîtriser les décisions d'investissement, de financement et de valorisation d'entreprise.\n\nLes compétences acquises couvrent :",
          items: [
            "L'évaluation des projets d'investissement (VAN, TRI)",
            "L'optimisation de la structure du capital et l'effet de levier",
            "La politique de dividende et la distribution aux actionnaires",
            "La valorisation d'entreprise (DCF, multiples)",
            "Les opérations de fusions-acquisitions (M&A)",
          ],
        },
        {
          title: "Synthèse : VAN et TRI",
          content: "Les critères de décision d'investissement permettent d'évaluer la rentabilité des projets :",
          items: [
            "VAN : mesure la valeur créée en actualisant les flux de trésorerie futurs",
            "VAN > 0 → le projet crée de la valeur → il faut investir",
            "TRI : taux de rendement interne du projet",
            "TRI > coût du capital → le projet crée de la valeur → il faut investir",
            "La VAN est généralement préférée car elle mesure directement la création de valeur en euros",
          ],
        },
        {
          title: "Synthèse : Structure du capital et effet de levier",
          content: "La structure du capital influence la valeur de l'entreprise et la rentabilité des actionnaires :",
          items: [
            "L'effet de levier financier mesure l'impact de l'endettement sur le ROE",
            "Effet de levier positif si ROA > coût de la dette",
            "La structure optimale du capital minimise le WACC",
            "La dette a un avantage fiscal mais augmente le risque financier",
            "Il n'existe pas de structure universelle : elle dépend de chaque entreprise",
          ],
        },
        {
          title: "Synthèse : Politique de dividende",
          content: "La politique de dividende définit la part du bénéfice distribuée aux actionnaires :",
          items: [
            "Selon Modigliani-Miller, la politique de dividende est neutre en théorie",
            "En pratique, plusieurs facteurs (signaux, préférences, fiscalité) peuvent influencer la valeur",
            "Politique stable : prévisibilité mais peut limiter les investissements",
            "Politique résiduelle : maximise les investissements mais rend le dividende variable",
            "Les dividendes peuvent servir de signal aux investisseurs",
          ],
        },
        {
          title: "Synthèse : Valorisation d'entreprise",
          content: "La valorisation d'entreprise permet de déterminer la valeur juste d'une entreprise :",
          items: [
            "Méthode DCF : valorise en actualisant les flux de trésorerie futurs",
            "Valeur terminale : représente souvent 50 à 70% de la valeur totale",
            "Méthode des multiples : compare l'entreprise à des entreprises similaires",
            "Multiples les plus utilisés : EV/EBITDA, EV/CA, P/E",
            "La valorisation est très sensible aux hypothèses (WACC, croissance, multiples)",
          ],
        },
        {
          title: "Synthèse : Fusions-acquisitions",
          content: "Les opérations M&A permettent de croître rapidement et de réaliser des synergies :",
          items: [
            "Les synergies sont les gains de valeur créés par la combinaison de deux entreprises",
            "La prime d'acquisition doit être justifiée par les synergies",
            "Prix maximum = Valeur standalone + Synergies attendues",
            "Le financement peut se faire en cash, en actions, ou de manière mixte",
            "Les opérations M&A présentent plusieurs risques (surpayer, intégration, culturel)",
          ],
        },
        {
          title: "Les liens entre les concepts",
          content: "Tous ces concepts sont interconnectés et forment un système cohérent :",
          items: [
            "VAN et TRI → évaluent les projets d'investissement",
            "Structure du capital → influence le WACC utilisé pour actualiser les flux",
            "Politique de dividende → impacte les flux de trésorerie disponibles",
            "Valorisation DCF → utilise le WACC et les flux de trésorerie",
            "M&A → nécessite une valorisation et une optimisation de la structure du capital",
          ],
        },
        {
          title: "La logique globale de la finance d'entreprise",
          content: "La finance d'entreprise vise à maximiser la valeur de l'entreprise pour les actionnaires :",
          items: [
            "Investir dans des projets rentables (VAN > 0, TRI > WACC)",
            "Optimiser la structure du capital pour minimiser le WACC",
            "Distribuer ou réinvestir selon les opportunités d'investissement",
            "Valoriser l'entreprise pour prendre des décisions stratégiques",
            "Croître par l'investissement interne ou par les acquisitions (M&A)",
          ],
        },
        {
          title: "À retenir : les formules clés",
          content: "Les formules essentielles à maîtriser :",
          items: [
            {
              type: "formula",
              formula: "\\text{VAN} = -I_0 + \\sum_{t=1}^{n} \\frac{\\text{CF}_t}{(1 + k)^t}",
              explanation: "Valeur Actuelle Nette : mesure la valeur créée par un projet.",
            },
            {
              type: "formula",
              formula: "\\text{ROE} = \\text{ROA} + (\\text{ROA} - r_d) \\times \\frac{D}{E}",
              explanation: "Effet de levier financier : impact de l'endettement sur le ROE.",
            },
            {
              type: "formula",
              formula: "\\text{WACC} = \\frac{E}{E + D} \\times r_e + \\frac{D}{E + D} \\times r_d \\times (1 - T)",
              explanation: "Coût moyen pondéré du capital : taux d'actualisation pour la valorisation.",
            },
            {
              type: "formula",
              formula: "\\text{Valeur de l'entreprise} = \\sum_{t=1}^{n} \\frac{\\text{FCF}_t}{(1 + \\text{WACC})^t} + \\frac{\\text{Valeur terminale}}{(1 + \\text{WACC})^n}",
              explanation: "Valorisation DCF : actualisation des flux de trésorerie futurs.",
            },
            {
              type: "formula",
              formula: "\\text{Prix maximum M&A} = \\text{Valeur standalone} + \\text{Synergies attendues}",
              explanation: "Prix maximum dans une opération M&A : valeur standalone plus synergies.",
            },
          ],
        },
        {
          title: "Les erreurs à éviter",
          content: "Quelques erreurs courantes à éviter :",
          items: [
            "Utiliser un WACC inadapté pour actualiser les flux",
            "Sous-estimer la valeur terminale dans une valorisation DCF",
            "Payer une prime d'acquisition trop élevée par rapport aux synergies",
            "Ignorer l'effet de levier dans l'analyse de la structure du capital",
            "Ne pas faire d'analyse de sensibilité sur les hypothèses clés",
          ],
        },
        {
          title: "Les bonnes pratiques",
          content: "Les bonnes pratiques à suivre :",
          items: [
            "Toujours vérifier la cohérence entre VAN et TRI",
            "Faire une analyse de sensibilité sur les hypothèses clés",
            "Utiliser plusieurs méthodes de valorisation pour valider le résultat",
            "Prendre en compte les risques dans les décisions d'investissement",
            "Adapter la structure du capital et la politique de dividende à chaque entreprise",
          ],
        },
      ],
      keyPoints: [
        "La VAN et le TRI permettent d'évaluer la rentabilité des projets d'investissement.",
        "L'effet de levier financier mesure l'impact de l'endettement sur le ROE.",
        "La politique de dividende est neutre en théorie mais peut influencer la valeur en pratique.",
        "La valorisation DCF actualise les flux de trésorerie futurs au WACC.",
        "Les opérations M&A créent de la valeur si les synergies dépassent la prime payée.",
        "Tous ces concepts sont interconnectés et forment un système cohérent de finance d'entreprise.",
      ],
      miniQuiz: [
        {
          question: "Quels sont les critères de décision d'investissement ?",
          answer: "La VAN (Valeur Actuelle Nette) et le TRI (Taux de Rendement Interne) permettent d'évaluer la rentabilité des projets d'investissement.",
        },
        {
          question: "Qu'est-ce que l'effet de levier financier ?",
          answer: "L'effet de levier financier mesure l'impact de l'endettement sur la rentabilité des actionnaires (ROE).",
        },
        {
          question: "Quelles sont les méthodes de valorisation d'entreprise ?",
          answer: "Les deux méthodes principales sont la méthode DCF (Discounted Cash Flow) et la méthode des multiples.",
        },
        {
          question: "Qu'est-ce que les synergies dans une opération M&A ?",
          answer: "Les synergies sont les gains de valeur créés par la combinaison de deux entreprises.",
        },
      ],
      quiz: [
        {
          question: "Quels sont les critères de décision d'investissement ?",
          options: [
            "VAN et TRI",
            "ROE et ROA",
            "WACC et DCF",
            "EBITDA et FCF",
          ],
          correctAnswer: "VAN et TRI",
        },
        {
          question: "Quand faut-il investir selon la VAN ?",
          options: [
            "Quand VAN > 0",
            "Quand VAN < 0",
            "Quand VAN = 0",
            "Quand VAN > 1",
          ],
          correctAnswer: "Quand VAN > 0",
        },
        {
          question: "Qu'est-ce que l'effet de levier financier ?",
          options: [
            "L'impact de l'endettement sur le ROE",
            "L'impact de l'endettement sur le ROA",
            "L'impact de l'endettement sur le WACC",
            "L'impact de l'endettement sur le résultat net",
          ],
          correctAnswer: "L'impact de l'endettement sur le ROE",
        },
        {
          question: "Quand l'effet de levier est-il positif ?",
          options: [
            "Quand ROA > coût de la dette",
            "Quand ROA < coût de la dette",
            "Quand ROA = coût de la dette",
            "Quand ROE > ROA",
          ],
          correctAnswer: "Quand ROA > coût de la dette",
        },
        {
          question: "Selon Modigliani-Miller, quel est l'impact de la politique de dividende sur la valeur de l'entreprise ?",
          options: [
            "La politique de dividende est neutre en théorie",
            "La politique de dividende augmente toujours la valeur",
            "La politique de dividende diminue toujours la valeur",
            "Cela dépend du secteur",
          ],
          correctAnswer: "La politique de dividende est neutre en théorie",
        },
        {
          question: "Quelle est la méthode de valorisation la plus utilisée ?",
          options: [
            "La méthode DCF",
            "La méthode des multiples",
            "La méthode des actifs",
            "La méthode des dividendes",
          ],
          correctAnswer: "La méthode DCF",
        },
        {
          question: "Qu'est-ce que la valeur terminale dans une valorisation DCF ?",
          options: [
            "La valeur de l'entreprise au-delà de la période de prévision",
            "La valeur de l'entreprise à la fin de la période de prévision",
            "La valeur de l'entreprise au début de la période de prévision",
            "La valeur de l'entreprise à l'infini",
          ],
          correctAnswer: "La valeur de l'entreprise au-delà de la période de prévision",
        },
        {
          question: "Quel est le prix maximum à payer dans une opération M&A ?",
          options: [
            "Valeur standalone de la cible + Synergies attendues",
            "Valeur standalone de la cible - Synergies attendues",
            "Valeur de marché de la cible",
            "Valeur combinée des deux entreprises",
          ],
          correctAnswer: "Valeur standalone de la cible + Synergies attendues",
        },
        {
          question: "Quel est le multiple le plus utilisé pour valoriser une entreprise ?",
          options: [
            "EV/EBITDA",
            "EV/CA",
            "P/E",
            "P/BV",
          ],
          correctAnswer: "EV/EBITDA",
        },
        {
          question: "Quelle est la logique globale de la finance d'entreprise ?",
          options: [
            "Maximiser la valeur de l'entreprise pour les actionnaires",
            "Maximiser le résultat net",
            "Minimiser le coût du capital",
            "Maximiser les dividendes",
          ],
          correctAnswer: "Maximiser la valeur de l'entreprise pour les actionnaires",
        },
      ],
    },
  },
];

const MODULE_ID = "finance-entreprise/investissement-valorisation";

// Mapping des leçons vers leur XP
const lessonXP: Record<string, number> = {
  "van-tri-criteres-investissement": 30,
  "structure-capital-effet-levier": 30,
  "politique-dividende-distribution": 30,
  "valorisation-entreprise-dcf-multiples": 30,
  "introduction-fusions-acquisitions": 30,
  "synthese-mini-quiz-final": 30,
  "examen-final": 1000,
};

interface PageProps {
  params: {
    lessonSlug: string;
  };
}

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
  const [examCase, setExamCase] = useState<ExamCase | null>(null);

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
        const xpEarned = lessonXP[currentLesson.id] || 30;
        
        const result = await completeLessonForUser({
          user,
          courseId: "corp-invest-financing",
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
      router.push(`/modules/finance-entreprise/investissement-valorisation/${nextLesson.id}`);
      router.refresh();
    } else {
      // Rediriger vers la page du module
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push("/modules/finance-entreprise/investissement-valorisation");
      router.refresh();
    }
  };

  // Si la leçon n'est pas débloquée, afficher un message
  if (!isUnlocked) {
    return (
      <main className="bg-gray-50 min-h-screen py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Leçon verrouillée</h1>
            <p className="text-gray-600 mb-6">
              Cette leçon est verrouillée. Complétez la leçon précédente pour la débloquer.
            </p>
            <Link
              href="/modules/finance-entreprise/investissement-valorisation"
              className="inline-block px-6 py-3 bg-[#0A2540] text-white font-semibold rounded-md hover:bg-[#0F294A] transition-colors"
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
              href="/modules/finance-entreprise/investissement-valorisation"
              className="hover:text-[#0A2540] transition-colors"
            >
              Investissement & valorisation
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
                <span className="inline-flex items-center rounded px-3 py-1 text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                  Avancé
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
                    const xpEarned = lessonXP[currentLesson.id] || 30;
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
                      const xpEarned = lessonXP[currentLesson.id] || 1000;
                      setXpEarnedForAnimation(xpEarned);
                      setShowXPAnimation(true);
                    }
                    
                    if (passed && user && !isCompleted) {
                      try {
                        await completeLesson(currentLesson.id);
                        const xpEarned = lessonXP[currentLesson.id] || 1000;
                        const result = await completeLessonForUser({
                          user,
                          courseId: "corp-invest-financing",
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
                  href={`/modules/finance-entreprise/investissement-valorisation/${previousLesson.id}`}
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
                          const xpEarned = lessonXP[currentLesson.id] || 1000;
                          const result = await completeLessonForUser({
                            user,
                            courseId: "corp-invest-financing",
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
                      // Rediriger vers la page du module
                      await new Promise((resolve) => setTimeout(resolve, 500));
                      router.push("/modules/finance-entreprise/investissement-valorisation");
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
                        const xpEarned = lessonXP[currentLesson.id] || 30;
                        const result = await completeLessonForUser({
                          user,
                          courseId: "corp-invest-financing",
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
                    // Rediriger vers la page du module
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    router.push("/modules/finance-entreprise/investissement-valorisation");
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
                {lessons.map((lesson, index) => {
                  const lessonCompleted = isLessonCompleted(lesson.id);
                  const isCurrentLesson = lesson.id === params.lessonSlug;
                  const lessonUnlocked = isLessonUnlocked(lesson.order, lessons.map((l) => ({ order: l.order, slug: l.id })));

                  return (
                    <Link
                      key={lesson.id}
                      href={`/modules/finance-entreprise/investissement-valorisation/${lesson.id}`}
                      className={`block p-3 rounded-lg transition-all ${
                        isCurrentLesson
                          ? "bg-[#0A2540] text-white"
                          : lessonCompleted
                          ? "bg-green-50 text-gray-900 hover:bg-green-100"
                          : lessonUnlocked
                          ? "bg-gray-50 text-gray-700 hover:bg-gray-100"
                          : "bg-gray-50 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          {index + 1}. {lesson.title}
                        </span>
                        {lessonCompleted && (
                          <span className="text-green-600">✓</span>
                        )}
                        {!lessonUnlocked && (
                          <span className="text-gray-400">🔒</span>
                        )}
                      </div>
                    </Link>
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

