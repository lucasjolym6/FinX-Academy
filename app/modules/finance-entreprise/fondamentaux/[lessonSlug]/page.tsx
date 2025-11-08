"use client";

import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import Quiz from "@/components/Quiz";
import MathFormula from "@/components/MathFormula";
import ModuleExam from "@/components/ModuleExam";
import XPAnimation from "@/components/XPAnimation";
import { getRandomExamCase } from "@/data/examCasesFinanceEntreprise";
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

// Données mockées des leçons
const lessons: Lesson[] = [
  {
    id: "introduction-finance-entreprise",
    title: "Introduction à la finance d'entreprise",
    description: "Découvrez les fondamentaux de la finance d'entreprise et son rôle dans la gestion d'une organisation.",
    duration: "20 min",
    order: 1,
    objective: "Comprendre le rôle central de la finance d'entreprise dans la gestion et la croissance d'une organisation, et identifier les grandes décisions financières qui déterminent la création de valeur.",
    content: {
      sections: [
        {
          title: "Qu'est-ce que la finance d'entreprise ?",
          content: "La finance d'entreprise est la discipline qui gère les ressources financières d'une organisation pour maximiser sa valeur à long terme.\nElle cherche à répondre à une question essentielle :\n\nComment une entreprise crée-t-elle de la valeur pour ses actionnaires et ses parties prenantes ?",
          items: [
            "Assurer la rentabilité des projets et des opérations",
            "Garantir la solvabilité et la capacité de financement de l'entreprise",
            "Optimiser la structure du capital (équilibre entre dettes et fonds propres)",
            "Distribuer la valeur créée (dividendes, réinvestissements, etc.)",
          ],
        },
        {
          title: "Les trois grandes décisions financières",
          content: "",
          items: [
            "Décision d'investissement : Choisir les projets rentables et cohérents avec la stratégie globale. Exemples : ouvrir une filiale, racheter une entreprise, lancer un produit. Outils : VAN (Valeur Actuelle Nette) et TRI (Taux de Rendement Interne).",
            "Décision de financement : Déterminer comment financer les projets : fonds propres (actions, capital), dettes (emprunts bancaires, obligations). Le but est de trouver un équilibre entre coût, risque et flexibilité.",
            "Décision de distribution : Décider de la répartition du bénéfice entre : dividendes versés aux actionnaires, bénéfices conservés pour réinvestir.",
          ],
        },
        {
          title: "Le rôle stratégique de la direction financière",
          content: "Le Directeur Financier (CFO) est un acteur stratégique.\nIl ne se limite plus à produire des rapports : il oriente les décisions majeures de l'entreprise.\n\nPrincipales responsabilités :",
          items: [
            "Évaluer la rentabilité et le risque des projets",
            "Définir la politique de financement",
            "Piloter la trésorerie et la structure du capital",
            "Garantir la conformité et la communication financière",
          ],
        },
        {
          title: "La création de valeur : le cœur de la finance d'entreprise",
          content: "Une entreprise crée de la valeur lorsque le rendement de ses projets est supérieur à son coût du capital (WACC).\n\nC'est la Valeur Économique Ajoutée (EVA) qui mesure cette création de valeur :",
          items: [
            {
              type: "formula",
              formula: "\\text{EVA} = \\text{Résultat opérationnel après impôts} - (\\text{Capital investi} \\times \\text{WACC})",
              explanation: "L'EVA mesure la valeur créée après avoir déduit le coût du capital. Si EVA > 0, l'entreprise crée de la valeur.",
            },
            "Si le rendement > WACC → l'entreprise crée de la valeur",
            "Si le rendement < WACC → l'entreprise détruit de la valeur",
            "Exemple : Une entreprise investit 10 M€ avec un WACC de 8 %. Le projet rapporte 12 %. → Elle crée 4 % de valeur économique ajoutée.",
          ],
        },
        {
          title: "Cas pratique – Tesla et la logique de création de valeur",
          content: "Tesla n'a pas été rentable pendant plusieurs années, mais sa valorisation boursière a explosé.\nPourquoi ? Parce que les investisseurs anticipaient une création future de valeur :\n• croissance rapide,\n• innovation continue,\n• avantage compétitif durable.\n\n👉 La finance d'entreprise ne se limite donc pas au présent ; elle projette la rentabilité future.",
        },
      ],
      keyPoints: [
        "La finance d'entreprise cherche à maximiser la valeur de l'entreprise.",
        "Elle repose sur trois grandes décisions : investir, financer, distribuer.",
        "La création de valeur (rendement > coût du capital) est la boussole du financier.",
        "Le CFO est un acteur stratégique, garant de la croissance durable.",
      ],
      miniQuiz: [
        {
          question: "Quelle est la mission principale de la finance d'entreprise ?",
          answer: "Maximiser la valeur de l'entreprise.",
        },
        {
          question: "La décision d'investissement consiste à :",
          answer: "Choisir les projets rentables.",
        },
        {
          question: "Si le WACC = 10 % et le rendement = 7 %, l'entreprise :",
          answer: "Détruit de la valeur.",
        },
      ],
      quiz: [
        {
          question: "Quelle est la mission principale de la finance d'entreprise ?",
          options: [
            "Maximiser la valeur de l'entreprise",
            "Minimiser les coûts opérationnels",
            "Augmenter le chiffre d'affaires",
            "Réduire l'endettement",
          ],
          correctAnswer: "Maximiser la valeur de l'entreprise",
        },
        {
          question: "Quelles sont les trois grandes décisions financières ?",
          options: [
            "Investir, financer, distribuer",
            "Acheter, vendre, louer",
            "Emprunter, prêter, épargner",
            "Produire, commercialiser, distribuer",
          ],
          correctAnswer: "Investir, financer, distribuer",
        },
        {
          question: "La décision d'investissement consiste à :",
          options: [
            "Choisir les projets rentables",
            "Sélectionner les fournisseurs",
            "Déterminer les prix de vente",
            "Gérer les stocks",
          ],
          correctAnswer: "Choisir les projets rentables",
        },
        {
          question: "Si le WACC = 10 % et le rendement d'un projet = 7 %, l'entreprise :",
          options: [
            "Détruit de la valeur",
            "Crée de la valeur",
            "Ne crée ni ne détruit de valeur",
            "Doit augmenter son WACC",
          ],
          correctAnswer: "Détruit de la valeur",
        },
        {
          question: "Quel est le rôle principal du Directeur Financier (CFO) ?",
          options: [
            "Orienter les décisions majeures de l'entreprise",
            "Gérer uniquement la comptabilité",
            "Superviser les ventes",
            "Contrôler les stocks",
          ],
          correctAnswer: "Orienter les décisions majeures de l'entreprise",
        },
      ],
    },
  },
  {
    id: "etats-financiers",
    title: "Les états financiers : Bilan et Compte de résultat",
    description: "Savoir lire, comprendre et interpréter les deux principaux états financiers d'une entreprise.",
    duration: "25 min",
    order: 2,
    objective: "Savoir lire, comprendre et interpréter les deux principaux états financiers d'une entreprise : le bilan, qui décrit la situation financière à un instant T, et le compte de résultat, qui retrace la performance sur une période donnée.",
    content: {
      sections: [
        {
          title: "Les trois états financiers fondamentaux",
          content: "Une entreprise publie généralement trois documents clés :\n\n1️⃣ Le bilan → Il montre ce que possède et ce qu'elle doit à une date précise.\n2️⃣ Le compte de résultat → Il montre ce qu'elle a gagné et dépensé pendant une période donnée.\n3️⃣ Le tableau des flux de trésorerie → Il explique comment la trésorerie a évolué.\n\nDans cette leçon, on se concentre sur les deux premiers : le bilan et le compte de résultat.",
        },
        {
          title: "Le bilan : une photographie du patrimoine",
          content: "Le bilan présente la situation financière d'une entreprise à un instant précis (souvent à la fin de l'année).\n\nIl se décompose en deux parties :\n\n• L'actif → ce que possède l'entreprise\n• Le passif → ce qu'elle doit (aux créanciers et aux actionnaires)\n\nLe principe fondamental du bilan :",
          items: [
            {
              type: "formula",
              formula: "\\text{Actif} = \\text{Passif}",
              explanation: "Le bilan est toujours équilibré : ce que l'entreprise possède (actif) est égal à ce qu'elle doit (passif).",
            },
            {
              type: "formula",
              formula: "\\text{Ressources} = \\text{Emplois}",
              explanation: "Autre formulation : les ressources (passif) sont égales aux emplois (actif).",
            },
            "L'actif comprend : les immobilisations (machines, bâtiments, brevets) ; les stocks et les créances clients ; la trésorerie disponible.",
            "Le passif comprend : les capitaux propres (apports + bénéfices accumulés) ; les dettes financières (emprunts, obligations) ; les dettes d'exploitation (fournisseurs, impôts à payer).",
            "En résumé : L'actif montre où l'argent est investi. Le passif montre d'où vient cet argent.",
          ],
        },
        {
          title: "Le compte de résultat : la performance de l'entreprise",
          content: "Le compte de résultat retrace l'activité sur une période donnée (souvent un an).\n\nIl répond à la question : L'entreprise a-t-elle créé ou détruit de la richesse cette année ?\n\nLa structure simplifiée est la suivante :",
          items: [
            {
              type: "formula",
              formula: "\\text{Résultat net} = \\text{Produits} - \\text{Charges}",
              explanation: "Le résultat net est la différence entre les produits (revenus) et les charges (coûts) sur une période donnée.",
            },
            "Résultat d'exploitation → activité principale (ventes – coûts de production)",
            "Résultat financier → produits et charges liés aux emprunts et placements",
            "Résultat exceptionnel → éléments non récurrents (vente d'actif, pénalités, etc.)",
            "Le résultat net final montre le bénéfice (ou la perte) de l'exercice",
          ],
        },
        {
          title: "Lien entre bilan et compte de résultat",
          content: "Les deux documents sont liés :\n• Le résultat net du compte de résultat vient s'ajouter (ou se retrancher) aux capitaux propres dans le bilan.\n• Les amortissements, les stocks et les créances se retrouvent aussi dans les deux états.\n\nAinsi, le compte de résultat explique l'évolution du bilan d'une année sur l'autre.\n\nLe compte de résultat montre le film de la performance.\nLe bilan montre la photo à la fin du film.",
        },
        {
          title: "Exemple simplifié : NovaTech",
          content: "Prenons l'entreprise NovaTech :\n\n• Elle vend pour 1 000 000 € de produits\n• Ses coûts de production sont de 700 000 €\n• Ses frais généraux sont de 200 000 €",
          items: [
            {
              type: "formula",
              formula: "\\text{Résultat net} = 1\\,000\\,000 - 700\\,000 - 200\\,000 = 100\\,000 \\text{ €}",
              explanation: "Le résultat net de NovaTech est de 100 000 €.",
            },
            "Dans son bilan :",
            "• 500 000 € d'actifs immobilisés",
            "• 200 000 € de trésorerie",
            "• 400 000 € de dettes",
            "• 300 000 € de capitaux propres",
            {
              type: "formula",
              formula: "\\text{Actif} = 500\\,000 + 200\\,000 = 700\\,000 \\text{ €} = \\text{Passif} = 400\\,000 + 300\\,000 = 700\\,000 \\text{ €}",
              explanation: "Le bilan est équilibré : Actif = Passif = 700 000 €.",
            },
          ],
        },
        {
          title: "Lecture et interprétation",
          content: "Un investisseur ou un analyste financier lit ces documents pour :",
          items: [
            "Évaluer la rentabilité de l'entreprise",
            "Mesurer son endettement et sa solvabilité",
            "Apprécier sa capacité à générer du cash",
            "Comprendre sa structure financière et ses choix stratégiques",
          ],
        },
        {
          title: "Quelques réflexes de lecture",
          content: "Pour interpréter correctement les états financiers, voici quelques réflexes à adopter :",
          items: [
            "Une forte marge nette → entreprise efficace dans la gestion de ses coûts",
            "Trop de dettes → risque financier élevé et dépendance aux créanciers",
            "Une trésorerie positive → autonomie et sécurité financière",
            "Un résultat net positif mais un cash-flow négatif → signe d'alerte sur la gestion opérationnelle",
            "Une croissance du CA mais une baisse de la marge → détérioration de la rentabilité",
          ],
        },
      ],
      keyPoints: [
        "Le bilan = photo du patrimoine à un instant T.",
        "Le compte de résultat = film de la performance sur la période.",
        "Le résultat net du compte de résultat se retrouve dans les capitaux propres du bilan.",
        "L'analyse conjointe des deux permet d'évaluer la santé financière globale.",
      ],
      miniQuiz: [
        {
          question: "Le bilan présente :",
          answer: "La situation financière à une date donnée.",
        },
        {
          question: "Le compte de résultat mesure :",
          answer: "La performance sur une période.",
        },
        {
          question: "Si l'actif est de 1 000 000 € et le passif de 1 000 000 €, cela signifie :",
          answer: "Le bilan est équilibré.",
        },
        {
          question: "Le résultat net correspond à :",
          answer: "Produits – Charges.",
        },
      ],
      quiz: [
        {
          question: "Le bilan présente :",
          options: [
            "La situation financière à une date donnée",
            "La performance sur une période",
            "Les flux de trésorerie",
            "Les investissements futurs",
          ],
          correctAnswer: "La situation financière à une date donnée",
        },
        {
          question: "Le compte de résultat mesure :",
          options: [
            "La performance sur une période",
            "Le patrimoine à un instant T",
            "Les flux de trésorerie",
            "L'endettement",
          ],
          correctAnswer: "La performance sur une période",
        },
        {
          question: "Quel est le principe fondamental du bilan ?",
          options: [
            "Actif = Passif",
            "Actif > Passif",
            "Passif > Actif",
            "Actif = Produits",
          ],
          correctAnswer: "Actif = Passif",
        },
        {
          question: "Si l'actif est de 1 000 000 € et le passif de 1 000 000 €, cela signifie :",
          options: [
            "Le bilan est équilibré",
            "L'entreprise est en faillite",
            "L'entreprise a trop de dettes",
            "L'entreprise est très rentable",
          ],
          correctAnswer: "Le bilan est équilibré",
        },
        {
          question: "Le résultat net correspond à :",
          options: [
            "Produits – Charges",
            "Actif – Passif",
            "Ventes – Coûts",
            "Capitaux propres – Dettes",
          ],
          correctAnswer: "Produits – Charges",
        },
        {
          question: "Qu'est-ce que l'actif dans un bilan ?",
          options: [
            "Ce que possède l'entreprise",
            "Ce que doit l'entreprise",
            "Les bénéfices de l'entreprise",
            "Les dettes de l'entreprise",
          ],
          correctAnswer: "Ce que possède l'entreprise",
        },
      ],
    },
  },
  {
    id: "flux-tresorerie",
    title: "Le tableau des flux de trésorerie",
    description: "Comprendre à quoi sert le tableau des flux de trésorerie, comment il est structuré et comment l'interpréter pour évaluer la capacité d'une entreprise à générer du cash.",
    duration: "30 min",
    order: 3,
    objective: "Comprendre à quoi sert le tableau des flux de trésorerie, comment il est structuré et comment l'interpréter pour évaluer la capacité d'une entreprise à générer du cash.",
    content: {
      sections: [
        {
          title: "Pourquoi la trésorerie est essentielle",
          content: "Le résultat net ne reflète pas toujours la réalité financière.\nUne entreprise peut être bénéficiaire sur le papier, mais en difficulté de trésorerie.\nExemple : une société qui vend beaucoup mais n'est pas payée tout de suite.\n\n👉 C'est pour cela que le tableau des flux de trésorerie est indispensable.\nIl explique d'où vient et où va l'argent pendant une période donnée.",
        },
        {
          title: "Définition",
          content: "Le tableau des flux de trésorerie retrace les encaissements et les décaissements réels de l'entreprise.\n\nIl met en lumière les flux de liquidités liés à trois grandes catégories d'activités :\n\n1️⃣ Activités d'exploitation — le cœur du métier (ventes, achats, salaires)\n2️⃣ Activités d'investissement — achats ou ventes d'actifs durables\n3️⃣ Activités de financement — emprunts, remboursements, émissions d'actions\n\nL'équation de base est :",
          items: [
            {
              type: "formula",
              formula: "\\text{Variation de la trésorerie} = \\text{CFO} + \\text{CFI} + \\text{CFF}",
              explanation: "La variation de la trésorerie est la somme des flux d'exploitation (CFO), d'investissement (CFI) et de financement (CFF).",
            },
          ],
        },
        {
          title: "Flux de trésorerie liés à l'exploitation (CFO)",
          content: "C'est la capacité de l'entreprise à générer du cash grâce à son activité normale.\n\nExemples d'entrées : ventes encaissées, remboursements clients\nExemples de sorties : paiements fournisseurs, salaires, impôts\n\nLe calcul simplifié est :",
          items: [
            {
              type: "formula",
              formula: "\\text{CFO} = \\text{Résultat net} + \\text{Amortissements} \\pm \\text{Variation du BFR}",
              explanation: "Le cash-flow d'exploitation (CFO) est calculé à partir du résultat net, auquel on ajoute les amortissements et on soustrait (ou ajoute) la variation du besoin en fonds de roulement (BFR).",
            },
            "Si le CFO est positif → l'activité génère du cash",
            "Si le CFO est négatif → l'activité consomme du cash",
          ],
        },
        {
          title: "Flux de trésorerie liés à l'investissement (CFI)",
          content: "Ils concernent les acquisitions ou cessions d'actifs durables.\n\nExemples de sorties : achat d'usines, de machines, de logiciels.\nExemples d'entrées : vente d'un terrain, cession d'une filiale.\n\nGénéralement, un flux d'investissement est négatif, car l'entreprise investit pour sa croissance future.",
        },
        {
          title: "Flux de trésorerie liés au financement (CFF)",
          content: "Ils reflètent la manière dont l'entreprise se finance auprès des marchés ou des banques.\n\nExemples d'entrées : emprunts obtenus, émission d'actions.\nExemples de sorties : remboursement de dettes, versement de dividendes.\n\nCes flux montrent si l'entreprise se finance par la dette, par le capital, ou si elle redistribue ses gains.",
        },
        {
          title: "Exemple simplifié : FinX Corp",
          content: "L'entreprise FinX Corp affiche les données suivantes sur l'année :\n\n• Résultat net : 120 000 €\n• Amortissements : 30 000 €\n• Augmentation du BFR : 20 000 €\n• Investissements : –80 000 €\n• Nouvel emprunt : +100 000 €\n• Dividendes versés : –40 000 €",
          items: [
            "Calculons les flux de trésorerie :",
            {
              type: "formula",
              formula: "\\text{CFO} = 120\\,000 + 30\\,000 - 20\\,000 = 130\\,000 \\text{ €}",
              explanation: "Le cash-flow d'exploitation est de 130 000 €, ce qui signifie que l'activité génère du cash.",
            },
            {
              type: "formula",
              formula: "\\text{CFI} = -80\\,000 \\text{ €}",
              explanation: "Le flux d'investissement est négatif car l'entreprise a investi 80 000 € dans des actifs.",
            },
            {
              type: "formula",
              formula: "\\text{CFF} = +100\\,000 - 40\\,000 = +60\\,000 \\text{ €}",
              explanation: "Le flux de financement est positif car l'entreprise a emprunté 100 000 € et versé 40 000 € de dividendes.",
            },
            {
              type: "formula",
              formula: "\\text{Variation de trésorerie} = 130\\,000 - 80\\,000 + 60\\,000 = +110\\,000 \\text{ €}",
              explanation: "La trésorerie a augmenté de 110 000 € sur l'année.",
            },
            "→ L'entreprise a augmenté sa trésorerie de 110 000 € sur l'année.",
          ],
        },
        {
          title: "Interprétation des flux de trésorerie",
          content: "L'interprétation du tableau des flux de trésorerie permet d'évaluer la santé financière de l'entreprise :",
          items: [
            "Si le CFO est positif et supérieur aux investissements → l'entreprise est autosuffisante et génère du cash pour financer sa croissance",
            "Si le CFO est positif mais que le CFI est très négatif → l'entreprise investit pour l'avenir, ce qui est positif à long terme",
            "Si le CFO est négatif → l'entreprise dépend du financement externe pour survivre, ce qui est un signe d'alerte",
            "Si le CFF est très positif → l'entreprise s'endette ou émet des actions pour financer ses besoins",
            "Si le CFF est négatif → l'entreprise rembourse ses dettes ou verse des dividendes",
            "Ce tableau permet d'évaluer la solidité de la gestion de trésorerie et la capacité de l'entreprise à générer du cash durablement",
          ],
        },
      ],
      keyPoints: [
        "Le résultat net ne dit pas tout : le cash est roi.",
        "Le tableau des flux de trésorerie montre d'où vient et où va l'argent.",
        "Il est structuré en 3 catégories : exploitation, investissement, financement.",
        "Une entreprise saine génère un cash-flow d'exploitation positif et durable.",
      ],
      miniQuiz: [
        {
          question: "Le tableau des flux de trésorerie sert à :",
          answer: "Expliquer les mouvements réels de trésorerie.",
        },
        {
          question: "Les flux d'investissement sont souvent :",
          answer: "Négatifs (car l'entreprise achète des actifs).",
        },
        {
          question: "Si le CFO est positif et le CFI négatif, cela signifie :",
          answer: "L'entreprise finance ses investissements avec son activité.",
        },
        {
          question: "Variation de trésorerie = ?",
          answer: "CFO + CFI + CFF.",
        },
      ],
      quiz: [
        {
          question: "Le tableau des flux de trésorerie sert à :",
          options: [
            "Expliquer les mouvements réels de trésorerie",
            "Calculer le bénéfice net",
            "Évaluer le patrimoine",
            "Mesurer la rentabilité",
          ],
          correctAnswer: "Expliquer les mouvements réels de trésorerie",
        },
        {
          question: "Les flux d'investissement (CFI) sont souvent :",
          options: [
            "Négatifs (car l'entreprise achète des actifs)",
            "Positifs (car l'entreprise vend des actifs)",
            "Nuls (car l'entreprise n'investit pas)",
            "Variables selon les années",
          ],
          correctAnswer: "Négatifs (car l'entreprise achète des actifs)",
        },
        {
          question: "Si le CFO (cash-flow d'exploitation) est positif et le CFI (cash-flow d'investissement) négatif, cela signifie :",
          options: [
            "L'entreprise finance ses investissements avec son activité",
            "L'entreprise perd de l'argent",
            "L'entreprise est en faillite",
            "L'entreprise ne génère pas de cash",
          ],
          correctAnswer: "L'entreprise finance ses investissements avec son activité",
        },
        {
          question: "Quelle est la formule de la variation de trésorerie ?",
          options: [
            "CFO + CFI + CFF",
            "CFO - CFI - CFF",
            "CFO × CFI × CFF",
            "CFO / CFI / CFF",
          ],
          correctAnswer: "CFO + CFI + CFF",
        },
        {
          question: "Qu'est-ce que le CFO (Cash Flow d'Exploitation) ?",
          options: [
            "La capacité de l'entreprise à générer du cash grâce à son activité normale",
            "Les investissements en actifs durables",
            "Les emprunts et remboursements",
            "Le bénéfice net",
          ],
          correctAnswer: "La capacité de l'entreprise à générer du cash grâce à son activité normale",
        },
        {
          question: "Pourquoi le résultat net ne reflète pas toujours la réalité financière ?",
          options: [
            "Parce qu'une entreprise peut être bénéficiaire mais en difficulté de trésorerie",
            "Parce que le résultat net est toujours faux",
            "Parce que le résultat net ne tient pas compte des ventes",
            "Parce que le résultat net ne tient pas compte des coûts",
          ],
          correctAnswer: "Parce qu'une entreprise peut être bénéficiaire mais en difficulté de trésorerie",
        },
      ],
    },
  },
  {
    id: "analyse-ratios",
    title: "Analyse financière et ratios clés",
    description: "Maîtrisez les ratios financiers essentiels pour évaluer la santé d'une entreprise.",
    duration: "30 min",
    order: 4,
    objective: "Savoir évaluer la performance, la rentabilité et la solidité financière d'une entreprise grâce à l'analyse des ratios financiers. Ces indicateurs permettent d'interpréter les états financiers et de juger la santé globale d'une organisation.",
    content: {
      sections: [
        {
          title: "Pourquoi utiliser des ratios financiers",
          content: "Les états financiers bruts (bilan, compte de résultat, flux de trésorerie) contiennent beaucoup de chiffres.\nLes ratios servent à synthétiser ces informations pour :",
          items: [
            "comparer des entreprises de tailles différentes,",
            "suivre l'évolution dans le temps,",
            "détecter les forces et les faiblesses d'un modèle économique.",
          ],
        },
        {
          title: "Les grandes familles de ratios",
          content: "Il existe quatre grandes catégories de ratios :\n\n1️⃣ Rentabilité — Mesurent la performance économique.\n2️⃣ Liquidité — Mesurent la capacité à faire face aux dettes à court terme.\n3️⃣ Structure financière (ou solvabilité) — Mesurent l'endettement et le risque.\n4️⃣ Efficience / activité — Évaluent la gestion opérationnelle.",
        },
        {
          title: "Ratios de rentabilité",
          content: "Ces ratios mesurent la capacité de l'entreprise à générer du profit à partir de ses ventes ou de ses actifs.",
          items: [
            {
              type: "formula",
              formula: "\\text{Marge nette} = \\frac{\\text{Résultat net}}{\\text{Chiffre d'affaires}} \\times 100",
              explanation: "Montre le pourcentage de bénéfice sur chaque euro de vente. Exemple : une marge nette de 10 % signifie 10 centimes de bénéfice pour 1 € de chiffre d'affaires.",
            },
            {
              type: "formula",
              formula: "\\text{ROE} = \\frac{\\text{Résultat net}}{\\text{Capitaux propres}} \\times 100",
              explanation: "Indique la rentabilité pour les actionnaires.",
            },
            {
              type: "formula",
              formula: "\\text{ROA} = \\frac{\\text{Résultat net}}{\\text{Total de l'actif}} \\times 100",
              explanation: "Évalue l'efficacité globale des ressources investies.",
            },
          ],
        },
        {
          title: "Ratios de liquidité",
          content: "Ils mesurent la capacité de l'entreprise à honorer ses dettes à court terme.",
          items: [
            {
              type: "formula",
              formula: "\\text{Liquidité générale} = \\frac{\\text{Actif courant}}{\\text{Passif courant}}",
              explanation: "Si le ratio est > 1, l'entreprise peut couvrir ses dettes à court terme.",
            },
            {
              type: "formula",
              formula: "\\text{Quick ratio} = \\frac{\\text{Actif courant} - \\text{Stocks}}{\\text{Passif courant}}",
              explanation: "Exclut les stocks (moins liquides) pour une mesure plus stricte.",
            },
          ],
        },
        {
          title: "Ratios de structure financière (ou d'endettement)",
          content: "Ces ratios évaluent la solidité financière et la dépendance à la dette.",
          items: [
            {
              type: "formula",
              formula: "\\text{Endettement} = \\frac{\\text{Dettes totales}}{\\text{Capitaux propres}}",
              explanation: "Plus le ratio est élevé, plus l'entreprise est risquée.",
            },
            {
              type: "formula",
              formula: "\\text{Couverture des intérêts} = \\frac{\\text{Résultat d'exploitation}}{\\text{Charges d'intérêts}}",
              explanation: "Indique combien de fois l'entreprise peut payer ses intérêts. S'il est inférieur à 2, la capacité de remboursement devient fragile.",
            },
          ],
        },
        {
          title: "Ratios d'efficience opérationnelle",
          content: "Ils évaluent la gestion des stocks, des clients et des fournisseurs.",
          items: [
            {
              type: "formula",
              formula: "\\text{Rotation des stocks} = \\frac{\\text{Coût des ventes}}{\\text{Stock moyen}}",
              explanation: "Montre combien de fois les stocks sont renouvelés sur l'année.",
            },
            {
              type: "formula",
              formula: "\\text{DSO} = \\frac{\\text{Créances clients}}{\\text{Chiffre d'affaires}} \\times 365",
              explanation: "Mesure le nombre de jours nécessaires pour encaisser les ventes.",
            },
            {
              type: "formula",
              formula: "\\text{DPO} = \\frac{\\text{Dettes fournisseurs}}{\\text{Achats TTC}} \\times 365",
              explanation: "Indique le délai moyen accordé par les fournisseurs.",
            },
          ],
        },
        {
          title: "Exemple simplifié : FinX Corp",
          content: "L'entreprise FinX Corp présente les données suivantes :\n\n• Résultat net : 80 000 €\n• Chiffre d'affaires : 1 000 000 €\n• Capitaux propres : 400 000 €\n• Total actif : 900 000 €\n• Dettes totales : 300 000 €\n• Actif courant : 250 000 €\n• Passif courant : 200 000 €",
          items: [
            "Calculs des ratios clés :",
            {
              type: "formula",
              formula: "\\text{Marge nette} = \\frac{80\\,000}{1\\,000\\,000} \\times 100 = 8\\%",
              explanation: "La marge nette de FinX Corp est de 8 %, ce qui signifie que 8 centimes de bénéfice sont générés pour chaque euro de chiffre d'affaires.",
            },
            {
              type: "formula",
              formula: "\\text{ROE} = \\frac{80\\,000}{400\\,000} \\times 100 = 20\\%",
              explanation: "Le ROE de 20 % indique une excellente rentabilité pour les actionnaires.",
            },
            {
              type: "formula",
              formula: "\\text{Liquidité générale} = \\frac{250\\,000}{200\\,000} = 1,25",
              explanation: "Un ratio de liquidité générale de 1,25 signifie que l'entreprise peut couvrir ses dettes à court terme avec ses actifs courants.",
            },
            {
              type: "formula",
              formula: "\\text{Endettement} = \\frac{300\\,000}{400\\,000} = 0,75",
              explanation: "Un ratio d'endettement de 0,75 indique que les dettes représentent 75 % des capitaux propres, ce qui est raisonnable.",
            },
            "Interprétation : FinX Corp est rentable, bien capitalisée et dispose d'une trésorerie suffisante à court terme.",
          ],
        },
        {
          title: "Limites de l'analyse par ratios",
          content: "Les ratios sont utiles, mais :",
          items: [
            "ils ne prennent pas en compte le contexte sectoriel,",
            "ils peuvent être influencés par des politiques comptables,",
            "ils doivent être comparés dans le temps et à des concurrents du même secteur.",
          ],
        },
      ],
      keyPoints: [
        "Les ratios permettent de résumer la performance financière d'une entreprise.",
        "Les familles principales : rentabilité, liquidité, structure, efficience.",
        "Une bonne analyse combine plusieurs ratios et leur évolution dans le temps.",
        "La rentabilité durable et la solidité du bilan sont les meilleurs indicateurs de valeur.",
      ],
      miniQuiz: [
        {
          question: "Que mesure le ratio ROE ?",
          answer: "La rentabilité des capitaux propres (pour les actionnaires).",
        },
        {
          question: "Si la liquidité générale < 1, cela signifie :",
          answer: "L'entreprise pourrait manquer de trésorerie pour payer ses dettes à court terme.",
        },
        {
          question: "Si le ratio d'endettement est de 2, cela veut dire :",
          answer: "Les dettes sont deux fois supérieures aux capitaux propres.",
        },
        {
          question: "Quel ratio mesure le délai moyen de paiement clients ?",
          answer: "Le DSO (Days Sales Outstanding).",
        },
      ],
      quiz: [
        {
          question: "Que mesure le ratio ROE (Return on Equity) ?",
          options: [
            "La rentabilité des capitaux propres (pour les actionnaires)",
            "La rentabilité des actifs",
            "La liquidité de l'entreprise",
            "L'endettement de l'entreprise",
          ],
          correctAnswer: "La rentabilité des capitaux propres (pour les actionnaires)",
        },
        {
          question: "Si la liquidité générale < 1, cela signifie :",
          options: [
            "L'entreprise pourrait manquer de trésorerie pour payer ses dettes à court terme",
            "L'entreprise est très rentable",
            "L'entreprise a trop de trésorerie",
            "L'entreprise est en faillite",
          ],
          correctAnswer: "L'entreprise pourrait manquer de trésorerie pour payer ses dettes à court terme",
        },
        {
          question: "Si le ratio d'endettement est de 2, cela veut dire :",
          options: [
            "Les dettes sont deux fois supérieures aux capitaux propres",
            "Les capitaux propres sont deux fois supérieurs aux dettes",
            "L'entreprise n'a pas de dettes",
            "L'entreprise est très solvable",
          ],
          correctAnswer: "Les dettes sont deux fois supérieures aux capitaux propres",
        },
        {
          question: "Quel ratio mesure le délai moyen de paiement clients ?",
          options: [
            "Le DSO (Days Sales Outstanding)",
            "Le DPO (Days Payable Outstanding)",
            "Le ROE (Return on Equity)",
            "Le ROA (Return on Assets)",
          ],
          correctAnswer: "Le DSO (Days Sales Outstanding)",
        },
        {
          question: "Que mesure la marge nette ?",
          options: [
            "Le pourcentage de bénéfice sur chaque euro de vente",
            "Le bénéfice total de l'entreprise",
            "Le chiffre d'affaires",
            "Les coûts de production",
          ],
          correctAnswer: "Le pourcentage de bénéfice sur chaque euro de vente",
        },
        {
          question: "Qu'est-ce que le ratio de couverture des intérêts ?",
          options: [
            "Le nombre de fois que l'entreprise peut payer ses intérêts",
            "Le montant des intérêts payés",
            "Le montant des dettes",
            "Le bénéfice net",
          ],
          correctAnswer: "Le nombre de fois que l'entreprise peut payer ses intérêts",
        },
        {
          question: "Que mesure le ratio ROA (Return on Assets) ?",
          options: [
            "L'efficacité globale des ressources investies",
            "La rentabilité pour les actionnaires",
            "La liquidité de l'entreprise",
            "L'endettement de l'entreprise",
          ],
          correctAnswer: "L'efficacité globale des ressources investies",
        },
      ],
    },
  },
  {
    id: "cout-capital",
    title: "Coût du capital et création de valeur",
    description: "Explorez les mécanismes de création de valeur pour les actionnaires.",
    duration: "25 min",
    order: 5,
    objective: "Comprendre ce qu'est le coût du capital, pourquoi il est essentiel dans les décisions d'investissement, et comment il détermine la création ou destruction de valeur au sein d'une entreprise.",
    content: {
      sections: [
        {
          title: "Le concept clé : le coût du capital",
          content: "Le coût du capital représente le rendement minimum exigé par les investisseurs (actionnaires et créanciers) pour financer une entreprise.\n\nEn d'autres termes : c'est le taux de rentabilité qu'une entreprise doit offrir pour compenser le risque pris par ceux qui lui apportent des fonds.",
          items: [
            "Si un projet rapporte plus que ce coût → il crée de la valeur",
            "Si un projet rapporte moins que ce coût → il détruit de la valeur",
            "Le coût du capital est donc la référence pour évaluer la rentabilité des projets d'investissement",
          ],
        },
        {
          title: "Les deux grandes sources de financement",
          content: "Une entreprise peut se financer de deux manières :",
          items: [
            "Les capitaux propres : argent des actionnaires (investissements initiaux, bénéfices non distribués). Rémunération attendue : dividendes ou plus-values. Risque élevé → rendement exigé plus fort.",
            "La dette : financement externe (emprunts bancaires, obligations). Rémunération : intérêts. Risque plus faible car les créanciers sont remboursés avant les actionnaires.",
            "Chaque source a donc son propre coût :",
            {
              type: "formula",
              formula: "r_e = \\text{coût des fonds propres}",
              explanation: "Le coût des fonds propres (rₑ) est le rendement exigé par les actionnaires pour investir dans l'entreprise.",
            },
            {
              type: "formula",
              formula: "r_d = \\text{coût de la dette}",
              explanation: "Le coût de la dette (r_d) est le taux d'intérêt payé sur les emprunts.",
            },
          ],
        },
        {
          title: "Le coût moyen pondéré du capital (WACC)",
          content: "Le WACC (Weighted Average Cost of Capital) combine ces deux coûts selon leur poids dans la structure financière.",
          items: [
            {
              type: "formula",
              formula: "\\text{WACC} = \\left( \\frac{E}{E + D} \\right) r_e + \\left( \\frac{D}{E + D} \\right) r_d (1 - T)",
              explanation: "où : E = capitaux propres, D = dettes financières, rₑ = coût des fonds propres, r_d = coût de la dette, T = taux d'imposition. L'expression (1 – T) traduit l'avantage fiscal de la dette : les intérêts sont déductibles des impôts.",
            },
          ],
        },
        {
          title: "Interprétation du WACC",
          content: "",
          items: [
            "Le WACC est le taux de rentabilité minimal qu'un projet doit atteindre pour créer de la valeur.",
            "Plus le risque de l'entreprise augmente, plus son WACC augmente.",
            "Un WACC faible signifie que l'entreprise se finance à moindre coût → elle peut investir plus facilement.",
          ],
        },
        {
          title: "Exemple",
          content: "Une entreprise a :\n• 60 % de capitaux propres (rₑ = 12 %)\n• 40 % de dettes (r_d = 6 %)\n• taux d'imposition = 25 %",
          items: [
            {
              type: "formula",
              formula: "\\text{WACC} = 0,6 \\times 12\\% + 0,4 \\times 6\\% \\times (1 - 0,25) = 9,9\\%",
              explanation: "Le projet doit donc rapporter au moins 9,9 % pour créer de la valeur.",
            },
          ],
        },
        {
          title: "Le coût des fonds propres : le modèle du MEDAF (CAPM)",
          content: "Le Modèle d'Évaluation des Actifs Financiers (MEDAF ou CAPM) permet d'estimer le coût des fonds propres.",
          items: [
            {
              type: "formula",
              formula: "r_e = r_f + \\beta (r_m - r_f)",
              explanation: "où : r_f = taux sans risque (ex. obligations d'État), r_m = rendement moyen du marché, (r_m - r_f) = prime de risque du marché, β (bêta) = sensibilité de l'entreprise au risque du marché. Si une entreprise a un bêta élevé, elle est plus risquée : les investisseurs exigent donc un rendement plus important.",
            },
          ],
        },
        {
          title: "Création et destruction de valeur",
          content: "Le WACC est la référence pour juger si un projet crée ou détruit de la valeur.\nOn compare le rendement du projet (ROIC) au coût du capital.",
          items: [
            {
              type: "formula",
              formula: "\\text{Création de valeur} : \\text{ROIC} > \\text{WACC}",
            },
            {
              type: "formula",
              formula: "\\text{Destruction de valeur} : \\text{ROIC} < \\text{WACC}",
              explanation: "où ROIC = Return on Invested Capital (rendement du capital investi).",
            },
          ],
        },
        {
          title: "Exemple chiffré",
          content: "Une entreprise investit 10 M€ dans un nouveau projet.\n• Rendement attendu du projet : 12 %\n• WACC de l'entreprise : 9 %",
          items: [
            {
              type: "formula",
              formula: "12\\% - 9\\% = +3\\%",
              explanation: "→ Le projet crée de la valeur.",
            },
            "Si le WACC était de 14 % :",
            {
              type: "formula",
              formula: "12\\% - 14\\% = -2\\%",
              explanation: "→ Le projet détruit de la valeur.",
            },
          ],
        },
        {
          title: "Impact stratégique du coût du capital",
          content: "Le coût du capital influence directement :",
          items: [
            "la sélection des projets d'investissement (critère de rentabilité minimale),",
            "la structure de financement (plus ou moins de dette),",
            "la valorisation de l'entreprise sur les marchés financiers.",
            "Un WACC bas est un atout stratégique : il permet de financer plus de projets rentables et donc d'augmenter la valeur à long terme.",
          ],
        },
      ],
      keyPoints: [
        "Le coût du capital est le rendement minimal exigé par les investisseurs.",
        "Le WACC combine le coût des fonds propres et de la dette selon leur poids.",
        "Si ROIC > WACC, il y a création de valeur.",
        "Maîtriser son coût du capital, c'est maîtriser sa croissance.",
      ],
      miniQuiz: [
        {
          question: "Le coût du capital correspond à :",
          answer: "Le rendement exigé par les investisseurs pour financer l'entreprise.",
        },
        {
          question: "Si le WACC = 8 % et le rendement du projet = 10 %, alors :",
          answer: "Le projet crée de la valeur.",
        },
        {
          question: "Le modèle du MEDAF (CAPM) permet de calculer :",
          answer: "Le coût des fonds propres.",
        },
        {
          question: "Si ROIC < WACC, cela signifie :",
          answer: "Destruction de valeur",
        },
      ],
      quiz: [
        {
          question: "Le coût du capital correspond à :",
          options: [
            "Le rendement exigé par les investisseurs pour financer l'entreprise",
            "Le coût des dettes uniquement",
            "Le coût des capitaux propres uniquement",
            "Le bénéfice net de l'entreprise",
          ],
          correctAnswer: "Le rendement exigé par les investisseurs pour financer l'entreprise",
        },
        {
          question: "Si le WACC = 8 % et le rendement du projet = 10 %, alors :",
          options: [
            "Le projet crée de la valeur",
            "Le projet détruit de la valeur",
            "Le projet ne crée ni ne détruit de valeur",
            "Le projet doit être abandonné",
          ],
          correctAnswer: "Le projet crée de la valeur",
        },
        {
          question: "Le modèle du MEDAF (CAPM) permet de calculer :",
          options: [
            "Le coût des fonds propres",
            "Le coût de la dette",
            "Le WACC",
            "Le ROIC",
          ],
          correctAnswer: "Le coût des fonds propres",
        },
        {
          question: "Si ROIC < WACC, cela signifie :",
          options: [
            "Destruction de valeur",
            "Création de valeur",
            "Neutralité de valeur",
            "Impossibilité de déterminer",
          ],
          correctAnswer: "Destruction de valeur",
        },
        {
          question: "Qu'est-ce que le WACC ?",
          options: [
            "Le coût moyen pondéré du capital",
            "Le coût des fonds propres",
            "Le coût de la dette",
            "Le rendement du capital investi",
          ],
          correctAnswer: "Le coût moyen pondéré du capital",
        },
        {
          question: "Quelle est la formule du WACC ?",
          options: [
            "WACC = (E/(E+D)) × r_e + (D/(E+D)) × r_d × (1-T)",
            "WACC = r_e + r_d",
            "WACC = E + D",
            "WACC = ROIC - r_e",
          ],
          correctAnswer: "WACC = (E/(E+D)) × r_e + (D/(E+D)) × r_d × (1-T)",
        },
        {
          question: "Qu'est-ce que le bêta (β) dans le modèle CAPM ?",
          options: [
            "La sensibilité de l'entreprise au risque du marché",
            "Le taux sans risque",
            "Le rendement moyen du marché",
            "Le coût de la dette",
          ],
          correctAnswer: "La sensibilité de l'entreprise au risque du marché",
        },
      ],
    },
  },
  {
    id: "quiz-final",
    title: "Synthèse et mini-quiz final",
    description: "Quiz final pour valider vos connaissances sur les fondamentaux de la finance d'entreprise.",
    duration: "15 min",
    order: 6,
    objective: "Faire le point sur les connaissances fondamentales acquises en finance d'entreprise : comprendre les grands équilibres financiers, relier les décisions d'investissement, de financement et de distribution, évaluer la création de valeur.",
    content: {
      sections: [
        {
          title: "Vision d'ensemble",
          content: "La finance d'entreprise vise à maximiser la valeur de l'entreprise tout en assurant sa pérennité.\n\nElle s'appuie sur trois grandes décisions stratégiques :",
          items: [
            "Investir — choisir les projets rentables et cohérents avec la stratégie globale",
            "Financer — déterminer comment ces projets seront payés (dettes ou capitaux propres)",
            "Distribuer — répartir les bénéfices entre actionnaires (dividendes) et réinvestissements",
            "Ces trois décisions sont reliées par un fil conducteur : la création de valeur",
            {
              type: "formula",
              formula: "\\text{Création de valeur} = \\text{ROIC} - \\text{WACC}",
              explanation: "La création de valeur est mesurée par la différence entre le rendement du capital investi (ROIC) et le coût du capital (WACC).",
            },
          ],
        },
        {
          title: "Les fondations de l'analyse financière",
          content: "Tout financier doit maîtriser les trois états financiers :",
          items: [
            "Le bilan → photographie du patrimoine à un instant T.",
            "Le compte de résultat → film de la performance sur une période.",
            "Le tableau des flux de trésorerie → explication des mouvements réels de cash.",
            "Ces documents sont analysés ensemble pour juger de la rentabilité, de la solvabilité et de la solidité financière d'une entreprise.",
          ],
        },
        {
          title: "Les ratios essentiels à retenir",
          content: "Voici les indicateurs clés à connaître absolument pour interpréter la situation d'une entreprise :",
          items: [
            {
              type: "formula",
              formula: "\\text{Marge nette} = \\frac{\\text{Résultat net}}{\\text{Chiffre d'affaires}} \\times 100",
              explanation: "Mesure le bénéfice par euro de vente. Indique l'efficacité opérationnelle de l'entreprise.",
            },
            {
              type: "formula",
              formula: "\\text{ROE} = \\frac{\\text{Résultat net}}{\\text{Capitaux propres}} \\times 100",
              explanation: "Mesure la rentabilité pour les actionnaires. Indique le rendement généré sur les fonds propres.",
            },
            {
              type: "formula",
              formula: "\\text{ROA} = \\frac{\\text{Résultat net}}{\\text{Total de l'actif}} \\times 100",
              explanation: "Mesure l'efficacité des actifs. Indique le rendement généré par l'ensemble des ressources investies.",
            },
            {
              type: "formula",
              formula: "\\text{Liquidité générale} = \\frac{\\text{Actif courant}}{\\text{Passif courant}}",
              explanation: "Mesure la capacité à rembourser les dettes à court terme. Un ratio > 1 indique une bonne liquidité.",
            },
            {
              type: "formula",
              formula: "\\text{Ratio d'endettement} = \\frac{\\text{Dettes totales}}{\\text{Capitaux propres}}",
              explanation: "Mesure le poids des dettes par rapport aux fonds propres. Indique le niveau de risque financier.",
            },
            "Rotation des stocks, DSO (Days Sales Outstanding) et DPO (Days Payable Outstanding) mesurent la qualité de la gestion opérationnelle.",
            "Ces ratios doivent toujours être interprétés dans le temps et en comparaison avec le secteur.",
          ],
        },
        {
          title: "La logique de création de valeur",
          content: "Une entreprise crée de la valeur lorsqu'elle génère un rendement supérieur à son coût du capital.",
          items: [
            {
              type: "formula",
              formula: "\\text{Création de valeur} \\Rightarrow \\text{ROIC} > \\text{WACC}",
            },
            "Si ce rendement est inférieur → destruction de valeur.",
            {
              type: "formula",
              formula: "\\text{Destruction de valeur} \\Rightarrow \\text{ROIC} < \\text{WACC}",
              explanation: "Cette logique est la boussole de toutes les décisions financières : elle relie la performance économique à la stratégie de financement.",
            },
          ],
        },
        {
          title: "Exemple global",
          content: "L'entreprise FinX Corp veut investir 5 M€ dans une nouvelle usine.\n• Coût du capital (WACC) : 9 %\n• Rendement attendu du projet : 12 %\n• Structure de financement : 60 % dette, 40 % capitaux propres.",
          items: [
            {
              type: "formula",
              formula: "12\\% - 9\\% = +3\\%",
              explanation: "→ Le projet crée de la valeur. Cette valeur se traduira à terme par une hausse des capitaux propres (bénéfices non distribués) et une valorisation accrue de l'entreprise.",
            },
          ],
        },
        {
          title: "La logique du cycle financier",
          content: "La finance d'entreprise est un cycle continu :",
          items: [
            "1️⃣ Lever des fonds (dettes ou capitaux propres)",
            "2️⃣ Investir dans des projets productifs",
            "3️⃣ Générer du rendement",
            "4️⃣ Créer de la valeur",
            "5️⃣ Redistribuer cette valeur (dividendes, réinvestissements)",
            "Ce cycle est équilibré quand chaque étape maximise la création de valeur globale, pas seulement la rentabilité immédiate.",
          ],
        },
        {
          title: "Récapitulatif global du module",
          content: "Tu maîtrises maintenant les bases indispensables pour aborder la finance de marché et les analyses de valorisation d'entreprise.",
        },
      ],
      keyPoints: [
        "La finance d'entreprise vise à maximiser la valeur de l'entreprise.",
        "Les trois grandes décisions : investir, financer, distribuer.",
        "La création de valeur (ROIC > WACC) est la boussole du financier.",
        "Maîtriser les états financiers et les ratios est essentiel pour évaluer une entreprise.",
      ],
      miniQuiz: [
        {
          question: "Quelle est la mission principale de la finance d'entreprise ?",
          answer: "Maximiser la valeur de l'entreprise.",
        },
        {
          question: "Que signifie un WACC élevé ?",
          answer: "L'entreprise est perçue comme plus risquée, donc son coût de financement augmente.",
        },
        {
          question: "Quelle est la relation entre ROIC et WACC pour créer de la valeur ?",
          answer: "ROIC > WACC.",
        },
        {
          question: "Que mesure le bilan ?",
          answer: "Le patrimoine de l'entreprise à une date donnée.",
        },
        {
          question: "Si la liquidité générale < 1, que cela indique-t-il ?",
          answer: "L'entreprise pourrait manquer de cash à court terme.",
        },
        {
          question: "Que signifie un DSO élevé ?",
          answer: "L'entreprise met longtemps à encaisser ses ventes.",
        },
        {
          question: "Quelle est la différence entre bénéfice et cash-flow ?",
          answer: "Le bénéfice inclut des éléments comptables, le cash-flow reflète les flux réels.",
        },
        {
          question: "Que représente le coût du capital ?",
          answer: "Le rendement minimum exigé par les investisseurs.",
        },
        {
          question: "Le CAPM sert à calculer :",
          answer: "Le coût des fonds propres.",
        },
        {
          question: "Quelle est la boussole du financier ?",
          answer: "La création de valeur à long terme.",
        },
      ],
      quiz: [
        {
          question: "Quelle est la mission principale de la finance d'entreprise ?",
          options: [
            "Maximiser la valeur de l'entreprise",
            "Minimiser les coûts opérationnels",
            "Augmenter le chiffre d'affaires",
            "Réduire l'endettement",
          ],
          correctAnswer: "Maximiser la valeur de l'entreprise",
        },
        {
          question: "Que signifie un WACC élevé ?",
          options: [
            "L'entreprise est perçue comme plus risquée, donc son coût de financement augmente",
            "L'entreprise est très rentable",
            "L'entreprise a peu de dettes",
            "L'entreprise est en faillite",
          ],
          correctAnswer: "L'entreprise est perçue comme plus risquée, donc son coût de financement augmente",
        },
        {
          question: "Quelle est la relation entre ROIC et WACC pour créer de la valeur ?",
          options: [
            "ROIC > WACC",
            "ROIC < WACC",
            "ROIC = WACC",
            "ROIC = 0",
          ],
          correctAnswer: "ROIC > WACC",
        },
        {
          question: "Que mesure le bilan ?",
          options: [
            "Le patrimoine de l'entreprise à une date donnée",
            "La performance sur une période",
            "Les flux de trésorerie",
            "Les investissements futurs",
          ],
          correctAnswer: "Le patrimoine de l'entreprise à une date donnée",
        },
        {
          question: "Si la liquidité générale < 1, que cela indique-t-il ?",
          options: [
            "L'entreprise pourrait manquer de cash à court terme",
            "L'entreprise est très rentable",
            "L'entreprise a trop de trésorerie",
            "L'entreprise est en faillite",
          ],
          correctAnswer: "L'entreprise pourrait manquer de cash à court terme",
        },
        {
          question: "Que signifie un DSO élevé ?",
          options: [
            "L'entreprise met longtemps à encaisser ses ventes",
            "L'entreprise encaisse rapidement ses ventes",
            "L'entreprise a peu de clients",
            "L'entreprise a beaucoup de clients",
          ],
          correctAnswer: "L'entreprise met longtemps à encaisser ses ventes",
        },
        {
          question: "Quelle est la différence entre bénéfice et cash-flow ?",
          options: [
            "Le bénéfice inclut des éléments comptables, le cash-flow reflète les flux réels",
            "Le bénéfice est toujours supérieur au cash-flow",
            "Le cash-flow est toujours supérieur au bénéfice",
            "Il n'y a pas de différence",
          ],
          correctAnswer: "Le bénéfice inclut des éléments comptables, le cash-flow reflète les flux réels",
        },
        {
          question: "Que représente le coût du capital ?",
          options: [
            "Le rendement minimum exigé par les investisseurs",
            "Le coût des dettes uniquement",
            "Le coût des capitaux propres uniquement",
            "Le bénéfice net de l'entreprise",
          ],
          correctAnswer: "Le rendement minimum exigé par les investisseurs",
        },
        {
          question: "Le CAPM sert à calculer :",
          options: [
            "Le coût des fonds propres",
            "Le coût de la dette",
            "Le WACC",
            "Le ROIC",
          ],
          correctAnswer: "Le coût des fonds propres",
        },
        {
          question: "Quelle est la boussole du financier ?",
          options: [
            "La création de valeur à long terme",
            "La maximisation du bénéfice net",
            "La minimisation des coûts",
            "L'augmentation du chiffre d'affaires",
          ],
          correctAnswer: "La création de valeur à long terme",
        },
      ],
    },
  },
  {
    id: "examen-final",
    title: "Grand Exercice - Examen final",
    description: "Examen final pour valider l'ensemble des notions abordées dans le module.",
    duration: "45 min",
    order: 7,
    objective: "Évaluer l'ensemble des notions abordées dans le module 1 de finance d'entreprise et conditionner l'obtention du badge 'Analyste Junior'.",
    content: {
      sections: [
        {
          title: "Instructions",
          content: "Cet examen final évalue l'ensemble des notions abordées dans le module 1 de finance d'entreprise.\n\nVous devrez analyser un cas pratique complet, calculer plusieurs ratios et indicateurs financiers, et interpréter les résultats.\n\nL'examen est composé de 5 questions à choix multiples. Vous devez obtenir au moins 70% de bonnes réponses pour valider l'examen et obtenir le badge 'Analyste Junior' ainsi que 500 XP.\n\nUn cas d'entreprise vous sera présenté avec ses données financières. À chaque tentative, un cas différent sera sélectionné aléatoirement parmi une banque de 10 cas.",
        },
      ],
      keyPoints: [
        "L'examen évalue toutes les compétences du module",
        "Un cas d'entreprise différent est sélectionné à chaque tentative",
        "Score minimum de 70% requis pour valider",
        "Badge 'Analyste Junior' et 500 XP attribués en cas de réussite",
      ],
      miniQuiz: [],
    },
  },
];

interface PageProps {
  params: {
    lessonSlug: string;
  };
}

const MODULE_ID = "finance-entreprise/fondamentaux";

// Mapping des leçons vers leur XP (doit correspondre à page.tsx)
const lessonXP: Record<string, number> = {
  "introduction-finance-entreprise": 20,
  "etats-financiers": 20,
  "flux-tresorerie": 20,
  "analyse-ratios": 20,
  "cout-capital": 20,
  "quiz-final": 20,
  "examen-final": 500,
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
  const [examCase, setExamCase] = useState<ReturnType<typeof getRandomExamCase> | null>(null);

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

  // Calculer la progression du module (mock)
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
        // Récupérer l'XP de la leçon depuis le mapping
        const xpEarned = lessonXP[currentLesson.id] || 20;
        
        const result = await completeLessonForUser({
          user,
          courseId: "corp-basics", // ID du parcours "Fondamentaux de la finance d'entreprise"
          lessonId: currentLesson.id,
          lessonIndex: currentLesson.order,
          totalLessons: lessons.length,
          xpEarned,
        });

        if (result.success) {
          // Afficher un message de succès (optionnel)
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
      router.push(`/modules/finance-entreprise/fondamentaux/${nextLesson.id}`);
    } else {
      router.push("/modules/finance-entreprise/fondamentaux");
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
              href="/modules/finance-entreprise/fondamentaux"
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
              href="/modules/finance-entreprise/fondamentaux"
              className="hover:text-[#0A2540] transition-colors"
            >
              Fondamentaux
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
                <span className="inline-flex items-center rounded px-3 py-1 text-xs font-semibold bg-green-50 text-green-800 border border-green-200">
                  Débutant
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
                    const xpEarned = lessonXP[currentLesson.id] || 20;
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
                      const xpEarned = lessonXP[currentLesson.id] || 500;
                      setXpEarnedForAnimation(xpEarned);
                      setShowXPAnimation(true);
                    }
                    
                    if (passed && user && !isCompleted) {
                      try {
                        await completeLesson(currentLesson.id);
                        const xpEarned = lessonXP[currentLesson.id] || 500;
                        const result = await completeLessonForUser({
                          user,
                          courseId: "corp-basics",
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
                    // Régénérer un nouveau cas d'examen aléatoirement
                    const newCase = getRandomExamCase();
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
                  href={`/modules/finance-entreprise/fondamentaux/${previousLesson.id}`}
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
                          const xpEarned = lessonXP[currentLesson.id] || 500;
                          const result = await completeLessonForUser({
                            user,
                            courseId: "corp-basics",
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
                      router.push("/modules/finance-entreprise/fondamentaux");
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
                        const xpEarned = lessonXP[currentLesson.id] || 20;
                        const result = await completeLessonForUser({
                          user,
                          courseId: "corp-basics",
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
                    router.push("/modules/finance-entreprise/fondamentaux");
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
                            href={`/modules/finance-entreprise/fondamentaux/${lesson.id}`}
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
