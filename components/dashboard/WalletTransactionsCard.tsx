"use client";

import { motion } from "framer-motion";
import { Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { useWalletTransactions } from "@/hooks/useWallet";

const variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

type CategoryLabel = {
  label: string;
  description: string;
};

const categoryLabels: Record<string, CategoryLabel> = {
  parcours: {
    label: "Parcours",
    description: "Accès aux modules et certifications premium.",
  },
  simulation: {
    label: "Simulations IA",
    description: "Interview IA ou analyses approfondies.",
  },
  mentoring: {
    label: "Mentoring",
    description: "Sessions mentorées individuelles ou en groupe.",
  },
  bonus: {
    label: "Bonus",
    description: "Gains liés aux offres et challenges.",
  },
  reward: {
    label: "Récompense",
    description: "Bonus gamifiés (streak, leaderboard...).",
  },
};

function getCategoryMeta(category?: string | null): CategoryLabel {
  if (!category) return { label: "Autre", description: "Opération hors catégorie standard." };
  return categoryLabels[category] ?? { label: category, description: "Opération enregistrée récemment." };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function WalletTransactionsCard() {
  const { transactions, isLoading, error } = useWalletTransactions({ limit: 5 });

  const items = transactions?.items ?? [];

  const emptyState = !isLoading && items.length === 0;

  return (
    <motion.section
      variants={variants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-[0_30px_90px_-65px_rgba(15,23,42,0.45)]"
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[#0B1728]">Historique du wallet</h3>
          <p className="mt-1 text-sm text-[#64748B]">Dernières opérations enregistrées sur ton compte FinX Wallet.</p>
        </div>
      </header>

      <div className="mt-5">
        {isLoading ? (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFF] p-6 text-sm text-[#64748B]">
            <Loader2 className="h-4 w-4 animate-spin text-[#3F76FF]" />
            Chargement des transactions…
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            Impossible de récupérer l&apos;historique du wallet pour le moment.
          </div>
        ) : emptyState ? (
          <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFF] px-5 py-6 text-sm text-[#64748B]">
            Aucune transaction enregistrée pour l&apos;instant. Utilise tes crédits pour débloquer des parcours premium ou participer à des lives mentorés.
          </div>
        ) : (
          <ul className="space-y-4">
            {items.map((tx) => {
              const meta = getCategoryMeta(tx.category);
              const isCredit = tx.type === "credit";
              const amount = `${isCredit ? "+" : "-"}${tx.amount.toLocaleString("fr-FR")} crédits`;

              return (
                <li
                  key={tx.id}
                  className="flex items-center justify-between rounded-2xl border border-[#E2E8F0] bg-[#F8FAFF] px-5 py-4"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
                          isCredit ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                        }`}
                      >
                        {isCredit ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#0B1728]">{tx.label}</p>
                        <p className="text-xs text-[#64748B]">{meta.description}</p>
                      </div>
                    </div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[#94A3B8]">{meta.label}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${isCredit ? "text-emerald-600" : "text-rose-600"}`}>{amount}</p>
                    <p className="text-xs text-[#94A3B8]">{formatDate(tx.occurredAt)}</p>
                    <p className="mt-1 text-xs text-[#64748B]">Solde après opération : {tx.balanceAfter.toLocaleString("fr-FR")} crédits</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </motion.section>
  );
}


