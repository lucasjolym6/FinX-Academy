"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, PiggyBank, Sparkle, Wallet } from "lucide-react";
import { useWalletSummary } from "@/hooks/useWallet";

const summaryVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

function formatAmount(amount?: number | null) {
  if (amount == null) return "—";
  return `${amount.toLocaleString("fr-FR")} crédits`;
}

export default function WalletSummaryCard() {
  const { summary, isLoading, error } = useWalletSummary();

  const total = summary?.totalCredits ?? 0;
  const bonus = summary?.bonusCredits ?? 0;
  const lifetime = summary?.lifetimeCredits ?? 0;

  return (
    <motion.section
      variants={summaryVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-[0_30px_90px_-65px_rgba(15,23,42,0.45)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#E9F2FF_0%,transparent_55%)]" />
      <div className="relative flex flex-col gap-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#3F76FF]">Wallet FinX</p>
            <h3 className="mt-2 text-lg font-semibold text-[#0B1728]">Crédits disponibles</h3>
            <p className="mt-1 text-sm text-[#64748B]">Alimente ton apprentissage avec des crédits utilisables sur les parcours premium, lives mentors et simulations IA.</p>
          </div>
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white text-[#3F76FF]">
            <Wallet className="h-6 w-6" />
          </span>
        </header>

        <div className="grid gap-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFF] p-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Solde total</p>
            <p className="mt-2 text-2xl font-semibold text-[#0B1728]">
              {isLoading ? "…" : error ? "—" : total.toLocaleString("fr-FR")}
              <span className="ml-1 text-sm font-medium text-[#3F76FF]">crédits</span>
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Bonus actifs</p>
            <p className="mt-2 flex items-center gap-2 text-base font-semibold text-[#0B1728]">
              {isLoading ? "…" : error ? "—" : bonus.toLocaleString("fr-FR")}
              <Sparkle className="h-4 w-4 text-[#F5B700]" />
            </p>
            <p className="text-xs text-[#94A3B8]">Bonus expirent automatiquement à la fin du mois.</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Crédits cumulés</p>
            <p className="mt-2 text-base font-semibold text-[#0B1728]">{isLoading ? "…" : error ? "—" : lifetime.toLocaleString("fr-FR")}</p>
            <p className="text-xs text-[#94A3B8]">Total depuis la création du compte.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-3 py-1 text-xs font-medium text-[#0F172A]">
              <PiggyBank className="h-3.5 w-3.5 text-[#3F76FF]" />
              Réserve dédiée aux parcours premium
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-3 py-1 text-xs font-medium text-[#0F172A]">
              <ArrowUpRight className="h-3.5 w-3.5 text-[#3F76FF]" />
              Historique détaillé accessible
            </span>
          </div>
          <Link
            href="/wallet"
            className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] px-4 py-2 text-sm font-semibold text-[#0B1728] transition-all hover:border-[#0B1728] hover:bg-[#0B1728]/5"
          >
            Gérer mon wallet
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.section>
  );
}


