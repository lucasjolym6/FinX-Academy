"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Download, Filter, Plus } from "lucide-react";
import { useState } from "react";
import { applyWalletTransaction, useWalletSummary, useWalletTransactions } from "@/hooks/useWallet";

const containerVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const tableRowVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const categories = [
  { value: "all", label: "Toutes catégories" },
  { value: "parcours", label: "Parcours premium" },
  { value: "simulation", label: "Simulations IA" },
  { value: "mentoring", label: "Mentoring" },
  { value: "reward", label: "Récompenses" },
  { value: "bonus", label: "Bonus promotionnels" },
];

const types = [
  { value: "all", label: "Tous types" },
  { value: "credit", label: "Crédits entrants" },
  { value: "debit", label: "Débits" },
];

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function WalletPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { summary, isLoading: loadingSummary } = useWalletSummary();
  const { transactions, isLoading: loadingTransactions } = useWalletTransactions({
    page,
    limit: 10,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    type: typeFilter !== "all" ? typeFilter : undefined,
  });

  const totalPages = transactions ? Math.ceil((transactions.total ?? 0) / (transactions.limit ?? 10)) : 1;

  return (
    <div className="relative min-h-screen bg-[#F4F6FB] pb-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#E3ECFF_0%,transparent_55%)]" />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(135deg,#F8FAFF_0%,#EEF2FF_100%)]" />
      <main className="relative mx-auto max-w-7xl px-6 pt-16">
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-10"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#3F76FF] transition-colors hover:text-[#1D4ED8]"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour au dashboard
              </Link>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#3F76FF]">Wallet FinX</p>
                <h1 className="mt-2 text-3xl font-semibold text-[#0B1728]">Gestion de vos crédits</h1>
                <p className="mt-2 max-w-2xl text-sm text-[#4B5A6B]">
                  Consultez votre solde, vos transactions récentes et boostez votre progression en finance. Activez des crédits,
                  suivez vos bonus et retrouvez un historique complet des opérations.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#0B1728] transition-all hover:border-[#0B1728] hover:bg-[#0B1728]/5">
                <Download className="h-4 w-4" />
                Exporter l&apos;historique
              </button>
              <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3F76FF] to-[#7C4DFF] px-5 py-2 text-sm font-semibold text-white shadow-[0_20px_45px_-25px_rgba(63,118,255,0.6)] transition-transform hover:-translate-y-0.5">
                <Plus className="h-4 w-4" />
                Recharger mon wallet
              </button>
            </div>
          </div>

          <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-[0_35px_110px_-70px_rgba(15,23,42,0.5)]">
              <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#0B1728]">Synthèse du wallet</h2>
                  <p className="text-sm text-[#64748B]">Vue claire de votre solde actuel et de vos bonus actifs.</p>
                </div>
                {summary?.lastTransactionAt && (
                  <p className="text-xs text-[#64748B]">Dernière opération : {formatDate(summary.lastTransactionAt)}</p>
                )}
              </header>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFF] p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Solde courant</p>
                  <p className="mt-3 text-3xl font-semibold text-[#0B1728]">
                    {loadingSummary ? "…" : summary?.totalCredits?.toLocaleString("fr-FR") ?? "0"}
                    <span className="ml-1 text-sm font-medium text-[#3F76FF]">crédits</span>
                  </p>
                  <p className="mt-2 text-xs text-[#94A3B8]">Utilisables immédiatement pour les parcours et simulations IA.</p>
                </div>
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFF] p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Bonus actifs</p>
                  <p className="mt-3 text-2xl font-semibold text-[#0B1728]">{loadingSummary ? "…" : summary?.bonusCredits ?? 0}</p>
                  <p className="mt-2 text-xs text-[#94A3B8]">Crédits offerts, expirent automatiquement selon les conditions du programme.</p>
                </div>
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Crédits cumulés depuis le début</p>
                  <p className="mt-3 text-xl font-semibold text-[#0B1728]">
                    {loadingSummary ? "…" : summary?.lifetimeCredits?.toLocaleString("fr-FR") ?? "0"}
                  </p>
                  <p className="mt-2 text-xs text-[#94A3B8]">Somme de tous les crédits générés (achats, bonus, rewards).</p>
                </div>
                <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Tips progression</p>
                  <ul className="mt-3 space-y-2 text-xs text-[#4B5A6B]">
                    <li>• Complétez un module premium pour gagner des bonus.</li>
                    <li>• Battez votre streak pour déclencher des récompenses XP.</li>
                    <li>• Participez à des lives mentoring pour des crédits exclusifs.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-[0_35px_110px_-70px_rgba(15,23,42,0.5)]">
              <h2 className="text-xl font-semibold text-[#0B1728]">Breakdown par catégorie</h2>
              <p className="mt-1 text-sm text-[#64748B]">
                Répartition des crédits selon les usages les plus fréquents au cours des 3 derniers mois.
              </p>
              <div className="mt-6 space-y-4">
                {summary?.categoryBreakdown &&
                  Object.entries(summary.categoryBreakdown).map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between rounded-2xl border border-[#E2E8F0] bg-[#F8FAFF] px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-[#0B1728]">{category}</p>
                        <p className="text-xs text-[#94A3B8]">Total enregistré sur la période</p>
                      </div>
                      <p className="text-sm font-semibold text-[#0B1728]">{amount.toLocaleString("fr-FR")} crédits</p>
                    </div>
                  ))}
                {!summary?.categoryBreakdown && (
                  <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFF] px-4 py-3 text-sm text-[#64748B]">
                    Aucune opération catégorisée pour le moment.
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-[0_35px_110px_-70px_rgba(15,23,42,0.5)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#0B1728]">Historique complet</h2>
                <p className="text-sm text-[#64748B]">
                  Filtrez vos opérations et identifiez les usages à forte valeur ajoutée pour vos objectifs.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F8FAFF] px-3 py-2 text-xs font-medium text-[#64748B]">
                  Catégorie
                  <select
                    className="bg-transparent text-sm font-semibold text-[#0B1728] focus:outline-none"
                    value={categoryFilter}
                    onChange={(event) => {
                      setCategoryFilter(event.target.value);
                      setPage(1);
                    }}
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value} className="text-[#0B1728]">
                        {category.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F8FAFF] px-3 py-2 text-xs font-medium text-[#64748B]">
                  Type
                  <select
                    className="bg-transparent text-sm font-semibold text-[#0B1728] focus:outline-none"
                    value={typeFilter}
                    onChange={(event) => {
                      setTypeFilter(event.target.value);
                      setPage(1);
                    }}
                  >
                    {types.map((type) => (
                      <option key={type.value} value={type.value} className="text-[#0B1728]">
                        {type.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-[#E2E8F0]">
              <table className="min-w-full divide-y divide-[#E2E8F0]">
                <thead className="bg-[#F8FAFF]">
                  <tr>
                    <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B] sm:pl-6">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Libellé
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Catégorie
                    </th>
                    <th scope="col" className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Montant
                    </th>
                    <th scope="col" className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Solde après
                    </th>
                    <th scope="col" className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] bg-white">
                  {loadingTransactions ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-sm text-[#64748B]">
                        Chargement de vos transactions...
                      </td>
                    </tr>
                  ) : (
                    transactions?.items?.map((tx, index) => (
                      <motion.tr
                        key={tx.id}
                        variants={tableRowVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.05 * index, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-[#0B1728] sm:pl-6">{formatDate(tx.occurredAt)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-[#0B1728]">{tx.label}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-[#64748B]">{tx.category ?? "—"}</td>
                        <td className={classNames("whitespace-nowrap px-3 py-4 text-sm text-right font-semibold", tx.type === "credit" ? "text-emerald-600" : "text-rose-600")}>
                          {tx.type === "credit" ? "+" : "-"}
                          {tx.amount.toLocaleString("fr-FR")} crédits
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-[#0B1728]">{tx.balanceAfter.toLocaleString("fr-FR")} crédits</td>
                        <td className="whitespace-nowrap px-3 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#3F76FF]">{tx.status}</td>
                      </motion.tr>
                    ))
                  )}
                  {!loadingTransactions && transactions?.items?.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-sm text-[#64748B]">
                        Aucune transaction pour ces filtres. Essayez d&apos;ajuster la catégorie ou le type.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center justify-between text-sm text-[#64748B]">
              <p>
                Page {transactions?.page ?? 1} sur {totalPages || 1}
              </p>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-full border border-[#E2E8F0] px-3 py-1 font-semibold text-[#0B1728] transition-all hover:border-[#0B1728] hover:bg-[#0B1728]/5 disabled:cursor-not-allowed disabled:border-[#E2E8F0] disabled:text-[#CBD5E1]"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page <= 1}
                >
                  Précédent
                </button>
                <button
                  className="rounded-full border border-[#E2E8F0] px-3 py-1 font-semibold text-[#0B1728] transition-all hover:border-[#0B1728] hover:bg-[#0B1728]/5 disabled:cursor-not-allowed disabled:border-[#E2E8F0] disabled:text-[#CBD5E1]"
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages || prev + 1))}
                  disabled={page >= totalPages}
                >
                  Suivant
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-[0_35px_110px_-70px_rgba(15,23,42,0.5)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#0B1728]">Boostez votre expérience FinX</h2>
                <p className="text-sm text-[#64748B]">
                  Profitez d&apos;événements exclusifs, débloquez des modules avancés et suivez vos bonus en temps réel.
                </p>
              </div>
              <Link
                href="/parcours"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3F76FF] to-[#7C4DFF] px-5 py-2 text-sm font-semibold text-white shadow-[0_20px_45px_-25px_rgba(63,118,255,0.6)] transition-transform hover:-translate-y-0.5"
              >
                Explorer les parcours premium
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
}


